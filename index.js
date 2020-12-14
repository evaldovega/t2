/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainNavigation from './src/nav/MainNav';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => MainNavigation);
