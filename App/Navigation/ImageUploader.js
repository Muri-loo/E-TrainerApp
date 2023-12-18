import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
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



export const uploadFile = async (uriPhoto, athlete) => {
  try {
    const { uri } = await FileSystem.getInfoAsync(uriPhoto);
    console.log(uri);

    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage(app);
    const filename = uriPhoto.substring(uriPhoto.lastIndexOf('/') + 1);
    const storageReference = storageRef(storage, `FotosExercicios/${filename}`);

    const snapshot = await uploadBytes(storageReference, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    if (athlete && athlete.idAtleta) {
      const AthletQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', athlete.idAtleta)));
      const atleta = AthletQueryResult.docs[0].ref;
      await updateDoc(atleta, { fotoAtleta: downloadURL });
      console.log('Athlete photo updated in Firestore');
    }

    return downloadURL;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

 //const handleImagePick = async () => {
    //const uri = await pickImage();
    //if (uri) {
      //try {
       // const downloadURL = await uploadFile(uri, athlete);
        // Do something with the download URL
       // Alert.alert('Photo uploaded successfully');
      //} catch (error) {
        //Alert.alert('Upload failed', error.message);
      //}
    //}
  //};


  //if (athlete && athlete.idAtleta) {
    //const AthletQueryResult = await getDocs(query(collection(db, 'Atleta'), where('idAtleta', '==', athlete.idAtleta)));
    //const atleta = AthletQueryResult.docs[0].ref;
    //await updateDoc(atleta, {
     // fotoAtleta: downloadURL
    //});
    //console.log('Athlete photo updated in Firestore');
  //}