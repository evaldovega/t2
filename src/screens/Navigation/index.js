import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

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
import ClienteSelector from 'screens/Navigation/Client/Selector';

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
  gesturesEnabled: true,
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
      screenOptions={({route}) => ({
        tabBarIcon: (focused, color, size) => {
          switch (route.name) {
            case 'Inicio':
              return (
                <SimpleLineIcons size={24} name="home" color={focused.color} />
              );
              break;
            case 'Perfil':
              return (
                <SimpleLineIcons size={24} name="user" color={focused.color} />
              );
              break;
            case 'Metas':
              return (
                <SimpleLineIcons size={24} name="flag" color={focused.color} />
              );
              break;
            case 'Negocios':
              return (
                <SimpleLineIcons
                  size={24}
                  name="folder"
                  color={focused.color}
                />
              );
              break;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: COLORS.PRIMARY_COLOR_DARK_1,
      }}>
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Perfil" component={Profile} />
      <Tab.Screen name="Metas" component={MetaListado} />
      <Tab.Screen name="Negocios" component={Negocios} />
    </Tab.Navigator>
  );
}

function Navigation() {
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
          name="ClienteSelector"
          options={optionNavigator}
          component={ClienteSelector}
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
