import React from 'react';
import {
  FlatList,
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Linking,
} from 'react-native';
import {Text, FAB, List, Colors} from 'react-native-paper';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import {SOCKET_ADDRESS} from '../../../constants';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import {connect} from 'react-redux';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 16,
  },
  mensaje: {
    padding: 12,
    backgroundColor: Colors.lightGreen100,
    borderRadius: 16,
    marginTop: 16,
    maxWidth: '90%',
    marginHorizontal: 16,
  },
  me: {
    backgroundColor: Colors.lightGreen300,
    alignSelf: 'flex-end',
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
//10.0.82.90
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
class Soporte extends React.Component {
  state = {
    usuarios: [],
    mensajes: [
      {me: false, msn: 'Hola en este momento no podemos ayudarte'},
      {me: true, msn: 'Oyeee usted no sabe quien soy yo'},
      {me: false, msn: 'Si un corredor que este mes no ha vendido nada'},
      {me: true, msn: 'JAJA que risa he sido el mejor durante meses'},
      {me: true, msn: 'Y ahora por un mes malo me tratan asi 😡'},
      {me: true, msn: 'Saben que quedense con su plataforma'},
      {me: true, msn: 'De igual forma ya estaba aburrido'},
      {me: false, msn: 'Esta bien Sr que tenga suerte'},
      {me: true, msn: 'JAAAY wp asi no mas'},
      {
        me: true,
        msn:
          'En esta url https://google.com.co busquen como pueden irse a la mierda',
      },
    ],
    total_mensajes: 10,
  };
  componentDidMount() {
    this.socket = SocketIOClient(
      SOCKET_ADDRESS + '?userName=' + this.props.nombre,
    );
    /*
    this.socket.on('usuarios',(usuarios)=>{
      console.log(usuarios)
      this.setState({usuarios:usuarios})
    })*/
  }

  transformarMensaje = (msn) => {
    return msn.split(' ').map((palabra) => {
      if (urlRegex.test(palabra)) {
        return (
          <Text>
            <Text onPress={() => Linking.openURL(palabra)} style={styles.link}>
              {palabra}
            </Text>{' '}
          </Text>
        );
      } else {
        return palabra + ' ';
      }
    });
  };
  renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.mensaje,
          item.me && styles.me,
          index + 1 == this.state.total_mensajes && {marginBottom: 120},
          index > 0 &&
            this.state.mensajes[index - 1].me == item.me && {marginTop: 1},
        ]}>
        <Text>{this.transformarMensaje(item.msn)}</Text>
      </View>
    );
  };
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="menu"
            onPress={() => this.props.navigation.openDrawer()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Soporte</Text>
          <FAB style={{elevation: 0}} icon="face-agent" />
        </View>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            initialScrollIndex={this.state.total_mensajes - 1}
            data={this.state.mensajes}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 16,
              marginLeft: 16,
              marginRight: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 16,
                backgroundColor: 'white',
                paddingHorizontal: 16,
              }}>
              <TextInput
                style={{backgroundColor: 'transparent'}}
                multiline={true}
                numberOfLines={4}
                underlineColor="transparent"
                underlineColorAndroid={'rgba(0,0,0,0)'}
              />
            </View>

            <FAB icon="send" style={{marginLeft: -16}} />
          </View>
        </View>
      </View>
    );
  }
}
const mapearEstado = (state) => {
  return {
    nombre: state.Usuario.nombre,
  };
};
export default connect(mapearEstado)(Soporte);
