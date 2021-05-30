/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ValidateSession from 'screens/ValidateSession';
import Login from 'screens/Login';
import Navigation from 'screens/Navigation';
import ModalConexion from 'components/ModalConexion';
import NetInfo from '@react-native-community/netinfo';

function App({estadoDeSesion}) {
  const [conexion, setConexion] = useState(true);

  useEffect(() => {
    console.log('App user session state ', estadoDeSesion);
  }, [estadoDeSesion]);

  const unsubscribe = NetInfo.addEventListener((state) => {
    if (conexion != state.isConnected) {
      setConexion(state.isConnected);
    }
  });

  return (
    <>
      {!conexion && <ModalConexion />}
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
