import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';


function TrainingPlanDetails({ navigation, route }) {
  const { fotoPlanoTreino, haveQrcode, tempo, nomePlano, idPlanoTreino} = route.params;

  // Use a default image or placeholder if fotoPlanoTreino is null
  const imageUri = fotoPlanoTreino || 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV';

  const deleteOnPress = async () => {
   console.log("Apaga");

  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Nome do Plano:</Text>
        <Text style={styles.value}>{nomePlano}</Text>

        <Text style={styles.label}>Have QR Code:</Text>
        <Text style={styles.value}>{haveQrcode}</Text>

        <Text style={styles.label}>Tempo:</Text>
        <Text style={styles.value}>{tempo}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={deleteOnPress}>
          <Text style={{fontWeight:600, color:'white'}}>Remover dos treinos de hoje</Text>

      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  value: {
    fontSize: 18,
    marginBottom: 15,
  }, 
  button: {
    backgroundColor: 'red', // Set background color to red
    borderRadius: 20, // Add border radius
    width: '80%', // Set width to 80%
    padding: 10,
    margin: 50,
    marginTop: 100,
    alignItems: 'center', // Center horizontally
    alignSelf: 'center', // Center vertically
  },
});

export default TrainingPlanDetails;
