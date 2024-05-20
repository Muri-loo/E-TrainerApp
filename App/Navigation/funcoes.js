import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { db, app } from '../../Config/firebase'; // Adjust this path to your Firebase config
import { collection, query, where, getDocs, updateDoc, getDoc,doc as document } from 'firebase/firestore';

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

const AGEGROUPS = {
  Teen: { lowerBound: 13, upperBound: 19 },
  Adult: { lowerBound: 20, upperBound: 59 },
  Senior: { lowerBound: 60, upperBound: Infinity } // Assuming senior age starts from 60 and onwards
};


const typeConfig = {
  Atleta: {
    collectionName: 'Atleta',
    docField: 'idAtleta',
    photoField: 'fotoAtleta',
    storagePath: 'FotosPerfil/',
  },
  Treinador: {
    collectionName: 'Treinador',
    docField: 'idTreinador',
    photoField: 'fotoTreinador',
    storagePath: 'FotosPerfil/',
  },
  Exercicio: {
    collectionName: 'Exercicio',
    docField: 'idExercicio',
    photoField: 'fotoExercicio',
    storagePath: 'FotosExercicios/',
  },
  PlanoTreino:{
    collectionName: 'PlanoTreino',
    docField: 'idPlanoTreino',
    photoField: 'fotoPlanoTreino',
    storagePath: 'FotosPlanoTreino/',
  },
};


export const uploadFile = async (uriPhoto, objeto, tipo) => {
  try {
    const { uri } = await FileSystem.getInfoAsync(uriPhoto);

    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage(app);
    const filename = uriPhoto.substring(uriPhoto.lastIndexOf('/') + 1);
    const config = typeConfig[tipo];
    const storageReference = storageRef(storage, `${config.storagePath}${filename}`);

    const QueryResult = await getDoc(document(db, config.collectionName, objeto[config.docField]));
    console.log(QueryResult.data());
    const oldPhotoURL = QueryResult.data()[config.photoField]; 
    
    const docRef = QueryResult.ref;

  
    if (oldPhotoURL) {
      const oldPhotoRef = storageRef(storage, oldPhotoURL);
      await deleteObject(oldPhotoRef).catch((error) => {
        console.error("Failed to delete the old photo: ", error);
      });
    }

    const snapshot = await uploadBytes(storageReference, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    if (docRef) {
      await updateDoc(docRef, { [config.photoField]: downloadURL });
      console.log(`${tipo} photo updated in Firestore`);
    }

    return downloadURL;
  } catch (error) {
    console.error("upload",error);
    throw error;
  }
};


export const algoritmoRecomendacao = async (idUtilizador) => {
  try {
    const Atleta = await getDoc(document(collection(db, 'Atleta'), idUtilizador));
    const nivelFisico = Atleta.data().nivelFisico;
    if (!Atleta.exists()) {
      return []; 
    }
    // const finishedTrainsQuery = query(
    //   collection(db, 'FinishedTrain'),
    //   where("idUtilizador", "==", idUtilizador),
    //   where("DificultyLevel", "==", nivelFisico)
    // );

    // Fetch user's goals
    const goalsSnapshot = await getDocs(query(collection(db, 'Atleta_Goals'), where('idAtleta', '==', idUtilizador)));

    if (goalsSnapshot.empty) {
      return []; // No goals found for the user
    }

    // Extract goal IDs
    const goalIds = goalsSnapshot.docs.map(doc => doc.data().idGoal);

    // Use a Set to avoid duplicate training plan IDs
    const uniquePlanoTreinoIds = new Set();

    // Fetch training plans that match any of the user's goals
    const trainingPlansSnapshot = await getDocs(query(
                                    collection(db, 'PlanoTreino'), 
                                    where('objetivos', 'array-contains-any', goalIds),      
                                    where('DificultyLevel', '==', nivelFisico)
                                  ));

    trainingPlansSnapshot.docs.forEach(doc => {
      uniquePlanoTreinoIds.add(doc.data().idPlanoTreino);
    });

    // Convert the Set to an array
    const uniquePlanoTreinoIdsArray = Array.from(uniquePlanoTreinoIds);

    return uniquePlanoTreinoIdsArray;

  } catch (error) {
    console.error('Error fetching recommended training plans:', error);
    throw error;
  }
};




export const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// const handlerImage = async () => {
//   const uri = await pickImage();
//   if (uri) {
//     try {
//       await uploadFile(uri, object, userType);
//       Alert.alert('Foto', 'Foto carregada com sucesso');
//     } catch (error) {
//       Alert.alert('Foto', error.message);
//     }
//   }
// };

//HANDLER EXEMPLE