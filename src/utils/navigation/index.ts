import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

const ROUTERS = {
    Onboarding: 'Onboarding',
    SignIn: 'SignIn',
    ForgotPassword: 'ForgotPassword',
    Profile: 'Profile',
    Notification: 'Notification',
    Dashboard: 'Dashboard',
};

export {Stack, NavigationContainer, Navigator, Screen, ROUTERS};

export const navigationRef = React.createRef();

export function navigate(name: string, params?: any) {
    // @ts-ignore
    navigationRef?.current?.navigate(name, params);
}
