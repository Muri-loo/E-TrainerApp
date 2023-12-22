import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebase'; 
import { getAuth } from 'firebase/auth';





  function DisplayTraining({ navigation, route }) {
    const [TrainingPlans, setTrainingPlans] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const alternativeImage = 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV'; // URL to your default image

  
    useEffect(() => {
      const fetchTrainingPlans = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
  
          if (user && route.params) {
            const uid = user.uid;
            const selectedDate = route.params;
            const planoTreino_AtletaRef = collection(db, 'PlanoTreino_Atleta');
            const planoTreinoRef = collection(db, 'PlanoTreino');
  
            const planoTreino_AtletaQuery = query(
              planoTreino_AtletaRef,
              where('idAtleta', '==', uid),
              where('data', '==', selectedDate)
            );
  
            const querySnapshot = await getDocs(planoTreino_AtletaQuery);
  
            const plansPromises = querySnapshot.docs.map(async (doc) => {
              const dataQuery = query(planoTreinoRef, where('idPlanoTreino', '==', doc.data().idPlanoTreino));
              const dataSnapshot = await getDocs(dataQuery);
              return dataSnapshot.docs[0].data();
            });
  
            const plans = await Promise.all(plansPromises);
            console.log(plans);
            setTrainingPlans(plans);
          }
        } catch (error) {
          console.error('Error fetching training plans:', error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchTrainingPlans();
    }, [route.params]);

    
    

    const handleButtonPress = (workoutType) => {
      navigation.navigate('TrainingPlanDetails',workoutType);
    };
  
    // Render button with ImageBackground and subtle shadow
    const renderButton = ({ item }) => {
      const imageUri = item.image ? item.image : alternativeImage;
  
      return (
        <SafeAreaView style={styles.shadowContainer}>
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
        </SafeAreaView>
      );
    };
  
    //pagecode
    return (
      <SafeAreaView style={styles.container}>
        <Navbarlight navigation={navigation} />
        <Text style={styles.titleText}>Training for today: {route.params}</Text>
  
        {loading ? (
        <Text style={styles.titleText}>Loading...</Text>
      ) : TrainingPlans.length > 0 ? (
        <FlatList
          data={TrainingPlans}
          renderItem={renderButton}
          keyExtractor={(item) => item.id} // Ensure the key is unique
          style={styles.scrollViewStyle}
        />
      ) : (
        <Text style={styles.noExercisesText}>
          Não tem exercicíos para hoje, aperte no botão abaixo para adicionar.
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddNewTrainningPlan', route.params)}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Adicionar Treino para este dia</Text>
      </TouchableOpacity>

  
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }
  
  

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    color: '#000',
    fontSize: 20,
    marginTop: 20,
    padding: 10,
  },
  noExercisesText: {
    color: '#000',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  scrollViewStyle: {
    flex:1,
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
    alignSelf:'center',
  },
});

export default DisplayTraining;
