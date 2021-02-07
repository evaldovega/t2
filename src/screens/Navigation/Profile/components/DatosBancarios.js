import React, {useEffect, useState} from 'react';
import {Text, Alert} from 'react-native';
import {
  COLORS,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import Select from 'components/Select';
import InputText from 'components/InputText';
import Validator, {Execute} from 'components/Validator';
import Button from 'components/Button';
import {fetchConfig} from 'utils/Fetch';

const DatosBancarios = ({user}) => {
  const [bancos, setBancos] = useState([]);
  const [tipoCuentas, setTipoCuentas] = useState([
    {key: 'ahorros', label: 'Ahorros'},
    {key: 'corriente', label: 'Corriente'},
  ]);

  const [data, setData] = useState({
    banco: user.banco,
    tipo_cuenta: user.tipo_cuenta,
    numero_cuenta: user.numero_cuenta,
  });

  const Validaciones = {};

  const cargarBancos = async () => {
    const {url, headers} = await fetchConfig();
    fetch(`${url}config/bancos/`, {headers})
      .then((r) => r.json())
      .then((data) => {
        setBancos(data.map((banco) => ({key: banco.id, label: banco.titulo})));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Guardar = () => {
    Execute(Validaciones)
      .then(async () => {
        const {url, headers} = await fetchConfig();
        const body = JSON.stringify(data);
        console.log(body);
        fetch(`${url}usuarios/editar/`, {method: 'PUT', headers, body})
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            Alert.alert('Datos bancarios actualizados', '');
          });
      })
      .catch((error) => {});
  };

  useEffect(() => {
    cargarBancos();
  }, []);

  return (
    <>
      <Text
        style={{
          color: COLORS.NEGRO,
          marginTop: MARGIN_VERTICAL * 3,
          fontFamily: 'Mont-Bold',
          fontSize: TITULO_TAM * 0.7,
        }}>
        Datos Bancarios
      </Text>

      <Select
        value={data.banco}
        options={bancos}
        marginTop={1}
        placeholder="Seleccione un banco"
        options={bancos}
        onSelect={(option) => setData({...data, ...{banco: option.key}})}
      />
      <Validator
        ref={(r) => (Validaciones['a'] = r)}
        required
        value={data.banco}
      />
      <Select
        value={data.tipo_cuenta}
        onSelect={(option) => setData({...data, ...{tipo_cuenta: option.key}})}
        options={tipoCuentas}
        marginTop={1}
        placeholder="Seleccione un tipo de cuenta"
      />
      <Validator
        ref={(r) => (Validaciones['b'] = r)}
        required
        value={data.tipo_cuenta}
      />
      <InputText
        input={{keyboardType: 'number-pad'}}
        value={data.numero_cuenta}
        onChangeText={(input) => setData({...data, ...{numero_cuenta: input}})}
        marginTop={1}
        placeholder="Número de cuenta"
      />
      <Validator
        ref={(r) => (Validaciones['c'] = r)}
        required
        value={data.numero_cuenta}
      />

      <Button marginTop={1} title="Guardar" onPress={Guardar} />
    </>
  );
};

export default DatosBancarios;
