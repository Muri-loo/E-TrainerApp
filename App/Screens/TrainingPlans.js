import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import IconFA from 'react-native-vector-icons/FontAwesome5';

function TrainingPlans({ navigation }) {
  const [trainingPlans, setTrainingPlans] = useState([]);

  const getTrainingPlans = async () => {
    const trainingPlansQueryResult = await getDocs(collection(db, 'PlanoTreino'));
    const trainingPlanData = trainingPlansQueryResult.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      exercicios: doc.data().exercicios || [] // Default to empty array if exercicios is undefined
    }));
    setTrainingPlans(trainingPlanData);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTrainingPlans();
    });
    return unsubscribe;
  }, [navigation]);

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
              <View style={styles.trainingPlanDisplay}>
                <View style={styles.exerciseImage}>
                    {item.fotoExercicio ? (
                      <Image style={{flex: 1, borderBottomLeftRadius:30, borderTopLeftRadius:30}} source={{uri: item.fotoPlano}} />
                    ) : null}
                    </View>
                <View style={styles.trainingPlanInfo}>
                  <Text style={styles.nomePlano}>{item.nomePlano}</Text>
                  <Text style={styles.descricaoPlano}>{item.descricaoPlano}</Text>
                  <Text style={styles.exerciciosCount}>
                    <IconFA name={"dumbbell"} size={15} color="white" /> {item.exercicios.length} exercises
                  </Text>
                </View>
              </View>
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
    padding: 10,
  },
  trainingPlanInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nomePlano: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
