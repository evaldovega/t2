import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Validate from './Validate';
import FQA from './FQA';

const Stack = createStackNavigator();

const ValidateSession = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={Validate} name="Validate" />
        <Stack.Screen component={FQA} name="FQA" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ValidateSession;
