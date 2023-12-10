import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
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
          <View style={styles.profileHeader}>
            <Text style={styles.title}>{athlete.nome}</Text>
          </View>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: athlete.fotoAtleta }}
              style={styles.profilePic}
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Gender: {athlete.genero}</Text>
              <Text style={styles.detailText}>Age: {athlete.dataNascimento}</Text>
              <Text style={styles.detailText}>Height: {athlete.altura} cm</Text>
              <Text style={styles.detailText}>Weight: {athlete.peso} kg</Text>
            </View>
          </View>
          
          <View style={styles.additionalInfo}>
          <Text style={styles.email}>Phone: {athlete.telemovel}</Text>
            <Text style={styles.email}>Email: {athlete.email}</Text>
           
            <Text style={styles.desc}>Description</Text>
            <Text style={styles.info}>{athlete.descricao}</Text>
          </View>

          <Image
               source={require('../assets/image.png')}
              style={styles.estatistica}
            />
        
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.editButton}>
          <Image
               source={require('../assets/removeatleta.png')}
              style={styles.estatistica}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Manage Workouts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
          </View>
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
  profileHeader: {
    // Style for profile header if needed
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 30,
    marginLeft: 55,
    marginBottom : 30,
  },
  bottomButtons: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#000',
  },
  
  // Ensure the details container takes up the remaining space and aligns its children to start
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the start of the container
    marginLeft: 30, // Add some space between the profile image and the details
  },
  
  // Ensure the image and details don't exceed the screen width
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff'
  },
  detailText: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 15,
    // Add other styling as needed
  },
  email: {
    color: '#fff',
    marginTop: 5,
    marginBottom: 5,
    // Add other styling as needed
    alignSelf: 'center',
    fontSize: 18,
  },
  detailColumn: {
    flex: 1, // Take up remaining space
    justifyContent: 'space-around', // Space out the details evenly
  },
  desc: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  estatistica: {
    alignSelf: 'center',
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
  studentGrid: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  studentItem: {
    backgroundColor: '#fff',
    alignItems: 'center',
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
    width: 50,
    height: 50,
    backgroundColor: '#CC2C02',
    borderRadius: 50,
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
