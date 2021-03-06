import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {changeProps} from 'redux/actions/Usuario';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Navbar from 'components/Navbar';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import ZoomIn from 'components/ZoomIn';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorfullContainer from 'components/ColorfullContainer';
import {deleteSharedPreference} from 'utils/SharedPreference';
import Balance from './components/Balance';
import ModalCapacitarse from '../Capacitacion/ModalCapacitarse';
import Usuario from 'redux/reducers/Usuario';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Calendar from './components/Calendar';
const width = Dimensions.get('window').width;

const Home = ({User, userChangeProps}) => {
  const modules = [
    {
      name: 'Capacitaciones',
      link: 'Capacitaciones',
      methodNav: 'push',
      icon: 'school',
      activeColor: COLORS.PRIMARY_COLOR_DARK_1,
      inactiveColor: COLORS.PRIMARY_COLOR_DARK_1,
    },
    {
      name: 'Clientes',
      link: 'Clientes',
      methodNav: 'navigate',
      icon: 'account-group',
      activeColor: COLORS.PRIMARY_COLOR_DARK_1,
      inactiveColor: COLORS.GRAY,
      params: {},
    },

    {
      name: 'Productos',
      link: 'Planes',
      params: {cliente_id: null},
      methodNav: 'push',
      icon: 'apps',
      activeColor: COLORS.PRIMARY_COLOR_DARK_1,
      inactiveColor: COLORS.GRAY,
    },
    {
      name: 'Soporte',
      link: 'Soporte',
      methodNav: 'push',
      icon: 'face-agent',
      activeColor: COLORS.PRIMARY_COLOR_DARK_1,
      inactiveColor: COLORS.GRAY,
    },
    {
      name: 'Notificaciones',
      link: 'NotificacionListado',
      methodNav: 'push',
      icon: 'bell',
      activeColor: COLORS.PRIMARY_COLOR_DARK_1,
      inactiveColor: COLORS.GRAY,
    },
    {
      name: 'Vender',
      link: 'Planes',
      params: {cliente_id: null},
      methodNav: 'push',
      icon: 'plus',
      activeColor: COLORS.BLANCO,
      inactiveColor: COLORS.GRAY,
    },
  ];

  const [refresh, setRefresh] = useState(null);

  const navigation = useNavigation();

  const visible = useIsFocused();

  const signOut = async () => {
    await deleteSharedPreference('auth-token');
    await deleteSharedPreference('userId');
    userChangeProps({estadoDeSesion: 0});
  };

  const handlePressModule = (module) => {
    if (module.link) {
      if (!User.habilitado && module.name != 'Capacitaciones') {
        Alert.alert(
          User.nombre + ` completa el entrenamiento`,
          'Entra en capacitaciones para continuar',
        );
      } else {
        console.log('Navigate ', module.name);
        //navigation.jumpTo(module.link);
        navigation[module.methodNav].call(
          navigation,
          module.link,
          module.params,
        );
      }
    } else {
      switch (module.name) {
        case 'Salir':
          signOut();
          break;
      }
    }
  };

  return (
    <ColorfullContainer style={styles.container}>
      <Navbar title="Inicio" transparent navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => setRefresh(Date.now())}
          />
        }>
        <View style={{paddingHorizontal: MARGIN_HORIZONTAL}}>
          <Text style={{fontFamily: 'Mont-Regular'}}>
            ??Hola, {User.nombre}! Bienvenido(a) a Servi
          </Text>

          {!User.habilitado ? (
            <>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: COLORS.ROJO,
                  padding: 8,
                  color: COLORS.BLANCO,
                  borderRadius: 24,
                }}>
                <Text
                  style={{
                    color: COLORS.BLANCO,
                  }}>
                  No habilitado
                </Text>
              </View>
              <ModalCapacitarse
                visible={visible}
                close={signOut}
                navigation={navigation}
                nombre={User.nombre}
              />
            </>
          ) : null}
          <Balance id={Usuario.id} token={Usuario.token} refresh={refresh} />
          <Calendar refresh={refresh} />
        </View>

        <ZoomIn>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
              marginHorizontal: 16,
              flexWrap: 'wrap',
            }}>
            {modules.map((module) => (
              <TouchableOpacity
                style={[
                  module.name == 'Vender' ? styles.moduleVender : styles.module,
                ]}
                onPress={() => handlePressModule(module)}>
                <Icon
                  name={module.icon}
                  size={32}
                  color={
                    User.habilitado ? module.activeColor : module.inactiveColor
                  }
                />
                <Text
                  style={[
                    styles.text,
                    {
                      color: User.habilitado
                        ? module.activeColor
                        : module.inactiveColor,
                    },
                  ]}>
                  {module.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ZoomIn>
      </ScrollView>
    </ColorfullContainer>
  );
};

const mapToActions = (dispatch) => {
  return {
    userChangeProps: (props) => {
      dispatch(changeProps(props));
    },
  };
};

const mapTopState = (state) => {
  return {
    User: state.Usuario,
  };
};

export default connect(mapTopState, mapToActions)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  module: {
    width: '30%',
    padding: 16,
    margin: 1,
    marginVertical: '2%',
    backgroundColor: COLORS.BLANCO,
    borderRadius: CURVA * 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleVender: {
    width: '30%',
    padding: 16,
    margin: 1,
    marginVertical: '2%',
    backgroundColor: COLORS.PRIMARY_COLOR,
    borderRadius: CURVA * 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 0.02 * width,
  },
});
