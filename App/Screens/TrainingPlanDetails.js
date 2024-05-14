import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc as d, deleteDoc, getDocs, where, query, getDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import IconFA from 'react-native-vector-icons/FontAwesome5';

function TrainingPlanDetails({ navigation, route }) {
  const { fotoPlanoTreino, tempo, nomePlano, deleteId, DificultyLevel, idPlanoTreino } = route.params;
  const [exerciseList, setExerciseList] = useState([]);
  // Use a default image or placeholder if fotoPlanoTreino is null
  const imageUri = fotoPlanoTreino || 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV';

  const deleteOnPress = async () => {
    try {
      const documentRef = d(db, 'PlanoTreino_Atleta', deleteId);
      await deleteDoc(documentRef);
      navigation.navigate('HomeCalendar');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  useEffect(() => {
    const getExercicesList = async () => {
      try {
        const data = await getDocs(query(collection(db, 'Exercicio_PlanoTreino'), where('idPlanoTreino', '==', idPlanoTreino)));
        const promises = data.docs.map(async (doc) => {
          const id = doc.data().idExercicio;
          console.log(id);
          const docSnap = await getDoc(d(db, "Exercicio", id));
          console.log(docSnap.data()); 
          return docSnap.data(); // Return the data of the document snapshot
        });
        const exercises = await Promise.all(promises);
        const exerciseList = exercises.filter(exercise => exercise !== null);
        setExerciseList(exerciseList);
        // Now you have the exerciseList containing the details of all exercises
      } catch (err) {
        console.error(err); // Handle any errors
      }
    };

    getExercicesList();
  }, [idPlanoTreino]); // Include idPlanoTreino in the dependency array

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.Title}>{nomePlano}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.infoText}><IconFA name={"clock"} size={15} color="white" /> {tempo} min</Text>
        <Text style={styles.infoText}><IconFA name={"leaf"} size={15} color="white" /> {DificultyLevel}</Text>
      </View>
      <View style={styles.line}></View>

      <View style={{ flex: 1 }}>

        <Text style={styles.subTitle}> Exercícios </Text>
          <FlatList
            data={exerciseList}
            renderItem={({ item }) => (
              <View style={styles.exerciseDisplay}>
              <View style={styles.exerciseImage}>
              </View>

                <View>
                  <Text style={styles.nomeExercicio}>{item.nomeExercicio}</Text> 
                  <Text style={styles.nomeExercicio}><IconFA name={"clock"} size={15} color="white" /> {item.tempo} sec</Text>  
                </View>

              </View>
            )}
            keyExtractor={(item) => item.idExercicio}
          />

        </View>


      <View style={styles.fundoContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={deleteOnPress}>
            <Text style={styles.buttonText}>Apagar Treino</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LiveTraining', exerciseList)}>
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
  exerciseImage:{
    backgroundColor:'#c2c2c2',
    width:'35%',
    borderTopLeftRadius:30,
    borderBottomLeftRadius:30,
  },
  exerciseDisplay:{
    flexDirection:'row',
    borderRadius:30,
    backgroundColor:'#323230',
    width:'90%',
    alignSelf:'center',
    marginBottom:'5%',
    height:120,
  },
  nomeExercicio:{
    fontSize:20,
    fontWeight:'bold',
    color:'white',
    marginTop:'10%',
    marginLeft:'10%',

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
    fontSize: 12,
    marginLeft: 5,
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
    marginBottom: 10,
  },
  subTitle: {
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom:'5%',
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '5%',
    margin: 10,
  },
  fundoContainer: {
    justifyContent: 'flex-end',
  },
});

export default TrainingPlanDetails;
 