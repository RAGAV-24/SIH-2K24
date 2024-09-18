import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MapScreen from '../screens/HomePage';
import CropDetailsPage from '../screens/CropDetailsPage';
import ShapeDetailsPage from '../screens/ShapeDetailsPage';
import PointMarkersPage from '../screens/PointMarkersPage';
import Dashboard from '../screens/Dashboard';
import HeatMap from '../screens/HeatMap';
import WaterMonitoring from '../screens/WaterMonitoring';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{
          drawerStyle: {
            backgroundColor: '#000', // Set background color to black
          },
          drawerLabelStyle: {
            color: '#fff', // Set drawer label color to white for contrast
          },
        }}>
        {/* Directly add all the screens into the Drawer */}
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Signup" component={SignupScreen} />
        <Drawer.Screen name="Home" component={MapScreen} />
        <Drawer.Screen name="CropDetails" component={CropDetailsPage} />
        <Drawer.Screen name="ShapeDetails" component={ShapeDetailsPage} />
        <Drawer.Screen name="PointMarkersPage" component={PointMarkersPage} />
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="HeatMap" component={HeatMap} />
        <Drawer.Screen name="WaterMonitoring" component={WaterMonitoring} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
