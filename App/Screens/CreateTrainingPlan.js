import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, FlatList, Modal, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { pickImage, uploadFile, formatTime } from '../Navigation/funcoes';
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

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
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [DificultyLevel, setDificuldade] = useState('');
  const [goal, setGoal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [uri, setUri] = useState('');
  const [tempoPlano, setTempoPlano] = useState(0);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    validateForm();
  }, [trainingPlan, selectedExercises]);
  
  useEffect(() => {
    let tempoTotal = 0;
    selectedExercises.forEach((exercise) => {
      tempoTotal += parseInt(exercise.tempo, 10);
    });
    setTempoPlano(tempoTotal);
  }, [selectedExercises]);

  const fetchExercises = async () => {
    const querySnapshotGoals = await getDocs(collection(db, 'Goals'));
    const fetchedGoals = querySnapshotGoals.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    const querySnapshot = await getDocs(collection(db, 'Exercicio'));
    const fetchedExercises = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    setExercises(fetchedExercises);
    setGoals(fetchedGoals);
  };

  const handleChange = (name, value) => {
    setTrainingPlan(prevPlan => ({ ...prevPlan, [name]: value }));
  };

  const handleSelect = (item) => {
    if (goal) {
      setSelectedGoals(prevSelected => {
        const isAlreadySelected = prevSelected.some(e => e.id === item.id);
        const updatedSelectedGoals = isAlreadySelected
          ? prevSelected.filter(e => e.id !== item.id)
          : [...prevSelected, item];
        
        // Check if there are any selected goals, if yes, remove the error
        const hasSelectedGoals = updatedSelectedGoals.length > 0;
        setErrors(prevErrors => ({
          ...prevErrors,
          goals: hasSelectedGoals ? '' : 'Selecione pelo menos 1 objetivo',
        }));
  
        return updatedSelectedGoals;
      });
    } else {
      setSelectedExercises(prevSelected => {
        return prevSelected.some(e => e.id === item.id)
          ? prevSelected.filter(e => e.id !== item.id)
          : [...prevSelected, item];
      });
    }
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
          fotoPlanoTreino: imageUrl,
          DificultyLevel: DificultyLevel,
        };
        
        const docRef = await addDoc(collection(db, 'PlanoTreino'), trainingPlanToSave);

        let tempoPlano = 0;
        await Promise.all(selectedExercises.map(async (e) => {
          tempoPlano += parseInt(e.tempo, 10);
          const object = { idExercicio: e.id, idPlanoTreino: docRef.id };
          await addDoc(collection(db, 'Exercicio_PlanoTreino'), object);
        }));

        const updatedTrainingPlan = {
          ...trainingPlanToSave,
          idPlanoTreino: docRef.id,
          tempo: tempoPlano
        };

        await setDoc(doc(db, 'PlanoTreino', docRef.id), updatedTrainingPlan);
        
        alert('Treino adicionado com sucesso!');
        setTrainingPlan({
          idPlanoTreino: '',
          nomePlano: '',
          descricao: '',
          exercicios: [],
          fotoPlanoTreino: '',
          DificultyLevel: '',
        });

        setSelectedGoals([]);
        setSelectedExercises([]);
        setUri('');
      } catch (error) {
        console.error('Erro ao adicionar plano treino: ', error);
        alert('Erro ao adicionar plano de treino');
      }
    } else {
      alert('Preencha todos os campos obrigatórios');
    }
  };

  const handleModalVisibility = (goalFlag) => {
    setGoal(goalFlag);
    setModalVisible(true);
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
    if (selectedGoals.length === 0) {
      errors.goals = 'Selecione pelo menos 1 objetivo';
      isValid = false;
    }
    if (!DificultyLevel) {
      errors.dificuldade = 'Selecione a dificuldade';
      isValid = false;
    }
  
    setErrors(errors);
    setIsFormValid(isValid);
  }
  const filteredExercises = exercises.filter(exercise =>
    exercise.nomeExercicio.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Criar Plano de Treino</Text>
        <View style={styles.line}></View>
        <View style={styles.selectedContainer}>
          <View style={styles.selectedList}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={trainingPlan.nomePlano}
              onChangeText={(value) => handleChange('nomePlano', value)}
            />
            {errors.nomePlano && <Text style={styles.error}>{errors.nomePlano}</Text>}
          </View>
          <View style={styles.selectedList}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              value={trainingPlan.descricao}
              onChangeText={(value) => handleChange('descricao', value)}
            />
            {errors.descricao && <Text style={styles.error}>{errors.descricao}</Text>}
          </View>
        </View>

        <View style={styles.selectedContainer}>
        <View style={styles.selectedList}>
          <Text style={styles.label}>Dificuldade:</Text>
            <Picker
              selectedValue={DificultyLevel}
              style={{ height: 50, width: 200, color: 'black' }}
              onValueChange={(itemValue, itemIndex) => { setDificuldade(itemValue); }}
            >
              <Picker.Item label="Fácil" value="Fácil" />
              <Picker.Item label="Intermédio" value="Intermédio" />
              <Picker.Item label="Avançado" value="Avançado" />
              <Picker.Item label="Profissional" value="Profissional" />
            </Picker>
            {errors.dificuldade && <Text style={styles.error}>{errors.dificuldade}</Text>}
          </View>
    
          
          <View style={styles.selectedList}>
            <Text style={styles.label}>Tempo de treino: </Text>
            <Text style={{fontSize : 20, marginLeft: '10%', marginTop: '7%'}}>{formatTime(tempoPlano)}</Text>
          </View>
        </View>

        <View style={styles.selectedContainer}>
          <View style={styles.selectedList}>
            <Text style={styles.label}>Exercicios selecionados:</Text>
            <FlatList
              data={selectedExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.selectedExerciseItem}>
                  {item.fotoExercicio ? (
                    <Image style={styles.exerciseImage} source={{ uri: item.fotoExercicio }} />
                  ) : null}
                  <View>
                    <Text style={styles.cenas}>{item.nomeExercicio}</Text>
                    <Text style={styles.cenas}>
                      <IconFA name={"clock"} size={15} color="white" /> {formatTime(item.tempo)}
                    </Text>
                  </View>
                </View>
              )}
            />
            {errors.exercicios && <Text style={styles.error}>{errors.exercicios}</Text>}
          </View>

          <View style={styles.selectedList}>
            <Text style={styles.label}>Objetivos selecionados:</Text>
            <FlatList
              data={selectedGoals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.selectedExerciseItem}>
                  <View>
                    <Text style={styles.cenas}>{item.goalName}</Text>
                  </View>
                </View>
              )}
            />
            {errors.goals && <Text style={styles.error}>{errors.goals}</Text>}
          </View>
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => handleModalVisibility(false)}>
          <Text style={styles.buttonText}>Adicionar exercicios</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={() => handleModalVisibility(true)}>
            <Text style={styles.buttonText}>Adicionar objectivos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleImageUpload}>
            <Text style={styles.buttonText}>Adicionar Imagem</Text>
          </TouchableOpacity>
          {uri ? <Image source={{ uri }} style={styles.image} /> : null}

          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Criar plano de treino</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Fundo navigation={navigation} />
  
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(!modalVisible); }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <FlatList
            data={goal ? goals : filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.exerciseItem,
                  (goal
                    ? selectedGoals.some(e => e.id === item.id)
                    : selectedExercises.some(e => e.id === item.id)
                  ) && styles.selectedExercise
                ]}
                onPress={() => handleSelect(item)}
              >
                {!goal ? (
                  <>
                    <Text>{item.nomeExercicio}</Text>
                    <Text>Duração: {formatTime(item.tempo)}</Text>
                  </>
                ) : (
                  <Text>{item.goalName}</Text>
                )}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => {
              setGoal(false);
              setModalVisible(false);
            }}
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
    selectedContainer: {
      flexDirection: 'row',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    selectedList: {
      flex: 1,
      marginRight: 10, // Adjust spacing between lists
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
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      marginBottom: '2%',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white', // Adjust as needed
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
      alignSelf: 'center',
    },
    cenas: {
      color: 'white',
    },
    selecionados: {
      flexDirection: "row",
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
      marginHorizontal: 5,
      alignItems: 'center',
      marginTop: 20,
      width: '22%'
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
