import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { db, app } from '../../Config/firebase'; // Adjust this path to your Firebase config
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

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

    const QueryResult = await getDocs(query(collection(db, config.collectionName), where(config.docField, '==', objeto[config.docField])));

    const docRef = QueryResult.docs[0].ref;
    const oldPhotoURL = QueryResult.docs[0].data()[config.photoField]; 

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
    console.error(error);
    throw error;
  }
};



//const handlerImage = async () =>{
//  const uri = await pickImage();
//  if (uri) {
//     try {
//        const downloadURL = await uploadFile(uri, athlete,userType);
//        Alert.alert('Photo uploaded successfully');
//      } catch (error) {
//        Alert.alert('Upload failed', error.message);
//      }
//   }
//}  

//HANDLER EXEMPLE