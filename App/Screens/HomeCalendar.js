import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';


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
      <Navbarlight navigation={navigation} />  
      <Calendar onDayPress={handleDayPress} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalView}>
        <Text >Insira codigo de Treinador:</Text>
        <TextInput style= {{ borderWidth:1, borderColor:'#000'}}
          placeholder="Codigo Treinador"
        />

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
