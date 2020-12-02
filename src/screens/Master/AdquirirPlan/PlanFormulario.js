import module from '@react-native-firebase/app';
import {COLORS} from 'constants';
import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import NumberFormat from 'react-number-format';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import TextInputMask from 'react-native-text-input-mask';
import produce from 'immer';
import {validar, totalErrores, renderErrores} from 'utils/Validar';

const Validaciones = {};

class PlanFormulario extends React.Component {
  state = {
    error: {},
    values: {},
    preguntas: [],
  };

  responder = (pregunta, valor) => {
    this.setState(
      produce((draft) => {
        draft.preguntas.find((p) => p.id == pregunta.id).respuesta = valor;
      }),
    );
  };

  onBlur = (pregunta) => {
    if (Validaciones['pregunta' + pregunta.id]) {
      validar(
        this,
        pregunta.respuesta,
        'pregunta' + pregunta.id,
        Validaciones['pregunta' + pregunta.id].validacion,
        false,
      );
    }
  };
  abrirOpciones = (pregunta, estado = true) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.preguntas.find((p) => p.id == pregunta.id);
        _pregunta.mostrar_selector = estado;
      }),
    );
    this.onBlur(pregunta);
  };
  seleccionarOpcion = (pregunta, opcion) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.preguntas.find((p) => p.id == pregunta.id);
        _pregunta.mostrar_selector = false;
        _pregunta.respuesta = opcion;
        draft.values['pregunta' + pregunta.id] = opcion;
      }),
    );
    setTimeout(() => {
      this.onBlur({id: pregunta.id, respuesta: opcion});
    }, 500);
  };
  renderChoices = (pregunta) => {
    console.log(pregunta);
    const {tipo_pregunta, opciones, mostrar_selector, respuesta} = pregunta;
    if (tipo_pregunta == 'choice') {
      return (
        <View
          style={{
            borderRadius: 16,
            marginTop: 4,
            borderWidth: 0.2,
            padding: 8,
          }}>
          <TouchableOpacity onPress={() => this.abrirOpciones(pregunta)}>
            <Text>
              {respuesta && respuesta != ''
                ? opciones.find((o) => o.id == respuesta).opcion
                : 'Seleccione'}
            </Text>
          </TouchableOpacity>
          <ModalFilterPicker
            visible={mostrar_selector}
            onSelect={(opcion) => this.seleccionarOpcion(pregunta, opcion.key)}
            onCancel={() => this.abrirOpciones(pregunta, false)}
            options={opciones.map((o) => ({
              key: o.id,
              label: o.opcion,
            }))}
          />
        </View>
      );
    }
  };

  renderInput = (pregunta) => {
    const tipo_validos = ['input', 'areatext', 'inputnumber'];
    const {tipo_pregunta, respuesta} = pregunta;
    if (tipo_validos.includes(tipo_pregunta)) {
      let props = {};
      if (tipo_pregunta == 'inputnumber') {
        props.keyboardType = 'decimal-pad';
      } else if (tipo_pregunta == 'areatext') {
        props.multilines = true;
        props.numberOfLines = 4;
      }
      return (
        <View
          style={{
            borderRadius: 16,
            marginTop: 4,
            borderWidth: 0.2,
            padding: 8,
          }}>
          <TextInput
            style={{padding: 0}}
            returnKeyType={'next'}
            value={pregunta.respuesta}
            onChangeText={(value) => {
              this.responder(pregunta, value);
            }}
            onBlur={() => this.onBlur(pregunta)}
            {...props}
          />
        </View>
      );
    }
  };

  renderDate = (pregunta) => {
    const {tipo_pregunta, respuesta} = pregunta;
    if (tipo_pregunta == 'date') {
      return (
        <View
          style={{
            borderRadius: 16,
            marginTop: 4,
            borderWidth: 0.2,
            padding: 8,
          }}>
          <TextInputMask
            style={{margin: 0, padding: 0}}
            placeholder="0000-00-00"
            value={pregunta.respuesta}
            returnKeyType={'next'}
            onChangeText={(formatted, extracted) => {
              this.responder(pregunta, formatted);
            }}
            onBlur={() => this.onBlur(pregunta)}
            mask={'[0000]-[00]-[00]'}
          />
        </View>
      );
    }
  };

  renderPreguntas = (preguntas) => {
    return preguntas.map((pregunta) => (
      <View style={{marginTop: 16}}>
        <Text style={{fontFamily: 'Roboto-Light', fontSize: 14}}>
          {pregunta.pregunta + ' ' + (pregunta.obligatorio ? '*' : '')}
        </Text>
        {this.renderInput(pregunta)}
        {this.renderDate(pregunta)}
        {this.renderChoices(pregunta)}
        {renderErrores(this, 'pregunta' + pregunta.id)}
      </View>
    ));
  };

  validar = () => {
    return new Promise((resolve, reject) => {
      Object.keys(Validaciones).forEach((k) => {
        let value = this.state.values[k];
        validar(this, value, k, Validaciones[k].validacion, false);
      });
      setTimeout(() => {
        resolve(totalErrores(this));
      }, 100);
    });
  };

  reset = () => {
    this.setState(
      produce((draft) => {
        draft.preguntas = draf.preguntas.map((p) => ({
          ...p,
          ...{respuesta: ''},
        }));
        draft.values = {};
        draft.error = {};
      }),
    );
  };

  obtenerValores = () => {
    return {
      id: this.state.id,
      campos: this.state.preguntas.map((p) => ({
        id: p.id,
        respuesta: p.respuesta,
      })),
    };
  };

  componentDidMount() {
    const {formulario} = this.props;
    formulario.preguntas
      .filter((p) => p.obligatorio)
      .forEach((p) => {
        Validaciones['pregunta' + p.id] = {
          default_value: '',
          validacion: {
            presence: {
              allowEmpty: false,
              message: '^Diligencie éste campo',
            },
          },
        };
      });
    this.setState({
      preguntas: formulario.preguntas,
      titulo: formulario.titulo,
      id: formulario.id,
    });
  }

  render() {
    const {titulo, preguntas} = this.state;

    return (
      <View
        style={{
          borderRadius: 24,
          borderWidth: 0.2,
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          padding: 16,
        }}>
        <Text style={{fontFamily: 'Roboto-Medium'}}>{titulo}</Text>
        {this.renderPreguntas(preguntas)}
      </View>
    );
  }
}

export default PlanFormulario;
