import module from '@react-native-firebase/app';
import {COLORS, CURVA, MARGIN_HORIZONTAL, TITULO_TAM} from 'constants';
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import NumberFormat from 'react-number-format';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import TextInputMask from 'react-native-text-input-mask';
import produce from 'immer';
import {validar, totalErrores, renderErrores} from 'utils/Validar';

import Button from 'components/Button';
import InputText from 'components/InputText';
import InputMask from 'components/InputMask';
import Select from 'components/Select';

import Validator from 'components/Validator';

const Validaciones = {};

class PlanFormulario extends React.Component {
  state = {
    error: {},
    values: {},
    preguntas: [],
  };
  refs = React.createRef([]);

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
    const {tipo_pregunta, opciones, mostrar_selector, respuesta} = pregunta;
    if (tipo_pregunta == 'choice') {
      return (
        <Select
          marginTop={1}
          value={respuesta}
          placeholder={'Seleccione'}
          options={opciones.map((o) => ({key: o.id, label: o.opcion}))}
          onSelect={(opcion) => this.seleccionarOpcion(pregunta, opcion.key)}
        />
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
        <InputText
          marginTop={1}
          input={props}
          value={pregunta.respuesta}
          onChangeText={(value) => {
            this.responder(pregunta, value);
          }}
          onBlur={() => this.onBlur(pregunta)}
        />
      );
    }
  };

  renderDate = (pregunta) => {
    const {tipo_pregunta, respuesta} = pregunta;
    if (tipo_pregunta == 'date') {
      return (
        <InputMask
          marginTop={1}
          placeholder="0000-00-00"
          value={pregunta.respuesta}
          onChangeText={(formatted, extracted) => {
            this.responder(pregunta, formatted);
          }}
          onBlur={() => this.onBlur(pregunta)}
          mask={'[0000]-[00]-[00]'}
        />
      );
    }
  };

  renderPreguntas = (preguntas) => {
    return preguntas.map((pregunta) => (
      <View style={{marginTop: 16}}>
        <Text style={{fontFamily: 'Mont-Medium', fontSize: TITULO_TAM * 0.6}}>
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
    return new Promise(async (resolve) => {
      const promesas = [];
      for (let k of Object.keys(Validaciones)) {
        let value = this.state.values[k];
        promesas.push(
          validar(this, value, k, Validaciones[k].validacion, false),
        );
      }
      Promise.all(promesas).then(() => {
        setTimeout(() => {
          resolve(totalErrores(this));
        }, 300);
      });
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

  enviar = () => {
    console.log(this.refs);
  };

  render() {
    const {titulo, preguntas} = this.state;

    return (
      <View
        style={{
          borderRadius: CURVA,
          padding: MARGIN_HORIZONTAL,
          backgroundColor: 'rgba(255,255,255,.7)',
        }}>
        <Text style={{fontFamily: 'Mont-Regular', fontSize: TITULO_TAM * 0.7}}>
          {titulo}
        </Text>
        {/*<Validator ref={(r) => (this.refs['v1'] = r)} value={this.state.valor} constraints={{'presence':{'allowEmpty':false,'message':'^Diligencie éste campo'}}}>
          <InputText value={this.state.valor} onChangeText={(v)=>this.setState({valor:v})}/>
        </Validator>
        <Validator ref={(r) => (this.refs['v2'] = r)} value={this.state.valor2} valueb={this.state.valor} constraints={{equality:{attribute:"e2",message:'^Las contraseñas introducidas no coinciden!',},'presence':{'allowEmpty':false,'message':'^Diligencie éste campo'}}}>
          <InputText value={this.state.valor2} onChangeText={(v)=>this.setState({valor2:v})}/>
        </Validator><Button title='Enviar' onPress={this.enviar}/>*/}

        {this.renderPreguntas(preguntas)}
      </View>
    );
  }
}

export default PlanFormulario;
