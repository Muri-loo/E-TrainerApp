import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Alert,TextInput,KeyboardAvoidingView, Platform} from 'react-native';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { db } from '../../Config/firebase';
import { pickImage, uploadFile } from '../Navigation/funcoes';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Shadow } from 'react-native-shadow-2';

function Profile({ navigation }) {
  const [object, setObject] = useState('');
  const [userType, setUserType] = useState('');
  const [students, setStudents] = useState([]);
  const [metas, setMetas] = useState([]);

  const [editable , setEditable] = useState(false);
  
 
  const changeEditable = () =>{
    setEditable(!editable);
    if(editable){
      // implementar logica para guardar as mudanças
      console.log('Guardei Dados');
    }
  }

  const getGoals = async (object) => {
    console.log('faz');
    if (object.idAtleta) {
      console.log('faz1');
  
      const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta_Goals'), where('idAtleta', '==', object.idAtleta)));
      const metas = AthletsQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const metasNomes = [];
  
      for (const doc of metas) {
        const searchId = doc.idGoal;
        const goalsQueryResult = await getDocs(query(collection(db, 'Goals'), where('idGoal', '==', searchId)));
  
        if (!goalsQueryResult.empty) {
          const goalDoc = goalsQueryResult.docs[0]; // Assuming there's only one document in the result
          metasNomes.push(goalDoc.data().goalName);
        }
      }
        setMetas(metasNomes);
    }
  };
  
  

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error on signout', error);
    }
  };

  const handlerImage = async () => {
    const uri = await pickImage();
    if (uri) {
      try {
        await uploadFile(uri, object, userType);
        Alert.alert('Foto', 'Foto carregada com sucesso');
      } catch (error) {
        Alert.alert('Foto', error.message);
      }
    }
  };

  const handleSelectedStudent = (item) => {
    navigation.navigate('CheckUserProgress',item.idAtleta);
    //console.log(item.nome);
  };

  const checkUserType = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const atletaDocRef = doc(db, 'Atleta', userId);
      const atletaDocSnap = await getDoc(atletaDocRef);

      if (atletaDocSnap.exists()) {
        setObject(atletaDocSnap.data());
        getGoals(atletaDocSnap.data());

        setUserType('Atleta');
      } else {
        const mail = auth.currentUser.email;
        const TrainerQueryResult = await getDocs(query(collection(db, 'Treinador'), where('email', '==', mail)));
        const trainerData = TrainerQueryResult.docs[0].data();

        setObject(trainerData);
        setUserType('Treinador');

        const AthletsQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idTreinador', '==', trainerData.idTreinador)));
        const studentData = AthletsQueryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(studentData);
      }
    } catch (error) {
      console.error('Error checking user type:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkUserType();
    });
    return unsubscribe;
  }, [navigation]);
  

  const getGender = (value) => (value === '0' ? 'Male' : 'Female');

  return (
    <SafeAreaView  style={styles.containerWrap}>
    <SafeAreaProvider>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 }}>
    {/* INICIO do container principal */}
    <Navbarlight navigation={navigation} />
        {userType === 'Atleta' && (
          <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal:60, marginLeft:55}}>
            <View style={{ flex: 1, alignItems: 'center'}}>
              <TouchableOpacity onPress={handlerImage} style={{ marginVertical:15}}>
                <Image
                  source={{ uri: object?.fotoAtleta || 'https://drive.google.com/uc?export=view&id=1VrqvZTseVMNmNciV1CvBEY5nIbFnSD1s' }}
                  style={{ width: 120, height: 120, borderRadius: 10, borderWidth: 2, borderColor: '#FFF', backgroundColor: '#FFF'}}
                />
              </TouchableOpacity>
            </View>
            <Shadow distance={10} startColor={'#D72E02F2'} endColor={'#FFFFFF'} >
              <TouchableOpacity style={{ backgroundColor: '#D72E02F2', padding: 10, borderRadius: 40, }} onPress={changeEditable}>
                <Icon name={editable ? "save" : "edit"}   size={20}   color="#FFFFFF" />
              </TouchableOpacity>
            </Shadow>
          </View>
            <View style={styles.containerData}>
            
            <TextInput style={styles.input} value={object.nome} editable={editable} 
              onChangeText={(newValue) => setObject(prevObject => ({ ...prevObject, nome: newValue }))}
            />

            <TextInput style={styles.input} value={object.email} editable={editable} />
            <TextInput style={styles.input} value={object.telemovel} editable={editable}     
             onChangeText={(newValue) => setObject(prevObject => ({ ...prevObject, telemovel: prevObject }))}
            />
            <Text style={{fontWeight:600,marginTop:10}}>Nível Fisico: </Text>
            <TextInput style={[styles.input,{marginTop:3}]} value={object.nivelFisico} editable={editable}  />
            <Text style={{fontWeight:600,marginTop:13}}>Metas: </Text>
            <TextInput 
              style={[styles.input, { marginTop: 3, marginBottom: 10 }]} 
              value={metas.join(', ')}
              editable={false}
            />




            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', margin: 4 }}>
                <Text style={{ fontWeight: 600,marginLeft:4 }}>Altura:</Text>
                <TextInput 
                  style={[styles.input, { paddingHorizontal: 20, textAlign: 'center', width: 100 }]} 
                  value={editable ? object.altura.toString() : object.altura.toString() + " cm"} 
                  editable={editable} 
                />
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', margin: 4 }}>
              <Text style={{ fontWeight: 600,marginLeft:4 }}>Peso:</Text>
              <TextInput 
                  style={[styles.input, { paddingHorizontal: 20, textAlign: 'center', width: 100 }]} 
                  value={editable ? object.peso.toString() : object.peso.toString() + " Kg"} 
                  editable={editable} 
                />
              </View>
            </View>

            </View>

          </>
        )}

        {userType === 'Treinador' && (
          <>
          <Text style={styles.title}>{object?.nome}</Text>
            
            
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
  <TouchableOpacity onPress={handlerImage}>
    <Image source={{ uri: object?.fotoTreinador || 'https://drive.google.com/uc?export=view&id=1VrqvZTseVMNmNciV1CvBEY5nIbFnSD1s' }} style={styles.profilePic} />
  </TouchableOpacity>
  <View style={styles.detailsContainer}>
    <Text style={styles.detailText}>
      <Text style={styles.labelText}>Genéro:</Text> {getGender(object?.genero)}
    </Text>
    <Text style={styles.detailText}>
      <Text style={styles.labelText}>Data de nascimento:</Text> {object?.dataNascimento}
    </Text>
    <Text style={styles.detailText}>
      <Text style={styles.labelText}>Codigo:</Text> {object?.codigoTreinador}
    </Text>
    <Text style={styles.detailText}>
      <Text style={styles.labelText}>Email:</Text> {object?.email}
    </Text>
    <Text style={styles.detailText}>
      <Text style={styles.labelText}>Descricao:</Text> {object?.descricao}
    </Text>
  </View>
</View>
            <Text style={{fontWeight: 'bold',marginTop:10, alignSelf: 'center', fontSize: 20 }}>Lista de atletas: </Text>
                <View style={styles.line}></View> 
          <View style={styles.gridContainer}>

            <FlatList
                data={students}
                renderItem={({ item }) => (
                <TouchableOpacity style={styles.studentItem} onPress={() => handleSelectedStudent(item)}>

                    <Image  source={{ uri: item?.fotoAtleta ? item.fotoAtleta : 'https://drive.google.com/uc?export=view&id=1WqNVu_0jLh9sQI511gCINW4aAlHRJP-i' }}
                    style={styles.fotoAtleta} />
                    <Text style={styles.studentName}>{item?.nome}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
                style={styles.studentGrid}
            />

          </View>
          </> 
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      
    {/* Fim do container principal */}
    </ScrollView>
    <Fundo navigation={navigation} />

    </KeyboardAvoidingView>
    </SafeAreaProvider>
    </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  input:{
    backgroundColor:'#3F3F3C',
    color:'white',
    padding:5,
    paddingLeft:15,
    marginTop:15,
    borderRadius:5,
  },
  containerData: {
    width:'90%',
    alignSelf: 'center',

  },
  container: {
    flex: 1,

  },
  line: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  editButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  profilePic: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    marginTop:20,
    marginLeft: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  
  },
  editButton:{
    backgroundColor: '#D72E02F2',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginTop:15,
    width:'80%',
  },
  detailText: {
    // Your existing styles for the outer <Text> components
    color: '#000',
    fontSize: 15,
  },
  labelText: {
    // Styles specific to the label (first <Text>)
    fontWeight: 'bold', // Add any other styles you want for the label
  },
  estatistica: {
    alignSelf: 'center',
  },
  gridContainer: {
    flexDirection: 'row', // Layout children in a row
    flexWrap: 'wrap', // Allow items to wrap to next row
    justifyContent: 'space-between', // Space items evenly
    padding: 10, // Add padding around the container
  },
  studentGrid: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  studentItem: {
    backgroundColor: '#808080',
    alignItems: 'center',
    margin: 5,
    width: '30%', // Adjust the width as needed, accounting for padding/margin
    aspectRatio: 1, // Keep the items square
    borderRadius: 20,
  },
  fotoAtleta: {
    margin: 5,
    width: '50%',
    height: '70%',
    backgroundColor: '#FFF',
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC2C02',
    textAlign: 'center',
  },
  info: {
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: '#3F3F3C',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'center',
  },
  logoutButton: {
    backgroundColor: '#D72E02F2',
    padding: 10,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  
});

export default Profile;
