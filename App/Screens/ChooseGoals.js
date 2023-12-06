import React, { useEffect, useState } from 'react';
import { db } from "../../Config/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { SafeAreaView, Text, StyleSheet, ScrollView} from 'react-native';

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
        <ScrollView style={styles.scrollView}>
          {GoalsList.map((Goal) => (                        //FOREACH
            <Text key={Goal.id} style={styles.textStyle}> 
              {Goal.Goal_name}
            </Text>
          ))}
          </ScrollView>
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
        marginTop: '50%',
        color: 'black',
        textAlign: 'center',
        fontSize: 50    ,
        // Add other styles if needed
    },
    scrollView: {
        marginHorizontal: 20,
      },
});

export default ChooseGoals;
