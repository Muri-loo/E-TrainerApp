import React, { useEffect, useState } from 'react';
import {   ActivityIndicator, View, Text} from 'react-native';
import { db } from '../../Config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import { onAuthStateChanged } from 'firebase/auth';

function AddNewTrainningPlan({ navigation, route }) {
    const [planosTreino, setPlanosTreinos] = useState([]);
    const [loadingData, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const PlanoTreinoRef = collection(db, "PlanoTreino");
  
    const fetchTrainningPlans = async () => {
      try {
        setLoading(true);
        const allPlansQuery = query(PlanoTreinoRef);
        const allPlansSnapshot = await getDocs(allPlansQuery);
        const plansData = allPlansSnapshot.docs.map((doc) => doc.data());
  
        setPlanosTreinos(plansData);
      } catch (error) {
        console.error(error);
        setError(error.message); // Set the error message
      } finally {
        setLoading(false);
      }
    }; 
  
    useEffect(() => { 
      fetchTrainningPlans();
    }, []);
  
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
          // Render content based on fetched training plans
          planosTreino.map((plan, index) => (
            <View key={index}>
              {/* Render each training plan as needed */}
              <Text>{plan.nomePlano}</Text>
            </View>
          ))
        )}
      </SafeAreaView>
    );
  }
  

export default AddNewTrainningPlan;