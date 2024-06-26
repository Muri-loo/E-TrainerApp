import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Image, Modal, View, SafeAreaView } from 'react-native';
import { auth } from '../../Config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { StackActions } from '@react-navigation/native';
import { db } from '../../Config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { Shadow } from 'react-native-shadow-2';

function LoginPage({ navigation }) {
    const [showModal, setShowModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.dispatch(StackActions.replace('HomeCalendar'));
            }
        });
        return unsubscribe;
    }, [navigation]);

    const handleLogIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.dispatch(StackActions.replace('HomeCalendar'));
        } catch (error) {
            setErrorMessage('Login falhou. Por favor verifique as suas credenciais.');
            // Additional error handling based on error.code
        }
    };

    const handleCloseModal = () => {
        setForgotPasswordEmail('');
        setShowModal(false);
    };

    const handleForgotPassword = () => {
        setShowModal(true);
    };

    const handleSendResetEmail = async () => {
        try {
            const AthletQueryResult = await getDocs(query(collection(db, 'Atleta'), where('email', '==', forgotPasswordEmail.trim())));
            if (AthletQueryResult.size > 0) {
                await sendPasswordResetEmail(auth, forgotPasswordEmail);
                alert('Password reset email sent. Please check your email.');
                handleCloseModal();
            } else {
                alert('Email not found in our records. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: 'https://drive.google.com/uc?export=view&id=1KN_MSCsm1L8sp81rfyJv5eFKqhyy-0Wm' }} />
        </TouchableOpacity>

            <Text style={{ color: '#fff', fontSize: 50, fontWeight: 'bold', width: '80%', alignSelf: 'center' }}>
                Faça Login na{"\n"}sua conta:
            </Text>

            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                placeholderTextColor="#fff"
                placeholder="Email"
                value={email}
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                placeholderTextColor="#fff"
                placeholder="Senha"
                value={password}
                secureTextEntry
            />

            <Text style={{ color: '#FF0000', alignSelf:'center'}}>
                {errorMessage}
            </Text>
            
            <View style={styles.button}>
            <Shadow  distance={10} startColor={'#eb9066d8'} endColor={'#ff00ff10'} >
            <TouchableOpacity style={{backgroundColor: "#D72E02",width:200,borderRadius: 20,padding:10,width:270}}  onPress={handleLogIn}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            </Shadow>

            </View>

            <Text style={{ color: '#CC2C02', alignSelf: 'center' }} onPress={handleForgotPassword}>
                Não sabe a senha?
            </Text>

            <Image
                style={styles.tinyLogo}
                source={require('../assets/E-TrainerWhiteLogo.png')}
            />

            <Text style={{ color: 'white', alignSelf: 'center' }}>Não tem uma conta?<Text style={{ color: '#CC2C02' }} onPress={() => navigation.navigate('SingUp')}>Registe-se</Text></Text>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ color: '#FFF', fontWeight: '600', margin: 4, alignSelf: 'center' }}>Introduza o seu email para recuperar senha:</Text>
                        <TextInput
                            style={[styles.input, { margin: 4, alignSelf: 'center' }]}
                            onChangeText={setForgotPasswordEmail}
                            placeholderTextColor="#FFF"
                            placeholder="Email"
                            value={forgotPasswordEmail}
                        />
                        <TouchableOpacity style={[styles.button2, { margin: 10, alignSelf: 'center' }]} onPress={handleSendResetEmail}>
                            <Text style={styles.buttonText}>Enviar email de recuperação</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button2, { margin: 10, alignSelf: 'center' }]} onPress={handleCloseModal}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "flex-start",
    justifyContent: "flex-start", // Changed from 'center' to 'flex-start'
    paddingTop: 10, // Reduced padding from 20 to 10
},
backButton: { // New style for the back button
    marginLeft: 20,
    marginTop: 30, // Adjust this value as needed
    width: 50,
    height: 50,
    marginBottom:60,
},
    tinyLogo: {
        width: 500 * 0.6,
        height: 250 * 0.6,
        marginTop: 0,
        alignSelf: 'center',
    },
    button2:{
        borderRadius: 20,
        width: '80%',
        backgroundColor: "#D72E02",
        padding: 10,
        margin: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },
    button: {
        margin: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttonText: {
        alignSelf:'center',
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
        alignSelf: 'center',
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
