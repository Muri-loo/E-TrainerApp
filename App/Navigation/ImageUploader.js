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

  console.log(result);

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};



export const uploadFile = async (uriPhoto, objeto,tipo) => {
  try {

    const { uri } = await FileSystem.getInfoAsync(uriPhoto);
    console.log(uri);

    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage(app);
    const filename = uriPhoto.substring(uriPhoto.lastIndexOf('/') + 1);

    let storageReference;
    let QueryResult;

    if( tipo=="Atleta" || tipo =='Treinador'){
      storageReference = storageRef(storage, `FotosPerfil/${filename}`);
    }else if(tipo=="Exercicio"){
      storageReference = storageRef(storage, `FotosExercicios/${filename}`);
    }else{
      storageReference = storageRef(storage, `FotosPlanoTreino/${filename}`);
    }

    const snapshot = await uploadBytes(storageReference, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    if (objeto && objeto.idAtleta) {
      QueryResult = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', objeto.idAtleta)));
      const objetoA = QueryResult.docs[0].ref;
      await updateDoc(objetoA, { fotoAtleta: downloadURL });
      console.log('Athlete photo updated in Firestore');
    }

    return downloadURL;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

