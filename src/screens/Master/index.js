import React, {Suspense} from 'react';
import messaging from '@react-native-firebase/messaging';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Dimensions, Alert, Modal, View} from 'react-native';
import {initUsuario} from 'redux/actions/Usuario';
import {connect} from 'react-redux';
import LoaderModule from 'components/LoaderModules';
import {Title, Paragraph, Button} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import ModalCapacitarse from 'components/ModalCapacitarse';
const delay = 500;

/*
const CapacitacionListado = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Capacitacion/Listado')), delay);
  });
});*/
import Dashboard from './Dashboard';
import CapacitacionListado from './Capacitacion/Listado';
import Lead from './Client/Lead';
import Soporte from './Chat/Soporte';
import Profile from './Profile';
import MenuLateral from './MenuLateral';

const Drawer = createDrawerNavigator();
const {width, height} = Dimensions.get('screen');

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    registerAppWithFCM();

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      //navigation.navigate(remoteMessage.data.type);
    });
  }
}

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

function cargarModulo(Component) {
  return (props) => (
    <Suspense fallback={<LoaderModule visible={true} />}>
      <Component {...props} />
    </Suspense>
  );
}

class Master extends React.Component {
  state = {
    mostrar_modal_capacitacion: false,
  };
  onPressMenu = () => {
    this.props.navigation.openDrawer();
  };

  componentDidMount() {
    requestUserPermission();
    messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });
    this.props.initUsuario();
    this.setState({mostrar_modal_capacitacion: this.props.habilitado});
  }
  componentDidUpdate(prev) {
    if (this.state.mostrar_modal_capacitacion && this.props.habilitado) {
      //this.setState({mostrar_modal_capacitacion:false})
    }
  }

  render() {
    return (
      <>
        <Drawer.Navigator
          drawerContent={(props) => <MenuLateral {...props} />}
          drawerType={width >= 768 ? 'permanent' : 'back'}>
          {this.props.habilitado && (
            <Drawer.Screen name="Dashboard" component={Dashboard} />
          )}
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen
            name="Capacitaciones"
            component={CapacitacionListado}
          />
          {this.props.habilitado && (
            <Drawer.Screen name="Clientes" component={Lead} />
          )}
          {this.props.habilitado && (
            <Drawer.Screen name="Soporte" component={Soporte} />
          )}
        </Drawer.Navigator>
        <ModalCapacitarse
          nombre={this.props.nombre}
          habilitado={this.props.habilitado}
          navigation={this.props.navigation}
        />
      </>
    );
  }
}
const mapearEstado = (state) => {
  return {
    habilitado: state.Usuario.habilitado,
    nombre: state.Usuario.nombre,
  };
};
const mapearAcciones = (dispatch) => {
  return {
    initUsuario: () => {
      dispatch(initUsuario());
    },
  };
};
//export default Master
export default connect(mapearEstado, mapearAcciones)(Master);
