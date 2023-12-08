import React, { useEffect, useState } from 'react';
import {SafeAreaView,Text,StyleSheet, Touchable, TouchableOpacity} from 'react-native';
import Fundo from '../Navigation/fundo';
import Navbar from '../Navigation/navbar';
import { db } from "../../Config/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";



function Profile({navigation}) {
    const logout = () => {
        const auth = getAuth();
        try{
        signOut(auth);
        navigation.navigate("Home");
        }catch(error){
        console.log("Error on singout");
        }
      };

      const [trainer, setTrainer] = useState(null);
      const [students, setStudents] = useState([]);
    
      useEffect(() => {
        //Buscar treinador respetivo
        const fetchTrainer = async () => {
          const trainerDoc = await db.collection('Treinador').doc('codigoTreinador').get();
          setTrainer(trainerDoc.data());
        };
    
        //Buscar estudantes do treinador
        //Atleta n tem id de treinador
        const fetchStudents = async () => {
          const studentsSnapshot = await db.collection('Atleta').where('trainerId', '==', 'yourTrainerId').get();
          const studentsList = studentsSnapshot.docs.map(doc => doc.data());
          setStudents(studentsList);
        }; 
    
        fetchTrainer();
        fetchStudents();
      }, []);
    
      // Check if trainer data is still loading
      if (!trainer) {
        return (
          <>
            <Navbar navigation={navigation} />
            <Text onPress={logout} style={{color: '#000',fontSize: 50,  fontWeight: 'bold', marginTop:150, width:'80%'}}>
               LOGOUT        
            </Text>
            <Text style={styles.loading}>Loading...</Text>
            <Fundo navigation={navigation} />
          </>
        );
      }
    
      return (
        <SafeAreaView style={styles.container}>
        
            <Navbar navigation={navigation} />
            <ScrollView style={styles.container}>


            {/* ... */}
            {/* Trainer and students information rendering goes here */}
            {/* ... */}
            </ScrollView>
            <TouchableOpacity onPress={logout}>LOGOUT</TouchableOpacity>
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