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
import CustomerService from './App/Screens/CustomerService';
import EditProfile from './App/Screens/EditProfile';
import Navbarlight from './App/Navigation/navbarlight';
import CreateTrainingPlan from './App/Screens/CreateTrainingPlan';
import CreateExercise from './App/Screens/CreateExercicise';
import CheckUserProgress from './App/Screens/CheckUserProgress';
import LiveTraining from './App/Screens/LiveTraining';
import Exercises from './App/Screens/Exercises';
import TrainingPlans from './App/Screens/TrainingPlans';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>        
      
        <Stack.Screen name="Home" component={StartPage}  options={{ headerShown: false }} />
        <Stack.Screen name="LiveTraining" component={LiveTraining}  options={{ headerShown: false }} />

        <Stack.Screen name="CreateTrainingPlan" component={CreateTrainingPlan}  options={{ headerShown: false }} />
        <Stack.Screen name="CreateExercise" component={CreateExercise}  options={{ headerShown: false }} />
        <Stack.Screen name="CheckUserProgress" component={CheckUserProgress}  options={{ headerShown: false }} />
        
        <Stack.Screen name="navi" component={Navbarlight}  options={{ headerShown: false }} />

        <Stack.Screen name="CustomerService" component={CustomerService}  options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile}  options={{ headerShown: false }} />
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
        <Stack.Screen name="Exercises" component={Exercises}  options={{ headerShown: false }} />
        <Stack.Screen name="TrainingPlans" component={TrainingPlans}  options={{ headerShown: false }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;