import React, { useEffect, useState } from 'react';
import { db } from "../../Config/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { SafeAreaView, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

function ChooseGoals({navigation}) {

    //Declare var;
    const [GoalsList, setGoalsList] = useState([]); // State to store the list of goals
    const GoalsCollectionRef = collection(db, "Goals"); // Reference to the Firestore collection

    //Functions
    useEffect(() => {
        const getGoalList = async () => {
            try {
                const data = await getDocs(GoalsCollectionRef);
                setGoalsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // Update the state with the fetched goals
            } catch (err) {
                console.error(err); // Handle any errors
            }
        };

        getGoalList();
    }, []);

    //Function 2
    const toggleGoalSelection = (id) => {
        setGoalsList(GoalsList.map(goal => {
            if (goal.id === id) {
                return { ...goal, selected: !goal.selected }; // Toggle the 'selected' state
            }
            return goal; // Return the goal unchanged if it's not the one being toggled
        }));
    }; 

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>What Are Your Goals?</Text>
            <Text style={styles.subtitle}>
                With this your AI trainer knows exactly {'\n'} how to train you
            </Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {GoalsList.map((Goal) => ( // Map over each goal in the state
                    <TouchableOpacity key={Goal.id} style={[styles.button, Goal.selected ? styles.buttonSelected : null]} onPress={() => toggleGoalSelection(Goal.id)}>
                        <Text style={styles.buttonText}>{Goal.Goal_name}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.button, { marginTop: '20%', borderRadius:30, padding:10 }]}>
                        <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Define the styles for the components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // Black background
    },
    title: {
        fontSize: 30,
        color: 'white',
        marginTop: '25%',
        fontWeight: 'bold', // Add bold font weight for title
        alignSelf: 'center', // Center title
    },
    subtitle: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center', // Center the subtitle text
        marginBottom: 20, // Add some bottom margin to the subtitle
    },
    scrollView: {
        flexGrow: 1, // Ensure the ScrollView takes up the space it needs
        justifyContent: 'center', // Center content vertically in ScrollView
        alignItems: 'center', // Center content horizontally in ScrollView
    },
    button: {
        borderRadius: 10,
        width: '90%', // Set button width
        backgroundColor: "#D72E02", // Red background color for buttons
        padding:20,
        marginTop: 22,
        alignSelf: 'center', // Center button within ScrollView
    },
    buttonSelected: {
        backgroundColor: "gray", // Color when a button is selected
    },
    buttonText: {
        color: 'white', // White text color for the buttons
        fontSize: 20, // Medium font weight for the button text
    },
});

export default ChooseGoals;
    