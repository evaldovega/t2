import Button from 'components/Button';
import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Validator, {Execute} from 'components/Validator';
import Select from 'components/Select';
import NumberFormat from 'react-number-format';
import ZoomIn from 'components/ZoomIn';
import ModalInputPin from './ModalInputPin';
import {
  MARGIN_HORIZONTAL,
  TITULO_TAM,
  COLORS,
  MARGIN_VERTICAL,
} from 'constants';

import Financiacion from './Financiacion';
import {useImmer} from 'use-immer';
import {fetchConfig} from 'utils/Fetch';

const FRECUENCIAS = [
  {key: 1, label: 'Mensual'},
  {key: 2, label: 'Bimestral'},
  {key: 3, label: 'Trimestral'},
  {key: 6, label: 'Semestral'},
  {key: 12, label: 'Anual'},
];

const Finalizar = ({
  navigation,
  cliente,
  plan,
  precio,
  setCurrentTab,
  formularioGeneralRef,
  variacionesRef,
}) => {
  const Validaciones = {};
  let dataToSend = {};

  const [data, setData] = useImmer({
    metodo_pago: '',
    numero_referencia: '',
    archivo_contrato: '',
    frecuencia: '',
    pasarela: '',
    total: 0,
  });

  const [inputPin, setInputPin] = useState(false);

  const visible = navigation.isFocused();

  useEffect(() => {
    if (visible) {
      setCurrentTab('Finalizar');
    }
    if (variacionesRef && variacionesRef.current) {
      console.log('Calcular total ', variacionesRef.current.total());
      setData((draft) => {
        draft.total =
          parseFloat(variacionesRef.current.total()) + parseFloat(precio);
        return draft;
      });
    } else {
      setData((draft) => {
        draft.total = parseFloat(precio);
        return draft;
      });
    }
  }, [visible]);

  const cambioDeDatos = (propiedad, valor) => {
    setData((draft) => {
      draft[propiedad] = valor;
      return draft;
    });
  };

  const {
    metodo_pago,
    frecuencia,
    pasarela,
    numero_referencia,
    archivo_contrato,
  } = data;

  const sendData = async () => {
    const {url, headers} = await fetchConfig();
    fetch(`${url}ordenes/registrar/`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers,
    })
      .then((r) => {
        const statusCode = r.status;
        if (statusCode == 200 || statusCode == 201) {
          return r.json();
        }
        console.log(JSON.stringify(dataToSend));
        console.log(`${url}ordenes/registrar/`);
        console.log(headers);
        throw 'Orden no creada';
      })
      .then((r) => {
        if (r.numero_orden) {
          Alert.alert(
            'Orden ' + r.numero_orden + ' ' + r.estado_orden_str,
            'Datos de subsanación enviados correctamente. Se le notificará cuando sean aprobados.',
          );
        } else {
          throw r.error;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validatePin = () => {
    if (metodo_pago == 'financiacion') {
      setInputPin(true);
    } else {
      sendData();
    }
  };

  const vender = async () => {
    try {
      if (!variacionesRef.current) {
        navigation.navigate('Variaciones');
        return;
      }
      dataToSend = {
        cliente,
        plan,
        frecuencia_pago: frecuencia,
        metodo_pago,
        total_pagado: data.total,
        planes: [],
        formularios: [],
      };

      dataToSend.planes = await variacionesRef.current.valid();

      await Execute(Validaciones).catch((errores) => {
        console.log(errores);
        throw errores.map((error) => error['0']).join('\n');
      });

      if (metodo_pago == 'financiacion') {
        dataToSend.pasarela_financiacion = pasarela;
        dataToSend.numero_referencia = numero_referencia;
        dataToSend.archivo = archivo_contrato;
        dataToSend.total_pagado =
          dataToSend.total_pagado * dataToSend.frecuencia_pago;
      }

      const dataFormularioGeneral = await formularioGeneralRef.current.valid();
      dataToSend.formularios.push(dataFormularioGeneral);
      validatePin();
    } catch (error) {
      console.log(error);
      Alert.alert('Algo anda mal', error.toString());
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: MARGIN_HORIZONTAL,
      }}>
      <ScrollView style={{flex: 1}}>
        {inputPin ? (
          <ModalInputPin customer={cliente} cancel={setInputPin} />
        ) : null}
        <ZoomIn>
          <NumberFormat
            value={data.total}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
            renderText={(nf) => (
              <Text
                style={{
                  fontSize: TITULO_TAM * 1.3,
                  color: COLORS.PRIMARY_COLOR,
                  textAlign: 'center',
                  fontFamily: 'Mont-Bold',
                  marginBottom: MARGIN_VERTICAL * 3,
                }}>
                {nf}
              </Text>
            )}
          />
        </ZoomIn>

        <Select
          marginTop={1}
          placeholder="Seleccione una frecuencia"
          value={frecuencia}
          options={FRECUENCIAS}
          onSelect={(opcion) => cambioDeDatos('frecuencia', opcion.key)}
        />

        <Validator
          value={metodo_pago}
          ref={(r) => (Validaciones['metodo_pago'] = r)}
          required="Seleccione un metodo de pago">
          <Select
            marginTop={1}
            value={metodo_pago}
            placeholder="Metodo pago"
            onSelect={(v) => cambioDeDatos('metodo_pago', v.key)}
            options={[
              {key: 'contado', label: 'Contado'},
              {key: 'financiacion', label: 'Financiación'},
            ]}
          />
        </Validator>

        {metodo_pago == 'financiacion' ? (
          <Financiacion
            {...data}
            cambioDeDatos={cambioDeDatos}
            Validaciones={Validaciones}
          />
        ) : null}

        <Button marginTop={2} title="Vender" onPress={vender} />
      </ScrollView>
    </View>
  );
};

export default Finalizar;
