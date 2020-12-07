import React, {Suspense} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Lato, Montserrat} from 'utils/fonts';
import {connect} from 'react-redux';
import {
  CambiarNombre,
  cambiarFotoPerfil,
  initUsuario,
} from 'redux/actions/Usuario';

import {Avatar} from 'react-native-paper';

import ImagePicker from 'react-native-image-crop-picker';
import {
  COLORS,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import {styleHeader} from 'styles';
import ProfileIdentificacion from './Identificacion';
import {actualizarDatos, cambiarProp} from 'redux/actions/Usuario';

import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Validator from 'components/Validator';

const SeguridadSocial = React.lazy(() => import('./SeguridadSocial'));

class Profile extends React.Component {
  state = {
    mostrar_modal_capacitacion: false,
  };
  formulario_datos_personales = {};

  componentDidMount() {
    console.log('Pagina perfil montada');
  }

  componentDidUpdate(prev) {
    if (
      prev.error_actualizando_perfil != this.props.error_actualizando_perfil &&
      this.props.error_actualizando_perfil != ''
    ) {
      Alert.alert('Algo anda mal', this.props.error_actualizando_perfil);
    }
  }

  componentWillUnmount() {}

  onPressMenu = () => {
    this.props.navigation.openDrawer();
  };

  cambiarFoto = () => {
    console.log('Buscar img');
    ImagePicker.openPicker({width: 200, height: 200, mediaType: 'photo'})
      .then((image) => {
        console.log(image);
        this.props.cambiarFotoPerfil(image);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };
  validar = () => {
    let errores = [];
    Object.keys(this.formulario_datos_personales).forEach((k) => {
      const e = this.formulario_datos_personales[k].execute();
      if (e.length > 0) {
        errores = [...errores, {...e}];
      }
    });
    if (errores.length == 0) {
      this.props.actualizarDatos();
    }
  };
  render() {
    return (
      <ColorfullContainer style={styles.container}>
        <Navbar transparent menu title="Perfil" {...this.props} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: MARGIN_HORIZONTAL,
              marginTop: MARGIN_VERTICAL,
            }}>
            <Avatar.Image
              onPress={this.cambiarFoto}
              size={96}
              source={{uri: this.props.usuario.foto_perfil}}
            />

            <View style={{marginLeft: 8}}>
              <Text
                style={{
                  textAlign: 'left',
                  color: COLORS.NEGRO,
                  fontFamily: 'Mont-Bold',
                  fontSize: TITULO_TAM,
                }}>
                {this.props.usuario.nombre || 'Nombre del usuario'}
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  color: COLORS.NEGRO,
                  fontFamily: 'Mont-Regular',
                  fontSize: TITULO_TAM * 0.7,
                }}>
                {this.props.usuario.num_documento_identidad}
              </Text>
            </View>
          </View>

          {!this.props.usuario.habilitado ? (
            <Button
              onPress={() => this.props.navigation.navigate('Capacitaciones')}
              title="Completar entrenamiento"
            />
          ) : null}

          <View style={styles.containerInfo}>
            <View style={styles.col}>
              <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Bold'}}>
                3.890
              </Text>
              <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Regular'}}>
                Clientes
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Bold'}}>
                257
              </Text>
              <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Regular'}}>
                Ventas
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Bold'}}>
                1.000.468
              </Text>
              <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Regular'}}>
                Ganancias
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.titleContent}>Datos Personales</Text>

            <Text
              style={{
                fontFamily: 'Mont-Regular',
                marginTop: MARGIN_VERTICAL,
                color: COLORS.NEGRO_N1,
              }}>
              Correo Electrónico
            </Text>
            <Validator
              ref={(r) => (this.formulario_datos_personales['email'] = r)}
              value={this.props.usuario.email}
              constraints={{
                presence: {
                  allowEmpty: false,
                  message: '^Diligencie éste campo',
                },
              }}>
              <InputText
                marginTop={1}
                input={{keyboardType: 'email-address'}}
                onChangeText={(t) => this.props.cambiarProp('email', t)}
                value={this.props.usuario.email}
              />
            </Validator>

            <Validator
              ref={(r) => (this.formulario_datos_personales['tel'] = r)}
              value={this.props.usuario.cel}
              constraints={{
                presence: {
                  allowEmpty: false,
                  message: '^Diligencie éste campo',
                },
              }}>
              <Text
                style={{
                  fontFamily: 'Mont-Regular',
                  marginTop: MARGIN_VERTICAL,
                  color: COLORS.NEGRO_N1,
                }}>
                Número de Celular
              </Text>
              <InputText
                marginTop={1}
                input={{keyboardType: 'phone-pad'}}
                onChangeText={(t) => this.props.cambiarProp('cel', t)}
                value={this.props.usuario.cel}
              />
            </Validator>

            <Button
              marginTop={1}
              icon="pencil"
              onPress={this.validar}
              loading={this.props.usuario.actualizando_perfil}
              title="Actualizar Datos"
            />

            <ProfileIdentificacion />

            <Suspense
              fallback={() => <Text>Cargando Seguridad Social...</Text>}>
              {SeguridadSocial && (
                <SeguridadSocial style={{marginTop: 32}} {...this.props} />
              )}
            </Suspense>
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}
const mapToState = (state) => {
  return {
    usuario: state.Usuario,
    habilitado: state.Usuario.habilitado,
    error_actualizando_perfil: state.Usuario.error_actualizando_perfil,
  };
};
const mapTopActions = (dispatch) => {
  return {
    cambiarProp: (p, v) => {
      dispatch(cambiarProp(p, v));
    },
    actualizarDatos: () => {
      dispatch(actualizarDatos());
    },
    cambiarNombre: (nombre) => {
      dispatch(CambiarNombre(nombre));
    },
    cambiarFotoPerfil: (data) => {
      dispatch(cambiarFotoPerfil(data));
    },
    initUsuario: () => {
      dispatch(initUsuario());
    },
  };
};
export default connect(mapToState, mapTopActions)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLANCO,
  },
  back: {
    position: 'absolute',
    left: 16,
    top: getStatusBarHeight(true) + 10,
    zIndex: 1,
    elevation: 0,
    backgroundColor: '#F7F8F9',
  },
  noti: {
    position: 'absolute',
    right: 16,
    top: getStatusBarHeight(true) + 10,
    zIndex: 1,
    backgroundColor: '#F7F8F9',
    elevation: 0,
  },
  name: {
    fontFamily: Montserrat,
    fontWeight: '500',
    fontSize: 18,
    color: '#1A051D',
    textAlign: 'center',
    marginTop: 8,
  },
  job: {
    fontFamily: Montserrat,
    fontSize: 14,
    color: '#6D5F6F',
    textAlign: 'center',
    marginTop: 8,
  },
  btnUpdate: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084F4',
    marginTop: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,

    alignItems: 'center',
    alignSelf: 'center',
  },
  txtUpdate: {
    fontFamily: Montserrat,
    fontSize: 13,
    color: '#FFF',
  },
  containerInfo: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 32,
  },
  col: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontFamily: Montserrat,
    fontSize: 20,
    color: '#1A051D',
  },
  title: {
    fontFamily: Lato,
    fontSize: 12,
    color: '#6D5F6F',
  },
  line: {
    width: 1,
    backgroundColor: COLORS.NEGRO_N1,
    height: 32,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingBottom: 20,
    paddingTop: 32,
  },
  titleContent: {
    fontFamily: 'Mont-Bold',
    fontSize: TITULO_TAM * 0.8,
    color: COLORS.NEGRO,
    marginVertical: MARGIN_VERTICAL * 2,
  },
  titleWork: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 19,
    fontFamily: Montserrat,
    fontSize: 14,
    color: '#FFF',
  },
  svgWork: {
    marginRight: 16,
  },
  client: {
    marginTop: 12,
    height: 48,
    marginBottom: 32,
  },
  work: {
    marginTop: 16,
  },
});
