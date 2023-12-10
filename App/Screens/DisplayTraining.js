import React, { useEffect, useState } from 'react';
import { db } from "../../Config/firebase";
import { collection, getDocs, addDoc,updateDoc, doc} from 'firebase/firestore';
import { SafeAreaView, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Fundo from '../Navigation/fundo';
import Navbarlight from '../Navigation/navbarlight';


function DisplayTraining({navigation,route}) {
    return (
        <SafeAreaView>
            <Navbarlight navigation={navigation} />
            <Text style={{color:'#000',fontSize:50,marginTop:400}}>TREINOS DO VAGABUNDO no dia {route.params}</Text>
            <Fundo navigation={navigation} />
        </SafeAreaView>
    );
}

export default DisplayTraining;