import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

function LiveTraining({ navigation, route }) {
  const [seconds, setSeconds] = useState(0);
  const [isTrainingFinished, setIsTrainingFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPaused && !isTrainingFinished) {
        setSeconds(prevSeconds => prevSeconds + 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPaused, isTrainingFinished]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleTogglePause = () => {
    setIsPaused(prevState => !prevState);
  };

  const handleFinishTraining = () => {
    setIsTrainingFinished(true);
    console.log(`Seconds when 'Terminar Treino' was pressed: ${seconds}`);
  };

  const handleSimularSoco = () => {
    const randomValue = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    console.log(`PunchForce: ${randomValue}, TimeOfPunch: ${seconds}`);
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.topLeft}>
          <Text>{route.params}</Text>
        </View>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSimularSoco}>
          <Text style={{ color: 'white' }}><IconMC name="boxing-glove" size={80} color="white" /></Text>
        </TouchableOpacity>

        <View style={[styles.row, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity style={styles.button} onPress={handleTogglePause}>
            <Text style={{ color: 'white' }}>
              {isPaused ? (
                <IconFA name="play" size={15} color="white" />
              ) : (
                <IconFA name="pause" size={15} color="white" />
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleTogglePause}>
            <Text style={{ color: 'white' }}>
              <IconFA name="forward" size={15} color="white" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { marginLeft: '20%' }]} onPress={handleFinishTraining}>
            <Text style={{ color: 'white' }}>Terminar Treino</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginRight: '3%',
  },
  row: {
    flexDirection: 'row',
    margin: '7%',
  },
  topLeft: {
    top: 20,
    left: 20,
  },
});

export default LiveTraining;
