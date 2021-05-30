import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import Validator, {Execute} from 'components/Validator';
import Button from 'components/Button';
import InputText from 'components/InputText';
import {fetchConfig} from 'utils/Fetch';
import {COLORS} from 'constants';
import SvgClose from 'svgs/forgotPass/SvgClose';

const ModalInputPin = ({customer, cancel, onConfirm}) => {
  const [loading, setLoading] = useState(false);
  const [msn, setMsn] = useState('');
  const [pin, setPin] = useState('');
  const Validations = {};

  const showAlert = (title, message, onPress) => {
    setTimeout(() => {
      Alert.alert(
        title,
        message,
        [
          {
            title: 'Ok',
            onPress: onPress,
          },
        ],
        {cancelable: false},
      );
    }, 500);
  };

  const requestPin = () => {
    setMsn('Enviando PIN al cliente');
    setLoading(true);

    setTimeout(async () => {
      const {url, headers} = await fetchConfig();
      fetch(`${url}ordentoken/`, {
        headers,
        method: 'POST',
        body: JSON.stringify({id_cliente: customer}),
      })
        .then((r) => {
          if (r.status == 200 || r.status == 201) {
            setLoading(false);
          } else {
            throw 'error';
          }
        })
        .catch((error) => {
          setLoading(false);
          showAlert(
            'No se envio el PIN',
            'Intetentelo nuevamente',
            () => cancel,
          );
        });
    }, 2000);
  };

  const validate = async () => {
    try {
      Execute(Validations).then(async () => {
        setMsn('Validando...');
        setLoading(true);
        const {url, headers} = await fetchConfig();
        console.log(`${url}ordertoken/validate/`);
        fetch(`${url}ordentoken/validate/`, {
          method: 'POST',
          body: JSON.stringify({token: pin}),
          headers,
        })
          .then((r) => {
            console.log(r);
            return r;
          })
          .then((r) => r.json())
          .then((r) => {
            console.log(r);
            switch (r.status) {
              case 'OK':
                onConfirm();
                cancel(false);
                break;
              case 'novalido':
                showAlert('PIN no valido', 'Intetentelo nuevamente', () =>
                  cancel(false),
                );
                break;
              case 'expired':
                showAlert('PIN vencido', 'Intetentelo nuevamente', () =>
                  cancel(false),
                );
                break;
              case 'used':
                showAlert('PIN usado', 'Intetentelo nuevamente', () =>
                  cancel(false),
                );
                break;
              default:
                showAlert(
                  'No se pudo validar en PIN',
                  'Intetentelo nuevamente',
                  () => cancel(false),
                );
                break;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPin();
  }, []);

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={true}
      onRequestClose={() => {}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.4)',
          justifyContent: 'center',
          padding: 64,
        }}>
        <View
          style={{
            backgroundColor: '#ffff',
            borderRadius: 16,
            justifyContent: 'center',
            padding: 24,
          }}>
          {!loading && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                <TouchableOpacity onPress={() => cancel(false)}>
                  <SvgClose />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    flex: 1,
                    fontFamily: 'Mont-Bold',
                  }}>
                  Validar cliente
                </Text>
              </View>
              <Validator
                value={pin}
                ref={(r) => (Validations['a'] = r)}
                required="Ingrese el PIN enviado al cliente!">
                <InputText
                  value={pin}
                  onChangeText={(t) => setPin(t)}
                  placeholder="Ingrese el PIN..."
                />
              </Validator>

              <Button marginTop={2} title="Validar" onPress={validate} />

              <Text
                style={{
                  fontSize: 14,
                  marginTop: 24,
                  color: COLORS.ACCENT,
                  textAlign: 'center',
                }}>
                El cliente no ha recibido el PIN?
              </Text>
              <Button
                style={{backgroundColor: '#ffff'}}
                style_text={{
                  color: COLORS.ACCENT,
                  textDecorationLine: 'underline',
                }}
                title="Volver a enviar"
                onPress={requestPin}
              />
            </View>
          )}

          {loading && (
            <View style={{justifyContent: 'center'}}>
              <Text style={{textAlign: 'center', marginBottom: 8}}>{msn}</Text>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalInputPin;
