import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native';
import NumberFormat from 'react-number-format';
import {
  SERVER_ADDRESS,
  MARGIN_VERTICAL,
  CURVA,
  MARGIN_HORIZONTAL,
  COLORS,
} from 'constants';
import moment from 'moment';

const Balance = (props) => {
  const [total, setTotal] = useState(0);
  const [cargando, setCargado] = useState(false);

  const sum = (acomulado, item) => {
    return acomulado + item.valor;
  };
  useEffect(() => {
    if (props.id && props.token) {
      setCargado(true);
      try {
        const fi = moment().startOf('month').format('YYYY-MM-DD');
        const ff = moment().endOf('month').format('YYYY-MM-DD');
        fetch(SERVER_ADDRESS + `api/usuarios/comisiones/?fi=${fi}&ff=${ff}`, {
          headers: {
            Authorization: 'Token ' + props.token,
            Accept: 'application/json',
            'content-type': 'application/json',
          },
        })
          .then((r) => r.json())
          .then((r) => {
            console.log(r);
            const t = r.reduce(sum, 0);
            setTotal(t);
            setCargado(false);
          });
      } catch (error) {
        setCargado(false);
      }
    }
  }, [props.id, props.token]);
  return (
    <View style={styles.containerChart}>
      <Text style={{fontFamily: 'Mont-Bold', fontSize: 18}}>Ingresos</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <NumberFormat
          value={total}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
          renderText={(v) => (
            <Text
              style={{
                fontFamily: 'Mont-Bold',
                fontSize: 32,
                color: COLORS.VERDE,
              }}>
              {v}
            </Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerChart: {
    marginTop: MARGIN_VERTICAL * 3,
    borderRadius: CURVA,
    paddingTop: MARGIN_VERTICAL,
    marginBottom: MARGIN_HORIZONTAL,
  },
});

export default Balance;
