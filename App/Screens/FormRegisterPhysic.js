import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const FormRegisterPhysic = () => {
    const heights = [];
    for (let i = 140; i <= 210; i++) {
      heights.push({
        label: `${i} cm`,
        value: `${i}`,
      });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Height:</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
                {heights.map((height, index) => (
                    <Text key={index} style={styles.numberText}>{height.value}</Text>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns content to the start
        alignItems: 'center',
    },
    headerText: {
        color: '#000',
        fontSize: 20,
        marginTop: '20%', // Reduces space below the header text
        marginLeft:0,


    },
    scrollViewContainer: {
    },
    numberText: {
        fontSize: 20,
        marginHorizontal: 10, // Adds space between the items
    },
});

export default FormRegisterPhysic;
