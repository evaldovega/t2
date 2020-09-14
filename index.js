/**
 * @format
 */
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainNavigation from "./src/nav/MainNav";
console.disableYellowBox = true

AppRegistry.registerComponent(appName, () => MainNavigation);
