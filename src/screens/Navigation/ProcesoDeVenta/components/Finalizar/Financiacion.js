import React from 'react';
import {Text, View, Linking} from 'react-native';
import Validator from 'components/Validator';
import InputText from 'components/InputText';
import FileSelector from 'components/FileSelector';
import Select from 'components/Select';
import PasarelaPago from './PasarelaPago';
import {MARGIN_VERTICAL} from 'constants';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Financiacion = ({
  archivo_contrato,
  numero_referencia,
  pasarela,
  documentacion_adicional,
  Validaciones,
  cambioDeDatos,
  orderId,
}) => {
  return (
    <>
      <FileSelector
        disabled={orderId ? true : false}
        marginTop={1}
        onSelect={(doc) => cambioDeDatos('archivo_contrato', doc)}
      />
      {!documentacion_adicional ? (
        <Validator
          ref={(r) => (Validaciones['archivo_contrato'] = r)}
          value={archivo_contrato}
          required="Seleccione un archivo de servicio público"></Validator>
      ) : (
        <TouchableOpacity
          onPress={() => Linking.openURL(documentacion_adicional)}>
          <Text
            style={{
              fontFamily: 'Mont-regular',
              textAlign: 'center',
              marginVertical: MARGIN_VERTICAL,
            }}>
            Ya haz subido un archivo. VER
          </Text>
        </TouchableOpacity>
      )}

      <PasarelaPago
        value={pasarela}
        disabled={orderId ? true : false}
        selected={(p) => cambioDeDatos('pasarela', p)}
      />

      <Validator
        ref={(r) => (Validaciones['numero_referencia'] = r)}
        value={numero_referencia}
        required="Ingrese el número de contrato con la entidad">
        <InputText
          marginTop={1}
          disabled={orderId ? true : false}
          label="Número de referencia"
          placeholder="Número de ref"
          marginTop={2}
          value={numero_referencia}
          onChangeText={(t) => cambioDeDatos('numero_referencia', t)}
        />
      </Validator>
    </>
  );
};

export default Financiacion;
