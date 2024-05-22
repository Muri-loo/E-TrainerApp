import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { formatTime } from '../Navigation/funcoes';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../../Config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

function CheckUserProgress({ navigation, route }) {
  const xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [yData, setYData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [averageSpeedPerPunch, setAverageSpeedPerPunch] = useState(0);
  const [averageStrengthPerPunchNewton, setAverageStrengthPerPunchNewton] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalPunches, setTotalPunches] = useState(0);
  const [averageDurationPerTraining, setAverageDurationPerTraining] = useState(0);
  const [averagePunchesPerTraining, setAveragePunchesPerTraining] = useState(0);
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [strongestPunch, setStrongestPunch] = useState(0);
  const [weakestPunch, setWeakestPunch] = useState(0);
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    let searchID = auth.currentUser.uid;
    if (route.params) {
      searchID = route.params;
    }

    try {
      setLoading(true);
      const userTrainsQuery = query(collection(db, 'FinishedTrain'), where('idUtilizador', '==', searchID));
      const querySnapshot = await getDocs(userTrainsQuery);

      if (!querySnapshot.empty) {
        const userTrainsData = querySnapshot.docs.map(doc => doc.data());
        const allPunches = userTrainsData.flatMap(doc => doc.punches);

        let totalSpeed = 0;
        let totalStrength = 0;
        let totalDuration = 0;
        let totalPunches = 0;
        let totalTrainings = userTrainsData.length;
        let totalPunchStrengths = allPunches.map(punch => punch.strength);

        userTrainsData.forEach(train => {
          totalSpeed += Number(train.AverageSpeedPerPunch);
          totalPunches += Number(train.NumberOfPunches);
          totalStrength += Number(train.AverageStrengthPerPunchNewton);
          totalDuration += Number(train.DurationOfTrainning);
        });

        setAverageSpeedPerPunch((totalSpeed / totalTrainings).toFixed(2));
        setAverageStrengthPerPunchNewton((totalStrength / totalTrainings).toFixed(2));
        setTotalDuration(totalDuration);
        setTotalPunches(totalPunches);
        setAverageDurationPerTraining((totalDuration / totalTrainings).toFixed(0));
        setAveragePunchesPerTraining((totalPunches / totalTrainings).toFixed(2));
        setTotalTrainings(totalTrainings);
        setStrongestPunch(Math.max(...totalPunchStrengths));
        setWeakestPunch(Math.min(...totalPunchStrengths));
      }

      const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta_Goals'), where('idAtleta', '==', searchID)));
      const metas = AthletsQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const metasNomes = [];

      for (const doc of metas) {
        const searchId = doc.idGoal;
        const goalsQueryResult = await getDocs(query(collection(db, 'Goals'), where('idGoal', '==', searchId)));

        if (!goalsQueryResult.empty) {
          const goalDoc = goalsQueryResult.docs[0];
          metasNomes.push(goalDoc.data().goalName);
        }
      }
      setMetas(metasNomes);

      const userTrainsGraphQuery = query(
        collection(db, 'FinishedTrain'),
        where('idUtilizador', '==', searchID),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const queryGraphSnapshot = await getDocs(userTrainsGraphQuery);

      if (!queryGraphSnapshot.empty) {
        const userTrainsGraphData = queryGraphSnapshot.docs.map(doc => doc.data());
        const yDataArray = Array(10).fill(0);

        for (let i = 0; i < Math.min(userTrainsGraphData.length, 10); i++) {
          const train = userTrainsGraphData[i];
          const maxStrength = Math.max(...train.punches.map(punch => punch.strength));
          yDataArray[i] = maxStrength;
        }

        setYData(yDataArray);
      } else {
        setYData(Array(10).fill(0));
      }
    } catch (error) {
      console.error('Error getting documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [route.params]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Navbarlight navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D72E02" />
          <Text>Loading...</Text>
        </View>
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Estatísticas do Utilizador</Text>
          <Text style={styles.statLeft}>
            <IconMC name="speedometer" size={18} color="#D72E02" /> Velocidade Média por Soco: <Text style={{ color: '#D72E02' }}>{averageSpeedPerPunch}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconMC name="dumbbell" size={18} color="#D72E02" /> Força Média por Soco (Newton): <Text style={{ color: '#D72E02' }}>{averageStrengthPerPunchNewton}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconMC name="clipboard-check" size={18} color="#D72E02" /> Total de Treinos Concluídos: <Text style={{ color: '#D72E02' }}>{totalTrainings}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconMI name="timer" size={18} color="#D72E02" /> Duração Total dos Treinos: <Text style={{ color: '#D72E02' }}>{formatTime(totalDuration)} min</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconMI name="timer" size={18} color="#D72E02" /> Duração Média por Treino: <Text style={{ color: '#D72E02' }}>{formatTime(averageDurationPerTraining)} min</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconFA name="fist-raised" size={18} color="#D72E02" /> Número Total de Socos: <Text style={{ color: '#D72E02' }}>{totalPunches}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconFA name="fist-raised" size={18} color="#D72E02" /> Número Médio de Socos por Treino: <Text style={{ color: '#D72E02' }}>{averagePunchesPerTraining}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconFA name="fist-raised" size={18} color="#D72E02" /> Soco Mais Forte: <Text style={{ color: '#D72E02' }}>{strongestPunch}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconFA name="fist-raised" size={18} color="#D72E02" /> Soco Mais Fraco: <Text style={{ color: '#D72E02' }}>{weakestPunch}</Text>
          </Text>
          <Text style={styles.statLeft}>
            <IconMC name="flag" size={18} color="#D72E02" /> Metas: <Text style={{ color: '#D72E02' }}>{metas.join(', ')}</Text>
          </Text>
          <Text style={styles.chartTitle}>Gráfico de Força Máxima Últimos 10 Treinos</Text>
          <LineChart
            data={{
              labels: xData.map(value => value.toString()),
              datasets: [
                {
                  data: yData,
                },
              ],
            }}
            width={Dimensions.get('window').width * 0.9}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#D72E02',
              backgroundGradientFrom: '#D72E02',
              backgroundGradientTo: '#D72E02',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#D72E02',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statLeft: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckUserProgress;
