import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from 'screens/SiginIn';
import SignUp from 'screens/SignUp';
import ForgotPass from 'screens/ForgotPass';

const Stack = createStackNavigator();

function Login() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={SignIn} name="SignIn" />
        <Stack.Screen component={SignUp} name="SignUp" />
        <Stack.Screen component={ForgotPass} name="ForgotPassword" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Login;
