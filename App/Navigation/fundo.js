import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Modal, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc, query, doc, where } from 'firebase/firestore';

function Fundo() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [misterCode, setMisterCode] = useState('');
  const [warning, setWarning] = useState('');

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
        const misterUID = MisterQueryResult.docs[0].id;

        if (MisterQueryResult.size > 0) {
          const athlet = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', uid)));
          const athletDoc = athlet.docs[0].ref;
          await updateDoc(athletDoc, {
            idTreinador: misterUID,
          });
        } else {
          console.log('Mister added successfully');
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
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity onPress={() => handlePress('HomeCalendar')}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://drive.google.com/uc?export=view&id=1-uX01VLE9efglYXBE62UBAdCTiTsuISG',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('Agenda')}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://drive.google.com/uc?export=view&id=1ozjo5CS6lYjdJNWjPHZJGkmJiXniX2SR',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddPress}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://drive.google.com/uc?export=view&id=1jqWEAhebOd_aUFbBuzl7KUS4cjpkadRB',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('Profile')}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://drive.google.com/uc?export=view&id=1MHAve7PLVPCBqj-6VVl2WQsFUFf_ut6x',
            }}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
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
        </View>
      </Modal>
    </View>
  );
}

const scaleFactor = 0.1;
const styles = StyleSheet.create({
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
