import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconFA from 'react-native-vector-icons/FontAwesome5';



function Navbarlight() {
  const navigation = useNavigation();
  const route = useRoute();


  const handlePress = (routeName) => {
    console.log(`Navigating to ${routeName}`);
    navigation.navigate(routeName);
  };

  return (
    <Shadow style={{width:'100%'}}  distance={1}  offset={[0,3]}>
      <View style={styles.navbarContainer}>
      {route.name === 'HomeCalendar' ? (
          <TouchableOpacity onPress={() => handlePress('HomeCalendar')} style={styles.iconContainer}>
            <Image
              style={styles.icon}
              source={{ uri: 'https://drive.google.com/uc?export=view&id=1BiX48q5QbgZnsbks84y2O2fzYXhizoOx' }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image style={{ width: 35, height: 35 }} source={{ uri: 'https://drive.google.com/uc?export=view&id=1k-ugPi9nM7_52L4XpVa8NNS1SJ8uQSJc' }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handlePress('HomeCalendar')}>
          <Image
            style={styles.logo}
            source={require('../assets/etrainerlogolight.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('CustomerService')} style={styles.iconContainer}>
        <IconAD name={"questioncircleo"} size={25} color="black" />
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
