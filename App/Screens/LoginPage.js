import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {auth} from '../../Config/firebase'; 
import {signInWithEmailAndPassword} from 'firebase/auth';


import {
    StyleSheet,
    Button,
    View,
    SafeAreaView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
  } from 'react-native';

 

function LoginPage({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Errormessage, setErrorMessage] = useState('');

    const handleLogIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setErrorMessage('login Sucessful');
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

            <Text style={{color: '#CC2C02'}}>
                Forgot the password?
            </Text>

            <Image
                style={styles.tinyLogo}
                source={require('../assets/E-TrainerWhiteLogo.png')}
            />   
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
});


export default LoginPage;