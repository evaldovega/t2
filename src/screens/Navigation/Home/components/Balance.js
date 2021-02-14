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

import {fetchConfig} from 'utils/Fetch';

const Balance = (props) => {
  const [total, setTotal] = useState(0);
  const [cargando, setCargado] = useState(false);

  const sum = (acomulado, item) => {
    return acomulado + item.valor;
  };

  const load = async () => {
    const {url, headers} = await fetchConfig();
    setCargado(true);
    const fi = moment().startOf('month').format('YYYY-MM-DD');
    const ff = moment().endOf('month').format('YYYY-MM-DD');
    fetch(`${url}api/usuarios/comisiones/?fi=${fi}&ff=${ff}`, {
      headers,
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        const t = r.reduce(sum, 0);
        setTotal(t);
        setCargado(false);
      })
      .catch((error) => {
        console.log(error);
        setCargado(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (props.refresh) {
      console.log('refresh...');
      load();
    }
  }, [props.refresh]);

  return (
    <View style={styles.containerChart}>
      <Text style={{fontFamily: 'Mont-Bold', fontSize: 18}}>
        Ingresos {cargando ? 'Cargando...' : ''}
      </Text>
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
