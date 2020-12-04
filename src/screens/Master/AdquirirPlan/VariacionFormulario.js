import React from 'react';
import {Text, ScrollView, View, Alert} from 'react-native';
import ColorfullContainer from 'components/ColorfullContainer';
import Navbar from 'components/Navbar';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  SERVER_ADDRESS,
  TITULO_TAM,
} from 'constants';
import {validar, totalErrores, renderErrores} from 'utils/Validar';
import produce from 'immer';

import Loader from 'components/Loader';
import Button from 'components/Button';
import InputText from 'components/InputText';
import InputMask from 'components/InputMask';
import Select from 'components/Select';

let Validaciones = {};

class VariacionFormulario extends React.Component {
  state = {
    cargando: false,
    values: {},
    error: {},
    variacion: {},
  };
  validando = false;

  onBlur = (pregunta) => {
    if (Validaciones['pregunta' + pregunta.id]) {
      return validar(
        this,
        pregunta.respuesta,
        'pregunta' + pregunta.id,
        Validaciones['pregunta' + pregunta.id].validacion,
        false,
      );
    }

    return new Promise((resolve) => {
      resolve(null);
    });
  };
  //--------------Choice
  abrirOpciones = (pregunta, estado = true) => {
    this.setState(
      produce((draft) => {
        draft.variacion.formularios
          .find((f) => f.id == pregunta.formulario)
          .preguntas.find((p) => p.id == pregunta.id).mostrar_selector = estado;
      }),
    );
    this.onBlur(pregunta);
  };
  seleccionarOpcion = (pregunta, opcion) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.variacion.formularios
          .find((f) => f.id == pregunta.formulario)
          .preguntas.find((p) => p.id == pregunta.id);
        _pregunta.mostrar_selector = false;
        _pregunta.respuesta = opcion;
      }),
    );
    setTimeout(() => {
      this.onBlur({id: pregunta.id, respuesta: opcion});
    }, 100);
  };

  renderChoices = (pregunta) => {
    const {tipo_pregunta, opciones, mostrar_selector, respuesta} = pregunta;
    if (tipo_pregunta == 'choice') {
      return (
        <Select
          marginTop={1}
          value={respuesta}
          onSelect={(opcion) => this.seleccionarOpcion(pregunta, opcion.key)}
          options={opciones.map((o) => ({
            key: o.id,
            label: o.opcion,
          }))}
        />
      );
    }
  };

  //----------------Input
  ingresarRespuesta = (pregunta, respuesta) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.variacion.formularios
          .find((f) => f.id == pregunta.formulario)
          .preguntas.find((p) => p.id == pregunta.id);
        _pregunta.respuesta = respuesta;
      }),
    );
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
          input={props}
          marginTop={1}
          value={pregunta.respuesta}
          onBlur={() => this.onBlur(pregunta)}
          onChangeText={(v) => this.ingresarRespuesta(pregunta, v)}
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
          onBlur={() => this.onBlur(pregunta)}
          mask={'[0000]-[00]-[00]'}
          onChangeText={(formatted, extracted) => {
            this.ingresarRespuesta(pregunta, formatted);
          }}
        />
      );
    }
  };

  renderPreguntas = (formulario) => {
    const {preguntas} = formulario;

    return preguntas.map((p) => (
      <View style={{marginTop: MARGIN_VERTICAL}}>
        <Text style={{fontFamily: 'Mont-Regular', fontSize: TITULO_TAM * 0.7}}>
          {p.pregunta + ' ' + (p.obligatorio ? '*' : '')}
        </Text>
        {this.renderChoices(p)}
        {this.renderInput(p)}
        {this.renderDate(p)}
        {renderErrores(this, 'pregunta' + p.id)}
      </View>
    ));
  };

  guardar = () => {
    this.setState({cargando: true});

    requestAnimationFrame(async () => {
      for await (let pregunta of this.state.variacion.formularios[0]
        .preguntas) {
        let v = await this.onBlur(pregunta);
        console.log(v);
      }

      if (totalErrores(this) > 0) {
        Alert.alert(
          'Información faltante',
          'Diligencie la información faltante para continuar el proceso.',
        );
        this.validando = false;
        this.setState({cargando: false});
        return;
      }
      let data = {
        plan: this.state.variacion.plan,
        variacion: this.state.variacion.id,
        formulario: {
          id: this.state.variacion.formularios[0].id,
          preguntas: [],
        },
      };
      this.state.variacion.formularios[0].preguntas.forEach((p) => {
        data.formulario.preguntas.push({
          id: p.id,
          pregunta: p.pregunta,
          respuesta: p.respuesta,
        });
      });
      this.props.route.params.variacionAgregada(data);
      this.props.navigation.pop();
    });
  };

  componentDidMount() {
    let variacion = {
      titulo: this.props.route.params.variacion.titulo,
      id: this.props.route.params.variacion.id,
      plan: this.props.route.params.variacion.plan,
    };
    const formularios = JSON.parse(
      JSON.stringify(this.props.route.params.variacion.formularios),
    );

    variacion.formularios = formularios.map((f) => {
      f.preguntas = f.preguntas.map((p) => {
        p.mostrar_selector = false;
        p.respuesta = '';
        if (p.obligatorio) {
          Validaciones['pregunta' + p.id] = {
            validacion: {
              presence: {
                allowEmpty: false,
                message: '^Diligencie éste campo',
              },
            },
          };
        }
        return p;
      });
      return f;
    });
    this.setState({variacion: variacion});
  }

  render() {
    const {variacion, cargando} = this.state;

    return (
      <ColorfullContainer style={{flex: 1}}>
        <Navbar transparent back title={variacion.titulo} {...this.props} />
        <Loader loading={cargando} />
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              marginHorizontal: MARGIN_HORIZONTAL,
              marginVertical: MARGIN_VERTICAL,
            }}>
            {variacion.formularios &&
              variacion.formularios.map((f) => (
                <View
                  style={{
                    padding: MARGIN_HORIZONTAL,
                    marginTop: MARGIN_VERTICAL,
                    borderRadius: CURVA,
                    backgroundColor: 'rgba(255,255,255,.7)',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Mont-Regular',
                      fontSize: TITULO_TAM * 0.7,
                      marginVertical: MARGIN_VERTICAL,
                    }}>
                    {f.titulo}
                  </Text>
                  {this.renderPreguntas(f)}
                </View>
              ))}

            <Button marginTop={1} title="Añadir" onPress={this.guardar} />
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}
export default VariacionFormulario;
