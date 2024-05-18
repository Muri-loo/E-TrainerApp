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
    const querySnapshotGoals = await getDocs(query(collection(db, 'Atleta_Goals'), where('idAtleta', '==', idUtilizador)));

    if (querySnapshotGoals.empty) {
      return null;
    }

    // Use a Set to avoid duplicate IDs
    const uniquePlanoTreinoIds = new Set();

    await Promise.all(
      querySnapshotGoals.docs.map(async (doc) => {
          const recomendedPlanningTrainsSnapshot = await getDocs(
          query(collection(db, 'PlanoTreino'), where('objetivos', 'array-contains', doc.data().idGoal))
        );
        
        // Extract document data from the query snapshot
        recomendedPlanningTrainsSnapshot.docs.forEach((trainDoc) => {
          uniquePlanoTreinoIds.add(trainDoc.data().idPlanoTreino);
        });
      })
    );

    // Convert the Set to an array if you need to return an array
    const uniquePlanoTreinoIdsArray = Array.from(uniquePlanoTreinoIds);

    // Log the unique IDs to check the data
    return uniquePlanoTreinoIdsArray;

  } catch (error) {
    console.error('Error fetching finished trains:', error);
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