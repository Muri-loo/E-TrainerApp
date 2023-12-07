import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const UserProfileForm = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleChange = (name, value) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Typically, here you would send the data to your server
    console.log(profile);
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

      <TouchableOpacity style={styles.button}onPress={() => navigation.navigate('FormRegisterPhysic')}>
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
