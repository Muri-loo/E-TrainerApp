import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Fundo from '../Navigation/fundo';
import Navbar from '../Navigation/navbar';
import { db } from "../../Config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";

function Profile({ navigation }) {
  
  const [athlete, setAthlete] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [userType, setUserType] = useState(null);
  const [students, setStudents] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigation.navigate("Home");
    }).catch((error) => {
      console.log("Error on signout", error);
    });
  };

  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const checkUserType = async () => {
    try {
      // Attempt to fetch from the Atleta collectio
      const AthletQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', userId)));
      const atleta = AthletQueryResult.docs[0];

      if (AthletQueryResult.size>0) {
        setAthlete(atleta.data());
        setUserType('Atleta');
      }else{
          const mail = auth.currentUser.email;
          const TrainerQueryResult = await getDocs(query(collection(db, 'Treinador'), where('email', '==', mail)));
          const trainer = TrainerQueryResult.docs[0];
          const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idTreinador', '==', trainer.data().idTreinador)));
          setStudents(AthletsQueryResult.docs);
          console.log("Atletas " + AthletsQueryResult.docs);
          setTrainer(trainer.data());
          setUserType('Treinador');
      }

    } catch (error) {
      console.error("Error checking user type:", error);
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
          <Text style={styles.info}>{athlete.nome}</Text>
          <Text style={styles.info}>Gender: {athlete.genero}</Text>
          <Text style={styles.info}>Age: {athlete.dataNascimento}</Text>
          <Text style={styles.info}>Atleta</Text>
          <Text style={styles.info}>Height: {athlete.altura} cm</Text>
          <Text style={styles.info}>Weight: {athlete.peso} kg</Text>
          <Text style={styles.info}>Email: {athlete.email}</Text>
          {/* Add your profile picture and other details here */}
          {/* ... Other athlete-specific UI components ... */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.info}>LOGOUT</Text>
          </TouchableOpacity>
        </ScrollView>
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }

  if (userType === 'Treinador') {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar navigation={navigation} />
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.info}>{trainer.nome}</Text>
          <Text style={styles.info}>Gender: {getGender(trainer.genero)}</Text>
          <Text style={styles.info}>Age: {trainer.dataNascimento}</Text>
          <Text style={styles.info}>Codigo: {trainer.codigoTreinador}</Text>
          <Text style={styles.info}>Email: {trainer.email}</Text>
          <Text style={styles.info}>Descricao: {trainer.descricao}</Text>
          {/* Add your profile picture and other details here */}
          {/* ... Other athlete-specific UI components ... */}
          {students.map((Atleta) => (
          <TouchableOpacity key={Atleta.idAtleta} style={styles.info}>
          <Text style={styles.info}>{Atleta.nome}</Text>
          </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.info}>LOGOUT</Text>
          </TouchableOpacity>
        </ScrollView>
        <Fundo navigation={navigation} />
      </SafeAreaView>
    );
  }

  // Default return if userType is neither 'Atleta' nor 'Treinador'
  return (
    <SafeAreaView style={styles.container}>
    <Navbar navigation={navigation} />
    <ScrollView style={styles.container}>
    <Text style={styles.loading}>No profile found</Text>
      {/* You can add more athlete-specific UI components here */}
    </ScrollView>
    <TouchableOpacity onPress={logout}>
      <Text>LOGOUT</Text>
    </TouchableOpacity>
    <Fundo navigation={navigation} />
  </SafeAreaView>
  );

  
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
      },
      info:{
        color:'#fff',
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
      },
      profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 20,
      },
      profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#555', // Placeholder for image
      },
      detailsContainer: {
        justifyContent: 'center',
      },
      detailText: {
        color: '#fff',
        fontSize: 16,
      },
      email: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 10,
        alignSelf: 'center',
      },
      sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      description: {
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 20,
        marginBottom: 20,
      },
      studentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 10,
      },
      student: {
        alignItems: 'center',
        marginVertical: 10,
      },
      studentPic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#555', // Placeholder for image
      },
      studentName: {
        color: '#fff',
        fontSize: 14,
        marginTop: 5,
      },
    });


export default Profile;