import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, FlatList, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { pickImage, uploadFile } from '../Navigation/ImageUploader';
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';

function CreateTrainingPlan({ navigation }) {
  const [trainingPlan, setTrainingPlan] = useState({
    idPlanoTreino: '',
    nomePlano: '',
    descricao: '',
    exercicios: [], 
    fotoPlanoTreino: '',
    DificultyLevel: '',
  });
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [DificultyLevel, setDificuldade] = useState('');
  const [goal, setGoal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [uri, setUri] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    validateForm();
  }, [trainingPlan, selectedExercises]); // Add selectedExercises to the dependency array

  const fetchExercises = async () => {
    const querySnapshot = await getDocs(collection(db, 'Exercicio'));
    const fetchedExercises = [];
    querySnapshot.forEach((doc) => {
      fetchedExercises.push({ ...doc.data(), id: doc.id });
    });
    setExercises(fetchedExercises);
  };

  const handleChange = (name, value) => {
    setTrainingPlan(prevPlan => ({
      ...prevPlan,
      [name]: value
    }));
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises(prevSelected => {
      if (prevSelected.some(e => e.id === exercise.id)) {
        return prevSelected.filter(e => e.id !== exercise.id);
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  const handleImageUpload = async () => {
    const uri = await pickImage();
    setUri(uri);
  };

  const handleSubmit = async () => {
    if (isFormValid) {
    
      try {
        let imageUrl = '';
        if (uri) {
          imageUrl = await uploadFile(uri, trainingPlan, 'PlanoTreino');
        }

        const trainingPlanToSave = {
          ...trainingPlan,
          exercicios: selectedExercises.map(e => e.id),
          fotoPlanoTreino: imageUrl
        };
      const docRef = await addDoc(collection(db, 'PlanoTreino'), trainingPlanToSave);


      let tempoPlano = 0;

      await Promise.all(selectedExercises.map(async (e) => {
        tempoPlano += parseInt(e.tempo, 10); // Make sure to add to tempoPlano correctly
        const object = { idExercicio: e.id, idPlanoTreino: docRef.id };
        await addDoc(collection(db, 'Exercicio_PlanoTreino'), object);
      }));
      

        // Update the training plan object with the generated ID
        const updatedTrainingPlan = {
          ...trainingPlanToSave,
          idPlanoTreino: docRef.id,
          tempo:tempoPlano
        };

        // Update Firestore with the updated training plan object
        await setDoc(doc(db, 'PlanoTreino', docRef.id), updatedTrainingPlan);
      
        alert('Training plan added successfully!');
        setTrainingPlan({
          idPlanoTreino: '',
          nomePlano: '',
          descricao: '',
          exercicios: [],
          fotoPlanoTreino: '',
          DificultyLevel: '',
        });


        setSelectedExercises([]);
        setUri('');
      } catch (error) {
        console.error('Error adding training plan: ', error);
        alert('An error occurred while adding the training plan.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    if (!trainingPlan.nomePlano) {
      errors.nomePlano = 'Escolha um nome';
      isValid = false;
    }
    if (!trainingPlan.descricao) {
      errors.descricao = 'Escreva uma descrição';
      isValid = false;
    }
    if (selectedExercises.length === 0) {
      errors.exercicios = 'Selecione pelo menos 1 exercicio';
      isValid = false;
    }
    if (!DificultyLevel) { // Check the difficulty state
      errors.dificuldade = 'Selecione a dificuldade'; // Correct the error field
      isValid = false;
    }
  
    setErrors(errors);
    setIsFormValid(isValid);
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.nomeExercicio.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Criar Plano de Treino</Text>
        <View style={styles.line}></View>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={trainingPlan.nomePlano}
          onChangeText={(value) => handleChange('nomePlano', value)}
        />
        {errors.nomePlano && <Text style={styles.error}>{errors.nomePlano}</Text>}
        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.input}
          value={trainingPlan.descricao}
          onChangeText={(value) => handleChange('descricao', value)}
        />
        {errors.descricao && <Text style={styles.error}>{errors.descricao}</Text>}
        <Text style={styles.label}>Dificuldade:</Text>
        <Picker
          selectedValue={DificultyLevel} 
          style={{ height: 50, width: 200, color: 'black' }}
          onValueChange={(itemValue, itemIndex) => {setDificuldade(itemValue);}}
>
          <Picker.Item label="Fácil" value="Fácil" />
          <Picker.Item label="Intermédio" value="Intermédio" />
          <Picker.Item label="Avançado" value="Avançado" />
          <Picker.Item label="Profissional" value="Profissional" />
        </Picker>

        {errors.dificuldade && <Text style={styles.error}>{errors.dificuldade}</Text>}
        <Text style={styles.label}>Exercicios selecionados:</Text>
        <FlatList
          data={selectedExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <View style={styles.selectedExerciseItem}>
              {item.fotoExercicio ? (
            <Image style={styles.exerciseImage} source={{ uri: item.fotoExercicio }} />
            ) : null}
            <View >
            <Text style={styles.cenas}>{item.nomeExercicio}</Text>
            <Text style={styles.cenas}><IconFA name={"clock"} size={15} color="white" /> {item.tempo} sec</Text>
          </View>

        </View>

  )}
/>
        {errors.exercicios && <Text style={styles.error}>{errors.exercicios}</Text>}

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add Exercise</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.addButton}  onPress={() => { setGoal(true); setModalVisible(true);}}>
          <Text style={styles.buttonText}>Adicionar Objectivos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>
        {uri ? <Image source={{ uri }} style={styles.image} /> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Fundo navigation={navigation} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <FlatList
          //fazer if aqui tambem para a data
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.exerciseItem,
                  selectedExercises.some(e => e.id === item.id) && styles.selectedExercise
                ]}
                onPress={() => handleExerciseSelect(item)}
              >
           
          {!goal ? (
          <>
          {/* EXERCICIO */}
            <Text>{item.nomeExercicio}</Text>
            <Text>Tempo Meta: {item.tempo}</Text>
          </>
          ) : (
            <>
            {/* GOALS */}
              <Text>{item.camposGoal}</Text>
              <Text>Tempo: {item.camposGoal}</Text>
            </>
          )}

          
              
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#D72E02',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#D72E02',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  cenas: {
    color : "white"
  },
  line: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '90%',
    alignSelf: 'center',
  },
  uploadText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginLeft: 10,
  },
  exerciseItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
  },
  selectedExercise: {
    backgroundColor: '#D72E02',
    borderColor: 'white',
  },
  selectedExerciseItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    backgroundColor: '#D72E02',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#D72E02',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  closeButton: {
    backgroundColor: '#D72E02',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    alignSelf: 'center',
  },
});

export default CreateTrainingPlan;
