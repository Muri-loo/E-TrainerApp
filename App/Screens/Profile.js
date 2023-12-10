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
      console.log(userId);
      const AthletQueryResult = await getDocs(
        query(collection(db, 'Atleta'), where('idAtleta', '==', userId))
      );
      const atleta = AthletQueryResult.docs[0];

      if (AthletQueryResult.size > 0) {
        setAthlete(atleta.data());
        setUserType('Atleta');
      } else {
        // If not found in Atleta, attempt to fetch from the Treinador collection
        // userRef = doc(db, 'Treinador', userId);
        // userSnapshot = await getDoc(userRef);

        // if (userSnapshot.exists()) {
        //   setUserType('Treinador');
        //   const studentsQuery = query(collection(db, 'Atleta'), where('idTreinador', '==', userId));
        //   const studentsSnapshot = await getDocs(studentsQuery);
        //   setStudents(studentsSnapshot.docs.map(doc => doc.data()));
        // } else {
        //   console.log("No user found with the given ID in either Atleta or Treinador collections.");
        // }
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

  const getAge = (dobString) => {
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const renderAtletaProfile = () => (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.header}>{athlete.nome}</Text>
      <Text style={styles.info}>Gender: {athlete.genero}</Text>
      <Text style={styles.info}>Age: {athlete.dataNascimento}</Text>
      <Text style={styles.subHeader}>Atleta</Text>
      <Text style={styles.info}>Height: {athlete.altura} cm</Text>
      <Text style={styles.info}>Weight: {athlete.peso} kg</Text>
      <Text style={styles.info}>Email: {athlete.email}</Text>
      {/* Add your profile picture and other details here */}
      {/* ... Other athlete-specific UI components ... */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTreinadorProfile = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Treinador</Text>
      {/* Render the list of students here */}
      <TouchableOpacity onPress={logout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderDefaultProfile = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.loading}>No profile found</Text>
      {/* You can add more athlete-specific UI components here */}
      <TouchableOpacity onPress={logout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbar navigation={navigation} />
      {userType === 'Atleta' && renderAtletaProfile()}
      {userType === 'Treinador' && renderTreinadorProfile()}
      {(!userType || (userType !== 'Atleta' && userType !== 'Treinador')) &&
        renderDefaultProfile()}
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
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
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
