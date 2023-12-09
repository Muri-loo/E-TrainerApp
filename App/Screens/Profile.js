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

  const checkUserType = async () => {
    try {
      // Attempt to fetch from the Atleta collectio
      let userRef = query(collection(db, 'Atleta'), where('idAtleta', '==', userId));
      let userSnapshot = studentsQuery.docs[0].data();

      if (userSnapshot.exists()) {
        setAthlete(userSnapshot);
        setUserType('Atleta');
      } else {
        // If not found in Atleta, attempt to fetch from the Treinador collection
        userRef = doc(db, 'Treinador', userId);
        userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setUserType('Treinador');
          const studentsQuery = query(collection(db, 'Atleta'), where('idTreinador', '==', userId));
          const studentsSnapshot = await getDocs(studentsQuery);
          setStudents(studentsSnapshot.docs.map(doc => doc.data()));
        } else {
          console.log("No user found with the given ID in either Atleta or Treinador collections.");
        }
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

  const getAge = (dobString) => {
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };


  if (userType === 'Atleta') {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar navigation={navigation} />
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.name}>{athlete.nome}</Text>
          <Text>Gender: {athlete.genero}</Text>
          <Text>Age: {getAge(athlete.dataNascimento)}</Text>
          <Text>Atleta</Text>
          <Text>Height: {athlete.altura} cm</Text>
          <Text>Weight: {athlete.peso} kg</Text>
          <Text>Email: {athlete.email}</Text>
          {/* Add your profile picture and other details here */}
          {/* ... Other athlete-specific UI components ... */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
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
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Treinador</Text>
          {/* Render the list of students here */}
          <TouchableOpacity onPress={logout}>
            <Text>LOGOUT</Text>
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