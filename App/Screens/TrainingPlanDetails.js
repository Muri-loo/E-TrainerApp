import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc as d, deleteDoc, getDocs, where, query, getDoc, addDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../Config/firebase';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { formatTime } from '../Navigation/funcoes';

function TrainingPlanDetails({ navigation, route }) {
  const { fotoPlanoTreino, tempo, nomePlano, deleteId, DificultyLevel, idPlanoTreino, aluno, data, descricao, objetivos,idCriador} = route.params;
  const [exerciseList, setExerciseList] = useState([]);
  const [goals,setGoals]= useState([]);
  const [isMister, setMister] = useState('filodapta');
  // Use a default image or placeholder if fotoPlanoTreino is null
  const imageUri = fotoPlanoTreino || 'https://drive.google.com/uc?export=view&id=1uNBArFrHi5f8c0WOlCHcJwPzWa8bKihV';

  const tradutor = async () => {
    try {
      const documento = await getDoc(doc(collection(db, 'Treinador'), auth.currentUser.uid));
      setMister(documento.exists());
      const goalsNames = await Promise.all(objetivos.map(async (element) => {
            const documento = await getDoc(doc(collection(db, 'Goals'), element));
            return documento.data().goalName;
        }));
        setGoals(goalsNames);
    } catch (error) {
        console.error('Error in tradutor:', error);
        throw error;
    }
};

  const addTrain = async () => {
    try {
      const userId = aluno.idAtleta; // Updated this line
      // Create a new document in 'PlanoTreino_Atleta'
      const newPlanDocRef = await addDoc(collection(db, 'PlanoTreino_Atleta'), {
        data: data,
        idAtleta: userId,
        idPlanoTreino: idPlanoTreino,
      });


      navigation.navigate('DisplayTraining', { data, aluno: aluno });
    } catch (error) {
      console.error('Error adding plan to PlanoTreino_Atleta:', error);
      setError(error.message);
    }
  };

  const deleteOnPress = async () => {
    try {
      if(auth.currentUser.uid==idCriador){
        const documentRef = d(db, 'PlanoTreino', idPlanoTreino);
        await deleteDoc(documentRef);
        navigation.goBack();
        return;
      }
      const documentRef = d(db, 'PlanoTreino_Atleta', deleteId);
      await deleteDoc(documentRef);
      navigation.navigate('HomeCalendar');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  useEffect(() => {
    tradutor();
    const getExercicesList = async () => {
      try {
        const data = await getDocs(query(collection(db, 'Exercicio_PlanoTreino'), where('idPlanoTreino', '==', idPlanoTreino)));
        const promises = data.docs.map(async (doc) => {
          const id = doc.data().idExercicio;
          const docSnap = await getDoc(d(db, "Exercicio", id));
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

      <Text style={{ marginLeft: '8%', fontSize: 17 }}>
        <Text style={{ fontWeight: 'bold' }}>Descrição do treino:</Text>{descricao}
      </Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.infoText}><IconFA name={"clock"} size={15} color="white" /> {formatTime(tempo)} min</Text>
        <Text style={styles.infoText}><IconFA name={"leaf"} size={15} color="white" /> {DificultyLevel}</Text>
        {goals.map((goal, index) => (
          <Text key={index} style={styles.infoText}><IconFA name={"leaf"} size={15} color="white" /> {goal}</Text>
        ))}
      </View>
      <View style={styles.line}></View>

      <View style={{ flex: 1 }}>
        <Text style={styles.subTitle}> Exercícios </Text>
        <FlatList
          data={exerciseList}
          renderItem={({ item }) => (
            <View style={styles.exerciseDisplay}>
              <View style={styles.exerciseImage}>
                {item.fotoExercicio ? (
                  <Image style={{ flex: 1, borderBottomLeftRadius: 30, borderTopLeftRadius: 30 }} source={{ uri: item.fotoExercicio }} />
                ) : null}
              </View>

              <View>
                <Text style={styles.nomeExercicio}>{item.nomeExercicio}</Text>
                <Text style={styles.nomeExercicio}><IconFA name={"clock"} size={15} color="white" /> {formatTime(item.tempo)} min</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.idExercicio}
        />
      </View>

      <View style={styles.fundoContainer}>
        <View style={styles.buttonsContainer}>
        {(deleteId ) &&  (
            <TouchableOpacity style={styles.button} onPress={deleteOnPress}>
              <Text style={styles.buttonText}>Apagar Treino{isMister}</Text>
            </TouchableOpacity>
  
          )}
          {(auth.currentUser.uid === idCriador) && (
            <TouchableOpacity style={styles.button} onPress={deleteOnPress}>
              <Text style={styles.buttonText}>Remover Plano Treino APP</Text>
            </TouchableOpacity>
          )}
          {((data || (!isMister))) && (  
          <TouchableOpacity style={styles.button} onPress={data ? addTrain : () => navigation.navigate('LiveTraining', { lista: exerciseList, idPlanoTreino: idPlanoTreino, nivelFisico:DificultyLevel })}>
            <Text style={styles.buttonText}>{data ? 'Adicionar Treino' : 'Iniciar Treino'}</Text>
          </TouchableOpacity>
        )}
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
  exerciseImage: {
    backgroundColor: '#c2c2c2',
    width: '35%',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  exerciseDisplay: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: '#323230',
    width: '90%',
    alignSelf: 'center',
    marginBottom: '5%',
    height: 120,
  },
  nomeExercicio: {
    fontSize: 18, // Reduced font size
    fontWeight: 'bold',
    color: 'white',
    marginTop: '10%',
    marginLeft: '10%',
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
    paddingVertical: 5, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
    fontSize: 12,
    margin: 5,
    width: '30%', // Fixed width to fit three per line
    textAlign: 'center', // Center align text
    flexDirection: 'row',
    alignItems: 'center',
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
    flexWrap: 'wrap',
  },
  subTitle: {
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: '5%',
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginBottom: '4%',
  },
  fundoContainer: {
    justifyContent: 'flex-end',
  },
});

export default TrainingPlanDetails;
