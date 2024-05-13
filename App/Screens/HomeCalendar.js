import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, FlatList,Image} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Config/firebase';
import { Shadow } from 'react-native-shadow-2';
import IconFA from 'react-native-vector-icons/FontAwesome5';



const CalendarPage = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [daysWithTraining, setDaysWithTraining] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadCalendar, setLoadCalendar] = useState(true);
  const [alunoA, setAluno] = useState(null);
  const [studentData, setstudentData] = useState([]);




  const fetchTrainingDays = async () => {
    setLoading(true);
    try {
      // Determine the user ID and set the 'aluno' state accordingly
      let userId = route.params?.idAtleta;
      if (!userId) {
        const alunoSnapshot = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', auth.currentUser.uid)));
        if (alunoSnapshot.empty) {
           setLoadCalendar(false);
           const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idTreinador', '==', auth.currentUser.uid)));
           const studentData = AthletsQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
           setstudentData(studentData);
          return;
        }
        const alunoData = alunoSnapshot.docs[0].data();
        userId = alunoData.idAtleta;
        setAluno(alunoData);
      } else {
        console.log('Mister');
        setLoadCalendar(true);
        setAluno(route.params);
      }
  
      // Fetch training days using the determined user ID
      const planoTreinoSnapshot = await getDocs(query(collection(db, 'PlanoTreino_Atleta'), where('idAtleta', '==', userId)));
      const trainingDates = planoTreinoSnapshot.docs.map(doc => convertToCalendarFormat(doc.data().data));
      const uniqueTrainingDates = [...new Set(trainingDates)];
  
      setDaysWithTraining(uniqueTrainingDates);
    } catch (error) {
      console.error('Error fetching training days:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedStudent = (item) => {
    navigation.navigate('HomeCalendar',item);
  };
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrainingDays();
    });
    fetchTrainingDays();
    return unsubscribe;
  }, [navigation, route.params]); // Removed the extra comma
  

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTrainingDay = async () => {
    const combinedParams= {
      data:formatDate(selectedDate),
      aluno:alunoA,
    }
    if (selectedDate) {
      navigation.navigate('DisplayTraining', combinedParams);
    } else {
      Alert.alert('Aviso','Escolha um dia para prosseguir');
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
    <SafeAreaView  style={styles.container}>
    <SafeAreaProvider>
    <View style={{ flex: 1 }}>
    {/* INICIO do container principal */}
    <Navbarlight navigation={navigation} />


    {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : !loadCalendar ? (
          // Display this when loadCalendar is false
          <>
          <Text style={{fontSize:27, fontWeight:'bold', alignSelf:'center', marginTop:10}}>Clientes</Text>
          <View style={{
            marginTop: 5, // Adjust the space between the text and the line
            height: 2, // Thickness of the line
            backgroundColor: 'gray', // Color of the line
            width: '90%', // Makes the line longer than the text
            alignSelf: 'center',
  }} />
            <View style={styles.gridContainer}>

                <FlatList
                    data={studentData}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.studentItem} onPress={() => handleSelectedStudent(item)}>

                        <Image  source={{ uri: item?.fotoAtleta ? item.fotoAtleta : 'https://drive.google.com/uc?export=view&id=1WqNVu_0jLh9sQI511gCINW4aAlHRJP-i' }}
                        style={styles.fotoAtleta} />
                        <Text style={styles.studentName}>{item?.nome}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    style={styles.studentGrid}
                />

            </View>
          </>
      
        ) : (
          // Your existing Calendar and other content for when loading is done and loadCalendar is true
          <>
          {alunoA && alunoA.nome && (
            <Text style={{fontSize:20, margin:10, fontWeight:'bold'}}>{alunoA.nome}</Text>
          )}
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
                <Text style={{ fontWeight: '600', color: '#15bff2' }}>DD </Text>
                Data de hoje
                </Text>
              </View>
            </View>

            {/* <TouchableOpacity style={styles.button} onPress={handleTrainingDay}>
              <Text style={styles.verText}>Detalhes Dia</Text>
            </TouchableOpacity> */}


            <View style={styles.middleButton}>
              <Shadow distance={10} startColor={'#eb9066d8'} endColor={'#ff00ff10'}>
                <TouchableOpacity 
                  style={{backgroundColor: '#CC2C02', height: 40, width: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center'}}  
                  onPress={handleTrainingDay}>
                  <IconFA  name={"plus"} size={25} color="white" />
                </TouchableOpacity>
              </Shadow>
            </View>

          </>
        )}


    {/* Fim do container principal */}
    </View>
    <Fundo navigation={navigation} />
    </SafeAreaProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  middleButton: {
    position: 'absolute',
    bottom: '-3%', // space from bottombar
    left: '52.5%', // center horizontally
    transform: [{ translateX: -25 }], // adjust for button width
    zIndex: 9999, // Set a high zIndex value
  },
  
  gridContainer: {
    flexDirection: 'row', // Layout children in a row
    flexWrap: 'wrap', // Allow items to wrap to next row
    justifyContent: 'space-between', // Space items evenly
    padding: 10, // Add padding around the container
  },
  studentGrid: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  studentItem: {
    backgroundColor: '#808080',
    alignItems: 'center',
    margin: 5,
    width: '30%', // Adjust the width as needed, accounting for padding/margin
    aspectRatio: 1, // Keep the items square
    borderRadius: 20,
  },
  fotoAtleta: {
    margin: 5,
    width: '50%',
    height: '70%',
    backgroundColor: '#FFF',
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC2C02',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  button: {
    borderRadius: 40,
    width: '40%',
    backgroundColor: '#D72E02',
    padding: 10,
    marginTop:5,
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
