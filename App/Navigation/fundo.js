import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';


const Fundo  = () => {
  // Function to handle press events
  const handlePress = (routeName) => {
    console.log(`Navigating to ${routeName}`);
    // Here you would add your navigation logic, possibly using React Navigation or another routing library
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
      }}>
        <TouchableOpacity onPress={() => handlePress('Home')}>
          <Image style = {styles.tinyLogo} source={{uri: 'https://drive.google.com/uc?export=view&id=1-uX01VLE9efglYXBE62UBAdCTiTsuISG',}}/>  
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('Agenda')}>
          <Image style = {styles.tinyLogo} source={{uri: 'https://drive.google.com/uc?export=view&id=1ozjo5CS6lYjdJNWjPHZJGkmJiXniX2SR',}}/>  
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('Add')}>
          <Image style = {styles.tinyLogo} source={{uri: 'https://drive.google.com/uc?export=view&id=1jqWEAhebOd_aUFbBuzl7KUS4cjpkadRB',}}/>  
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('Profile')}>
          <Image style = {styles.tinyLogo} source={{uri: 'https://drive.google.com/uc?export=view&id=1MHAve7PLVPCBqj-6VVl2WQsFUFf_ut6x',}}/>  
        </TouchableOpacity>
      </View>
    </View> 
  );
};
const scaleFactor = 0.1;
const styles = {
  tinyLogo:{ 
    width: 300 * scaleFactor,
    height: 300 * scaleFactor,
  },
}

export default Fundo;
