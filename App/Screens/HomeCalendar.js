import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';

const CalendarPage = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTrainingDay = () =>{
    if(selectedDate){
      
      navigation.navigate('DisplayTrain',selectedDate);
    }else{
      alert('Escolha um dia para prosseguir');
    }

  }

  function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString; // Return the original string if the format is unexpected
  }

  const customMarkedDates = {};
  if (selectedDate) {
    customMarkedDates[selectedDate] = { selected: true, marked: true, selectedColor: '#D72E02' };
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <Calendar
        style={{ marginTop: 50, backgroundColor: '#FFFFF' }}
        onDayPress={handleDayPress}
        markedDates={customMarkedDates}
        for
        theme={{
          calendarBackground: '#FFFFF',
          selectedDayBackgroundColor: '#D72E02',
          selectedDayTextColor: '#ffffff',
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleTrainingDay}>
        <Text style={styles.texto}>{formatDate(selectedDate)}</Text>
        <Text style={styles.verText}>Ver treinos para este dia  ➡️</Text>
        
      </TouchableOpacity>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFF', // Pure white background
  },

  button: {
    borderRadius: 20,
    width: '80%',
    backgroundColor: '#D72E02',
    padding: 10,
    margin: 50,
    marginTop: 150,
    alignItems: 'center',
  },
  texto: {
    alignItems: 'center',
    color: '#FFF',
    fontWeight: '600',
    marginHorizontal: 30, // Adjust this value as needed
  },
  verText: {
    alignItems: 'center',
    color: '#FFF',
    fontWeight: '600',
  },
});

export default CalendarPage;
