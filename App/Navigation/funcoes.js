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

const GOALS = {
  VELOCIDADE: "EgQX6VFYJWlb763UDyaT",
  FORCA: "j4nQseXhp70QPnS4ceY0",
  RESISTENCIA: "l9F1z4DMWc1F60WQX92k",
};
const AGEGROUPS = {
  Teen: { lowerBound: 13, upperBound: 19 },
  Adult: { lowerBound: 20, upperBound: 59 },
  Senior: { lowerBound: 60, upperBound: Infinity } // Assuming senior age starts from 60 and onwards
};

// Function to calculate age group based on date of birth
const calculateAgeGroup = (dateOfBirthString) => {
  // Split date of birth string into day, month, and year
  const dataNascimentoParts = dateOfBirthString.split('/');
  const day = parseInt(dataNascimentoParts[0]);
  const month = parseInt(dataNascimentoParts[1]) - 1; // Months are zero-based in JavaScript Date object
  const year = parseInt(dataNascimentoParts[2]);

  // Create Date object from date of birth
  const dataNascimento = new Date(year, month, day);
  
  // Get current date
  const today = new Date();
  
  // Calculate age
  let age = today.getFullYear() - dataNascimento.getFullYear();
  const monthDiff = today.getMonth() - dataNascimento.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dataNascimento.getDate())) {
    age--;
  }

  // Determine the age group
  let ageGroup = null;
  for (const groupName in AGEGROUPS) {
    if (AGEGROUPS.hasOwnProperty(groupName)) {
      const group = AGEGROUPS[groupName];
      if (age >= group.lowerBound && age <= group.upperBound) {
        ageGroup = groupName;
        break;
      }
    }
  }

  // Return calculated age and age group
  return { age, ageGroup };
};

// Function to fetch user stats and calculate recommended training plans
const getUserStats = async (idUtilizador) => {
  try {
    // Fetch user data from Firestore
    const atletaDoc = await getDoc(document(collection(db, 'Atleta'), idUtilizador));
    
    // If user document doesn't exist, throw an error
    if (!atletaDoc.exists()) {
      throw new Error("User does not exist");
    }

    // Extract user data from document
    const atleta = atletaDoc.data();
    const nivelFisico = atleta.nivelFisico;

    // Extract date of birth, calculate age, and determine age group
    const { age, ageGroup } = calculateAgeGroup(atleta.dataNascimento);

    // Fetch finished training data for the user
    const [finishedTrainsQuery, finishedTrainsQueryAllUsers] = await Promise.all([
      getDocs(query(collection(db, 'FinishedTrain'), where("idUtilizador", "==", idUtilizador))),
      getDocs(query(collection(db, 'FinishedTrain'), where("DificultyLevel", "==", nivelFisico),
                where("idade", ">", AGEGROUPS[ageGroup].lowerBound),
                where("idade", "<", AGEGROUPS[ageGroup].upperBound)
              ))
    ]);

    // Calculate total strength and speed for the user and all users
    const totalStrengthUser = finishedTrainsQuery.docs.reduce((acc, doc) => acc + Number(doc.data().AverageStrengthPerPunchNewton), 0);
    const totalSpeedUser = finishedTrainsQuery.docs.reduce((acc, doc) => acc + Number(doc.data().AverageSpeedPerPunch), 0);
    const totalStrengthAll = finishedTrainsQueryAllUsers.docs.reduce((acc, doc) => acc + Number(doc.data().AverageStrengthPerPunchNewton), 0);
    const totalSpeedAll = finishedTrainsQueryAllUsers.docs.reduce((acc, doc) => acc + Number(doc.data().AverageSpeedPerPunch), 0);

    // Calculate average strength and speed for the user and all users
    const avgStrengthTargetUser = totalStrengthUser / Math.max(finishedTrainsQuery.docs.length, 1);
    const avgSpeedTargetUser = totalSpeedUser / Math.max(finishedTrainsQuery.docs.length, 1);
    const avgStrengthTargetAll = totalStrengthAll / Math.max(finishedTrainsQueryAllUsers.docs.length, 1);
    const avgSpeedTargetAll = totalSpeedAll / Math.max(finishedTrainsQueryAllUsers.docs.length, 1);

    // Return user stats
    return {
      nivelFisico,
      avgStrengthTargetUser,
      avgSpeedTargetUser,
      avgStrengthTargetAll,
      avgSpeedTargetAll
    };

  } catch (error) {
    // Handle errors
    console.error('Error fetching user stats:', error);
    throw error;
  }
};





// Function to recommend training plans based on user's stats and goals
export const algoritmoRecomendacao = async (idUtilizador) => {
  try {
    // Fetch user stats
    const {
      nivelFisico,
      avgStrengthTargetUser,
      avgSpeedTargetUser,
      avgStrengthTargetAll,
      avgSpeedTargetAll
    } = await getUserStats(idUtilizador);

    // Log user stats
    console.log(`Average Strength for User: ${avgStrengthTargetUser}`);
    console.log(`Average Speed for User: ${avgSpeedTargetUser}`);
    console.log(`Average Strength for All: ${avgStrengthTargetAll}`);
    console.log(`Average Speed for All: ${avgSpeedTargetAll}`);

    // Fetch user's goals from Firestore
    const goalsSnapshot = await getDocs(query(
      collection(db, 'Atleta_Goals'), 
      where('idAtleta', '==', idUtilizador)
    ));

    // If user has no goals, return an empty array
    if (goalsSnapshot.empty) {
      return [];
    }

    // Extract goal IDs from the snapshot
    const goalIds = goalsSnapshot.docs.map(doc => doc.data().idGoal);

    // Adjust goal IDs based on user's stats compared to overall averages
    if (avgSpeedTargetUser < avgSpeedTargetAll) {
      goalIds.push(GOALS.VELOCIDADE);
    }
    if (avgStrengthTargetUser < avgStrengthTargetAll) {
      goalIds.push(GOALS.FORCA);
    }

    // Initialize set to store unique training plan IDs
    const uniquePlanoTreinoIds = new Set();

    // Fetch training plans from Firestore based on user's goals and difficulty level
    const trainingPlansSnapshot = await getDocs(query(
      collection(db, 'PlanoTreino'), 
      where('objetivos', 'array-contains-any', goalIds),
      where('DificultyLevel', '==', nivelFisico)
    ));

    // Store unique training plan IDs in the set
    trainingPlansSnapshot.docs.forEach(doc => {
      uniquePlanoTreinoIds.add(doc.data().idPlanoTreino);
    });

    // Return array of unique training plan IDs
    return Array.from(uniquePlanoTreinoIds);

  } catch (error) {
    // Handle errors
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