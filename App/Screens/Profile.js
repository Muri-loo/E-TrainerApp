import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { db } from '../../Config/firebase';
import { pickImage, uploadFile } from '../Navigation/ImageUploader';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

function Profile({ navigation }) {
  const [object, setObject] = useState('');
  const [userType, setUserType] = useState('');
  const [students, setStudents] = useState([]);

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error on signout', error);
    }
  };

  const handlerImage = async () => {
    const uri = await pickImage();
    if (uri) {
      try {
        await uploadFile(uri, object, userType);
        Alert.alert('Foto', 'Foto carregada com sucesso');
      } catch (error) {
        Alert.alert('Foto', error.message);
      }
    }
  };

  const checkUserType = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const atletaDocRef = doc(db, 'Atleta', userId);
      const atletaDocSnap = await getDoc(atletaDocRef);

      if (atletaDocSnap.exists()) {
        setObject(atletaDocSnap.data());
        setUserType('Atleta');
      } else {
        const mail = auth.currentUser.email;
        const TrainerQueryResult = await getDocs(query(collection(db, 'Treinador'), where('email', '==', mail)));
        const trainerData = TrainerQueryResult.docs[0].data();

        setObject(trainerData);
        setUserType('Treinador');

        const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idTreinador', '==', trainerData.idTreinador)));
        const studentData = AthletsQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(studentData);
      }
    } catch (error) {
      console.error('Error checking user type:', error);
    }
  };

  useEffect(() => {
    checkUserType();
  }, []);

  const getGender = (value) => (value === '0' ? 'Male' : 'Female');

  return (
    <SafeAreaView style={styles.containerWrap}>
      <Navbarlight navigation={navigation} />
      <View style={styles.container}>
        {userType === 'Atleta' && (
          <>
            <Text style={styles.title}>{object?.nome}</Text>
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={handlerImage}>
                <Image source={{ uri: object?.fotoAtleta || 'https://drive.google.com/uc?export=view&id=1VrqvZTseVMNmNciV1CvBEY5nIbFnSD1s' }} style={styles.profilePic} />
              </TouchableOpacity>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Genéro: {getGender(object?.genero)}</Text>
                <Text style={styles.detailText}>Idade: {object?.dataNascimento}</Text>
                <Text style={styles.detailText}>Altura: {object?.altura} cm</Text>
                <Text style={styles.detailText}>Peso: {object?.peso} kg</Text>
              </View>
            </View>

            <View style={{marginTop:20, marginLeft:50}}>
              <Text style={styles.detailText}>Telemóvel: {object?.telemovel}</Text>
              <Text style={styles.detailText}>Email: {object?.email}</Text>
              <Text style={styles.detailText}>Descrição:</Text>
              <Text style={styles.detailText}>{object?.descricao}</Text>
            </View>

            <Image source={require('../assets/fotofinal.png')} style={styles.estatistica} />
          </>
        )}

        {userType === 'Treinador' && (
          <>
          <View style={{marginTop:40}}>
          <TouchableOpacity onPress={handlerImage}>
              <Image source={{ uri: object?.fotoTreinador || 'https://drive.google.com/uc?export=view&id=1VrqvZTseVMNmNciV1CvBEY5nIbFnSD1s' }} style={styles.profilePic} />
          </TouchableOpacity>
          </View>
          
            <Text style={styles.title}>{object?.nome}</Text>
            
            <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>
            <Text style={styles.labelText}>Genéro:</Text> {getGender(object?.genero)}</Text>
            <Text style={styles.detailText}>  <Text style={styles.labelText}>Data de nascimento:</Text> {object?.dataNascimento}</Text>
            <Text style={styles.detailText}> <Text style={styles.labelText}>Codigo:</Text> {object?.codigoTreinador}</Text>
            <Text style={styles.detailText}> <Text style={styles.labelText}>Email:</Text> {object?.email}</Text>
            <Text style={styles.detailText}> <Text style={styles.labelText}>Descricao:</Text> {object?.descricao}</Text>

          </View>

            <FlatList
              data={students}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
                  <Image source={{ uri: item?.fotoAtleta }} style={styles.fotoAtleta} />
                  <Text style={styles.studentName}>{item?.nome}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              numColumns={3}
              style={styles.studentGrid}
            />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    marginLeft: 55,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginTop:15,
    width:'80%',
  },
  profilePic: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  detailText: {
    // Your existing styles for the outer <Text> components
    color: '#000',
    fontSize: 15,
    marginLeft: 29,
  },
  labelText: {
    // Styles specific to the label (first <Text>)
    fontWeight: 'bold', // Add any other styles you want for the label
  },
  estatistica: {
    alignSelf: 'center',
  },
  studentGrid: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  studentItem: {
    backgroundColor: '#808080',
    alignItems: 'center',
    margin: 5,
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  fotoAtleta: {
    marginTop: 10,
    width: '40%',
    height: '60%',
    backgroundColor: '#FFF',
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC2C02',
    textAlign: 'center',
    marginTop: 8,
  },
  info: {
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: '#3F3F3C',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'center',
  },
  logoutButton: {
    backgroundColor: '#D72E02F2',
    padding: 10,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default Profile;
