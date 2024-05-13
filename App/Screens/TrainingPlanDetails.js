import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';

function TrainingPlanDetails({ navigation, route }) {
  const { fotoPlanoTreino, haveQrcode, tempo, nomePlano, deleteId } = route.params;

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
        <Text style={styles.infoText}>{tempo}</Text>
        <Text style={styles.infoText}>Iniciar Treino</Text>
      </View>
      <View style={styles.line}></View>

      <View>
        <Text style={styles.subTitle}>Exercícios</Text>
        <ScrollView>

        </ScrollView>
      </View>

      <View style={styles.fundoContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={deleteOnPress}>
            <Text style={styles.buttonText}>Apagar Treino</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LiveTraining')}>
            <Text style={styles.buttonText}>Iniciar Treino</Text>
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
  line: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '90%',
    alignSelf: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  infoText: {
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize:14,
    height: '2%', 
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
  image: {
    width: '100%',
    height: '20%',
    borderBottomLeftRadius: 30,
    marginTop: '-10%',
    zIndex: -1,
  },
  detailsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  subTitle: {
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 17,
    fontWeight: 'bold',
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginBottom: 10,
  },
  fundoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default TrainingPlanDetails;
