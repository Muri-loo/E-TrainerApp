import React from 'react';
import {  Text, StyleSheet, ScrollView, TouchableOpacity,Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';

function AddNewTrainningPlan({navigation,route}) {
    return (
        <SafeAreaView>
        <Navbarlight></Navbarlight>
                <Text style={{color:'black',fontSize:15,fontWeight:600}}>ADICIONE TREINO PARA ESTE DIA:{route.params}</Text>
        </SafeAreaView>
    );
}

export default AddNewTrainningPlan;