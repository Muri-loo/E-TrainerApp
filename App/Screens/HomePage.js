import React from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        // Initially visible month. Default = now
        current={'2022-01-01'}
        // Callback that gets called on day press
        onDayPress={(day) => { console.log('selected day', day); }}
        // ...other props
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SomeOtherPage')}
      >
        <Text style={styles.buttonText}>Agendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SomeOtherPage')}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#D72E02',
    padding: 10,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  // ... other styles
});

export default CalendarPage;
