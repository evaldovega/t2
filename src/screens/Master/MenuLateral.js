import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Avatar, Title, Drawer, Caption} from 'react-native-paper';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {salir} from 'redux/actions/Usuario';

class MenuLateral extends React.Component {
  componentDidMount() {}
  render() {
    const actual = this.props.state.routeNames[this.props.state.index];
    return (
      <DrawerContentScrollView {...this.props}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            marginVertical: 32,
          }}>
          <Avatar.Image
            source={{uri: this.props.foto_perfil}}
            style={{marginRight: 8}}
          />
          <Title style={{flex: 1}}>
            {this.props.nombre} {this.props.index}
          </Title>
        </View>
        <Drawer.Section>
          <Drawer.Item
            label="Perfil"
            active={actual == 'Profile'}
            icon="account-circle"
            onPress={() => this.props.navigation.navigate('Profile')}
          />
          <Drawer.Item
            label="Dashboard"
            active={actual == 'Dashboard'}
            icon="monitor-dashboard"
            onPress={() => this.props.navigation.navigate('Dashboard')}
          />
          <Drawer.Item
            label="Capacitaciones"
            active={actual == 'Capacitaciones'}
            icon="school"
            onPress={() => this.props.navigation.navigate('Capacitaciones')}
          />
          <Drawer.Item
            label="Clientes"
            active={actual == 'Clientes'}
            icon="account-group"
            onPress={() => this.props.navigation.navigate('Clientes')}
          />
        </Drawer.Section>

        <Drawer.Section>
          <Drawer.Item
            label="Notificaciones"
            active={actual == 'Notificaciones'}
            icon="bell"
            onPress={() => this.props.navigation.navigate('Notificaciones')}
          />
          <Drawer.Item
            label="Soporte"
            icon="face-agent"
            active={actual == 'Soporte'}
            onPress={() => this.props.navigation.navigate('Soporte')}
          />
        </Drawer.Section>

        <Drawer.Item
          label="Cerrar Seción"
          icon="logout"
          style={{marginTop: 32}}
          onPress={() => this.props.salir()}
        />

        <Caption style={{textAlign: 'center'}}>Serviproteccion</Caption>
      </DrawerContentScrollView>
    );
  }
}
const mapToState = (state) => {
  return {
    nombre: state.Usuario.nombre,
    foto_perfil: state.Usuario.foto_perfil,
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
