import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet
} from 'react-native';
import { collection, getDocs, query , where} from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth} from '../../Config/firebase';
import { Shadow } from 'react-native-shadow-2';

import Navbarlight from '../Navigation/navbarlight';

function AddNewTrainningPlan({ navigation, route }) {
  const [planosTreino, setPlanosTreinos] = useState([]);
  const [loadingData, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const PlanoTreinoRef = collection(db, 'PlanoTreino');
  const alternativeImage =
    'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV'; // URL to your default image
  
  const fetchTrainningPlans = async () => {
    try {
      setLoading(true);
  
      const collectionToQuery = collection(db, 'PlanoTreino_Atleta');
      const queryForTrain = query(
        collectionToQuery,
        where('idAtleta', '==', auth.currentUser.uid),
        where('data', '==', route.params)
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
    

    
        console.log(filteredPlansData);

      setPlanosTreinos(filteredPlansData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
    

  useEffect(() => {
    fetchTrainningPlans();
  }, []);

  const handleButtonPress = () =>{
   const collectionToQuery = collection(db,'PlanoTreino_Atleta');
   const queryforTrain= query(collectionToQuery)

  };

  const renderPlan = ({ item }) => {
    const imageUri = item.image ? item.image : alternativeImage;

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
    <SafeAreaView>
      <Navbarlight></Navbarlight>
      <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>
        ADICIONE TREINO PARA ESTE DIA: {route.params}
      </Text>

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
          keyExtractor={(item) => item.id} // Ensure the key is unique

        />
      )}
    </SafeAreaView>
  );
}
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
  noExercisesText: {
    color: '#000',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
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

export default AddNewTrainningPlan;
