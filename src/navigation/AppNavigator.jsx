// src/navigation/AppNavigator.jsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen      from '../screens/LoginScreen';
import HomeScreen       from '../screens/HomeScreen';
//import CreateTaskScreen from '../screens/CreateTaskScreen';
//import TaskDetailScreen from '../screens/TaskDetailScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: true,
        animation: 'slide_from_right',  // Transición natural en Android e iOS
      }}
    >

      {/* Login — sin header */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Home — sin botón de retroceso */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'KronoTask',
          headerLeft: () => null,   // Evita volver al Login con el botón atrás
          gestureEnabled: false,    // Desactiva swipe back al Login
        }}
      />
  
      
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;