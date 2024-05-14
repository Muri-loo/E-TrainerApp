import React, { useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Modal, Text, TextInput, Alert} from 'react-native';
import { useRoute } from '@react-navigation/native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc, query, doc, where, getDoc, QuerySnapshot} from 'firebase/firestore';
import { Shadow } from 'react-native-shadow-2';
import { SafeAreaView } from 'react-native-safe-area-context'
;

function Fundo() {
  const route = useRoute();

  const [mister,setMister] = useState(false);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [misterCode, setMisterCode] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const verifyType = async () => {
      if (auth.currentUser) {
        const querysnapshot = await getDocs(query(collection(db, 'Treinador'), where('idTreinador', '==', auth.currentUser.uid)));
        if (!querysnapshot.empty) 
          setMister(true);
        else
          setMister(false);
        console.log("run");
      }
    }
    verifyType();
  }, []); 

  // Function to handle press events
  const handlePress = (routeName) => {
    console.log(`Navigating to ${routeName}`);
    navigation.navigate(routeName);
  };

  const addMister = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const uid = user.uid;
            const MisterQueryResult = await getDocs(query(collection(db, 'Treinador'), where('codigoTreinador', '==', misterCode)));
            
            if (MisterQueryResult.size > 0) {
                const misterUID = MisterQueryResult.docs[0].id;

                const athletDocRef = doc(db, 'Atleta', uid);
                const athletDocSnap = await getDoc(athletDocRef); 

                if (athletDocSnap.exists()) {
                    await updateDoc(athletDocSnap.ref, {
                        idTreinador: misterUID,
                    });
                    Alert.alert('Treinador', 'Treinador adicionado com sucesso.');
                  } else {
                    console.log("document not found");
                }
            } else {
              Alert.alert('Treinador', 'Nenhum treinador com esse codigo foi encontrado');
            }
        }
    } catch (error) {
        console.error('Error adding mister:', error.message);
    }

    setShowModal(false);
  };

  const handleAddPress = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const athlet = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', user.uid)));

      const coachID = athlet.docs[0].data().idTreinador;

      if (coachID)
        setWarning('Já tens um treinador, ao repetir o processo será ser efetuada uma troca!');
      else
        setWarning('');
    } catch (error) {
      console.log(error);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <View style={{ justifyContent: 'flex-end' }}>
    
      <Shadow
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
          backgroundColor: '#fff',
        }}
      >
        <View
          style={{
            flex:1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            backgroundColor: '#fff',
          }}
        >
      {/* Middle button for "180" */}
{/* {!mister && route.name === 'HomeCalendar' && (
  <View style={styles.middleButton}>
    <Shadow distance={10} startColor={'#eb9066d8'} endColor={'#ff00ff10'}>
      <TouchableOpacity 
        style={{backgroundColor: '#CC2C02', height: 40, width: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center'}}  
        onPress={() => handlePress('LiveTraining')}>
        <IconFA  name={"plus"} size={25} color="white" />
      </TouchableOpacity>
    </Shadow>
  </View>
)} */}



       

          <TouchableOpacity onPress={() => handlePress('HomeCalendar')}>
            <IconFA name={"home"} size={25} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePress('CreateTrainingPlan')}>
            <IconMC name={mister ? "strategy" : "sine-wave"} size={25} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={mister ? () => handlePress('Exercises') : handleAddPress}>
            {mister ? (
              <IconFA name={"dumbbell"} size={25} color="black" />
            ) : (
              <IconMI name={"self-improvement"} size={25} color="black" />
            )}
          </TouchableOpacity>

       

          <TouchableOpacity onPress={() => handlePress('Profile')}>
            <IconFA name={"user"} size={25} color="black" />
          </TouchableOpacity>
        
        </View>
        
      </Shadow>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: '#FFFFFF' }]}>
            <Text style={styles.warningText}>{warning}</Text>
            <Text style={styles.modalText}>Insere o código de treinador:</Text>
            <TextInput
              onChangeText={(value) => setMisterCode(value)}
              style={styles.input}
              placeholder="Codigo Treinador..."
              placeholderTextColor="black"
            />
            <TouchableOpacity style={styles.button} onPress={addMister}>
              <Text style={styles.buttonText}>Adicionar Treinador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const scaleFactor = 0.1;
const styles = StyleSheet.create({

  
  middleButton: {
    position: 'absolute',
    bottom: 30, // space from bottombar
    left: '55.5%', // center horizontally
    transform: [{ translateX: -25 }], // adjust for button width
 
  },
  tinyLogo: {
    width: 300 * scaleFactor,
    height: 300 * scaleFactor,
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
  },
  warningText: {
    color: 'red',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    color: 'black',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    color: 'black',
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#ccc',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
  },
});

export default Fundo;
