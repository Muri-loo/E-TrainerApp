import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fundo from '../Navigation/fundo';

const CalendarPage = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const tasks = {
    '2023-04-01': [{ name: 'Abs' }, { name: 'Push up' }],
    '2023-04-02': [{ name: 'Doctor Appointment' }],
    // ... other tasks
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowModal(true);
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <Calendar onDayPress={handleDayPress} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalView}>
          <Text>Exercices for today {selectedDate}:</Text>
          {tasks[selectedDate]?.map((task, index) => (
            <Text key={index}>{task.name}</Text>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowModal(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>        
      <Fundo navigation={navigation} />  

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
});

export default CalendarPage;
