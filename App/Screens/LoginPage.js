import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {auth} from '../../Config/firebase'; 
import {signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, fetchSignInMethodsForEmail} from 'firebase/auth';
import { StackActions } from '@react-navigation/native';
import { db } from '../../Config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';



import {StyleSheet,SafeAreaView,Text,TextInput,Image,TouchableOpacity, Modal,View} from 'react-native';

 

function LoginPage({navigation}) {
  const [showModal, setShowModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleCloseModal = () => {
    setForgotPasswordEmail('');
    setShowModal(false);
  };
  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleSendResetEmail = async () => {
    console.log('A enviar email de recuperação para:', forgotPasswordEmail);
    admin.auth().getUserByEmail(forgotPasswordEmail);
    try {
        await sendPasswordResetEmail(auth, forgotPasswordEmail);
        alert('Foi enviado um email para repor a palavra-passe. Por favor, verifique o seu email.');
        handleCloseModal();
      
    } catch (error) {
      console.error('Erro ao verificar o email:', error);
      alert('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    } finally {
      setForgotPasswordEmail('');
    }
  };
  
  
  
  
    
    //IF LOGGED GO STRAIGTH TO HOMEPAGE
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
          if (user){
            // Reset navigation stack
            navigation.dispatch(
              StackActions.replace('HomeCalendar')
            );
          }
        });
        return unsubscribe;
      }, []);
      

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Errormessage, setErrorMessage] = useState('');

    const handleLogIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.dispatch(
                StackActions.replace('HomeCalendar')
              );
        } catch (error) {
            const errorCode = error.code;
            let errorMessage = '';
            console.log(errorCode)
            switch (errorCode) {
                case 'auth/invalid-email':
                    errorMessage = 'Please insert a valid email address';
                    break;
                case 'auth/missing-password':
                    errorMessage = 'Please Insert your password   ';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Problem with server. Try again Later';
                    break;
                default:
                    errorMessage = 'Email or password incorrect';
                    break;
            }
    
            setErrorMessage(errorMessage);
        }
    };

      useEffect(() => {
        setErrorMessage('');
      }, [email, password]);

  


    return (

        <SafeAreaView style={styles.container}>
            <Text style={{color: '#fff',fontSize: 50,  fontWeight: 'bold', marginTop:150, width:'80%'}}>
            Login to your{"\n"}account:            
            </Text>

            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                placeholderTextColor ="#fff" // Set the placeholder text color
                placeholder="Email"
                value={email}
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                placeholderTextColor ="#fff" // Set the placeholder text color
                placeholder="Password"
                value={password}
                secureTextEntry
            />

            <Text style={{color: '#FF0000'}}>
                {Errormessage}       
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleLogIn}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={{color: '#CC2C02'}} onPress={handleForgotPassword}>
                Forgot the password?
            </Text>

            <Image
                style={styles.tinyLogo}
                source={require('../assets/E-TrainerWhiteLogo.png')}
            />   

<Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{color:'#FFF',fontWeight:'600',margin:4,alignSelf:'center'}}>Enter your email to reset password:</Text>

            <TextInput
              style={[styles.input,{margin:4,alignSelf:'center'}]}
              onChangeText={setForgotPasswordEmail}
              placeholderTextColor="#FFF"
              placeholder="Email"
              value={forgotPasswordEmail}
            />

            <TouchableOpacity style={[styles.button,{margin:10,alignSelf:'center'}]} onPress={handleSendResetEmail}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button,{margin:10,alignSelf:'center'}]} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

            
        </SafeAreaView>
    );
}


const scaleFactor=0.4;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    tinyLogo: {
        width: 500 * scaleFactor,
        height: 250 * scaleFactor,
        marginTop: 0,
        alignSelf: 'center',
    },

    button: {
        borderRadius: 20,
        width: '80%',
        backgroundColor: "#D72E02",
        padding: 10,
        margin: 20,
        alignItems: 'center',
    },

    buttonText: {
        color: "#fff",
    },

    input: {
        borderRadius: 10,
        height: 50,
        width: '80%',
        margin: 12,
        backgroundColor: "#3F3F3C",
        color: "#fff",
        paddingLeft: 10, 
        

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
      },
      modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        backgroundColor: '#000',
      },
});


export default LoginPage;