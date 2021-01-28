import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {getSharedPreference} from 'utils/SharedPreference';
import {changeProps} from 'redux/actions/Usuario';
import {connect} from 'react-redux';
import {fetchConfig} from 'utils/Fetch';
import {COLORS} from 'constants';
import Presentation from 'screens/ValidateSession/components/Presentation';
import Button from 'components/Button';

const ValidateSession = ({navigation, userChangeProps}) => {
  const [error, setError] = useState(null);
  const [allowStart, setAllowStart] = useState(false);

  const Validate = async () => {
    setAllowStart(false);
    const token = await getSharedPreference('auth-token');
    if (token) {
      const userId = await getSharedPreference('userId');

      fetchConfig().then((config) => {
        const {url, headers} = config;

        fetch(`${url}usuarios/${userId}`, {headers: headers})
          .then((response) => {
            if (response.status != 200) {
              setTimeout(() => {
                userChangeProps({estadoDeSesion: 1});
              });
              throw `Usuario ${userId} no encontrado`;
            }
            return response;
          })
          .then((response) => response.json())
          .then((data) => {
            const {
              user,
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
            userChangeProps({
              token,
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
            });
            setAllowStart(true);
          })
          .catch((error) => {
            console.log(error);
            setError(error.toString());
          });
      });
    } else {
      userChangeProps({estadoDeSesion: 1});
    }
  };

  const Loading = () => {
    return (
      <>
        <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
        {!error && (
          <Text style={{color: COLORS.PRIMARY_COLOR, fontWeight: 'bold'}}>
            Validando datos...
          </Text>
        )}
        {error && (
          <Text style={{color: COLORS.ROJO, fontWeight: 'bold'}}>{error}</Text>
        )}
      </>
    );
  };

  const start = () => {
    userChangeProps({estadoDeSesion: 2});
  };
  useEffect(() => {
    Validate();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Presentation navigation={navigation} />
      <View
        style={{
          flexDirection: 'column',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        {allowStart ? (
          <Button onPress={start} title="Vende ahora" />
        ) : (
          Loading()
        )}
      </View>
    </View>
  );
};

const mapToActions = (dispatch) => {
  return {
    userChangeProps: (props) => {
      dispatch(changeProps(props));
    },
  };
};

export default connect(null, mapToActions)(ValidateSession);
