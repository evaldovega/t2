import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Easing,
  ScrollView,
} from 'react-native';
import Input from 'screens/SiginIn/components/Input';
import ColorfullContianer from 'components/ColorfullContainer';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Validator, {Execute} from 'components/Validator';

import {ROUTERS} from 'utils/navigation';
import {SERVER_ADDRESS, COLORS} from 'constants';
import Loader from 'components/Loader';
import {connect} from 'react-redux';
import {acceder, initUsuario} from 'redux/actions/Usuario';

const {width, height} = Dimensions.get('screen');
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      u: '',
      k: '',
      msg: '',
      userborderColor: '#EAE8EA',
      passborderColor: '#EAE8EA',
      errorMsgUser: '',
      errorMsgPass: '',
      progress: new Animated.Value(0),
    };
    this.Validations = {};
  }

  componentDidUpdate(prev) {
    if (prev != this.props.logeado && this.props.logeado) {
      this.props.initUsuario();
    }
    if (prev.error == '' && this.props.error != '') {
      setTimeout(() => {
        Alert.alert('Error', this.props.error);
      }, 400);
    }
  }

  onPressSignIn = () => {
    Execute(this.Validations).then(() => {
      this.props.acceder({
        username: this.state.u,
        password: this.state.k,
      });
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
      <KeyboardAvoidingView style={{flex: 1}}>
        <ColorfullContianer style={{flex: 1, justifyContent: 'center'}}>
          <Loader loading={this.props.accediendo}></Loader>

          <ScrollView>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 16,
                marginTop: 24,
                marginBottom: 24,
              }}>
              <Image
                style={{
                  width: 150,
                  height: 150,
                  alignSelf: 'center',
                }}
                resizeMode="contain"
                source={require('utils/images/logo_black.png')}
              />
              <View style={{marginBottom: '16%'}}>
                <Text
                  style={{
                    fontSize: 30,
                    color: COLORS.VERDE,
                    fontFamily: 'Mont-Bold',
                  }}>
                  Hola
                </Text>
                <Text
                  style={{
                    fontSize: 30,
                    color: COLORS.NEGRO,
                    fontFamily: 'Mont-Bold',
                  }}>
                  Bienvenido a Servi
                </Text>
              </View>

              <InputText
                placeholder="Correo electrónico"
                onChangeText={(t) => this.setState({u: t})}
                value={this.state.u}
              />
              <Validator
                ref={(r) => (this.Validations['a'] = r)}
                required
                value={this.state.u}></Validator>

              <InputText
                marginTop={1}
                password
                placeholder={'Contraseña'}
                value={this.state.k}
                onChangeText={(p) => this.setState({k: p})}
              />
              <Validator
                ref={(r) => (this.Validations['b'] = r)}
                required
                value={this.state.k}></Validator>
              <Button
                onPress={this.onPressSignIn}
                marginTop={1}
                title="Iniciar sesión"
              />

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

              <Button
                title="Regístrate"
                color="morado"
                onPress={this.onPressRegister}
              />
            </View>
          </ScrollView>
        </ColorfullContianer>
      </KeyboardAvoidingView>
    );
  }
}

const mapToState = (state) => {
  return {
    logeado: state.Usuario.logeado,
    accediendo: state.Usuario.accediendo,
    error: state.Usuario.error,
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
    justifyContent: 'center',
  },
  btnSignIn: {
    width: '100%',
    backgroundColor: COLORS.VERDE,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSignIn: {
    fontFamily: 'Mont-Regular',
    color: COLORS.BLANCO,
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
    height: 0.5,
    backgroundColor: COLORS.TEXT,
    marginVertical: '8%',
  },
  txtOr: {
    marginHorizontal: 20,
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: 'normal',
  },
  btnSignFb: {
    backgroundColor: COLORS.MORADO,
    borderRadius: 8,
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSignInFb: {
    fontFamily: 'Mont-Regular',
    fontSize: 17,
    color: COLORS.BLANCO,
  },
  btnSignUp: {
    alignSelf: 'center',
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 80,
    alignSelf: 'center',
    marginTop: 64,
  },
});
