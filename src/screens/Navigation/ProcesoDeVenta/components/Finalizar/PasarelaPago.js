import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import Select from 'components/Select';
import {fetchConfig} from 'utils/Fetch';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from 'constants';

const PasarelaPago = ({value, selected, disabled}) => {
  const [pasarelas, setPasarelas] = useState([]);

  const load = () => {
    fetchConfig().then((config) => {
      const {url, headers} = config;
      fetch(`${url}config/pasarelas-financiacion/`, {headers: headers})
        .then((response) => response.json())
        .then((data) => {
          console.log('Pasarelas ', data);
          setPasarelas(data);
        });
    });
  };

  const help = () => {
    const link = pasarelas.find((p) => p.id == value).imagen_guia;
    Linking.openURL(link);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Select
        disabled={disabled}
        style={{flex: 1}}
        marginTop={1}
        value={value}
        placeholder={'Seleccione pasarela de pagos'}
        options={pasarelas.map((o) => ({key: o.id, label: o.titulo}))}
        onSelect={(opcion) => {
          selected(opcion.key), console.log('Pasarela seleccionada ', opcion);
        }}
      />
      {value > 0 && (
        <Entypo
          size={24}
          color={COLORS.ACCENT}
          style={{margin: 4}}
          name="help-with-circle"
          onPress={help}
        />
      )}
    </View>
  );
};

export default PasarelaPago;
