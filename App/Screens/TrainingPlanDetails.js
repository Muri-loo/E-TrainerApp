import React from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

function TrainingPlanDetails(props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.flexColumn}>
                <View style={styles.flexColumnInner}>
                    <View style={styles.flexRow}>
                        <Image
                            source={{ uri: "https://file.rendit.io/n/dWCU5j1NUPvZuPZUw3aH.png" }}
                            style={styles.downloadImage}
                        />
                        {/* ... other UI elements ... */}
                    </View>
                    {/* ... additional nested components ... */}
                </View>

                <View style={styles.workoutActivity}>
                    <Text style={styles.workoutActivityText}>Workout Activity</Text>
                    {/* ... additional components ... */}
                </View>

                {/* ... more components as needed ... */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    flexColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    flexColumnInner: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        // ... additional styles ...
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        // ... additional styles ...
    },
    downloadImage: {
        width: 360,
        height: 139,
        position: 'absolute',
        top: 5,
        left: 0,
    },
    workoutActivity: {
        marginLeft: 6,
        // ... additional styles ...
    },
    workoutActivityText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        // ... additional styles ...
    },
    // ... more styles ...
});

export default TrainingPlanDetails;
