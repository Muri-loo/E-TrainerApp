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
    const alternativeImage = 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV'; // URL to your default image

  
    useEffect(() => {
      const fetchTrainingPlans = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
  
          if (user && route.params) {
            const uid = user.uid;
            const selectedDate = route.params; // Assuming route.params is the date
            const trainingPlansRef = collection(db, 'PlanoTreino_Atleta');
            console.log(selectedDate);

            const trainingPlansQuery = query(
              trainingPlansRef, 
            where('idAtleta', '==', uid),
            where('data', '==', selectedDate) // Use the  selectedDate in the query
            );
  
            const querySnapshot = await getDocs(trainingPlansQuery);
            const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTrainingPlans(plans);
          } 
          console.log(TrainingPlans); 
        } catch (error) { 
          console.error('Error fetching training plans:', error); 
        }
      };
  
      fetchTrainingPlans();
    }, []);

    const handleButtonPress = (workoutType) => {
      console.log(`Selected workout: ${workoutType}`);
      // Navigation logic here if needed
    };
  
    // Render button with ImageBackground and subtle shadow
    const renderButton = ({ item }) => {
      // Check if item.image is null or undefined, if so use alternativeImage
      const imageUri = item.image ? item.image : alternativeImage;
  
      return (
        <SafeAreaView style={styles.shadowContainer}>
          <Shadow>
            <TouchableOpacity onPress={() => handleButtonPress(item.planName)} style={styles.buttonStyle}>
              <ImageBackground
                source={{ uri: imageUri }}
                style={styles.imageBackground}
                imageStyle={styles.buttonImage}
              >
                <Text style={styles.buttonText}>{item.planName}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Shadow>
        </SafeAreaView>
      );
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Navbarlight navigation={navigation} />
        <Text style={styles.titleText}>Training for today: {route.params}</Text>
  
        {TrainingPlans.length > 0 ? (
        <FlatList
          data={TrainingPlans}
          renderItem={renderButton}
          keyExtractor={item => item.id} // Assuming each plan has a unique 'id'
          style={styles.scrollViewStyle}
        />
      ) : (
        <Text style={styles.noExercisesText}>
          NO EXERCISES FOR TODAY, WANT TO ADD SOME?
        </Text>
      )}
        <TouchableOpacity style={styles.button} >

            <Text style={{color:'#fff', fontWeight:'600'}}>Adicionar Treino para este dia</Text> 
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
