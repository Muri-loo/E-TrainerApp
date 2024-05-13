import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function LiveTraining({ navigation }) {
  const [seconds, setSeconds] = useState(0);
  const [isTrainingFinished, setIsTrainingFinished] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isTrainingFinished) {
        setSeconds(prevSeconds => prevSeconds + 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTrainingFinished]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleFinishTraining = () => {
    setIsTrainingFinished(true);
    console.log(`Seconds when 'Terminar Treino' was pressed: ${seconds}`);
  };

  const handleSimularSoco = () => {
    console.log(`Seconds when 'Simular Soco' was pressed: ${seconds}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSimularSoco}>
          <Text style={{ color: 'white' }}>Simular Soco</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFinishTraining}>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
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
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LiveTraining;
