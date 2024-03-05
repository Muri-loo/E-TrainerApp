import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { db } from '../../Config/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

function EditProfile({ navigation,route}) {
  const [editMode,setEditMode] = useState(false);
  const [profile, setProfile] = useState(route.params);

  const handleEdit = () =>{
  setEditMode(!editMode);
  }

  const editProfile = (field, data) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [field]: data
    }));
    console.log(profile.nome);
  }
  



  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={{ flex: 1 }}>


      <TouchableOpacity
        style={[styles.logoutButton,{margin:20}]} 
        onPress={handleEdit}
      >
        <Text style={{ color: '#FFF' }}>
          {editMode ? 'Guardar Dados' : 'Alterar Dados'}
        </Text>
        
      </TouchableOpacity>


<Text style={[styles.label, { marginTop: 30 }]}>Nome:</Text>

      <TextInput
          style={styles.input}
          value={profile.nome}
          onChangeText={text => editProfile("nome",text)}
          placeholder="Nome"
          editable={editMode} // Allow editing only in edit mode
        />
        <Text style={styles.label}>Numero telemóvel:</Text>

      <TextInput
        style={styles.input}
        value={profile.telemovel}
        onChangeText={text => editProfile("telemovel", text)}
        placeholder="Telemóvel"
        editable={editMode} // Allow editing only in edit mode
      />
        <Text style={styles.label}>Data Nascimento:</Text>

<TextInput
  style={styles.input}
  value={profile.dataNascimento}
  onChangeText={text => editProfile("telemovel", text)}
  placeholder="Telemóvel"
  keyboardType="numeric" 
  editable={editMode} // Allow editing only in edit mode
/>

<Text style={styles.label}>Peso:</Text>

<TextInput
  style={styles.input}
  value={'' + profile.peso}
  onChangeText={text => editProfile("peso", text)}
  placeholder="Peso"
  keyboardType="numeric" 
  editable={editMode} // Allow editing only in edit mode
/>
      </View>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFF',
    justifyContent: 'space-between',
  },  logoutButton: {
    backgroundColor: '#D72E02F2',
    padding: 10,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    margin: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0d7d7',
  },
  label:{
    margin:10,
    marginLeft:20,
    marginBottom:-5,
  }
});

export default EditProfile;
