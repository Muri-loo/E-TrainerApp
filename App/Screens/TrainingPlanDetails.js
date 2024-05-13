import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';

function TrainingPlanDetails({ navigation, route }) {
  const { fotoPlanoTreino, haveQrcode, tempo, nomePlano, deleteId} = route.params;

  // Use a default image or placeholder if fotoPlanoTreino is null
  const imageUri = fotoPlanoTreino || 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV';

  const deleteOnPress = async () => {
    try {
      const documentRef = doc(db, 'PlanoTreino_Atleta', deleteId);
      await deleteDoc(documentRef);
      navigation.navigate('HomeCalendar');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.Title}>{nomePlano}</Text>

      <View style={styles.detailsContainer}>
      <TouchableOpacity style={styles.infoButton} onPress={deleteOnPress}>
          <Text style={{fontWeight:600, color:'white'}}>Iniciar Treino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoButton  } onPress={deleteOnPress}>
          <Text style={{fontWeight:600, color:'white'}}>Iniciar Treino</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>

      <View>
      <Text style={{ marginLeft:'5%', marginTop:'2%',fontSize:17,fontWeight:'bold'}}>Exercícios</Text>
      <ScrollView>

      </ScrollView>

      </View>


   

      <View style={styles.fundoContainer}>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={deleteOnPress}>
          <Text style={{fontWeight:600, color:'white'}}>Apagar Treino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LiveTraining')}>
          <Text style={{fontWeight:600, color:'white'}}>Iniciar Treino</Text>
        </TouchableOpacity>

      </View>
        <Fundo navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  line:{
    borderWidth:1,
    borderColor:'gray',
    width:'90%',
    alignSelf: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'flex-end', // Align buttons to the right
    paddingHorizontal: 20, // Add some horizontal padding
    marginTop: 20, // Add some top margin
    marginBottom:20,
  },
  infoButton:{
    height:'5%',
    backgroundColor: 'red', // Set background color to red
    borderRadius: 20, // Add border radius
    paddingVertical: 10, // Adjust padding
    paddingHorizontal: 20, // Adjust padding
    marginLeft: 10, // Add some left margin between buttons
    alignItems: 'center', // Center horizontally
  },
  button: {
    backgroundColor: 'red', // Set background color to red
    borderRadius: 20, // Add border radius
    paddingVertical: 10, // Adjust padding
    paddingHorizontal: 20, // Adjust padding
    marginLeft: 10, // Add some left margin between buttons
    alignItems: 'center', // Center horizontally
  },
  image: {
    width: '100%',
    height: '20%',
    borderBottomLeftRadius: 30, // Adjust the border radius for the left side
    marginTop:"-10%",
    zIndex: -1, // Set a lower z-index for the image

  },
  detailsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginBottom:10,
  },
  fundoContainer: {
    flex: 1, // Take remaining vertical space
    justifyContent: 'flex-end', // Align at the bottom
  },
});

export default TrainingPlanDetails;
