import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SERVER_ADDRESS, CURVA} from 'constants';
import {Text, TouchableOpacity} from 'react-native';
var {FBLoginManager} = require('react-native-facebook-login');
import {setSharedPreference} from 'utils/SharedPreference';
import {connect} from 'react-redux';
import {changeProps} from 'redux/actions/Usuario';

const FBLoginButton = ({userChangeProps}) => {
  const navigation = useNavigation();

  const login = (fb) => {
    console.log(`${SERVER_ADDRESS}api/login/`);
    fetch(`${SERVER_ADDRESS}api/login/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({username: fb.email, social_user_id: fb.id}),
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
        await setSharedPreference('userId', '' + data.id);
        await setSharedPreference('auth-token', token);
        userChangeProps({estadoDeSesion: 0});
      })
      .catch((e) => {
        console.log(e);
        if (e.errors) {
          navigation.push('SignUp', {social: fb});
        }
      });
  };

  const initUser = (token) => {
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name,first_name,last_name,birthday,friends&access_token=' +
        token,
    )
      .then((response) => response.json())
      .then((json) => {
        login(json);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signIn = () => {
    FBLoginManager.loginWithPermissions(['email', 'user_friends'], function (
      error,
      data,
    ) {
      if (!error) {
        initUser(data.credentials.token);
      } else {
        console.log('Error: ', error);
      }
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={signIn}
        style={{
          width: '100%',
          alignSelf: 'center',
          backgroundColor: '#2874A6',
          height: 32,
          borderRadius: CURVA,
          marginTop: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: '#ffff', textAlign: 'center'}}>
          Acceder con Facebook
        </Text>
      </TouchableOpacity>
    </>
  );
};

const mapToActions = (dispatch) => {
  return {
    userChangeProps: (props) => {
      dispatch(changeProps(props));
    },
  };
};
export default connect(null, mapToActions)(FBLoginButton);
