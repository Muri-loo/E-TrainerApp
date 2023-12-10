import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ImageBackground,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';
import Navbar from '../Navigation/navbar';
import { db } from '../../Config/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

function Profile({ navigation }) {
  const [athlete, setAthlete] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [userType, setUserType] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.log('Error on signout', error);
      });
  };

  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const checkUserType = async () => {
    try {
      // Attempt to fetch from the Atleta collectio
      const AthletQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', userId)));
      const atleta = AthletQueryResult.docs[0];

      if (AthletQueryResult.size > 0) {
        setAthlete(atleta.data());
        setUserType('Atleta');
      }else{
          const mail = auth.currentUser.email;
          const TrainerQueryResult = await getDocs(query(collection(db, 'Treinador'), where('email', '==', mail)));
          const trainerData = TrainerQueryResult.docs[0].data(); // Get the trainer data
          setTrainer(trainerData);
          setUserType('Treinador');
        
          // Fetch athletes associated with this trainer
          const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idTreinador', '==', trainerData.idTreinador)));
          // Convert the query snapshot to a usable array of athlete data
          const studentData = AthletsQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setStudents(studentData); // Set the students in the state
      }

    } catch (error) {
      console.error('Error checking user type:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    checkUserType();
  }, []);

  const getGender = (value) => {
    if(value == "0")
      return "Male";
    else
      return "Female";
  }

  if (userType === 'Atleta') {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar navigation={navigation} />
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.title}>{athlete.nome}</Text>
          <Image
          source={{uri: athlete.fotoAtleta}}
          style={styles.profilePic}
          />
          <Text style={styles.info}>Email: {athlete.email}</Text>
          <Text style={styles.info}>Phone: {athlete.telemovel}</Text>
          <Text style={styles.info}>About me: {athlete.descricao}</Text>
          <Text style={styles.info}>Gender: {athlete.genero}</Text>
          <Text style={styles.info}>Age: {athlete.dataNascimento}</Text>
          <Text style={styles.info}>Height: {athlete.altura} cm</Text>
          <Text style={styles.info}>Weight: {athlete.peso} kg</Text>

          <TouchableOpacity>
            <Text style={styles.info}>EDIT</Text>
            <Image
              source={{uri: 'https://drive.google.com/uc?export=view&id=1yBtDO3nUsGbx7FZgBTzjZeRFNWa-c4aI'}}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </ScrollView>
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }

  if (userType === 'Treinador') {

    const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
        <Image
          source={{ uri: item.fotoAtleta }}
          style={styles.fotoAtleta}
        />
        <Text style={styles.studentName}>{item.nome}</Text>
      </TouchableOpacity>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.contentContainer}>
            <Text style={styles.title}>{trainer.nome}</Text>
            <Image
              style={styles.profilePic}
              source={{ uri: trainer.fotoTreinador }} // Replace with trainer's profile picture URL
            />
            
            <Text style={styles.info}>Gender: {getGender(trainer.genero)}</Text>
            <Text style={styles.info}>Age: {trainer.dataNascimento}</Text>
            <Text style={styles.info}>Codigo: {trainer.codigoTreinador}</Text>
            <Text style={styles.info}>Email: {trainer.email}</Text>
            <Text style={styles.info}>Descricao: {trainer.descricao}</Text>
          <FlatList
            data={students}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={styles.studentGrid}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }

  const renderDefaultProfile = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.loading}>Loading...</Text>
      {/* You can add more athlete-specific UI components here */}
      <TouchableOpacity onPress={logout}>
        
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {userType === 'Atleta' && renderAtletaProfile()}
      {userType === 'Treinador' && renderTreinadorProfile()}
      {(!userType || (userType !== 'Atleta' && userType !== 'Treinador')) &&
        renderDefaultProfile()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#000',
  },
  content: {
    backgroundColor:'#D72E02F2',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    marginTop: 5,
    padding: 20,
    backgroundColor: '#000',
  },
  profilePic: {
    marginTop: 30,
    width: 100,
    height: 100,
    borderRadius: 10, // Make it round
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  studentGrid: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  studentItem: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    width: 120, // Adjust the size as needed
    height: 120, // Adjust the size as needed
    borderRadius: 20, // Make it round
  },
  fotoAtleta: {
    marginTop: 10,
    width: '40%',
    height: '60%',
    backgroundColor: '#fff',
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC2C02',
    textAlign: 'center',
    marginTop: 8,
  },
  studentInfo: {
    fontSize: 16,            // Font size for other student information
    color: '#666'            // Set the text color for the student information
  },
  editButton: {
    width: 100,
    height: 100,
    backgroundColor: '#CC2C02',
    borderRadius: 50,
    marginTop: 100,
    marginLeft: 135,
    alignItems: 'center',
  },
  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  loading: {
    marginTop: 300,
    alignSelf: 'center',
    color: '#000',
    fontSize: 18,
  },
  logoutText: {
    backgroundColor: '#D72E02F2',
    padding: 10,
    borderRadius: 25,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
