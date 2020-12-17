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
import {Text, FAB, List, Colors, Card, Caption} from 'react-native-paper';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import {COLORS, SOCKET_ADDRESS, SERVER_ADDRESS} from 'constants';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import ColorfullContainer from 'components/ColorfullContainer';
import NavBar from 'components/Navbar';

const Sound = require('react-native-sound');
const {fs} = RNFetchBlob;
Sound.setCategory('Playback');

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 11,
  },
  mensaje: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 16,
    maxWidth: '90%',
    marginHorizontal: 16,
    alignSelf: 'flex-start',
  },
  me: {
    color: 'white',
    backgroundColor: Colors.grey300,
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
    cargando: false,
    entrando: true,
    usuarios: [],
    msg: '',
    mensajes: [],
    total_mensajes: 0,
  };

  load = () => {
    this.setState({cargando: true});
    fetch(SERVER_ADDRESS + 'api/mensajes/?sala=' + this.props.id, {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const user = this.props.id;
        const mensajes = data.map((d) => ({...d, ...{me: d.user == user}}));
        this.setState({
          mensajes: mensajes,
          total_mensajes: mensajes.length,
          cargando: false,
        });
      })
      .catch((error) => {
        this.setState({cargando: false});
      });
  };

  componentDidMount() {
    console.log('Ruta ', fs.dirs.MainBundleDir);
    this.msn = new Sound(require('../../../sms.mp3'), (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
    });

    this.socket = SocketIOClient(SOCKET_ADDRESS, {transports: ['websocket']});
    console.log('Room ' + this.props.id);

    this.load();

    this.socket.on('disconnect', () => {
      this.setState({entrando: true});
    });
    this.socket.on('connect', () => {
      this.socket.emit('enter', {user: this.props.id});
    });
    this.socket.on('message_enter', (data) => {
      this.setState({entrando: false});
    });
    this.socket.on('message', (data) => {
      if (data.id != this.props.id) {
        let mensajes = this.state.mensajes;
        mensajes = mensajes.map((m) => {
          m.mb = null;
          return m;
        });
        mensajes.push({me: false, mensaje: data.message, mb: 130});

        this.setState({mensajes: mensajes, total_mensajes: mensajes.length});
        this.msn.play();
      }
    });
  }

  componentWillUnmount() {
    try {
      this.msn.release();
    } catch (e) {}
  }

  enviar = () => {
    this.socket.emit('onmessage', {
      msg: this.state.msg,
      id: this.props.id,
      sala: this.props.id,
    });
    let mensajes = this.state.mensajes;
    mensajes = mensajes.map((m) => {
      m.mb = null;
      return m;
    });

    mensajes.push({me: true, msn: this.state.msg, mb: 130});
    this.setState({
      mensajes: mensajes,
      msg: '',
      total_mensajes: mensajes.length,
    });
  };

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
    const igual = index > 0 && this.state.mensajes[index - 1].me == item.me;
    return (
      <View
        style={[
          styles.mensaje,
          item.me && styles.me,
          item.mb && {marginBottom: item.mb},
          igual && {marginTop: 1},
        ]}>
        {!item.me && !igual && <Caption>Asesor</Caption>}
        <Text style={styles.text}>{this.transformarMensaje(item.mensaje)}</Text>
      </View>
    );
  };
  render() {
    return (
      <ColorfullContainer style={{flex: 1, flexDirection: 'column'}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <NavBar {...this.props} menu title="Soporte" transparent />
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={this.state.mensajes}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
        <Card
          style={{
            flex: 1,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            elevation: 8,
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
          }}>
          <Card.Content
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.entrando ? (
              <Text>Conectando...</Text>
            ) : (
              <>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <TextInput
                    value={this.state.msg}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor={COLORS.PRIMARY_COLOR}
                    onChangeText={(t) => this.setState({msg: t})}
                    style={{backgroundColor: 'transparent'}}
                    multiline={true}
                    numberOfLines={4}
                    underlineColor="transparent"
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                  />
                </View>
                <FAB
                  icon="send"
                  onPress={this.enviar}
                  style={{marginLeft: -16}}
                />
              </>
            )}
          </Card.Content>
        </Card>
      </ColorfullContainer>
    );
  }
}
const mapearEstado = (state) => {
  return {
    id: state.Usuario.id,
    nombre: state.Usuario.nombre,
    token: state.Usuario.token,
  };
};
export default connect(mapearEstado)(Soporte);
