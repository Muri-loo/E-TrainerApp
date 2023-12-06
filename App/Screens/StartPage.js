import React from 'react';
import {StyleSheet,SafeAreaView,Text,Image,TouchableOpacity,} from 'react-native';

function StartPage({navigation} ) {
    console.log("Foda-se ne");
    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../assets/E-TrainerWhiteLogo.png')}
            />   
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('LoginPage')}
                accessibilityLabel="Learn more about this purple button"
                >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
                <Text style={styles.buttonText}>Or</Text>
                
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SingUp')}
                accessibilityLabel="Learn more about this purple button"
                > 
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            

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
      marginTop:15,
      alignSelf: 'center', // Center the logo horizontally

    },
    button: {
        borderRadius: 20,
        width: 200,
        backgroundColor: "#D72E02",
        padding: 10,
        margin:20,
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
    }

});

export default StartPage;