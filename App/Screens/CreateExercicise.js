import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet,Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { pickImage, uploadFile, formatTime } from '../Navigation/funcoes';
import { collection, addDoc, setDoc, doc,getDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';

function CreateExercise({ navigation,route }) {
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [exercise, setExercise] = useState({
    descricao: '',
    fotoExercicio: '',
      idExercicio: '',
    nomeExercicio: '',
    tempo: '',
  });
  const [uri, setUri] = useState('');

  const handleChange = (name, value) => {
    setExercise(prevExercise => ({
      ...prevExercise,
      [name]: value
    }));
  };

  useEffect(() => {
    validateForm();
  }, [exercise]);

  const handleImageUpload = async () => {
    const uri = await pickImage();
    setUri(uri);
  };


  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        const docRef = await addDoc(collection(db, 'Exercicio'), exercise);
        
        // Update the exercise object with the generated ID
        const updatedExercise = {
          ...exercise,
          idExercicio: docRef.id
        };
        
        // Update Firestore with the updated exercise object
        await setDoc(doc(db, 'Exercicio', docRef.id), updatedExercise);

        if (uri) {
          try {
            await uploadFile(uri, updatedExercise, 'Exercicio');
          } catch (error) {
              Alert.alert('Foto', error.message);
          }
        }
        
        alert('Exercicio criado com sucesso!');
        
        // Clear form fields after submission
        setExercise({
          descricao: '',
          fotoExercicio: '',
          idExercicio: '',
          nomeExercicio: '',
          tempo: '',
        });
      } catch (error) {
        console.error('Erro ao adicionar exericio: ', error);
        alert('Ocorreu um erro ao adicionar exericio. ');
      }
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  };
  
  

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!exercise.descricao) {
      errors.descricao = 'Description is required';
      isValid = false;
    }
    if (!exercise.nomeExercicio) {
      errors.nomeExercicio = 'Exercise Name is required';
      isValid = false;
    }
    if (!exercise.tempo) {
      errors.tempo = 'Time is required';
      isValid = false;
    }


    setErrors(errors);
    setIsFormValid(isValid);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
        {!route.params ? (
          <>
            <Text style={styles.title}>Criar exercicio</Text>
            <View style={styles.line}></View>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={exercise.nomeExercicio}
              onChangeText={(value) => handleChange('nomeExercicio', value)}
            />
            {errors.nomeExercicio && <Text style={styles.error}>{errors.nomeExercicio}</Text>}
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              value={exercise.descricao}
              onChangeText={(value) => handleChange('descricao', value)}
            />
            {errors.descricao && <Text style={styles.error}>{errors.descricao}</Text>}
            <Text style={styles.label}>Duração:</Text>
            <TextInput
              style={styles.input}
              value={exercise.tempo}
              onChangeText={(value) => handleChange('tempo', value)}
            />
            {errors.tempo && <Text style={styles.error}>{errors.tempo}</Text>}
  
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>
            {errors.fotoExercicio && <Text style={styles.error}>{errors.fotoExercicio}</Text>}
  
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Criar exercicio</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>hello</Text>
        )}
      </View>
      <Fundo navigation={navigation} />
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
});

export default CreateExercise;
