import module from '@react-native-firebase/app';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  TITULO_TAM,
  MARGIN_VERTICAL,
} from 'constants';
import React, {useEffect, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import produce from 'immer';

import Button from 'components/Button';
import InputText from 'components/InputText';
import InputMask from 'components/InputMask';
import Select from 'components/Select';
import Validator from 'components/Validator';

class PlanFormulario extends React.Component {
  state = {
    error: {},
    values: {},
    preguntas: [],
  };
  validations = {};

  responder = (pregunta, valor) => {
    this.setState(
      produce((draft) => {
        draft.preguntas.find((p) => p.id == pregunta.id).respuesta = valor;
      }),
    );
  };

  abrirOpciones = (pregunta, estado = true) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.preguntas.find((p) => p.id == pregunta.id);
        _pregunta.mostrar_selector = estado;
      }),
    );
  };

  seleccionarOpcion = (pregunta, opcion) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.preguntas.find((p) => p.id == pregunta.id);
        _pregunta.mostrar_selector = false;
        _pregunta.respuesta = opcion;
      }),
    );
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
          mask={'[0000]-[00]-[00]'}
        />
      );
    }
  };

  renderPreguntas = (preguntas) => {
    return preguntas.map((pregunta) => (
      <View style={{marginTop: 16}}>
        <Text style={{fontFamily: 'Mont-Regular', fontSize: TITULO_TAM * 0.6}}>
          {pregunta.pregunta + ' ' + (pregunta.obligatorio ? '*' : '')}
        </Text>
        {this.renderInput(pregunta)}
        {this.renderDate(pregunta)}
        {this.renderChoices(pregunta)}
        {pregunta.obligatorio ? (
          <Validator
            ref={(r) => (this.validations['pregunta' + pregunta.id] = r)}
            value={pregunta.respuesta}
            required="Completa este campo"
          />
        ) : null}
      </View>
    ));
  };

  validar = () => {
    let errores = [];
    Object.keys(this.validations).forEach((v) => {
      let e = this.validations[v].execute();
      if (e.length > 0) {
        errores = [...errores, ...e];
      }
    });
    return errores;
  };

  reset = () => {
    this.setState(
      produce((draft) => {
        draft.preguntas = draf.preguntas.map((p) => ({
          ...p,
          ...{respuesta: ''},
        }));
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
    this.setState({
      preguntas: formulario.preguntas,
      titulo: formulario.titulo,
      id: formulario.id,
    });
  }
  componentDidUpdate(prev) {
    if (prev.formulario != this.props.formulario) {
      const {formulario} = this.props;
      this.setState({
        preguntas: formulario.preguntas,
        titulo: formulario.titulo,
        id: formulario.id,
      });
    }
  }

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
        {this.renderPreguntas(preguntas)}
      </View>
    );
  }
}

export default PlanFormulario;
