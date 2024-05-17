import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db, auth } from '../../Config/firebase';
import { Shadow } from 'react-native-shadow-2';
import { SearchBar } from 'react-native-elements';

import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';

function AddNewTrainningPlan({ navigation, route }) {
  const { data, aluno } = route.params;
  const [loadingData, setLoading] = useState(false);


  const [planosTreino, setPlanosTreinos] = useState([]);
  const [error, setError] = useState(null);

  const [pesquisa, setSearch] = useState('');
  const PlanoTreinoRef = collection(db, 'PlanoTreino');
  const alternativeImage =
    'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV'; // URL to your default image

  const handleSearch = (text) => {
    setSearch(text);
  };



  const fetchTrainningPlans = async () => {
    try {
      setLoading(true);
      const searchId = aluno?.idAtleta || auth.currentUser.uid; // Updated this line

      
      const collectionToQuery = collection(db, 'PlanoTreino_Atleta');
      const queryForTrain = query(
        collectionToQuery,
        where('idAtleta', '==', searchId),
        where('data', '==', data)
      );

      const trainningPlanSnapshot = await getDocs(queryForTrain);

      // Extract the 'idPlanoTreino' values from 'PlanoTreino_Atleta'
      const associatedPlanIds = trainningPlanSnapshot.docs.map((doc) => doc.data().idPlanoTreino);
      // Query 'PlanoTreinoRef' to get all plans
      const allPlansQuery = query(PlanoTreinoRef);
      const allPlansSnapshot = await getDocs(allPlansQuery);

      // Filter out plans from 'PlanoTreinoRef' that appear in 'PlanoTreino_Atleta' for the current user
      const filteredPlansData = allPlansSnapshot.docs
        .filter((doc) => !associatedPlanIds.includes(doc.id.trim()))
        .map((doc) => doc.data());

      setPlanosTreinos(filteredPlansData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrainningPlans();
    });
    return unsubscribe;
  }, [navigation]);

  const handleButtonPress = async (selectedPlan) => {
    try {
      setLoading(true);
      const userId = aluno?.idAtleta || auth.currentUser.uid; // Updated this line

      const selectedDate = data;
      console.log(selectedPlan.idPlanoTreino, userId, selectedDate);
      // Create a new document in 'PlanoTreino_Atleta'
      const newPlanDocRef = await addDoc(collection(db, 'PlanoTreino_Atleta'), {
        data: selectedDate,
        idAtleta: userId,
        idPlanoTreino: selectedPlan.idPlanoTreino,
      });

      console.log('Document added with ID: ', newPlanDocRef.id);

      navigation.navigate('DisplayTraining', {data,aluno});
    } catch (error) {
      console.error('Error adding plan to PlanoTreino_Atleta:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPlan = ({ item }) => {
    const imageUri = item.fotoPlanoTreino ? item.fotoPlanoTreino : alternativeImage;

    return (
      <SafeAreaView>
        <Shadow>
          <TouchableOpacity onPress={() => handleButtonPress(item)} style={styles.buttonStyle}>
            <ImageBackground
              source={{ uri: imageUri }}
              style={styles.imageBackground}
              imageStyle={styles.buttonImage}>
              <Text style={styles.buttonText}>{item.nomePlano}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </Shadow>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight></Navbarlight>
        <View style={styles.contentWrapper}>
        
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 600, margin: 10 }}>
          ADICIONE TREINO PARA ESTE DIA: {data}
        </Text>

        <SearchBar
          placeholder="Pesquisa o treino a tua medida"
          containerStyle={{
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            backgroundColor: 'transparent',
          }}
          inputContainerStyle={{ backgroundColor: 'transparent', width: '80%' }}
          value={pesquisa}
          onChangeText={handleSearch}
          inputStyle={{
            color: 'black',
            textAlign: 'center',
          }}
        />

        {loadingData ? (
          // Loading indicator while data is being fetched
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          // Display an error message
          <Text>Error: {error}</Text>
        ) : (
          <FlatList
          data={planosTreino}
          renderItem={renderPlan}
          keyExtractor={(item) => item.idPlanoTreino}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />} // Adjust the height as needed
          contentContainerStyle={{ paddingBottom: 20 }} // Additional padding to compensate for ItemSeparatorComponent height
          style={{ alignSelf: 'center', marginVertical: -20 }} // Adjust marginVertical to compensate for negative space introduced by ItemSeparatorComponent
        />

        )}
      </View>
      <Fundo></Fundo>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:'white',

  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleText: {
    color: '#000',
    fontSize: 20,
    marginTop: 20,
    padding: 10,
  },
  noExercisesText: {
    color: '#000',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  scrollViewStyle: {
    flex: 1,
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
    alignSelf: 'center',
  },

});

export default AddNewTrainningPlan;
