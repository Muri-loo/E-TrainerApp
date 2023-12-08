import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';



const UserProfileForm = ({navigation}) => {
  
  //Var
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    Altura:'',
    Peso:'',
    genero:'',
    dataNascimento:'',
  });




  useEffect(() => { 
    validateForm(); 
}, [profile]); 

  const handleChange = (name, value) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));

  };

  const handleSubmit = () => { 
    if (isFormValid) { 

        // Form is valid, perform the submission logic
        navigation.navigate('FormRegisterPhysic',{profile} ); 
        console.log('Form submitted successfully!'); 
    } else { 
          
        // Form is invalid, display error messages 
        console.log('Form has errors. Please correct them.'); 
    } 
}; 


const validateForm = () => { 
  let errors = {}; 

  // Validar campo do nome 
  if (!profile.fullName) { 
    errors.name = 'Nome é necessário.'; 
  } else if (!/^[A-Za-z ]+$/.test(profile.fullName)) {
    errors.name = 'O nome não pode conter caracteres especiais ou números.'; 
  }

  // Validar campo do email 
  if (!profile.email) { 
    errors.email = 'Email é necessário.'; 
  } else if (!/\S+@\S+\.\S+/.test(profile.email)) { 
    errors.email = 'Email inválido.'; 
  } 

  // Validar campo da senha 
  if (!profile.password) { 
    errors.password = 'Senha é necessária.'; 
  } else if (profile.password.length < 6) { 
    errors.password = 'A senha deve ter no mínimo 6 caracteres.'; 
  } 

  // Validar campo do número de telefone 
  if (!profile.phoneNumber) { 
    errors.phoneNumber = 'Número de telemóvel é necessário.'; 
  } else if (profile.phoneNumber.length != 9) { 
    errors.phoneNumber = 'Número Português inválido.'; 
  } 

  // Definir os erros e atualizar a validade do formulário 
  setErrors(errors); 
  setIsFormValid(Object.keys(errors).length === 0); 
}; 


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Fill Your Profile</Text>
        <Text style={styles.subHeaderText}>Don't worry you can change it later</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={profile.fullName}
          onChangeText={(value) => handleChange('fullName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          value={profile.email}
          onChangeText={(value) => handleChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={profile.password}
          onChangeText={(value) => handleChange('password', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={profile.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
        />

      </View>
      {Object.values(errors).map((error, index) => ( 
                <Text  key={index} style={{color:'red'}} > 
                    {error} 
                </Text> 
            ))} 
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Assuming the background is black
    paddingHorizontal: 20
  },
  header: {
    paddingVertical: 20
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  subHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 30
  },
  inputContainer: {
    marginBottom: 20
  },
  input: {
    backgroundColor: '#333', // Dark input fields
    color: '#fff',
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#e74c3c', // Red button, replace with the color from the image
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default UserProfileForm;
