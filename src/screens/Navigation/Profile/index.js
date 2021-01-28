import React, {Suspense} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Lato, Montserrat} from 'utils/fonts';
import moment from 'moment';
import {connect} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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
import ProfileIdentificacion from './components/Identificacion';
import {actualizarDatos, cambiarProp} from 'redux/actions/Usuario';

import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';
import Button from 'components/Button';
import InputText from 'components/InputText';
import InputDateTimerPicker from 'components/DatetimePicker';
import Validator, {Execute} from 'components/Validator';
import Usuario from 'redux/reducers/Usuario';

const SeguridadSocial = React.lazy(() =>
  import('./components/SeguridadSocial'),
);
const DatosBancarios = React.lazy(() => import('./components/DatosBancarios'));

function Profile(props) {
  const {
    navigation,
    usuario,
    cambiarFotoPerfil,
    actualizarDatos,
    cambiarProp,
  } = props;

  const formulario_datos_personales = {};

  const cambiarFoto = () => {
    console.log('Buscar img');
    ImagePicker.openPicker({width: 200, height: 200, mediaType: 'photo'})
      .then((image) => {
        console.log(image);
        cambiarFotoPerfil(image);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const validar = () => {
    Execute(formulario_datos_personales).then(() => {
      actualizarDatos();
    });
  };

  return (
    <ColorfullContainer style={styles.container}>
      <Navbar transparent title="Perfil" {...props} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: MARGIN_HORIZONTAL,
            marginTop: MARGIN_VERTICAL,
          }}>
          <TouchableOpacity style={{width: 96}} onPress={cambiarFoto}>
            <Avatar.Image size={96} source={{uri: usuario.foto_perfil}} />
            <SimpleLineIcons
              name="camera"
              size={16}
              color="#ffff"
              style={{
                position: 'absolute',
                bottom: 1,
                right: -1,
                backgroundColor: COLORS.PRIMARY_COLOR,
                padding: 4,
                borderRadius: 16,
              }}
            />
          </TouchableOpacity>

          <View style={{marginLeft: 8}}>
            <Text
              style={{
                textAlign: 'left',
                color: COLORS.NEGRO,
                fontFamily: 'Mont-Regular',
                fontSize: TITULO_TAM,
              }}>
              {`${usuario.nombre} ${usuario.apellidos}` || 'Nombre del usuario'}
            </Text>
            <Text
              style={{
                textAlign: 'left',
                color: COLORS.NEGRO,
                fontFamily: 'Mont-Regular',
                fontSize: TITULO_TAM * 0.7,
              }}>
              {usuario.num_documento_identidad}
            </Text>
          </View>
        </View>

        <View style={styles.containerInfo}>
          <View style={styles.col}>
            <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Bold'}}>
              {usuario.no_clientes}
            </Text>
            <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Regular'}}>
              Clientes
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.col}>
            <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Bold'}}>
              {usuario.no_ventas}
            </Text>
            <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Regular'}}>
              Ventas
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.col}>
            <Text style={{color: COLORS.NEGRO, fontFamily: 'Mont-Bold'}}>
              {usuario.ganancias}
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
            ref={(r) => (formulario_datos_personales['email'] = r)}
            value={usuario.email}
            required
            email>
            <InputText
              marginTop={1}
              disabled={usuario.actualizando_perfil}
              input={{keyboardType: 'email-address'}}
              onChangeText={(t) => cambiarProp('email', t)}
              value={usuario.email}
            />
          </Validator>

          <Validator
            ref={(r) => (formulario_datos_personales['tel'] = r)}
            value={props.usuario.cel}
            required>
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
              disabled={usuario.actualizando_perfil}
              input={{keyboardType: 'phone-pad'}}
              onChangeText={(t) => cambiarProp('cel', t)}
              value={usuario.cel}
            />
          </Validator>

          <Text
            style={{
              fontFamily: 'Mont-Regular',
              marginTop: MARGIN_VERTICAL,
              color: COLORS.NEGRO_N1,
            }}>
            Fecha de cumpleaños
          </Text>
          <Validator
            value={usuario.fecha_nacimiento}
            ref={(r) => (formulario_datos_personales['nacimiento'] = r)}
            required>
            <InputDateTimerPicker
              marginTop={1}
              showTime={false}
              disabled={usuario.actualizando_perfil}
              value={moment(usuario.fecha_nacimiento).startOf('day')}
              onChange={(v) => cambiarProp('fecha_nacimiento', v)}
            />
          </Validator>

          <Button
            marginTop={1}
            icon="pencil"
            disabled={usuario.actualizando_perfil}
            onPress={validar}
            loading={usuario.actualizando_perfil}
            title="Actualizar Datos"
          />

          <ProfileIdentificacion />

          <Suspense fallback={() => <Text>Cargando Datos Bancarios...</Text>}>
            <DatosBancarios userId={Usuario.id} user={usuario} />
          </Suspense>

          <Suspense fallback={() => <Text>Cargando Seguridad Social...</Text>}>
            {SeguridadSocial && (
              <SeguridadSocial style={{marginTop: 32}} {...props} />
            )}
          </Suspense>
        </View>
      </ScrollView>
    </ColorfullContainer>
  );
}
const mapToState = (state) => {
  return {
    usuario: state.Usuario,
    habilitado: state.Usuario.habilitado,
    actualizando_perfil: state.Usuario.actualizando_perfil,
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
