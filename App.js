/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import ValidateSession from 'screens/ValidateSession';
import Login from 'screens/Login';
import Navigation from 'screens/Navigation';

function App({estadoDeSesion}) {
  useEffect(() => {
    console.log('App user session state ', estadoDeSesion);
  });
  return (
    <>
      {estadoDeSesion == 0 ? <ValidateSession /> : null}
      {estadoDeSesion == 1 ? <Login /> : null}
      {estadoDeSesion == 2 ? <Navigation /> : null}
    </>
  );
}

const mapToState = (state) => {
  return {
    estadoDeSesion: state.Usuario.estadoDeSesion,
  };
};
export default connect(mapToState)(App);
