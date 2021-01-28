import React, {useState} from 'react';
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
import ColorfullContianer from 'components/ColorfullContainer';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Validator, {Execute} from 'components/Validator';
import {SERVER_ADDRESS, COLORS} from 'constants';
import Loader from 'components/Loader';
import {connect} from 'react-redux';
import {changeProps} from 'redux/actions/Usuario';
import {fetchErrors} from 'utils/Fetch';
import {setSharedPreference} from 'utils/SharedPreference';

const SignIn = ({navigation, userChangeProps}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const Validations = {};

  const login = () => {
    setLoading(true);
    fetch(`${SERVER_ADDRESS}api/login/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    })
      .then((response) => {
        if (response.status != 200 && response.status != 201) {
          throw {errors: response.json()};
        } else {
          return response.json();
        }
      })
      .then(async (response) => {
        const {data, token} = response;

        console.log(JSON.stringify(data));

        const {
          user,
          id,
          email,
          foto_perfil,
          habilitado,
          contrato_aprobado,
          numero_whatsapp,
          fecha_nacimiento,
          foto_documento_cara1,
          foto_documento_cara2,
          banco,
          tipo_cuenta,
          numero_cuenta,
        } = data;

        await setSharedPreference('userId', '' + id);

        await setSharedPreference('auth-token', token);

        userChangeProps({
          token,
          id,
          nombre: user.first_name,
          apellidos: user.last_name,
          habilitado,
          contrato_aprobado,
          foto_perfil,
          email,
          cel: numero_whatsapp,
          fecha_nacimiento,
          ide_foto_frente: foto_documento_cara1,
          ide_foto_respaldo: foto_documento_cara2,
          banco,
          numero_cuenta,
          tipo_cuenta,
          estadoDeSesion: 2,
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);

        setTimeout(() => {
          if (e.errors) {
            e.errors.then((errors) => {
              Alert.alert('Algo anda mal', fetchErrors(errors));
            });
          } else {
            Alert.alert('Algo anda mal', e.toString());
          }
        }, 500);
      });
  };

  const onPressSignIn = () => {
    Execute(Validations)
      .then(() => {
        login();
      })
      .catch((error) => {});
  };

  const onPressForgot = () => {
    navigation.navigate('ForgotPassword');
  };

  const onPressRegister = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ColorfullContianer style={{flex: 1, justifyContent: 'center'}}>
        <Loader loading={loading}></Loader>

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
            <View style={{marginBottom: '10%'}}>
              <Text
                style={{
                  fontSize: 40,
                  color: COLORS.VERDE,
                  fontWeight: 'bold',
                  fontFamily: 'Mont-Bold',
                }}>
                Hola
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: COLORS.NEGRO,
                  fontFamily: 'Mont-Bold',
                }}>
                Bienvenido a Servi
              </Text>
            </View>

            <InputText
              placeholder="Nombre de usuario"
              onChangeText={(t) => setUsername(t)}
              value={username}
            />
            <Validator
              ref={(r) => (Validations['a'] = r)}
              required
              value={username}></Validator>

            <InputText
              marginTop={1}
              password
              placeholder={'Contraseña'}
              value={password}
              onChangeText={(p) => setPassword(p)}
            />
            <Validator
              ref={(r) => (Validations['b'] = r)}
              required
              value={password}></Validator>
            <Button
              onPress={onPressSignIn}
              marginTop={1}
              title="Iniciar sesión"
            />

            <TouchableOpacity style={styles.btnForgot} onPress={onPressForgot}>
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
              onPress={onPressRegister}
            />
          </View>
        </ScrollView>
      </ColorfullContianer>
    </KeyboardAvoidingView>
  );
};

const mapToActions = (dispatch) => {
  return {
    userChangeProps: (props) => {
      dispatch(changeProps(props));
    },
  };
};

export default connect(null, mapToActions)(SignIn);

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
