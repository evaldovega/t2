import React, {useEffect, useState} from 'react';
import {Modal, View, ActivityIndicator, Alert, Text} from 'react-native';
import Validator, {Execute} from 'components/Validator';
import Button from 'components/Button';
import InputText from 'components/InputText';
import {fetchConfig} from 'utils/Fetch';

const ModalInputPin = ({customer, cancel, onConfirm}) => {
  const [loading, setLoading] = useState(false);
  const [msn, setMsn] = useState('');

  const requestPin = async () => {
    setMsn('Enviando PIN');
    console.log('Send PIN to ', customer);
    setLoading(true);
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
        setTimeout(() => {
          Alert.alert(
            'No se envio el PIN',
            'Intetentelo nuevamente',
            [
              {
                title: 'Ok',
                onPress: () => cancel(false),
              },
            ],
            {cancelable: false},
          );
        }, 500);
        cancel(false);
      });
  };

  const validate = async () => {
    try {
      setLoading(true);
      const {url, headers} = fetchConfig();
      fetch(`${url}`)
        .then((r) => r.json())
        .then((r) => {});
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPin();
  }, []);

  return (
    <Modal
      animationType="slide"
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
            height: '20%',
            backgroundColor: '#fff',
            borderRadius: 16,
            justifyContent: 'center',
            padding: 24,
          }}>
          {!loading && (
            <View style={{justifyContent: 'center'}}>
              <InputText placeholder="Ingrese el PIN recibido" />
              <Button marginTop={2} title="Validar" onPress={validate} />

              <Button
                marginTop={4}
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
