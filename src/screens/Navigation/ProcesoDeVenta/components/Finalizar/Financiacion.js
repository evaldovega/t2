import React from 'react';
import {Text, View} from 'react-native';
import Validator from 'components/Validator';
import InputText from 'components/InputText';
import FileSelector from 'components/FileSelector';
import Select from 'components/Select';
import PasarelaPago from './PasarelaPago';

const Financiacion = ({
  archivo_contrato,
  numero_referencia,
  pasarela,
  documentacion_adicional,
  Validaciones,
  cambioDeDatos,
}) => {
  return (
    <>
      <FileSelector
        marginTop={1}
        onSelect={(doc) => cambioDeDatos('archivo_contrato', doc)}
      />
      {!documentacion_adicional ? (
        <Validator
          ref={(r) => (Validaciones['archivo_contrato'] = r)}
          value={archivo_contrato}
          required="Seleccione un archivo de servicio público"></Validator>
      ) : (
        <Text
          style={{
            fontFamily: 'Mont-regular',
            textAlign: 'center',
            marginVertical: MARGIN_VERTICAL,
          }}>
          Ya haz subido un archivo.
        </Text>
      )}

      <Validator
        ref={(r) => (Validaciones['numero_referencia'] = r)}
        value={numero_referencia}
        required="Ingrese el número de contrato con la entidad">
        <InputText
          marginTop={1}
          label="Número de contrato"
          placeholder="Número de contrato"
          marginTop={2}
          value={numero_referencia}
          onChangeText={(t) => cambioDeDatos('numero_referencia', t)}
        />
      </Validator>

      <PasarelaPago
        value={pasarela}
        selected={(p) => cambioDeDatos('pasarela', p)}
      />
    </>
  );
};

export default Financiacion;
