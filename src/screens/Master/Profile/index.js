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
  TextInput,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Lato, Montserrat} from 'utils/fonts';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import {Neomorph} from 'react-native-neomorph-shadows';
import {connect} from 'react-redux';
import {
  CambiarNombre,
  cambiarFotoPerfil,
  initUsuario,
} from 'redux/actions/Usuario';

import {
  Avatar,
  FAB,
  Subheading,
  // TextInput,
  Title,
  Caption,
  Button,
  Colors,
  Paragraph,
} from 'react-native-paper';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS} from 'constants';
import {styleHeader} from 'styles';
import ProfileIdentificacion from './Identificacion';
import {actualizarDatos, cambiarProp} from 'redux/actions/Usuario';

import Navbar from 'components/Navbar';
import GradientContainer from 'components/GradientContainer';

const SeguridadSocial = React.lazy(() => import('./SeguridadSocial'));

class Profile extends React.Component {
  state = {
    mostrar_modal_capacitacion: false,
  };

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

  onPressMenu = () => {
    requestAnimationFrame(() => {
      this.props.navigation.openDrawer();
    });
  };

  render() {
    return (
      <LinearGradient style={styles.container} colors={['#72d3c1', '#72d3c1']}>
        {/* <Navbar menu title="Perfil" {...this.props} /> */}

        <View style={[styles.wrapper]}>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            style={styles.btnLeft}
            onPress={this.onPressMenu}>
            <SimpleLineIcons name="menu" size={24} color="#ffff" />
          </TouchableOpacity>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Perfil</Text>
          </View>
          <View style={styles.btnRight}>
            <React.Fragment>
              <Image
                source={require('utils/images/isologo.png')}
                style={{width: 40, height: 40}}
                resizeMode="contain"
              />
            </React.Fragment>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 24,
              marginTop: 32,
            }}>
            <View
              style={{
                shadowRadius: 3,
                borderRadius: 36,
                backgroundColor: COLORS.PRIMARY_COLOR,
                width: 72,
                height: 72,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                inner
                style={{
                  shadowRadius: 7,
                  borderRadius: 32,
                  backgroundColor: COLORS.PRIMARY_COLOR,
                  width: 64,
                  height: 64,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
                <Avatar.Image
                  onPress={this.cambiarFoto}
                  size={64}
                  source={{uri: this.props.usuario.foto_perfil}}
                />
              </View>
            </View>

            <View style={{marginLeft: 8}}>
              <Title style={{textAlign: 'center', color: 'white'}}>
                {this.props.usuario.nombre || 'Nombre del usuario'}
              </Title>
              <Subheading
                style={{textAlign: 'center', color: 'white', marginLeft: -38}}>
                {this.props.usuario.num_documento_identidad}
              </Subheading>
            </View>
          </View>

          {!this.props.usuario.habilitado ? (
            <TouchableOpacity
              style={styles.btnUpdate}
              onPress={() => this.props.navigation.navigate('Capacitaciones')}>
              <Text style={styles.txtUpdate}>Completar entrenamiento</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.containerInfo}>
            <View style={styles.col}>
              <Subheading style={{color: 'white'}}>3.890</Subheading>
              <Caption style={{color: 'white'}}>Clientes</Caption>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Subheading style={{color: 'white'}}>257</Subheading>
              <Caption style={{color: 'white'}}>Ventas</Caption>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Subheading style={{color: 'white'}}>1.000.468</Subheading>
              <Caption style={{color: 'white'}}>Ganancias</Caption>
            </View>
          </View>

          <View style={styles.content}>
            <Title style={{color: COLORS.PRIMARY_COLOR, textAlign: 'center'}}>
              Datos Personales
            </Title>

            <Text style={styles.labelInput}>Número de documento</Text>
            <View style={styles.containerInput}>
              <TextInput
                style={[styles.input]}
                placeholder={'Número de documento'}
                placeholderTextColor={'#ABA4AC'}
                value={this.props.usuario.num_documento_identidad}
                onChangeText={(t) =>
                  this.props.cambiarProp('num_documento_identidad', t)
                }
              />
            </View>

            <Text style={styles.labelInput}>Correo electrónico</Text>
            <View style={styles.containerInput}>
              <TextInput
                style={[styles.input]}
                label="Correo Electrónico"
                textContentType="emailAddress"
                value={this.props.usuario.email}
                onChangeText={(t) => this.props.cambiarProp('email', t)}
                placeholder={'Correo electrónico'}
                placeholderTextColor={'#ABA4AC'}
              />
            </View>

            <Text style={styles.labelInput}>Número de celular</Text>
            <View style={styles.containerInput}>
              <TextInput
                style={[styles.input]}
                textContentType="telephoneNumber"
                onChangeText={(t) => this.props.cambiarProp('cel', t)}
                value={this.props.usuario.cel}
                placeholder={'Número de celular'}
                placeholderTextColor={'#ABA4AC'}
              />
            </View>

            <Button
              icon="pencil"
              style={{
                marginVertical: 16,
                backgroundColor: COLORS.PRIMARY_COLOR,
                color: 'white',
              }}
              onPress={this.props.actualizarDatos}
              loading={this.props.usuario.actualizando_perfil}>
              Actualizar Datos
            </Button>

            <ProfileIdentificacion />

            <Suspense
              fallback={() => <Text>Cargando Seguridad Social...</Text>}>
              {SeguridadSocial && (
                <SeguridadSocial style={{marginTop: 32}} {...this.props} />
              )}
            </Suspense>
          </View>
        </ScrollView>
      </LinearGradient>
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
    elevation: 0,
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
    backgroundColor: '#EAE8EA',
    height: 32,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingBottom: 20,
    paddingTop: 32,
    elevation: 16,
  },
  titleContent: {
    fontFamily: Montserrat,
    fontSize: 16,
    color: '#1A051D',
    textTransform: 'uppercase',
    marginTop: 28,
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
  wrapper: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#FFFFFF00',
    paddingHorizontal: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    overflow: 'hidden',
    elevation: 0.2,
  },
  title: {
    marginLeft: 16,
    fontSize: 17,
    color: '#ffff',
  },
  btnLeft: {
    zIndex: 1,
    elevation: 0,
  },
  btnRight: {elevation: 0},

  containerInput: {
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE8EA',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1,
  },
  textAlert: {
    marginHorizontal: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
    color: 'red',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Roboto',
    padding: 0,
    margin: 0,
  },
  labelInput: {
    marginHorizontal: 18,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
});
