import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from 'react-native';
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

  const getUserData = async () => {
    let searchID = auth.currentUser.uid;
    if (route.params && route.params) {
      searchID = route.params;
    }

    try {
      const userTrainsQuery = query(collection(db, 'FinishedTrain'), where("idUtilizador", "==", searchID));
      const querySnapshot = await getDocs(userTrainsQuery);

      if (!querySnapshot.empty) {
        const userTrainsData = querySnapshot.docs.map(doc => doc.data());
        const allPunches = userTrainsData.flatMap(doc => doc.punches); // Collect all punches


        // Calculate averages
        let totalSpeed = 0;
        let totalStrength = 0;
        let totalDuration = 0;
        let totalPunches = 0;
        let totalTrainings = userTrainsData.length;
        let totalPunchStrengths = allPunches.map(punch => punch.strength);

      userTrainsData.forEach(train => {
        console.log(train.AverageStrengthPerPunchNewton);
        totalSpeed += Number(train.AverageSpeedPerPunch);
        totalStrength += Number(train.AverageStrengthPerPunchNewton); // Convert to number before adding
        totalDuration += Number(train.DurationOfTrainning); 
        totalPunches += Number(train.NumberOfPunches);
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

      } else {
        console.log("No such documents!");
      }
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };

  useEffect(() => {
    const getGraph = async () => {
      let searchID = auth.currentUser.uid;
      if (route.params && route.params) {
        searchID = route.params;
      }

      try {
        const userTrainsQuery = query(
          collection(db, 'FinishedTrain'),
          where('idUtilizador', '==', searchID),
          orderBy('timestamp', 'desc'), // Order by timestamp in descending order
          limit(10) // Get only the last 10 trains
        );
        const querySnapshot = await getDocs(userTrainsQuery);
        // Your existing code to handle the query snapshot

        if (!querySnapshot.empty) {
          const userTrainsData = querySnapshot.docs.map(doc => doc.data());
          
          // Fill yData with 0s
          const yDataArray = Array(10).fill(0);

          // Update yData with the strongest punch values from available trains
          for (let i = 0; i < Math.min(userTrainsData.length, 10); i++) {
            const train = userTrainsData[i];
            const maxStrength = Math.max(...train.punches.map(punch => punch.strength));
            yDataArray[i] = maxStrength;
          }

          setYData(yDataArray);
          console.log(yDataArray);
        } else {
          // If there are no trains, set yData to all 0s
          setYData(Array(10).fill(0));
        }

      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };
    getGraph();
    getUserData();
  }, [route.params]);
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
  <IconMI name="timer" size={18} color="#D72E02" /> Duração Total dos Treinos: <Text style={{ color: '#D72E02' }}>{formatTime(totalDuration) } min</Text>
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
<Text style={styles.chartTitle}>Gráfico de Força Máxima Ultimos 10 Treinos</Text>
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
    alignItems: 'flex-start', // Align text to the left
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
    textAlign: 'left', // Align text to the left
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default CheckUserProgress;
