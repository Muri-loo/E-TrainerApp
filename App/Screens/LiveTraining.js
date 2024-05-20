import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet, TouchableOpacity,Image, Alert } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { db, auth } from '../../Config/firebase';
import { addDoc, collection, getDoc,doc,Timestamp } from 'firebase/firestore';


function LiveTraining({ navigation, route }) {
  const {lista,idPlanoTreino,nivelFisico} = route.params;
  const [seconds, setSeconds] = useState(0);
  const [isTrainingFinished, setIsTrainingFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false); 
  const [exercises, setExerciseList] = useState([]);
  const [exercise, setCurrentExercise] = useState(lista[0]);
  const [punches, setPunches] = useState([]);
  let exerciseNumber = 0;
  const [age, setAge] = useState(0);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const atletaDoc = await getDoc(doc(collection(db,'Atleta'), auth.currentUser.uid));
        const atletaData = atletaDoc.data();
        
        // Parse date of birth and calculate age
        const parts = atletaData.dataNascimento.split('/');
        const dataNascimento = new Date(parts[2], parts[1] - 1, parts[0]); // Year, month (0-indexed), day
        
        // Calculate age
        const today = new Date();
        let age = today.getFullYear() - dataNascimento.getFullYear();
        const monthDiff = today.getMonth() - dataNascimento.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dataNascimento.getDate())) {
          age--;
        }
        
        // Set age in the state
        setAge(age);
        
        setExerciseList(lista);
      } catch (error) {
        console.error('Error fetching athlete data:', error);
      }
    };
    
    fetchData();
    
    const intervalId = setInterval(() => {
      if (!isPaused && !isTrainingFinished) {
        setSeconds(prevSeconds => prevSeconds + 1);
      }
    }, 1000);
    
    // Cleanup function to clear interval when component unmounts or re-renders
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount
  

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };



  const handleTogglePause = () => {
    setIsPaused(prevState => !prevState);
  };



  const handleToggleFoward = useCallback(() => {
    if (!isTrainingFinished) {
      exerciseNumber++;
      if (exerciseNumber >= exercises.length) {
        setIsTrainingFinished(true); 
      } else {
        setCurrentExercise(exercises[exerciseNumber]);
      }
    }
  }, [isTrainingFinished, exerciseNumber, exercises]);



  const handleFinishTraining = async () => {
    // Prompt user for confirmation
    Alert.alert(
      "Confirm Finish Training",
      "Are you sure you want to finish training?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: async () => {
          setIsTrainingFinished(true);
  
          // Calculate average speed and strength per punch
          console.log(punches);
          const totalPunchStrength = punches.reduce((acc, punch) => acc + punch.strength, 0);
          const averageStrengthPerPunchNewton = (totalPunchStrength / punches.length).toFixed(2);
  
          // Find the strongest punch
          const strongestPunchStrength = punches.reduce((max, punch) => (punch.strength > max ? punch.strength : max), punches[0].strength);
          const id = auth.currentUser.uid;
          const nivelFisico = nivelFisico;
  
          // Populate FinishedTraining object
          const timestamp = Timestamp.now();

          const finishedTraining = {
            AverageSpeedPerPunch: (seconds / punches.length).toFixed(2),
            AverageStrengthPerPunchNewton: averageStrengthPerPunchNewton, // Assuming 1 kgf equals 9.81 newtons
            DurationOfTrainning: seconds,
            NumberOfPunches: punches.length,
            PlanTrainId: idPlanoTreino, // Get this from your application's context or state management
            StrongestPunch: strongestPunchStrength,
            punches: punches,
            idade: age,
            idUtilizador: id,
            timestamp: timestamp,
            Dificuldade: nivelFisico,
          };
          
  
          try {
            await addDoc(collection(db, 'FinishedTrain'), finishedTraining);
          } catch (error) {
            console.error('Error adding finished training: ', error);
            alert('An error occurred while adding the finished training.');
          } finally {
            navigation.navigate('HomeCalendar');
          }
        } }
      ]
    );
  };
  
  
  
  

  const handleSimularSoco = () => {
    const randomValue = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    const punch = { strength: randomValue, time: seconds };
    setPunches(prevPunches => [...prevPunches, punch]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      
      <Image source={{
            uri: exercise.fotoExercicio ? exercise.fotoExercicio : 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV'
      }}
  style={styles.image}
/>
      <View style={styles.content}>
        <View style={styles.topLeft}>
        <Text style={{ fontSize: 18 }}>
            <Text style={{ fontWeight: 'bold', color: '#F01801' }}>Exercicio:</Text> {exercise.nomeExercicio}
          </Text>
        </View>
        <View style={styles.topLeft}>
          <Text style={{ fontSize: 18 }}>
            <Text style={{ fontWeight: 'bold', color: '#F01801' }}>Descrição:</Text> {exercise.descricao}
          </Text>
        </View>
          <Text style={{ fontSize: 18,marginBottom:'5%' }}>
            <Text style={{ fontWeight: 'bold', color: '#F01801' }}>Tempo recomendado :</Text> {formatTime(exercise.tempo)} <IconFA name={"clock"} size={18} color="black" />

          </Text>
        <View style={styles.line}></View>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <Text style={{ fontSize: 15, alignSelf: 'center', marginVertical:'5%'}}>Este botão tem como{'\n'}objetivo simular um soco</Text>
        <TouchableOpacity style={styles.button} onPress={handleSimularSoco}>
          <Text style={{ color: 'white' }}><IconMC name="boxing-glove" size={80} color="white" /></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.button} onPress={handleTogglePause}>
          <Text style={{ color: 'white' }}>
            {isPaused ? (
              <IconFA name="play" size={15} color="white" />
            ) : (
              <IconFA name="pause" size={15} color="white" />
            )}
          </Text>
        </TouchableOpacity>
        {!isTrainingFinished && (
    <TouchableOpacity style={styles.button} onPress={handleToggleFoward}>
      <Text style={{ color: 'white' }}>
        <IconFA name="forward" size={15} color="white" />
      </Text>
    </TouchableOpacity>
  )}
        <TouchableOpacity style={[styles.button, { marginLeft: '20%' }]} onPress={handleFinishTraining}>
          <Text style={{ color: 'white' }}>Terminar Treino</Text>
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
  image: {
    width: '100%',
    height: '20%',
    borderBottomLeftRadius: 30,
    marginTop: '-10%',
    zIndex: -1,
  },
  line: {
    borderWidth: 1,
    borderColor: '#CC2C02',
    backgroundColor: '#CC2C02',
    width: '100%',
    alignSelf: 'center',
    marginBottom:'5%'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'flex-start', // Align content at the start
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20, // Reduce margin bottom
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10, // Reduce margin bottom
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center', // Align buttons at the center horizontally
    marginBottom: 20, // Adjust the margin bottom to create space between the buttons and other content
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10, // Reduce margin bottom
  },
});

export default LiveTraining;
