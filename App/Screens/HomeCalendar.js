import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Config/firebase';

const CalendarPage = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [daysWithTraining, setDaysWithTraining] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrainingDays = async () => {
    try {
      setLoading(true);
      const PlanoTreino_AtletaRef = collection(db, 'PlanoTreino_Atleta');
      const userId = auth.currentUser.uid;

      const PlanoTreino_AtletaSnapshot = await getDocs(query(PlanoTreino_AtletaRef, where('idAtleta', '==', userId)));

      const uniqueDatesSet = new Set(
        PlanoTreino_AtletaSnapshot.docs.map((doc) => convertToCalendarFormat(doc.data().data))
      );

      const PlanoTreino_dates = Array.from(uniqueDatesSet);
        console.log(PlanoTreino_dates);
      setDaysWithTraining(PlanoTreino_dates);
    } catch (error) {
      console.error('Error fetching training days:', error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingDays();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTrainingDay = () => {
    if (selectedDate) {
      navigation.navigate('DisplayTraining', formatDate(selectedDate));
    } else {
      alert('Escolha um dia para prosseguir');
    }
  };

  function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  }

  function convertToCalendarFormat(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return dateString;
  }

  const customMarkedDates = {};

  daysWithTraining.forEach((date) => {
    customMarkedDates[date] = { marked: true, dotColor: '#D72E02' };
  });

  if (selectedDate) {
    customMarkedDates[selectedDate] = { selected: true, selectedColor: '#D72E02' };
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Calendar
              style={{ marginTop: 50, backgroundColor: '#FFFFF' }}
              onDayPress={handleDayPress}
              markedDates={customMarkedDates}
              theme={{
                calendarBackground: '#FFFFF',
                selectedDayBackgroundColor: '#D72E02',
                selectedDayTextColor: '#FFFFFF',
              }}
            />

<View style={{ margin: 20, flexDirection: 'column', justifyContent: 'flex-end' }}>
  <Text style={{ fontWeight: '600' }}>Legenda:</Text>

  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{ color: '#D72E02' }}>●</Text>
    <Text style={{ marginLeft: 5 }}>Dia com treino</Text>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ backgroundColor: '#D72E02', borderRadius: 30, width: 25, padding: 2, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>DD</Text>
    </View>
    <Text style={{ marginLeft: 5 }}>Dia selecionado</Text>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
    <Text style={{ marginLeft: 5}}>
      <Text style={{ color: 'blue' }}>DD </Text>
      Data de hoje
    </Text>
  </View>
</View>

          </>
          
        )}
      </View>
      {!loading && (
        <TouchableOpacity style={styles.button} onPress={handleTrainingDay}>
          <Text style={styles.texto}>{formatDate(selectedDate)}</Text>
          <Text style={styles.verText}>Ver treinos para este dia ➡️</Text>
        </TouchableOpacity>
      )}
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFF',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 20,
    width: '80%',
    backgroundColor: '#D72E02',
    padding: 10,
    margin: 50,
    marginTop: 100,
    alignItems: 'center',
    alignSelf: 'center',
  },
  texto: {
    alignItems: 'center',
    color: '#FFF',
    fontWeight: '600',
    marginHorizontal: 30,
  },
  verText: {
    alignItems: 'center',
    color: '#FFF',
    fontWeight: '600',
  },
});

export default CalendarPage;
