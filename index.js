/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainNavigation from './src/nav/MainNav';
import {SOCKET_ADDRESS} from './src/constants';
console.disableYellowBox = true;
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
global.socket = SocketIOClient(SOCKET_ADDRESS);
AppRegistry.registerComponent(appName, () => MainNavigation);
