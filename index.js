import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {useScreens} from 'react-native-screens';
//import MainNavigation from './src/nav/MainNav';
import App from './App';
import moment from 'moment';
import 'moment/locale/es';
console.disableYellowBox = true;

import {Provider} from 'react-redux';
import configureStore from 'redux/configuracion';
const store = configureStore();
moment.locale('es');

const Init = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

useScreens();
AppRegistry.registerComponent(appName, () => Init);
