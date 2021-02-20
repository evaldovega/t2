import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {getSharedPreference} from 'utils/SharedPreference';
import {changeProps} from 'redux/actions/Usuario';
import {connect} from 'react-redux';
import {fetchConfig} from 'utils/Fetch';
import {COLORS} from 'constants';
import Presentation from 'screens/ValidateSession/components/Presentation';
import Button from 'components/Button';

const TEXT = ['Siguiente', 'Siguiente', 'Vende ya'];

const ValidateSession = ({navigation, userChangeProps}) => {
  const [error, setError] = useState(null);
  const [allowStart, setAllowStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indexActive, setIndexActive] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const Validate = async () => {
    setAllowStart(false);
    const token = await getSharedPreference('auth-token');
    if (token) {
      const userId = await getSharedPreference('userId');
      setLoading(true);
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
              id,
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
              no_clientes,
              no_ventas,
              ganancias,
            } = data;
            setLoading(false);
            userChangeProps({
              token,
              id,
              userId: user.id,
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
              no_clientes,
              no_ventas,
              ganancias,
            });
            setAllowStart(true);
            userChangeProps({estadoDeSesion: 2});
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
            setError(error.toString());
          });
      });
    }
  };

  const Loading = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Modal visible={true} animationType="slide">
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
            {!error && (
              <Text
                style={{
                  color: COLORS.PRIMARY_COLOR,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Validando datos...
              </Text>
            )}
            {error && (
              <Text style={{color: COLORS.ROJO, fontWeight: 'bold'}}>
                {error}
              </Text>
            )}
          </View>
        </Modal>
      </View>
    );
  };

  const start = () => {
    if (allowStart) {
      userChangeProps({estadoDeSesion: 2});
    } else {
      userChangeProps({estadoDeSesion: 1});
    }
  };

  const next = () => {
    if (indexActive + 1 < 3) {
      setIndexActive(indexActive + 1);
    } else {
      start();
    }
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
      <Presentation
        indexActive={indexActive}
        setIndexActive={setIndexActive}
        navigation={navigation}
      />

      <View
        style={{
          flexDirection: 'column',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: 16,
          marginBottom: 16,
        }}>
        <Button
          title={TEXT[indexActive]}
          onPress={next}
          style={{marginBottom: 16}}
        />

        {allowStart && (
          <TouchableOpacity onPress={start}>
            <Text>Saltar</Text>
          </TouchableOpacity>
        )}
        {loading && Loading()}
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
