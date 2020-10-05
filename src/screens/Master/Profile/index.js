import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
/*
import SvgClient1 from 'svgs/profile/SvgClient1';
import SvgClient2 from 'svgs/profile/SvgClient2';
import SvgClient3 from 'svgs/profile/SvgClient3';
import SvgClient4 from 'svgs/profile/SvgClient4';
import SvgClient5 from 'svgs/profile/SvgClient5';*/

/*
import SvgWork1 from 'svgs/profile/SvgWork1';
import SvgWork2 from 'svgs/profile/SvgWork2';
import SvgWork3 from 'svgs/profile/SvgWork3';*/

import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Lato, Montserrat} from 'utils/fonts';

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
  TextInput,
  Title,
  Caption,
  Button,
} from 'react-native-paper';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS} from 'constants';
import RNFS from 'react-native-fs';

import ProfileIdentificacion from './Identificacion';

//const dataClient = [SvgClient1, SvgClient2, SvgClient3, SvgClient4, SvgClient5];
/*
const dataWork = [
  {
    title: 'Illustration Collection #2',
    Svg: SvgWork1,
  },
  {
    title: 'Work Form Home #1',
    Svg: SvgWork2,
  },
  {
    title: 'Illustration Collection #2',
    Svg: SvgWork3,
  },
];*/

class Profile extends React.Component {
  componentDidMount() {
    //this.props.initUsuario()
    // RNFS.exists(filePath)
    // .then(success => {
    //     if (success) {
    //         readFile(filePath, logData);
    //     } else {
    //         writeFile(filePath, logData);
    //     }
    // })
    // .catch(err => {
    //     console.log(err.message, err.code);
    // });
  }

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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FAB
          icon="menu"
          small
          style={styles.back}
          elevation={0}
          onPress={this.onPressMenu}
        />
        <FAB icon="bullhorn" small style={styles.noti} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableNativeFeedback onPress={this.cambiarFoto}>
            <Avatar.Image
              style={styles.avatar}
              source={{uri: this.props.usuario.foto_perfil}}
            />
          </TouchableNativeFeedback>

          <Title style={{textAlign: 'center'}}>
            {this.props.usuario.nombre}
          </Title>
          <Subheading style={{textAlign: 'center'}}>
            {this.props.usuario.nivel}
          </Subheading>
          {!this.props.usuario.entrenamiento_completado ? (
            <TouchableOpacity
              style={styles.btnUpdate}
              onPress={() => this.props.navigation.navigate('Capacitaciones')}>
              <Text style={styles.txtUpdate}>Completar entrenamiento</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.containerInfo}>
            <View style={styles.col}>
              <Subheading>3.890</Subheading>
              <Caption>Clientes</Caption>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Subheading>257</Subheading>
              <Caption>Ventas</Caption>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Subheading>1.000.468</Subheading>
              <Caption>Ganancias</Caption>
            </View>
          </View>

          <View style={styles.content}>
            <Title style={{color: COLORS.PRIMARY_COLOR}}>
              Datos Personales
            </Title>
            <TextInput
              label="Correo Electrónico"
              textContentType="emailAddress"
              value={this.props.usuario.email}
              style={{backgroundColor: 'transparent'}}
            />
            <TextInput
              label="Número de Celular"
              textContentType="telephoneNumber"
              value={this.props.usuario.cel}
              style={{backgroundColor: 'transparent'}}
            />
            <Button icon="pencil" style={{marginVertical: 16}}>
              Actualizar Datos
            </Button>

            <ProfileIdentificacion />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapToState = (state) => {
  return {
    usuario: state.Usuario,
  };
};
const mapTopActions = (dispatch) => {
  return {
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
    backgroundColor: '#F7F8F9',
    elevation: 0,
  },
  avatar: {
    marginTop: getStatusBarHeight(true) + 10,
    alignSelf: 'center',
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
});
