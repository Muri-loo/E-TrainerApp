import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, FlatList, Alert } from 'react-native';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import IconFA from 'react-native-vector-icons/FontAwesome5';

function DisplayTraining({ navigation, route }) {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [myTrains, setMyTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const alternativeImage = 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV';
  const { data, aluno } = route.params;

  const fetchTrainingPlans = async () => {
    try {
      setLoading(true);

      if (aluno) {
        const queryForTrain = query(
          collection(db, 'PlanoTreino_Atleta'),
          where('idAtleta', '==', aluno.idAtleta),
          where('data', '==', data)
        );
      
        const querySnapshot = await getDocs(queryForTrain);
        const trainsDataWithIds = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setMyTrains(trainsDataWithIds);

        if (querySnapshot.empty) {
          setTrainingPlans([]);
          console.log('No plans found for the current user and date.');
          return;
        }

        const associatedPlanIds = querySnapshot.docs.map((doc) => doc.data().idPlanoTreino);
        const allPlansQuery = query(collection(db, 'PlanoTreino'));
        const allPlansSnapshot = await getDocs(allPlansQuery);
        const filteredPlansData = allPlansSnapshot.docs
          .filter((doc) => associatedPlanIds.includes(doc.id.trim()))
          .map((doc) => doc.data());
        setTrainingPlans(filteredPlansData);
      } 
    } catch (error) {
      console.error('Error fetching training plans:', error);
      Alert.alert('Error', 'Error fetching training plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrainingPlans();
    });
    return unsubscribe;
  }, [navigation]);

  const handleButtonPress = (workoutType) => {
    const foundTrain = myTrains.find(train => train.idPlanoTreino === workoutType.idPlanoTreino);
    workoutType.deleteId = foundTrain.id;
    navigation.navigate('TrainingPlanDetails', workoutType);
  };

  const renderItem = ({ item }) => {
    const imageUri =  (item.fotoPlanoTreino ? item.fotoPlanoTreino : alternativeImage);
    const onPressHandler = () => handleButtonPress(item);
    
    return (
      <View style={styles.shadowContainer}>
        <TouchableOpacity onPress={onPressHandler} style={styles.buttonStyle}>
          <ImageBackground
            source={{ uri: imageUri }}
            style={styles.imageBackground}
            imageStyle={styles.buttonImage}
          >
            <Text style={styles.buttonText}>{item.nomePlano}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };
  

  const isDateGreaterThanVarDate = () => {
    const dateParts = data.split('/');
    const extractedDate = new Date(Date.UTC(+dateParts[2], dateParts[1] - 1, +dateParts[0]));
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return extractedDate >= currentDate;
  };
  
  const isGreaterThan = isDateGreaterThanVarDate();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <Navbarlight navigation={navigation} />
        <Text style={styles.titleText}>{aluno ? aluno.nome : ''}</Text>

        <Text style={styles.titleText}>Treinos para hoje: {data}</Text>
        {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
          ) : trainingPlans.length > 0 ? (
              <FlatList
                  data={trainingPlans}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.idPlanoTreino}
                  ItemSeparatorComponent={() => <View style={{ height: 40 }} />} 
              />
          ) : (
              <Text style={styles.noExercisesText}>
                  Não tem exercícios para hoje, aperte no botão abaixo para adicionar.
              </Text>
          )}

      </View>
      {isGreaterThan && (
        <View style={styles.addButtonContainer}>
  <View style={styles.addButtonWrapper}>
    <View style={styles.addButtonColumn}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewTrainningPlan', { data: data, aluno: aluno, type: 'todos' })}>
      <IconFA style={styles.addButtonIcon} name={"dumbbell"} size={25} color="white" />
      <Text style={styles.addButtonText}>Todos os Treinos</Text>
    </TouchableOpacity>
    </View>
    
    <View style={styles.addButtonColumn}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewTrainningPlan', { data: data, aluno: aluno, type: 'recomendacao' })}>
      <IconFA style={styles.addButtonIcon} name={"lightbulb"} size={25} color="white" />
      <Text style={styles.addButtonText}>Treinos Recomendados</Text>
    </TouchableOpacity>
    </View>
  </View>
</View>


)}

      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:'white',

  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleText: {
    color: '#000',
    fontSize: 20,
    padding: 10,
    paddingTop: 15,
    marginTop: 0,
  },
  noExercisesText: {
    color: '#000',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  shadowContainer: {  
    alignItems: 'center',
  },
  buttonStyle: {
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    borderRadius: 20,
  },
  buttonText: {
    width: 300,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  addButtonContainer: {
    marginHorizontal: '5%',
    marginVertical: '5%',
  },
  addButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButtonColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    borderRadius: 20,
    width: '80%',
    height: 100,
    backgroundColor: '#D72E02',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, // Add padding here

  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
  },

  addButtonIcon: {
    alignSelf: 'center',
    padding: 5,
  },
  noExercisesTextContainer: {
    flex: 1,
  },
});

export default DisplayTraining;
