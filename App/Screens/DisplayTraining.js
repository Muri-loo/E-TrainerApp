import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from 'react-native-elements';


function DisplayTraining({ navigation, route }) {
  const [TrainingPlans, setTrainingPlans] = useState([]);
  const [myTrains, setMyTrains] = useState([]);

  const [loading, setLoading] = useState(true);
  const alternativeImage = 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV';

  const fetchTrainingPlans = async () => {
    try {
      setLoading(true);

      const userId = auth.currentUser.uid;

      const queryForTrain = query(
        collection(db, 'PlanoTreino_Atleta'),
        where('idAtleta', '==', userId),
        where('data', '==', route.params)
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
    } catch (error) {
      console.error('Error fetching training plans:', error);
      setError('Error fetching training plans');
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

  const renderButton = ({ item }) => {
    const imageUri = item.image ? item.image : alternativeImage;

    return (
      <View style={styles.shadowContainer}>
        <Shadow>
          <TouchableOpacity onPress={() => handleButtonPress(item)} style={styles.buttonStyle}>
            <ImageBackground
              source={{ uri: imageUri }}
              style={styles.imageBackground}
              imageStyle={styles.buttonImage}
            >
              <Text style={styles.buttonText}>{item.nomePlano}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </Shadow>
      </View>
    );
  };

  const isDateGreaterThanVarDate = () => {
    var dateParts = route.params.split('/');
    const extractedDate = new Date(Date.UTC(+dateParts[2], dateParts[1] - 1, +dateParts[0]));
  
    // Get the current date
    const currentDate = new Date();
  
    // Set the time part of currentDate to 00:00:00 to compare only dates
    currentDate.setHours(0, 0, 0, 0);
  
    return extractedDate >= currentDate;
  };
  

  const isGreaterThan = isDateGreaterThanVarDate();

  return (
    <SafeAreaView style={styles.container}>
      {/* Content Wrapper with justifyContent: 'flex-start' */}
      <View style={styles.contentWrapper}>
        <Navbarlight navigation={navigation} />
        <Text style={styles.titleText}>Treinos para hoje: {route.params}</Text>
       

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : TrainingPlans.length > 0 ? (
          <FlatList
            data={TrainingPlans}
            renderItem={renderButton}
            keyExtractor={(item) => item.id}
            style={styles.scrollViewStyle}
            ItemSeparatorComponent={() => <View style={{ height: 40 }} />} // Adjust the height as needed
          />

        ) : (
          <Text style={styles.noExercisesText}>
            Não tem exercícios para hoje, aperte no botão abaixo para adicionar.
          </Text>
        )}
  
      </View>
      {isGreaterThan && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AddNewTrainningPlan', route.params)}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Adicionar Treino para este dia</Text>
          </TouchableOpacity>
        )}
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
  scrollViewStyle: {
    flex: 1,
    marginTop:25,
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
  button: {
    borderRadius: 20,
    width: '80%',
    backgroundColor: '#D72E02',
    padding: 10,
    margin: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default DisplayTraining;
