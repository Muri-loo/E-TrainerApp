import React, { useEffect, useState } from 'react';
import { db } from "../../Config/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { SafeAreaView, Text, StyleSheet} from 'react-native';

function ChooseGoals(props) {
    const [GoalsList, setGoalsList] = useState([]);
    const GoalsCollectionRef = collection(db, "Goals");

    useEffect(() => {
        const getGoalList = async () => {
            try {
                const data = await getDocs(GoalsCollectionRef);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id // Assuming each document has a unique ID
                }));
                setGoalsList(filteredData);
            } catch (err) {
                console.error(err);
            }
        }; 

        getGoalList();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
          {GoalsList.map((Goal) => (                        //FOREACH
            <Text key={Goal.id} style={styles.textStyle}> 
              {Goal.Goal_name}
            </Text>
          ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: 'black',
        textAlign: 'center',
        // Add other styles if needed
    },
});

export default ChooseGoals;
