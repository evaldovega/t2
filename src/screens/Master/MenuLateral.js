import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Avatar, Title, Drawer, Caption} from 'react-native-paper';
import {View, Image, Text} from 'react-native';
import {connect} from 'react-redux';
import {salir} from 'redux/actions/Usuario';
import moment from 'moment';
import GradientContainer from 'components/GradientContainer';
import AntDesing from 'react-native-vector-icons/AntDesign';
import {COLORS, MARGIN_HORIZONTAL, MARGIN_VERTICAL} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

class MenuLateral extends React.Component {
  componentDidMount() {}

  render() {
    const actual = this.props.state.routeNames[this.props.state.index];
    return (
      <GradientContainer style={{flex: 1}}>
        <Image
          source={require('utils/images/logo_black.png')}
          resizeMode="contain"
          style={{
            width: 100,
            height: 80,
            alignSelf: 'center',
            marginTop: getStatusBarHeight(),
            marginVertical: MARGIN_VERTICAL,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            marginBottom: MARGIN_VERTICAL * 2,
          }}>
          <Title style={{flex: 1}}>
            {this.props.nombre} {this.props.index}
          </Title>
        </View>
        <Drawer.Section>
          <Drawer.Item
            label="Perfil"
            active={actual == 'Profile'}
            icon="account-circle"
            onPress={() =>
              requestAnimationFrame(() => {
                this.props.navigation.navigate('Profile');
              })
            }
          />
          {this.props.habilitado ? (
            <Drawer.Item
              label="Dashboard"
              active={actual == 'Dashboard'}
              icon="monitor-dashboard"
              onPress={() =>
                requestAnimationFrame(() => {
                  this.props.navigation.navigate('Dashboard');
                })
              }
            />
          ) : (
            <></>
          )}
          <Drawer.Item
            label="Capacitaciones"
            active={actual == 'Capacitaciones'}
            icon="school"
            onPress={() =>
              requestAnimationFrame(() => {
                this.props.navigation.navigate('Capacitaciones');
              })
            }
          />
          {this.props.habilitado ? (
            <Drawer.Item
              label="Clientes"
              active={actual == 'Clientes'}
              icon="account-group"
              onPress={() =>
                requestAnimationFrame(() =>
                  this.props.navigation.navigate('Clientes'),
                )
              }
            />
          ) : (
            <></>
          )}
        </Drawer.Section>

        {this.props.habilitado ? (
          <Drawer.Section>
            <Drawer.Item
              label="Notificaciones"
              active={actual == 'Notificaciones'}
              icon="bell"
              onPress={() =>
                requestAnimationFrame(() => {
                  this.props.navigation.navigate('Notificaciones');
                })
              }
            />
            <Drawer.Item
              label="Soporte"
              icon="face-agent"
              active={actual == 'Soporte'}
              onPress={() =>
                requestAnimationFrame(() => {
                  this.props.navigation.navigate('Soporte');
                })
              }
            />
          </Drawer.Section>
        ) : (
          <></>
        )}

        <Drawer.Item
          label="Cerrar Sesión"
          icon="logout"
          style={{marginTop: 32}}
          onPress={() => this.props.salir()}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 64,
          }}>
          <Image
            source={require('utils/images/icon.png')}
            style={{width: 20, aspectRatio: 1, marginRight: 16}}
            resizeMode="contain"
          />
          <Caption style={{textAlign: 'center'}}>
            Serviproteccion © {moment().format('YYYY')}
          </Caption>
        </View>
      </GradientContainer>
    );
  }
}
const mapToState = (state) => {
  return {
    nombre: state.Usuario.nombre,
    foto_perfil: state.Usuario.foto_perfil,
    habilitado: state.Usuario.habilitado,
  };
};
const mapToActions = (dispatch) => {
  return {
    salir: () => {
      dispatch(salir());
    },
  };
};
export default connect(mapToState, mapToActions)(MenuLateral);
