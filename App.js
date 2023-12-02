// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartPage from './App/Screens/StartPage';
import UserProfileForm from './App/Screens/UserProfileForm';
import LoginPage from './App/Screens/LoginPage';
import CalendarPage from './App/Screens/HomeCalendar';



const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={StartPage}  options={{ headerShown: false }} />
        <Stack.Screen name="HomeCalendar" component={CalendarPage}  options={{ headerShown: false }} />
        <Stack.Screen name="SingUp" component={UserProfileForm}  options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginPage}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//guga
//bernado vai a merda
export default App;