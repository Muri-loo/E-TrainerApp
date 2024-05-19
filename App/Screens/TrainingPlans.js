import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { formatTime } from '../Navigation/funcoes';

function TrainingPlans({ navigation }) {
  const [trainingPlans, setTrainingPlans] = useState([]);

  const getTrainingPlans = async () => {
    try {
      const trainingPlansQueryResult = await getDocs(collection(db, 'PlanoTreino'));
      const trainingPlanData = trainingPlansQueryResult.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        exercicios: doc.data().exercicios || [] // Default to empty array if exercicios is undefined
      }));
      setTrainingPlans(trainingPlanData);
    } catch (error) {
      console.error("Error fetching training plans:", error);
      // Handle the error, such as showing an error message to the user
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTrainingPlans();
    });
    return unsubscribe;
  }, [navigation]);

  const navigateToDetailPage = (item) => {
    // Pass the selected training plan to the detail page
    navigation.navigate('TrainingPlanDetails',  item );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Planos de treino</Text>
        <View style={styles.line}></View>
        <View style={styles.gridContainer}>
          <FlatList
            data={trainingPlans}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToDetailPage(item)}>
                <View style={styles.trainingPlanDisplay}>
                  <View style={styles.exerciseImage}>
                    {item.fotoPlanoTreino ? (
                      <Image style={{ flex: 1, borderBottomLeftRadius: 30, borderTopLeftRadius: 30 }} source={{ uri: item.fotoPlanoTreino }} />
                    ) : null}
                  </View>
                  <View style={styles.trainingPlanInfo}>
                    <Text style={styles.nomePlano}>{item.nomePlano}</Text>
                    <Text style={styles.time}><IconFA name={"clock"} size={15} color="white" /> {formatTime(item.tempo)} min</Text>  
                    <Text style={styles.exerciciosCount}>
                      <IconFA name={"dumbbell"} size={15} color="white" /> {item.exercicios.length} exercises
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            style={styles.planGrid}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateTrainingPlan')}>
          <Text style={styles.buttonText}>Novo treino</Text>
        </TouchableOpacity>
      </View>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  title: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  line: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  time:{
    color:'white',

  },
  gridContainer: {
    flex: 1,
  },
  trainingPlanDisplay: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: '#323230',
    width: '90%',
    alignSelf: 'center',
    marginBottom: '5%',
    height: 100,
  },
  exerciseImage: {
    backgroundColor: '#c2c2c2',
    width: '35%',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    marginRight: '5%',
  },
  trainingPlanInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nomePlano: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '2%',

  },
  descricaoPlano: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  exerciciosCount: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#D72E02',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    borderRadius: 30,
  },
});

export default TrainingPlans;
