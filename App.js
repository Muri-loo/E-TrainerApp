// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartPage from './App/Screens/StartPage';
import UserProfileForm from './App/Screens/UserProfileForm';
import LoginPage from './App/Screens/LoginPage';
import CalendarPage from './App/Screens/HomeCalendar';
import Profile from './App/Screens/Profile';
import Fundo from './App/Navigation/fundo';
import ChooseGoals from './App/Screens/ChooseGoals';
import FormRegisterPhysic from './App/Screens/FormRegisterPhysic';
import DisplayTraining from './App/Screens/DisplayTraining';
import TrainingPlanDetails from './App/Screens/TrainingPlanDetails';
import AddNewTrainningPlan from './App/Screens/AddNewTrainningPlan';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>        
      
        <Stack.Screen name="Home" component={StartPage}  options={{ headerShown: false }} />
        <Stack.Screen name="AddNewTrainningPlan" component={AddNewTrainningPlan}  options={{ headerShown: false }} />
        <Stack.Screen name="TrainingPlanDetails" component={TrainingPlanDetails}  options={{ headerShown: false }} />
        <Stack.Screen name="DisplayTraining" component={DisplayTraining}  options={{ headerShown: false }} />
        <Stack.Screen name="ChooseGoals" component={ChooseGoals}  options={{ headerShown: false }} />
        <Stack.Screen name="FormRegisterPhysic" component={FormRegisterPhysic}  options={{ headerShown: false }} />
        <Stack.Screen name="HomeCalendar" component={CalendarPage}  options={{ headerShown: false }} />
        <Stack.Screen name="SingUp" component={UserProfileForm}  options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginPage}  options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile}  options={{ headerShown: false }} />
        <Stack.Screen name="navBottom" component={Fundo}  options={{ headerShown: false }} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;