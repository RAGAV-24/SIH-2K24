import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MapScreen from '../screens/HomePage';
import CropDetailsPage from '../screens/CropDetailsPage';
import ShapeDetailsPage from '../screens/ShapeDetailsPage';
import PointMarkersPage from '../screens/PointMarkersPage';
import Dashboard from '../screens/Dashboard';
import Heatmapview from '../screens/Heatmapview';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={MapScreen} />
        <Stack.Screen name="CropDetails" component={CropDetailsPage} />
        <Stack.Screen name="ShapeDetails" component={ShapeDetailsPage} />
        <Stack.Screen name="PointMarkersPage" component={PointMarkersPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Heatmapview" component={Heatmapview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
