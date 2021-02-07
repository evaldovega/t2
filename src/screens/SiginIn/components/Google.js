import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, TouchableOpacity} from 'react-native';
import {CURVA, SERVER_ADDRESS} from 'constants';
import {setSharedPreference} from 'utils/SharedPreference';
import {connect} from 'react-redux';
import {changeProps} from 'redux/actions/Usuario';

const Google = ({userChangeProps}) => {
  const navigation = useNavigation();

  const login = (social) => {
    fetch(`${SERVER_ADDRESS}api/login/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: social.user.email,
        social_user_id: social.user.id,
      }),
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
          navigation.push('SignUp', {
            social: {
              email: social.user.email,
              first_name: social.user.givenName,
              last_name: social.user.familyName,
              id: social.user.id,
            },
          });
        }
      });
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      login(userInfo);
    } catch (err) {
      console.error('play services are not available');
    }
  };

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  return (
    <TouchableOpacity
      onPress={signIn}
      style={{
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#C0392B',
        padding: 16,
        borderRadius: CURVA,
        marginTop: 16,
      }}>
      <Text style={{color: '#ffff', textAlign: 'center'}}>
        Acceder con Google
      </Text>
    </TouchableOpacity>
  );
};

const mapToActions = (dispatch) => {
  return {
    userChangeProps: (props) => {
      dispatch(changeProps(props));
    },
  };
};
export default connect(null, mapToActions)(Google);
