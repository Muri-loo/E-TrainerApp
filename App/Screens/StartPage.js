import React from 'react';
import {StyleSheet,SafeAreaView,Text,Image,TouchableOpacity,} from 'react-native';
import { Shadow } from 'react-native-shadow-2';


function StartPage({navigation} ) {
    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../assets/E-TrainerWhiteLogo.png')}
            />   

            <Shadow distance={10} startColor={'#eb9066d8'} endColor={'#ff00ff10'} >
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('LoginPage')}
                accessibilityLabel="Learn more about this purple button"
                >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            </Shadow>

            <Text style={{color:'#fff',margin:25}}>ou</Text>

            <Shadow distance={10} startColor={'#eb9066d8'} endColor={'#ff00ff10'}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SingUp')}
                > 
                <Text style={styles.buttonText}>Registo</Text>
            </TouchableOpacity>
                
            </Shadow>
           
        </SafeAreaView>
    );
}
const scaleFactor = 0.6; // Scale down by 50%

const styles = StyleSheet.create({
    container: {
        paddingTop:0,
        flex : 1 ,
        backgroundColor : "#000" ,
        alignItems : "center",
        justifyContent: "flex-start", // Align items to the start
    },
    tinyLogo:{
      width: 500*scaleFactor,
      height:500*scaleFactor,
      marginTop:50,
      marginBottom:80,
      alignSelf: 'center', // Center the logo horizontally

    },
    button: {
        borderRadius: 20,
        width: 200,
        backgroundColor: "#D72E02",
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontWeight:'600',
    }

});

export default StartPage;