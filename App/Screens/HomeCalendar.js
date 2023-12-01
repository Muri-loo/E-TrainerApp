import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarPage = ({ navigation }) => {
  // Define the theme for the calendar
  const [selected, setSelected] = useState('');


  return (
    <SafeAreaView style={styles.container}>

<Calendar onDayPress={day => {setSelected(day.dateString);}}
          markedDates={{[selected]: {selected: true, disableTouchEvent: true, selectedColor: '#D72E02', selectedDotColor: "#000"}}}
    />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Agendar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set the background color of the container to black
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#D72E02',
    padding: 10,
    margin: 20,
  },
  buttonText: {
    color: '#fff',
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'gray',
    margin: 40, // Adjust the margin as needed
    marginTop: '20%',
  },
});

export default CalendarPage;
