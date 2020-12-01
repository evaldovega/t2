import React, {memo, useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
} from 'react-native';
import Input from 'screens/SiginIn/components/Input';
import {Montserrat} from 'utils/fonts';
import LottieView from 'lottie-react-native';
import {Colors, Paragraph, Title} from 'react-native-paper';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {ROUTERS} from 'utils/navigation';
import {SERVER_ADDRESS, COLORS} from 'constants';
import Loader from 'components/Loader';

import LinearGradient from 'react-native-linear-gradient';
import {Shadow, Neomorph} from 'react-native-neomorph-shadows';

import {connect} from 'react-redux';
import {acceder, initUsuario} from 'redux/actions/Usuario';

const {width, height} = Dimensions.get('screen');
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

  componentDidMount() {}
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
      <LinearGradient
        colors={['#ffff', '#C2C4C7']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Loader loading={this.props.accediendo}></Loader>

        <Neomorph
          darkShadowColor={COLORS.ACCENT}
          lightShadowColor={COLORS.PRIMARY_COLOR}
          swapShadows
          style={{
            shadowOpacity: 0.1,
            shadowRadius: 15,
            backgroundColor: '#F7F7F7',
            width: width * 0.8,
            height: height * 0.75,
            borderRadius: 72,
          }}>
          <Image
            style={{
              width: 100,
              height: 100,
              position: 'absolute',
              left: width * 0.4 - 50,
              top: -42,
            }}
            resizeMode="contain"
            source={require('utils/images/icon.png')}
          />

          <Input
            mt={70}
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

          <Image
            source={require('utils/images/logo_black.png')}
            style={{width: 100, height: 50, alignSelf: 'center', marginTop: 32}}
            resizeMode="contain"
          />
        </Neomorph>
      </LinearGradient>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSignIn: {
    flexDirection: 'row',
    marginHorizontal: 40,
    marginTop: 24,
  },
  btnSignIn: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 64,
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  txtSignIn: {
    fontFamily: 'Roboto-Light',
    color: '#FFF',
    fontSize: 17,
  },
  btnForgot: {
    marginTop: 24,
    alignSelf: 'center',
  },
  txtForgot: {
    fontSize: 12,
    color: '#0F4C81',
    fontFamily: 'Roboto-Light',
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
    backgroundColor: COLORS.TEXT,
  },
  txtOr: {
    marginHorizontal: 20,
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: 'normal',
  },
  btnSignFb: {
    marginHorizontal: 40,
    height: 48,
    borderRadius: 64,
    backgroundColor: COLORS.PRIMARY_COLOR,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  txtSignInFb: {
    fontFamily: 'Roboto-Light',
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
  logo: {
    width: 100,
    height: 80,
    alignSelf: 'center',
    marginTop: 64,
  },
});
