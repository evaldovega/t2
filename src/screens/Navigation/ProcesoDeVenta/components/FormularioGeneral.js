import React, {useEffect, useImperativeHandle} from 'react';
import {View, Text} from 'react-native';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  TITULO_TAM,
  MARGIN_VERTICAL,
} from 'constants';
import InputText from 'components/InputText';
import InputDateTimerPicker from 'components/DatetimePicker';
import {ScrollView} from 'react-native-gesture-handler';
import {useImmer} from 'use-immer';
import Validator, {Execute} from 'components/Validator';
import Select from 'components/Select';
import ColorfullContainer from 'components/ColorfullContainer';
import Button from 'components/Button';

const FormularioGeneral = React.forwardRef(
  (
    {navigation, setCurrentTab, formulario, datosPrecargados, orderId, planes},
    ref,
  ) => {
    const {id, titulo, preguntas} = formulario;
    const [respuestas, setRespuestas] = useImmer({});
    const [subsanar, setSubsanar] = useImmer({});
    const Validaciones = {};

    const visible = navigation.isFocused();

    const setRespuesta = (pregunta, nuevoValor) => {
      setRespuestas((draft) => {
        draft[pregunta] = nuevoValor;
      });
    };

    const renderInput = (pregunta) => {
      const tiposValidos = ['input', 'areatext', 'inputnumber'];
      const {id, tipo_pregunta, formulario} = pregunta;
      if (tiposValidos.includes(tipo_pregunta)) {
        let props = {};
        if (tipo_pregunta == 'inputnumber') {
          props.keyboarType = 'number-pad';
        } else if (tipo_pregunta == 'areatext') {
          props.multilenes = true;
          props.numberofLines = 4;
        }

        if (orderId && !subsanar[pregunta.id]) {
          props.disabled = true;
        }

        return (
          <InputText
            disabled={props.disabled}
            value={respuestas[id]}
            onChangeText={(nuevoValor) => setRespuesta(id, nuevoValor)}
            marginTop={1}
            input={props}
          />
        );
      }
    };

    const renderDate = (pregunta) => {
      const {id, tipo_pregunta, respuesta} = pregunta;
      if (tipo_pregunta == 'date') {
        const disabled = orderId && !subsanar[pregunta.id] ? true : false;
        return (
          <InputDateTimerPicker
            disabled={disabled}
            format="YYYY-MM-DD"
            value={respuestas[id]}
            onChange={(nuevoValor) => setRespuesta(id, nuevoValor)}
            marginTop={1}
            showTime={false}
          />
        );
      }
    };

    renderSelect = (pregunta) => {
      const {id, opciones, tipo_pregunta} = pregunta;
      if (tipo_pregunta == 'choice') {
        return (
          <Select
            disabled={orderId && !subsanar[pregunta.id]}
            marginTop={1}
            value={respuestas[id]}
            placeholder="Seleccione"
            options={opciones.map((o) => ({key: o.id, label: o.opcion}))}
            onSelect={(opcion) => setRespuesta(id, opcion.key)}
          />
        );
      }
    };

    const Pregunta = (pregunta) => {
      const {id, obligatorio} = pregunta;
      return (
        <View style={{marginTop: 24}}>
          <Text
            style={{fontFamily: 'Mont-Regular', fontSize: TITULO_TAM * 0.6}}>
            {pregunta.pregunta + ' ' + (pregunta.obligatorio ? '*' : '')}
          </Text>
          {renderInput(pregunta)}
          {renderDate(pregunta)}
          {renderSelect(pregunta)}
          {obligatorio ? (
            <Validator
              ref={(r) => (Validaciones[`pregunta-${id}`] = r)}
              value={respuestas[id]}
              required
            />
          ) : null}
        </View>
      );
    };

    const next = () => {
      Execute(Validaciones).then(() => {
        if (planes > 0) {
          navigation.navigate('Variaciones');
        } else {
          navigation.navigate('Finalizar');
        }
      });
    };

    useImperativeHandle(ref, () => ({
      valid: () => {
        return Execute(Validaciones)
          .then(() => {
            return {
              id,
              campos: preguntas.map((p) => ({
                id: p.id,
                respuesta: respuestas[p.id],
              })),
            };
          })
          .catch((error) => {
            throw 'Debes completar los datos generales';
          });
      },
      navigationTab: () => navigation,
    }));

    useEffect(() => {
      if (visible) {
        setCurrentTab('Datos generales');
      }
    }, [visible]);

    useEffect(() => {
      if (preguntas) {
        const _respuestas = {};
        for (let pregunta of preguntas) {
          _respuestas[pregunta.id] = pregunta.respuesta
            ? pregunta.respuesta
            : '';
        }
        setRespuestas((draft) => _respuestas);
      }
    }, [preguntas]);

    useEffect(() => {
      if (datosPrecargados) {
        datosPrecargados.forEach((dp) => {
          if (dp.subsanar) {
            setSubsanar((draft) => {
              draft[dp.pregunta] = true;
            });
          }
          setRespuesta(
            dp.pregunta,
            dp.opcion_respuesta ? dp.opcion_respuesta : dp.respuesta,
          );
        });
      }
    }, [datosPrecargados]);

    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: '#ffff'}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              borderRadius: CURVA,
              padding: MARGIN_HORIZONTAL,
              paddingHorizontal: MARGIN_HORIZONTAL * 2,
            }}>
            <Text
              style={{fontFamily: 'Mont-Regular', fontSize: TITULO_TAM * 0.7}}>
              {titulo}
            </Text>
            {preguntas && preguntas.map((pregunta) => Pregunta(pregunta))}
          </View>
        </ScrollView>
        <View style={{margin: 24}}>
          <Button title="Continuar" onPress={next} />
        </View>
      </ColorfullContainer>
    );
  },
);

export default FormularioGeneral;
