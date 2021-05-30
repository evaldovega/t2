import React, {useEffect} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import {fetchConfig} from 'utils/Fetch';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import messaging from '@react-native-firebase/messaging';

import Home from 'screens/Navigation/Home';

import Profile from 'screens/Navigation/Profile';

import MetaListado from 'screens/Navigation/Meta/Listado';
import MetaGuardar from 'screens/Navigation/Meta/Guardar';

import CapacitacionListado from 'screens/Navigation/Capacitacion/Listado';
import CapacitacionDetalle from 'screens/Navigation/Capacitacion/Detalle';
import Actividad from 'screens/Navigation/Capacitacion/Actividad';

import ClienteListado from 'screens/Navigation/Client/List';
import ClientSave from 'screens/Navigation/Client/Save';
import ClientProfile from 'screens/Navigation/Client/Profile';
import ContactToClient from 'screens/Navigation/Client/Import';

import PlanesListado from 'screens/Navigation/Planes/Listado';
import PlanDetalle from 'screens/Navigation/Planes/Detalle';

import NegocioDiligenciarInformacion from 'screens/Navigation/ProcesoDeVenta/Diligenciar';
import VariacionFormulario from 'screens/Navigation/ProcesoDeVenta/VariacionFormulario';

import Negocios from 'screens/Navigation/Negocio/Listado';
import NegocioDetalle from 'screens/Navigation/Negocio/Detalle';

import TaskSave from 'screens/Navigation/Task/Save';

import Soporte from 'screens/Navigation/Chat/Soporte';
import NotificacionListado from 'screens/Navigation/Notificacion/Listado';
import {COLORS} from 'constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const optionNavigator = {
  headerShown: false,
  gesturesEnabled: false,
};

const tabs = {
  Inicio: {
    color: COLORS.GRAY,
  },
  Profile: {
    color: COLORS.GRAY,
  },
  Metas: {
    color: COLORS.GRAY,
  },
  Negocios: {
    color: COLORS.GRAY,
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{style: {paddingTop: 16}}}
      screenOptions={({route}) => ({
        tabBarIcon: (focused, color, size) => {
          switch (route.name) {
            case 'Inicio':
              return <Feather size={24} name="home" color={focused.color} />;
              break;
            case 'Perfil':
              return <Feather size={24} name="user" color={focused.color} />;
              break;
            case 'Metas':
              return <Feather size={24} name="flag" color={focused.color} />;
              break;
            case 'Negocios':
              return <Feather size={24} name="folder" color={focused.color} />;
              break;
          }
        },
      })}
      tabBarOptions={{
        title: 'e',
        activeTintColor: COLORS.PRIMARY_COLOR,
      }}>
      <Tab.Screen name="Inicio" options={{title: 'Servi'}} component={Home} />
      <Tab.Screen name="Perfil" component={Profile} />
      <Tab.Screen name="Metas" component={MetaListado} />
      <Tab.Screen name="Negocios" component={Negocios} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    const tokenCurrent = await AsyncStorage.getItem('token-push');
    if (tokenCurrent != token) {
      console.log('Send push token');
      const {url, headers} = await fetchConfig();
      fetch(`${url}usuarios/editar/`, {
        method: 'PUT',
        body: JSON.stringify({fcm_token: token}),
        headers,
      }).then((r) => {
        if (r.status == 200 || r.status == 201) {
          console.log('Token push send ok');
          AsyncStorage.setItem('token-push', token);
        }
      });
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      registerAppWithFCM();
    }
  };

  useEffect(() => {
    requestUserPermission();

    messaging().onMessage(async (remoteMessage) => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      //navigation.navigate(remoteMessage.data.type);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" options={optionNavigator} component={Tabs} />
        <Stack.Screen
          name="Capacitaciones"
          options={optionNavigator}
          component={CapacitacionListado}
        />
        <Stack.Screen
          name="CapacitacionDetalle"
          options={optionNavigator}
          component={CapacitacionDetalle}
        />
        <Stack.Screen
          name="Actividad"
          options={optionNavigator}
          component={Actividad}
        />
        <Stack.Screen
          name="MetaGuardar"
          options={optionNavigator}
          component={MetaGuardar}
        />

        <Stack.Screen
          name="Clientes"
          options={optionNavigator}
          component={ClienteListado}
        />
        <Stack.Screen
          name="ClientProfile"
          options={optionNavigator}
          component={ClientProfile}
        />

        <Stack.Screen
          name="ContactToClient"
          options={optionNavigator}
          component={ContactToClient}
        />
        <Stack.Screen
          name="TaskSave"
          options={optionNavigator}
          component={TaskSave}
        />
        <Stack.Screen
          name="ClientSave"
          options={optionNavigator}
          component={ClientSave}
        />

        <Stack.Screen
          name="Planes"
          options={optionNavigator}
          component={PlanesListado}
        />
        <Stack.Screen
          name="PlanDetalle"
          options={optionNavigator}
          component={PlanDetalle}
        />

        <Stack.Screen
          name="NegocioDiligenciarInformacion"
          options={optionNavigator}
          component={NegocioDiligenciarInformacion}
        />
        <Stack.Screen
          name="VariacionFormulario"
          options={optionNavigator}
          component={VariacionFormulario}
        />

        <Stack.Screen
          name="NegocioDetalle"
          options={optionNavigator}
          component={NegocioDetalle}
        />

        <Stack.Screen
          name="Soporte"
          options={optionNavigator}
          component={Soporte}
        />
        <Stack.Screen
          name="NotificacionListado"
          options={optionNavigator}
          component={NotificacionListado}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
