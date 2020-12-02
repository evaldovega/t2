import React from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import GradientContainer from 'components/GradientContainer';
import Navbar from 'components/Navbar';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import TextInputMask from 'react-native-text-input-mask';
import {COLORS, SERVER_ADDRESS} from 'constants';
import {validar, totalErrores, renderErrores} from 'utils/Validar';
import produce from 'immer';

let Validaciones = {};

class VariacionFormulario extends React.Component {
  state = {
    values: {},
    error: {},
    variacion: {},
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
        <View
          style={{
            borderRadius: 16,
            marginTop: 4,
            borderWidth: 0.2,
            padding: 8,
          }}>
          <TextInput
            style={{padding: 0}}
            value={pregunta.respuesta}
            onBlur={() => this.onBlur(pregunta)}
            onChangeText={(v) => this.ingresarRespuesta(pregunta, v)}
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
            onChangeText={(formatted, extracted) => {
              this.ingresarRespuesta(pregunta, formatted);
            }}
            onBlur={() => this.onBlur(pregunta)}
            mask={'[0000]-[00]-[00]'}
          />
        </View>
      );
    }
  };

  renderPreguntas = (formulario) => {
    const {preguntas} = formulario;

    return preguntas.map((p) => (
      <View style={{marginTop: 16}}>
        <Text style={{fontFamily: 'Roboto-Light', fontSize: 14}}>
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
    this.state.variacion.formularios[0].preguntas.forEach((p) => {
      this.onBlur(p);
    });

    setTimeout(() => {
      if (totalErrores(this) > 0) {
        Alert.alert(
          'Información faltante',
          'Diligencie la información faltante para continuar el proceso.',
        );
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
    const {variacion} = this.state;

    return (
      <GradientContainer style={{flex: 1}}>
        <Navbar back title={variacion.titulo} {...this.props} />
        <ScrollView style={{flex: 1}}>
          <View style={{marginHorizontal: 16}}>
            {variacion.formularios &&
              variacion.formularios.map((f) => (
                <View
                  style={{
                    padding: 16,
                    marginTop: 16,
                    borderRadius: 24,
                    borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                    borderWidth: 0.2,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Medium',
                      textAlign: 'center',
                      fontSize: 16,
                    }}>
                    {f.titulo}
                  </Text>
                  {this.renderPreguntas(f)}
                </View>
              ))}
            <TouchableOpacity
              onPress={this.guardar}
              style={{
                marginVertical: 24,
                elevation: 2,
                backgroundColor: COLORS.PRIMARY_COLOR,
                padding: 24,
                borderRadius: 24,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'Roboto-Black',
                  color: '#ffff',
                }}>
                Añadir
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </GradientContainer>
    );
  }
}
export default VariacionFormulario;
