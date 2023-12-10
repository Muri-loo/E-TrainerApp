import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Navbar() {
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
          source={{uri: 'https://drive.google.com/uc?export=view&id=1wnM712eVagAiWOEZ-XqD0ub-J8l164aa'}} // Replace with your menu icon asset
        />  
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('HomeCalendar')}>
      <Image
        style={styles.logo}
        source={require('../assets/E-TrainerWhiteLogo.png')} // Replace with your logo asset
      />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('Profile')} style={styles.lastIcon}>
        <Image 
          style={styles.icon}
          source={{uri: 'https://drive.google.com/uc?export=view&id=180C9fXZ_YFycuUgDFaHNF4rQgHoQ-iXM'}} // Replace with your menu icon asset
        />
      </TouchableOpacity>
    </View> 
  );
};
const scaleFactor=0.5;
const styles = StyleSheet.create({
  navbarContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding : 5,
    alignItems: 'center',
    backgroundColor: '#000', // Match the color to the screenshot
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

export default Navbar;
