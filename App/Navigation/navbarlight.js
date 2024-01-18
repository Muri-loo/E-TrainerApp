import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

function Navbarlight() {
  const navigation = useNavigation();

  const handlePress = (routeName) => {
    console.log(`Navigating to ${routeName}`);
    navigation.navigate(routeName);
  };

  return (
    <Shadow style={{width:'100%'}}  distance={1}  offset={[0,3]}>
      <View style={styles.navbarContainer}>
        <TouchableOpacity onPress={() => handlePress('Menu')} style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={{ uri: 'https://drive.google.com/uc?export=view&id=1BiX48q5QbgZnsbks84y2O2fzYXhizoOx' }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('HomeCalendar')}>
          <Image
            style={styles.logo}
            source={require('../assets/etrainerlogolight.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('Profile')} style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={{ uri: 'https://drive.google.com/uc?export=view&id=1x7avbZIKjVoTMm5KgKgftXDq_ggPBfsf' }}
          />
        </TouchableOpacity>
      </View>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff', // Set your background color here
    borderBottomLeftRadius: 20, // Border radius for the bottom-left corner
    borderBottomRightRadius: 20, // Border radius for the bottom-right corner
  },
  iconContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  icon: {
    width: 30,
    height: 35,
  },
  logo: {
    width: 150,
    height: 70,
  },
});

export default Navbarlight;
