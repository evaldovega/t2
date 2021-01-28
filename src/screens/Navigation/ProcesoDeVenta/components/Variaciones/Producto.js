import React, {useEffect, useRef, useState, useImperativeHandle} from 'react';
import {View, Text, ScrollView, Switch} from 'react-native';
import {MARGIN_HORIZONTAL, COLORS, TITULO_TAM} from 'constants';
import {useImmer} from 'use-immer';
import Variacion from './Variacion';
import Variaciones from '.';

const Producto = React.forwardRef(({data, datosPrecargados}, ref) => {
  const {id, titulo, requerido, variaciones} = data;
  const [seleccionado, setSeleccionado] = useState(false);
  //const variacionesRef = useRef([]);
  const variacionesRef = {};

  const valid = async () => {
    try {
      const variacionesValidas = [];

      Object.keys(variacionesRef).forEach((key) => {
        variacionesValidas.push(variacionesRef[key].valid());
      });
      const variaciones = await Promise.all(variacionesValidas);

      return {id, variaciones, formularios: []};
    } catch (errores) {
      throw errores;
    }
  };

  const obtenerDatosPrecargadosVariacion = (variacionId) => {
    if (datosPrecargados) {
      return datosPrecargados.variaciones.find(
        (v) => v.variacion == variacionId,
      );
    }
    return null;
  };

  useImperativeHandle(
    ref,
    () => ({
      valid: () => valid(),
      seleccionado,
      total: () => {
        let total = 0;
        Object.keys(variacionesRef).forEach((key) => {
          total += variacionesRef[key].total();
        });
        return total;
      },
    }),
    [seleccionado],
  );

  useEffect(() => {
    if (requerido === true) {
      setSeleccionado(true);
    }
  }, [requerido]);

  return (
    <View style={{paddingHorizontal: MARGIN_HORIZONTAL}}>
      <View
        key={id}
        style={{
          paddingVertical: MARGIN_HORIZONTAL,
          borderTopWidth: 0.3,
          borderColor: '#EAE8EA',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              flex: 1,
              color: COLORS.NEGRO,
              fontSize: TITULO_TAM * 0.7,
              marginBottom: 16,
              fontFamily: 'Mont-Bold',
            }}>
            {titulo} {id}
          </Text>
          <Switch
            value={seleccionado}
            onValueChange={(v) => setSeleccionado(v)}
          />
        </View>
      </View>
      {seleccionado
        ? variaciones.map((v, i) => {
            return (
              <Variacion
                producto={titulo}
                key={i}
                ref={(r) => (variacionesRef[i] = r)}
                data={v}
                datosPrecargados={obtenerDatosPrecargadosVariacion(v.id)}
              />
            );
          })
        : null}
    </View>
  );
});

export default Producto;
