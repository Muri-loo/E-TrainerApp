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
import { collection, getDocs, query, where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { algoritmoRecomendacao } from '../Navigation/funcoes';
import { db, auth } from '../../Config/firebase';
import { Shadow } from 'react-native-shadow-2';
import { SearchBar } from 'react-native-elements';

import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';

function AddNewTrainningPlan({ navigation, route }) {
  const { data, aluno, type } = route.params;
  const [loadingData, setLoading] = useState(false);
  const [planosTreino, setPlanosTreinos] = useState([]);
  const [error, setError] = useState(null);
  const [pesquisa, setSearch] = useState('');
  const alternativeImage = 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV'; // URL to your default image

  useEffect(() => {
    const fetchTrainningPlans = async () => {
      try {
        setLoading(true);
        const searchId = aluno?.idAtleta || auth.currentUser.uid;
        const collectionToQuery = collection(db, 'PlanoTreino_Atleta');
        const queryForTrain = query(
          collectionToQuery,
          where('idAtleta', '==', searchId),
          where('data', '==', data)
        );
  
        let exerciciosRecomendados = [];
        if (type === 'recomendacao') {
          exerciciosRecomendados = await algoritmoRecomendacao(aluno.idAtleta);
        }
  
        const trainningPlanSnapshot = await getDocs(queryForTrain);
  
        const associatedPlanIds = trainningPlanSnapshot.docs.map((doc) => doc.data().idPlanoTreino);
  
        const allPlansQuery = query(collection(db, 'PlanoTreino'));
        const allPlansSnapshot = await getDocs(allPlansQuery);
  
        let filteredPlansData = allPlansSnapshot.docs
          .filter((doc) => !associatedPlanIds.includes(doc.id.trim()))
          .map((doc) => doc.data());
  
        if (exerciciosRecomendados.length > 0) {
          filteredPlansData = filteredPlansData.filter((plan) =>
            exerciciosRecomendados.includes(plan.idPlanoTreino)
          );
        }
  
        // Filter the plans based on the search term
        filteredPlansData = filteredPlansData.filter((plan) =>
          plan.nomePlano.toLowerCase().includes(pesquisa.toLowerCase())
        );
  
        setPlanosTreinos(filteredPlansData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainningPlans();
  }, [data, aluno, type, pesquisa]);

  const handleButtonPress = async (selectedTrainingPlan) => {
    try {
      setLoading(true);
      // Add additional attributes to selectedTrainingPlan
      const updatedTrainingPlan = {
        ...selectedTrainingPlan,
        data: data,
        aluno: aluno
      };
      navigation.navigate('TrainingPlanDetails', updatedTrainingPlan);
    } catch (error) {
      console.error('Error navigating to TrainingPlanDetails:', error);
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
          placeholder="O que procura?"
          containerStyle={{
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            backgroundColor: 'transparent',
            width:'90%',
            alignSelf:'center',
          }}
          inputContainerStyle={{ backgroundColor: 'transparent', width: '80%' }}
          value={pesquisa}
          onChangeText={setSearch}
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
    backgroundColor: 'white',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
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
});

export default AddNewTrainningPlan;
