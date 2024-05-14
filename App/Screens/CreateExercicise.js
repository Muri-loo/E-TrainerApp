import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { pickImage, uploadFile } from '../Navigation/ImageUploader';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import { v4 as uuidv4 } from 'uuid';

function CreateExercise({ navigation }) {
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [exercise, setExercise] = useState({
    descricao: '',
    fotoExercicio: '',
    idExercicio: uuidv4(),
    nomeExercicio: '',
    tempo: '',
  });

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
    if (uri) {
      try {
        await uploadFile(uri, exercise, 'exercise');
        setExercise(prevExercise => ({
          ...prevExercise,
          fotoExercicio: uri
        }));
        alert('Imagem carregada com sucesso!');
      } catch (error) {
        alert('Erro ao carregar a imagem: ' + error.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        await addDoc(collection(db, 'Exercicio'), exercise);
        alert('Exercise added successfully!');
        // Clear form fields after submission
        setExercise({
          descricao: '',
          fotoExercicio: '',
          idExercicio: '',
          nomeExercicio: '',
          tempo: '',
        });
      } catch (error) {
        console.error('Error adding exercise: ', error);
        alert('An error occurred while adding the exercise.');
      }
    } else {
      alert('Please fill in all required fields.');
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
    /* if (!exercise.fotoExercicio) {
      errors.fotoExercicio = 'Image is required';
      isValid = false;
    } */

    setErrors(errors);
    setIsFormValid(isValid);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>
      <Text style={styles.label}>Exercise Name:</Text>
        <TextInput
          style={styles.input}
          value={exercise.nomeExercicio}
          onChangeText={(value) => handleChange('nomeExercicio', value)}
        />
        {errors.nomeExercicio && <Text style={styles.error}>{errors.nomeExercicio}</Text>}
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={exercise.descricao}
          onChangeText={(value) => handleChange('descricao', value)}
        />
        {errors.descricao && <Text style={styles.error}>{errors.descricao}</Text>}
        <Text style={styles.label}>Duration:</Text>
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
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

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
