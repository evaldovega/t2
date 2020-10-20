import React from 'react';
import {TouchableHighlight, View, Alert, TextInput} from 'react-native';
import {
  Text,
  FAB,
  Subheading,
  Title,
  Checkbox,
  Colors,
  Card,
  Button,
} from 'react-native-paper';
import Loader from 'components/Loader';
import {
  styleHeader,
  styleInput,
  styleButton,
  styleText,
  checkbox,
} from 'styles';
import {COLORS, SERVER_ADDRESS} from 'constants';
import {connect} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {addOrden} from 'redux/actions/Clients';

class AdquirirPlan extends React.Component {
  state = {
    nombre_plan: '',
    cargando: false,
    formularios: [],
    data: {
      form_plan: [],
    },
  };
  componentDidMount() {
    const {id, name, productos} = this.props.route.params;
    this.setState({nombre_plan: name});
    fetch(SERVER_ADDRESS + 'api/planes/' + id + '/', {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let formularios = [];
        if (r.formulario) {
          r.formulario[0].tipo = 'plan';
          formularios.push(r.formulario[0]);
        }

        r.productos.forEach((p) => {
          if (p.formulario) {
            p.formulario[0].tipo = 'producto';
            p.formulario[0].titulo = p.titulo;
            formularios.push(p.formulario[0]);
          }
        });

        console.log('FORM ', formularios);

        this.setState({formularios: formularios});
      });
  }

  handle_formulario_producto = (formulario_id, pregunta_id, valor) => {
    this.setState((state) => {
      const index = state.formularios.findIndex((f) => f.id == formulario_id);
      const formularios = state.formularios;
      formularios[index].preguntas.find(
        (p) => p.id == pregunta_id,
      ).respuesta = valor;
      return {...state, ...formularios};
    });
    console.log(this.state.formularios);
  };
  getValue = (formulario_id, pregunta) => {
    return this.state.formularios
      .find((f) => f.id == formulario_id)
      .preguntas.find((p) => p.id == pregunta).respuesta;
  };

  renderChoices = (formulario_id, pregunta_id, choices) => {
    return choices.map((o, k) => {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() =>
            this.handle_formulario_producto(formulario_id, pregunta_id, o.id)
          }>
          <View style={checkbox.wrapper}>
            <Checkbox
              color={COLORS.PRIMARY_COLOR}
              status={
                this.getValue(formulario_id, pregunta_id) == o.id
                  ? 'checked'
                  : 'unchecked'
              }></Checkbox>
            <Text style={[styleText.h3, {flex: 1, marginTop: 0}]}>
              {o.opcion}
            </Text>
          </View>
        </TouchableHighlight>
      );
    });
  };
  buscarPreguntaDiligenciada = (id, pregunta) => {
    const formularios = this.state.formularios;
    let encontrada = '';
    for (let f of formularios) {
      for (let p of f.preguntas) {
        if (p.id != id && p.pregunta == pregunta && p.respuesta != '') {
          encontrada = p.respuesta;
          break;
        }
      }
      if (encontrada != '') {
        break;
      }
    }
    return encontrada;
  };
  completar = () => {
    this.setState((state) => {
      const formularios = state.formularios;
      for (var f in formularios) {
        for (let p in formularios[f].preguntas) {
          if (
            !formularios[f].preguntas[p].respuesta ||
            formularios[f].preguntas[p].respuesta == ''
          ) {
            let c = this.buscarPreguntaDiligenciada(
              formularios[f].preguntas[p].id,
              formularios[f].preguntas[p].pregunta,
            );
            console.log('Respuesta ', c);
            if (c != '') {
              formularios[f].preguntas[p].respuesta = c;
            }
          }
        }
      }
      return {...state, ...formularios};
    });
  };
  renderInput = (formulario_id, pregunta_id) => {
    return (
      <View style={styleInput.wrapper}>
        <TextInput
          style={styleInput.input}
          returnKeyType="next"
          value={this.getValue(formulario_id, pregunta_id)}
          onFocus={this.completar}
          onChangeText={(t) =>
            this.handle_formulario_producto(formulario_id, pregunta_id, t)
          }
        />
      </View>
    );
  };

  rendeformulario = (formulario) => {
    return (
      <Card style={{borderRadius: 16, marginTop: 16}}>
        <Card.Title title={formulario.titulo} />
        <Card.Content>
          {formulario.preguntas.map((p) => {
            return (
              <>
                <Subheading>{p.pregunta}</Subheading>
                {p.tipo_pregunta == 'radiochoices'
                  ? this.renderChoices(formulario.id, p.id, p.opciones)
                  : null}
                {p.tipo_pregunta == 'input'
                  ? this.renderInput(formulario.id, p.id)
                  : null}
              </>
            );
          })}
        </Card.Content>
      </Card>
    );
  };

  renderPreguntas = (step, formulario_id, preguntas) => {
    return preguntas.map((p) => {
      return (
        <>
          <Subheading>{p.pregunta}</Subheading>
          {p.tipo_pregunta == 'radiochoices'
            ? this.renderChoices(step, formulario_id, p.id, p.opciones)
            : null}
          {p.tipo_pregunta == 'input'
            ? this.renderInput(step, formulario_id, p.id)
            : null}
        </>
      );
    });
  };

  guardar = () => {
    this.setState({cargando: true});
    const data = {
      cliente: this.props.route.params.cliente,
      form_plan: [],
      form_producto: [],
    };
    const form_plan = this.state.formularios.find((f) => f.tipo == 'plan');
    if (form_plan) {
      form_plan.preguntas.forEach((p) => {
        data.form_plan.push({
          formulario: p.formulario,
          pregunta: p.id,
          respuesta: p.respuesta,
        });
      });
    }
    const form_productos = this.state.formularios.filter(
      (f) => f.tipo == 'producto',
    );
    if (form_productos && form_productos.length > 0) {
      form_productos.forEach((f) => {
        f.preguntas.forEach((p) => {
          data.form_producto.push({
            formulario: p.formulario,
            pregunta: p.id,
            respuesta: p.respuesta,
          });
        });
      });
    }

    console.log(data);
    fetch(
      SERVER_ADDRESS +
        'api/planes/' +
        this.props.route.params.id +
        '/registrar/',
      {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          Authorization: 'Token ' + this.props.token,
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      },
    )
      .then((r) => r.json())
      .then((r) => {
        console.log('Orden ', r);
        this.setState({cargando: false});
        this.props.addOrden(r);
        this.props.navigation.navigate('ClientProfile', {
          orden: r.numero_orden,
        });
      })
      .catch((error) => {
        this.setState({cargando: false});
        Alert.alert('No se pudo crear la orden', error.toString());
      });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.grey100}}>
        <Loader loading={this.state.cargando} />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>{this.state.nombre_plan}</Text>
          <FAB style={{opacity: 0}} />
        </View>
        <ScrollView
          style={{flex: 1, paddingHorizontal: 16}}
          showsVerticalScrollIndicator={false}>
          {this.state.formularios.map((f) => {
            return <>{this.rendeformulario(f)}</>;
          })}
          <Button
            style={[styleButton.wrapper, {marginVertical: 16}]}
            dark={true}
            color="white"
            onPress={() => this.guardar()}>
            Guardar
          </Button>
        </ScrollView>
      </View>
    );
  }
}

const mapearEstado = (state) => {
  return {
    token: state.Usuario.token,
  };
};
const mapToAction = (dispatch) => {
  return {
    addOrden: (orden) => {
      dispatch(addOrden(orden));
    },
  };
};

export default connect(mapearEstado, mapToAction)(AdquirirPlan);
