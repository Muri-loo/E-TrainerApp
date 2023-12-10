import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';

function DisplayTraining({ navigation, route }) {
    // Function to handle button press
    const handleButtonPress = (workoutType) => {
      console.log(`Selected workout: ${workoutType}`);
      // Navigation logic here if needed
    };
  
    // Data for the FlatList
    const workoutButtons = [
      { title: 'Abdominal Workout', type: 'Abdominal' },
      { title: 'Boxe Workout', type: 'Boxe' },
      { title: 'Mobility Workout', type: 'Mobility' },
      { title: 'Strength Workout', type: 'Strength' },
    ];
  
    // Render button with ImageBackground and subtle shadow
    const renderButton = ({ item }) => (
      <SafeAreaView style={styles.shadowContainer}>
        <Shadow>
          <TouchableOpacity onPress={() => handleButtonPress(item.type)} style={styles.buttonStyle}>
            <ImageBackground
              source={{ uri: 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV' }}
              style={styles.imageBackground}
              imageStyle={styles.buttonImage}
            >
              <Text style={styles.buttonText}>{item.title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </Shadow>
      </SafeAreaView>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <Navbarlight navigation={navigation} />
        <Text style={styles.titleText}>Training for today: {route.params}</Text>
  
        <FlatList
          data={workoutButtons}
          renderItem={renderButton}
          keyExtractor={item => item.type}
          style={styles.scrollViewStyle}
        />
        <TouchableOpacity style={styles.button} >

            <Text style={{color:'#fff', fontWeight:'600'}}>Adicionar Treino para este dia</Text> 
        </TouchableOpacity>
  
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }
  
  

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    color: '#000',
    fontSize: 20,
    marginTop: 20,
    padding: 10,
  },
  scrollViewStyle: {
    flex:1,
},
  shadowContainer: {
    alignItems: 'center',
  },
  buttonStyle: {
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    borderRadius: 20,
  },
  buttonText: {
    width: 300,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    width: '80%',
    backgroundColor: '#D72E02',
    padding: 10,
    margin: 20,
    alignItems: 'center',
    alignSelf:'center',
  },
});

export default DisplayTraining;
