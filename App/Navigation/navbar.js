import React from 'react';
import {StyleSheet,SafeAreaView,Text,View, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Navbar() {
  
    const navigation = useNavigation(); 

  // Function to handle press events
  const handlePress = (routeName) => {
    console.log(`Navigating to ${routeName}`);
    navigation.navigate(routeName); // Use the navigate function from the navigation object
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#000',
      }}>

        
        
        <TouchableOpacity onPress={() => handlePress('Add')}>
          <Image 
          
                style={styles.bars }
                source={require('../assets/3bars.png')}
                
                />  
       </TouchableOpacity>

        <Image
                style={styles.logo}
                source={require('../assets/E-TrainerWhiteLogo.png')}
            />   

        <TouchableOpacity onPress={() => handlePress('Add')}>
          <Image style = {styles.tinyLogo} source={{uri: 'https://drive.google.com/uc?export=view&id=1jqWEAhebOd_aUFbBuzl7KUS4cjpkadRB',}}/>  
        </TouchableOpacity>

      </View>
    </View> 
  );
};

const scaleFactor = 0.2;
const styles = {
  tinyLogo:{ 
    width: 400 * scaleFactor,
    height: 300 * scaleFactor,
  },

  logo:{
    width: 600 * scaleFactor,
    height: 500 * scaleFactor,
  },

  bars:{
    justifyContent: 'flex-center',
    width: 300 * scaleFactor/2,
    height: 300 * scaleFactor/2,
  },


}

export default Navbar;
