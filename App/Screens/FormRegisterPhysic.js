import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
// Add this import to your file
import { InteractionManager } from 'react-native';


const FormRegisterPhysic = ({navigation}) => {
    const [selectedHeight, setSelectedHeight] = useState(null);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);


    // Generate heights array
    const heights = [];
    for (let i = 140; i <= 210; i++) {
        heights.push(i);
    }

    // Generate weights array
    const weights = [];
    for (let i = 35; i <= 210; i++) {
        weights.push(i);
    }

     // Generate weights array
    const genders = [];
    genders.push('male');
    genders.push('female');

    
    return (
        
        <View style={styles.container}>
            <Text style={styles.header}>Tell Us About Yourself</Text>
            <Text style={styles.subHeader}>
                To give you an experience adapted to you we need to know your gender
            </Text>

            <Text style={styles.label}>Gender:</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
            {genders.map((gender, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedGender(gender)}>
                    <Text style={selectedGender === gender ? [styles.selectedText,styles.numberText] : [styles.numberText]}>
                            {gender}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            <Text style={styles.label}>Height(Cm):</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
                {heights.map((height, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedHeight(height)}>
                    <Text style={selectedHeight === height ? [styles.selectedText,styles.numberText] : [styles.numberText]}>
                            {height}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.label}>Weight(Kg):</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
                {weights.map((weight, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedWeight(weight)}>
                        <Text style={selectedWeight === weight ? [styles.selectedText,styles.numberText] : [styles.numberText]}>
                            {weight}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Add Physical Activity Level Picker Here */}

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Goals')}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 10,
        
    },
    header: {
        marginTop:'25%',
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    scrollViewContainer: {
        flexGrow: 0,
        flexDirection: 'row',
        marginBottom: 0,
    },
    numberText: {
        color: '#fff',
        fontSize: 20,
        marginHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        textAlign: 'center',
        minWidth: 40,
    },
    selectedText: {
        color: '#000',
        backgroundColor: 'red',
    },
    button: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 20, // Adjust this to reduce the gap
        marginBottom: 20, // Adjust the bottom margin as necessary
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',

    },
    // Add styles for gender icons, picker, and other elements as necessary
});

export default FormRegisterPhysic;
