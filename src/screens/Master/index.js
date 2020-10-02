import React, {Suspense} from 'react';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer';
import {Dimensions} from 'react-native';
import LoaderModule from 'components/LoaderModules';

const delay = 500;
const Dashboard = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Dashboard')), delay);
  });
});

const CapacitacionListado = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Capacitacion/Listado')), delay);
  });
});
const Lead = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Client/Lead')), delay);
  });
});

const Soporte = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Chat/Soporte')), delay);
  });
});

const Profile = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Profile')), delay);
  });
});

import MenuLateral from './MenuLateral';
const Drawer = createDrawerNavigator();
const {width, height} = Dimensions.get('screen');

class Master extends React.Component {
  onPressMenu = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <Suspense fallback={<LoaderModule visible={true} />}>
        <Drawer.Navigator
          drawerContent={(props) => <MenuLateral {...props} />}
          initialRouteName="Dashboard"
          drawerType={width >= 768 ? 'permanent' : 'back'}>
          {Profile && <Drawer.Screen name="Profile" component={Profile} />}
          {Dashboard && (
            <Drawer.Screen name="Dashboard" component={Dashboard} />
          )}
          {CapacitacionListado && (
            <Drawer.Screen
              name="Capacitaciones"
              component={CapacitacionListado}
            />
          )}
          {Lead && <Drawer.Screen name="Clientes" component={Lead} />}
          {Soporte && <Drawer.Screen name="Soporte" component={Soporte} />}
        </Drawer.Navigator>
      </Suspense>
    );
  }
}

export default Master;
