import Button from 'components/Button';
import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Validator, {Execute} from 'components/Validator';
import Select from 'components/Select';
import NumberFormat from 'react-number-format';
import ZoomIn from 'components/ZoomIn';
import ModalInputPin from './ModalInputPin';
import usePrevious from 'utils/usePrevius';
import {
  MARGIN_HORIZONTAL,
  TITULO_TAM,
  COLORS,
  MARGIN_VERTICAL,
} from 'constants';

import Financiacion from './Financiacion';
import {useImmer} from 'use-immer';
import {fetchConfig} from 'utils/Fetch';
import ColorfullContainer from 'components/ColorfullContainer';

const FRECUENCIAS = [
  {key: 1, label: 'Mensual'},
  {key: 2, label: 'Bimestral'},
  {key: 3, label: 'Trimestral'},
  {key: 6, label: 'Semestral'},
  {key: 12, label: 'Anual'},
];

const Finalizar = ({
  navigation,
  cliente: clienteId,
  plan,
  planes,
  precio,
  setCurrentTab,
  formularioGeneralRef,
  variacionesRef,
  order,
  orderId,
}) => {
  const Validaciones = {};

  const [data, setData] = useImmer({
    cliente: clienteId,
    metodo_pago: '',
    numero_referencia: '',
    archivo_contrato: '',
    frecuencia: '',
    pasarela: '',
    total: 0,
  });

  const [inputPin, setInputPin] = useState(false);
  const [needPIN, setNeedPIN] = useState(false);

  const previusNeedPIN = usePrevious(needPIN);
  const previusCustomer = usePrevious(data.cliente);
  const [firstLoad, setFirstLoad] = useState(true);

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

  useEffect(() => {
    if (order) {
      setData((draft) => {
        draft.metodo_pago = order.metodo_pago;
        draft.frecuencia = order.frecuencia_pago;
      });
    }
  }, [order]);

  const cambioDeDatos = (propiedad, valor) => {
    setData((draft) => {
      draft[propiedad] = valor;
      return draft;
    });
  };

  const {
    cliente,
    metodo_pago,
    frecuencia,
    pasarela,
    numero_referencia,
    archivo_contrato,
  } = data;

  const customerSelected = (customer) => {
    const {id} = customer;
    setData((draft) => {
      draft.cliente = id;
      return draft;
    });
  };

  const validPIN = () => {
    setNeedPIN(false);
  };

  const vender = async () => {
    try {
      if (!variacionesRef.current && planes > 0) {
        navigation.navigate('Variaciones');
        return;
      }
      let dataToSend = {
        cliente,
        plan,
        frecuencia_pago: frecuencia,
        metodo_pago,
        total_pagado: data.total,
        planes: [],
        formularios: [],
      };

      if (planes > 0) {
        dataToSend.planes = await variacionesRef.current.valid();
      } else {
        dataToSend.planes = [];
      }

      await Execute(Validaciones).catch((errores) => {
        console.log(errores);
        throw errores.map((error) => error['0']).join('\n');
      });

      dataToSend.total_pagado =
        dataToSend.total_pagado * dataToSend.frecuencia_pago;

      if (metodo_pago == 'financiacion') {
        dataToSend.pasarela_financiacion = pasarela;
        dataToSend.numero_referencia = numero_referencia;
        dataToSend.archivo = archivo_contrato;
      }

      const dataFormularioGeneral = await formularioGeneralRef.current.valid();

      dataToSend.formularios.push(dataFormularioGeneral);

      if (!cliente) {
        navigation.push('ClienteSelector', {seleccionar: customerSelected});
        return;
      }

      if (needPIN) {
        setInputPin(true);
        return;
      }

      const {url, headers} = await fetchConfig();
      if (orderId) {
        dataToSend.orden = orderId;
      }

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
              'Se le notificará cuando sea aprobada.',
              [
                {
                  title: 'Ok',
                  onPress: () => {
                    navigation.navigate('Negocios', {forceReload: true});
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            throw r.error;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      Alert.alert('Algo anda mal', error.toString());
    }
  };

  useEffect(() => {
    if (previusNeedPIN && !needPIN) {
      console.log('PIN validado');
      vender();
    }
  }, [needPIN]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      if (!previusCustomer && data.cliente && data.cliente != '') {
        console.log('Customer selected');
        vender();
      }
    }
  }, [data.cliente]);

  const totalPagado =
    data.frecuencia != '' ? data.total * data.frecuencia : data.total;

  return (
    <ColorfullContainer style={{flex: 1, backgroundColor: '#ffff'}}>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            paddingHorizontal: MARGIN_HORIZONTAL,
          }}>
          {inputPin ? (
            <ModalInputPin
              customer={cliente}
              cancel={setInputPin}
              onConfirm={validPIN}
            />
          ) : null}
          <ZoomIn>
            <NumberFormat
              value={totalPagado}
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
                    marginTop: MARGIN_VERTICAL * 3,
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
              onSelect={(v) => {
                if (v.key == 'financiacion') {
                  setNeedPIN(true);
                } else {
                  setNeedPIN(false);
                }
                cambioDeDatos('metodo_pago', v.key);
              }}
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
        </View>
      </ScrollView>
      <Button title={orderId ? 'Subsanar' : 'Vender'} onPress={vender} />
    </ColorfullContainer>
  );
};

export default Finalizar;
