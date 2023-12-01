// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartPage from './App/Screens/StartPage';
import UserProfileForm from './App/Screens/UserProfileForm';
import LoginPage from './App/Screens/LoginPage';
import HomePage from './App/Screens/HomePage';



const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomePage" component={HomePage}  options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={StartPage}  options={{ headerShown: false }} />
        <Stack.Screen name="SingUp" component={UserProfileForm}  options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginPage}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//guga

export default App;