import React from 'react';
import {SafeAreaView,Text,StyleSheet} from 'react-native';
import Fundo from '../Navigation/fundo';
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{color: '#000',fontSize: 50,  fontWeight: 'bold', marginTop:150, width:'80%'}}>
                PERFIL TREINADOR          
            </Text>
            <Text onPress={logout} style={{color: '#000',fontSize: 50,  fontWeight: 'bold', marginTop:150, width:'80%'}}>
               LOGOUT        
            </Text>
            <Fundo navigation={navigation} />  

        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
      },
      
});


export default Profile;