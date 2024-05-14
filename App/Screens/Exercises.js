import React, {  useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';

function Exercises({ navigation }) {



const [exercises, setExercises] = useState([]);
const getExercises = async () => {
    const ExercisesQueryResult = await getDocs(query(collection(db, 'Exercicio')));
    const exerciseData = ExercisesQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setExercises(exerciseData);
}
useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getExercises();
    });
    return unsubscribe;
  }, [navigation]);
  
  return (
    <SafeAreaView style={styles.container}>
    <Navbarlight navigation={navigation} />
    <View style={{ flex: 1 }}>
    <Text>List of Exercises</Text>
      <View style={styles.gridContainer}>

            <FlatList
                data={exercises}
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
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateExercise')}>
        <Text style={styles.buttonText}>Add Exercise</Text>
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
    addButton: {
        backgroundColor: '#D72E02',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    studentGrid: {
        alignSelf: 'center',
        marginBottom: 20,
      },
      gridContainer: {
        flexDirection: 'row', // Layout children in a row
        flexWrap: 'wrap', // Allow items to wrap to next row
        justifyContent: 'space-between', // Space items evenly
        padding: 10, // Add padding around the container
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
});

export default Exercises;