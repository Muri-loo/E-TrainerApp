import React, {  useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import IconFA from 'react-native-vector-icons/FontAwesome5';

function Exercises({ navigation }) {



const [exercises, setExercises] = useState([]);
const getExercises = async () => {
    const ExercisesQueryResult = await getDocs(query(collection(db, 'Exercicio')));
    const exerciseData = ExercisesQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setExercises(exerciseData);
}
useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getExercises();
    });
    return unsubscribe;
  }, [navigation]);
  
  return (
    <SafeAreaView style={styles.container}>
    <Navbarlight navigation={navigation} />
    <View style={{ flex: 1 }}>
    <Text style={{ marginHorizontal: 10, marginTop: 10, marginBottom: 10, fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>Exercicios</Text>
    <View style={styles.line}></View> 
      <View style={styles.gridContainer}>

            <FlatList
                data={exercises}
                renderItem={({ item }) => (
                    <View style={styles.exerciseDisplay}>
                    <View style={styles.exerciseImage}>
                    {item.fotoExercicio && (
                      <Image style={{flex: 1, resizeMode: 'cover'}} source={{uri: item.fotoExercicio}} />
                    )}                          
                    </View>
      
                      <View>
                        <Text style={styles.nomeExercicio}>{item.nomeExercicio}</Text> 
                        <Text style={styles.nomeExercicio}><IconFA name={"clock"} size={15} color="white" /> {item.tempo} sec</Text>  
                      </View>
      
                    </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.studentGrid}
            />

          </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateExercise')}>
        <Text style={styles.buttonText}>Criar exercicio</Text>
      </TouchableOpacity>
      
    </View>
    <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
    container: {
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
    },
    addButton: {
        backgroundColor: '#D72E02',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width:'90%',
        alignSelf:'center',
        marginBottom: 10,
    },
    
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        alignSelf:'center',
        borderRadius: 30,
    },
      gridContainer: {
        flex: 1,

      },
      exerciseImage:{
        backgroundColor:'#c2c2c2',
        width:'35%',
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30,
      },
      line: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
      },
      exerciseDisplay:{
        flexDirection:'row',
        borderRadius:30,
        backgroundColor:'#323230',
        width:'90%',
        alignSelf:'center',
        marginBottom:'5%',
        height:100,
      },
      nomeExercicio:{
        fontSize:20,
        fontWeight:'bold',
        color:'white',
        marginTop:'10%',
        marginLeft:'10%',
    
      },
});

export default Exercises;