import React, {memo, useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Animated,
  Easing,
} from 'react-native';
import Input from 'screens/SiginIn/components/Input';
import {Montserrat} from 'utils/fonts';
import LottieView from 'lottie-react-native';
import {Colors, Paragraph, Title} from 'react-native-paper';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {ROUTERS} from 'utils/navigation';
import {SERVER_ADDRESS} from 'constants';
import Loader from 'components/Loader';

import {connect} from 'react-redux';
import {acceder, initUsuario} from 'redux/actions/Usuario';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      u: 'admin',
      k: 'administrador',
      msg: '',
      userborderColor: '#EAE8EA',
      passborderColor: '#EAE8EA',
      errorMsgUser: '',
      errorMsgPass: '',
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }
  componentDidUpdate(prev) {
    if (prev != this.props.logeado && this.props.logeado) {
      this.props.initUsuario();
    }
  }

  onPressSignIn = () => {
    this.setState({
      errorMsgUser: '',
      errorMsgPass: '',
      userborderColor: '#EAE8EA',
      passborderColor: '#EAE8EA',
    });
    if (this.state.u == '') {
      this.setState({userborderColor: 'red', errorMsgUser: 'ERROR'});
      return;
    }
    if (this.state.k == '') {
      this.setState({passborderColor: 'red', errorMsgPass: 'ERROR'});
      return;
    }
    this.props.acceder({
      username: this.state.u,
      password: this.state.k,
    });
  };

  onPressForgot = () => {
    // this.state.navigate(ROUTERS.ForgotPassword);
    this.props.navigation.navigate(ROUTERS.ForgotPassword);
  };

  onPressRegister = () => {
    this.props.navigation.navigate(ROUTERS.SignUp);
  };

  render() {
    return (
      <View style={styles.container}>
        <LottieView
          loop={true}
          style={{width: '60%', alignSelf: 'center'}}
          source={require('../../animations/dinero.json')}
          progress={this.state.progress}
        />

        <Loader loading={this.props.accediendo}></Loader>
        <View
          style={{
            borderTopStartRadius: 24,
            borderTopEndRadius: 24,
            backgroundColor: 'white',
            paddingVertical: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 32,
            }}>
            <Image
              style={styles.logo}
              source={require('utils/images/ISO.png')}></Image>
            <View>
              <Title>Hola</Title>
              <Paragraph>Bienvenido a Servi</Paragraph>
            </View>
          </View>
          <Input
            mt={40}
            pass={false}
            errorMsg={this.state.errorMsgUser}
            borderColor={this.state.userborderColor}
            placeholder={'Usuario'}
            value={this.state.u}
            onChangeText={(t) => this.setState({u: t})}
          />
          <Input
            mt={16}
            pass={true}
            errorMsg={this.state.errorMsgPass}
            borderColor={this.state.passborderColor}
            placeholder={'Contraseña'}
            value={this.state.k}
            onChangeText={(p) => this.setState({k: p})}
          />
          <View style={styles.containerSignIn}>
            <TouchableOpacity
              style={styles.btnSignIn}
              onPress={this.onPressSignIn}>
              <Text style={styles.txtSignIn}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.btnForgot}
            onPress={this.onPressForgot}>
            <Text style={styles.txtForgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.containerOr}>
            <View style={styles.line} />
            <Text style={styles.txtOr}>o</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.btnSignFb}
            onPress={this.onPressRegister}>
            <Text style={styles.txtSignInFb}>Regístrate</Text>
          </TouchableOpacity>
        </View>
        {/*
                <TouchableOpacity style={styles.btnSignInGoogle}>
                    <Text style={styles.txtSignInFb}>Sign In With Google</Text>
                </TouchableOpacity>
                */}
      </View>
    );
  }
}

const mapToState = (state) => {
  return {
    logeado: state.Usuario.logeado,
    accediendo: state.Usuario.accediendo,
  };
};
const mapToActions = (dispatch) => {
  return {
    acceder: (data) => {
      dispatch(acceder(data));
    },
    initUsuario: () => {
      dispatch(initUsuario());
    },
  };
};

export default connect(mapToState, mapToActions)(SignIn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey100,
    justifyContent: 'flex-end',
  },
  containerSignIn: {
    flexDirection: 'row',
    marginHorizontal: 40,
    marginTop: 24,
  },
  btnSignIn: {
    backgroundColor: '#102e4d',
    borderRadius: 24,
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSignIn: {
    fontFamily: Montserrat,
    fontWeight: '600',
    color: '#FFF',
    fontSize: 17,
  },
  btnFaceId: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6979F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  btnForgot: {
    marginTop: 24,
    alignSelf: 'center',
  },
  txtForgot: {
    fontSize: 12,
    color: '#0F4C81',
    fontFamily: Montserrat,
    fontWeight: '500',
  },
  containerOr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 40,
    marginTop: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  txtOr: {
    marginHorizontal: 20,
    fontSize: 16,
    color: '#1A051D',
    fontFamily: Montserrat,
    fontWeight: 'normal',
  },
  btnSignFb: {
    marginHorizontal: 40,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#209a91',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSignInFb: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFF',
  },
  btnSignInGoogle: {
    marginHorizontal: 40,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF647C',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSignUp: {
    alignSelf: 'center',
    marginTop: 10,
  },
  txtSignUp: {
    fontSize: 12,
    color: '#0F4C81',
    fontFamily: Montserrat,
    fontWeight: '500',
  },
});
