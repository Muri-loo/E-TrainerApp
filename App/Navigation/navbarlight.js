import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Navbarlight() {
  const navigation = useNavigation(); 

  const handlePress = (routeName) => {
    console.log(`Navigating to ${routeName}`);
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity onPress={() => handlePress('Menu') } style={styles.firstIcon}>
        <Image 
          style={styles.icon}
          source={require('../assets/3barslight.png')} // Replace with your menu icon asset
        />  
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('HomeCalendar')}>
      <Image
        style={styles.logo}
        source={require('../assets/etrainerlogolight.png')} // Replace with your logo asset
      />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('Profile')} style={styles.lastIcon}>
        <Image 
          style={styles.icon}
          source={require('../assets/helplight.png')} // Replace with your profile icon asset
        />
      </TouchableOpacity>
    </View> 
  );
};
const scaleFactor=0.5;
const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding : 5,
    alignItems: 'center',
    backgroundColor: 'fff', // Match the color to the screenshot
  },
  icon: {
    width: 30, // Adjust the size as needed
    height: 35, // Adjust the size as needed
  },
  logo: {
    width: 150, // Adjust the size as needed
    height: 70, // Adjust the size as needed
  }, 
  firstIcon: {
    marginLeft: 20, // Adjust the value as needed to create space
  },
  lastIcon: {
    marginRight: 20, // Adjust the value as needed to create space
  }
});

export default Navbarlight;
