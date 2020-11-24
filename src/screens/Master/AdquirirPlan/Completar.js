import React from 'react';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import {
  TouchableHighlight,
  View,
  Alert,
  TextInput,
  Dimensions,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Switch,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Text, FAB, Paragraph, Colors, Card, Title} from 'react-native-paper';
import {Button} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import TextInputMask from 'react-native-text-input-mask';
import produce from 'immer';
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
import {addOrden} from 'redux/actions/Clients';
import {validar, totalErrores, renderErrores} from 'utils/Validar';
import Navbar from 'components/Navbar';

const {width, height} = Dimensions.get('screen');

const {width: viewportWidth} = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = '100%';
const slideWidth = wp(80);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
let amount = 0;

let Validaciones = {};

class EVForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }

  componentDidMount() {}

  change = (name, value, rowIndex, tipo) => {
    this.setState(
      produce((draft) => {
        if (tipo == 'single') {
          draft.data[name] = value;
        } else {
          if (!draft.data[name]) {
            draft.data[name] = [];
          }
          console.log('Array ', rowIndex, value);
          draft.data[name][rowIndex] = value;
        }
      }),
    );
  };

  getValues = () => {
    return this.state.data;
    /*
    let data={}
      React.Children.forEach(this.props.children,(child,index)=>{
        if(child.tipo=='single'){
          data[child.props.name]=this.refs['input-'+index].getValue()
        }else{
          if(!data[child.props.name]){
            data[child.props.name]=[]
          }
          data[child.props.name].push(this.refs['input-'+index].getValue())
        }
      })
      return data*/
  };

  render() {
    let index = 0;
    const children = React.Children.map(this.props.children, (child) => {
      if (child.props.children) {
        return (
          <child.type
            {...this.props}
            {...child.props}
            change={this.change}
            tipo="array"
            ref={'input-' + index++}>
            {child.props.children}
          </child.type>
        );
      } else {
        return (
          <child.type
            {...this.props}
            {...child.props}
            change={this.change}
            tipo="single"
            index={index++}>
            {child.children}
          </child.type>
        );
      }
    });
    return <View>{this.props.children}</View>;
  }
}

class EVFormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {values: {}};
  }

  componentDidMount() {
    console.log('Mi index ', this.props.rowIndex);
  }

  change = (name, value, rowIndex, tipo) => {
    this.setState(
      produce((draft) => {
        draft.values[name] = value;
      }),
    );
    setTimeout(() => {
      this.props.change(
        this.props.name,
        this.state.values,
        this.props.rowIndex,
        'array',
      );
    });
  };

  getValue = () => {
    let values = {};
    React.Children.forEach(this.props.children, (child, index) => {
      values[child.props.name] = this.refs[
        'list-' + this.props.name + '-input-' + index
      ].getValue();
    });
    return values;
  };

  render() {
    let index = 0;
    const children = React.Children.map(this.props.children, (child, k) => {
      if (child.props.children) {
        return (
          <child.type
            {...this.props}
            {...child.props}
            change={this.change}
            rowIndex={this.props.rowIndex}
            ref={'list-' + this.props.name + '-input-' + index++}>
            {child.props.children}
          </child.type>
        );
      } else {
        return (
          <child.type
            {...this.props}
            {...child.props}
            change={this.change}
            rowIndex={this.props.rowIndex}
            ref={'list-' + this.props.name + '-input-' + index++}></child.type>
        );
      }
    });
    return <>{this.props.children}</>;
  }
}

class EVInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'hola'};
  }
  componentDidMount() {
    this.props.change(this.props.name, '', this.props.rowIndex, 'single');
  }

  getValue = () => {
    return this.state.value;
  };
  set = (v) => {
    this.setState({value: v});
    console.log(this.props.key);
    this.props.change(this.props.name, v, this.props.rowIndex, 'single');
  };
  render() {
    return (
      <>
        <Text>{this.props.label}:</Text>
        <TextInput value={this.state.value} onChangeText={(v) => this.set(v)} />
      </>
    );
  }
}

class AdquirirPlan extends React.Component {
  state = {
    amount: 0,
    error: {},
    values: {},
    indexActive: 0,
    nombre_plan: '',
    cargando: false,
    formularios: [],
    productos: [],
    mostrar_selector: false,
  };

  componentDidMount() {
    const {id, titulo, productos} = this.props.route.params;
    this.setState({nombre_plan: titulo});
    fetch(SERVER_ADDRESS + 'api/planes/' + id + '/', {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        const productos = r.planes.map((p) => {
          p.variaciones = p.variaciones.map((v) => {
            return {...v, ...{cantidad: v.cantidad_minima.toString()}};
          });
          if (p.formularios) {
            p.formularios = p.formularios.map((f) => {
              f.preguntas = f.preguntas.map((p) => ({
                ...p,
                ...{mostrar_selector: false},
              }));
              return f;
            });
          }
          return {...p, ...{seleccionado: false}};
        });
        this.setState({productos: productos});
      });
  }

  seleccionarProducto = (estado, id) => {
    this.setState(
      produce((draft) => {
        let producto = draft.productos.find((p) => p.id == id);

        if (estado) {
          //Validar los campos de las variaciones
          producto.variaciones.forEach((v) => {
            if (v.requerido) {
              Validaciones['variacion' + v.id] = {
                default_value: v.cantidad_minima,
                validacion: {
                  presence: {
                    allowEmpty: false,
                    message: '^Este campo es requerido',
                  },
                  numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: v.cantidad_minima,
                    lessThanOrEqualTo: v.cantidad_maxima,
                    message: '^Debe ser un número',
                    message: `^ La cantidad debe ser entre ${v.cantidad_minima} y ${v.cantidad_maxima}`,
                  },
                },
              };
            }
          });

          //Validar los campos de los formularios
          if (producto.formularios) {
            producto.formularios.forEach((f) => {
              f.preguntas
                .filter((p) => p.obligatorio)
                .forEach((p) => {
                  Validaciones['pregunta' + p.id] = {
                    default_value: '',
                    validacion: {
                      presence: {
                        allowEmpty: false,
                        message: 'Diligencie éste campo',
                      },
                    },
                  };
                  this.setState({values: {...{['pregunta' + p.id]: ''}}});
                });
            });
          }

          this.setState(
            produce((draft) => {
              Object.keys(Validaciones).forEach((k) => {
                draft.values[k] = Validaciones[k].default_value;
              });
            }),
          );
        } else {
          //Remover validaciones de las variaciones
          producto.variaciones.forEach((v) => {
            if (v.requerido) {
              delete Validaciones['variacion' + v.id];
            }
          });
          //Remover validaciones de los campos de los formularios
          producto.formularios.forEach((f) => {
            f.preguntas
              .filter((p) => p.obligatorio)
              .forEach((p) => {
                delete Validaciones['pregunta' + p.id];
              });
          });
        }
        producto.seleccionado = estado;
      }),
    );
  };

  modificarValorVariacion = (id_producto, id_variacion, cantidad) => {
    this.setState(
      produce((draft) => {
        console.log('Setear cantidad ', cantidad);
        draft.productos
          .find((p) => p.id == id_producto)
          .variaciones.find((v) => v.id == id_variacion).cantidad = cantidad;
      }),
    );
  };

  responderPregunta = (producto_id, k_f, k_p, k, v, pregunta_id) => {
    this.setState(
      produce((draft) => {
        draft.productos.find((p) => p.id == producto_id).formularios[
          k_f
        ].preguntas[k_p][k] = v;
        if (pregunta_id) {
          draft.values[pregunta_id] = v;
        }
      }),
    );
  };

  renderFormularios = (producto) => {
    if (!producto.seleccionado) {
      return;
    }

    if (producto.formularios) {
      return producto.formularios.map((f, k_f) => {
        const preguntas = f.preguntas.map((p, k_p) => {
          const props = {};
          if (p.obligatorio) {
            props.onBlur = () => {
              validar(
                this,
                p.respuesta,
                'pregunta' + p.id,
                Validaciones['pregunta' + p.id].validacion,
                false,
              );
            };
          }
          if (p.tipo_pregunta == 'areatext') {
            props.multilines = true;
            props.numberOfLines = 4;
          }
          if (p.tipo_pregunta == 'inputnumber') {
            props.keyboardType = 'decimal-pad';
          }
          //radiochoices
          return (
            <View key={k_p}>
              <Paragraph>{p.pregunta}:</Paragraph>
              {p.tipo_pregunta == 'input' ||
              p.tipo_pregunta == 'areatext' ||
              p.tipo_pregunta == 'inputnumber' ? (
                <TextInput
                  {...props}
                  value={p.respuesta}
                  onChangeText={(v) =>
                    this.responderPregunta(
                      producto.id,
                      k_f,
                      k_p,
                      'respuesta',
                      v,
                    )
                  }
                  style={{
                    borderRadius: 16,
                    borderColor: '#A2D9CE',
                    borderWidth: 1,
                  }}
                />
              ) : null}
              {p.tipo_pregunta == 'choice' ? (
                <View
                  style={{
                    borderRadius: 16,
                    borderColor: '#A2D9CE',
                    borderWidth: 1,
                    padding: 16,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.responderPregunta(
                        producto.id,
                        k_f,
                        k_p,
                        'mostrar_selector',
                        true,
                      )
                    }>
                    <Text>
                      {p.respuesta && p.respuesta != ''
                        ? p.opciones.find((o) => o.id == p.respuesta).opcion
                        : 'Seleccione'}
                    </Text>
                  </TouchableOpacity>
                  <ModalFilterPicker
                    visible={p.mostrar_selector}
                    onSelect={(p) => {
                      this.responderPregunta(
                        producto.id,
                        k_f,
                        k_p,
                        'respuesta',
                        p.key,
                        p.id145,
                      );
                      this.responderPregunta(
                        producto.id,
                        k_f,
                        k_p,
                        'mostrar_selector',
                        false,
                      );
                    }}
                    onCancel={() =>
                      this.responderPregunta(
                        producto.id,
                        k_f,
                        k_p,
                        'mostrar_selector',
                        false,
                      )
                    }
                    options={p.opciones.map((o) => ({
                      key: o.id,
                      label: o.opcion,
                    }))}
                  />
                </View>
              ) : null}
              {renderErrores(this, 'pregunta' + p.id)}
            </View>
          );
        });
        return <View style={{marginTop: 32}}>{preguntas}</View>;
      });
    }
  };

  renderVariaciones = (producto) => {
    if (!producto.seleccionado) {
      return;
    }
    return producto.variaciones.map((v, i) => {
      return (
        <View style={{marginLeft: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image source={{uri: v.icono}} style={{width: 32, height: 32}} />
            <Text style={{flex: 1, textAlign: 'center', color: '#566573'}}>
              {v.titulo}
            </Text>
          </View>
          {v.tipo_variacion == 'numerico' ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  backgroundColor: COLORS.PRIMARY_COLOR,
                  borderRadius: 24,
                  overflow: 'hidden',
                }}>
                <TextInput
                  keyboardType="decimal-pad"
                  underlineColorAndroid="transparent"
                  value={v.cantidad}
                  onChangeText={(cantidad) =>
                    this.modificarValorVariacion(producto.id, v.id, cantidad)
                  }
                  onBlur={() =>
                    validar(
                      this,
                      v.cantidad,
                      'variacion' + v.id,
                      Validaciones['variacion' + v.id].validacion,
                      false,
                    )
                  }
                  style={{
                    backgroundColor: '#ffff',
                    flex: 1,
                    fontSize: 24,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: COLORS.PRIMARY_COLOR,
                    borderTopLeftRadius: 24,
                    borderBottomLeftRadius: 24,
                  }}
                />
                <NumberFormat
                  value={v.valor * v.cantidad}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  renderText={(nf) => (
                    <Text
                      style={{
                        fontSize: 24,
                        color: '#ffff',
                        flex: 1,
                        textAlign: 'center',
                      }}>
                      {nf}
                    </Text>
                  )}
                />
              </View>

              {renderErrores(this, 'variacion' + v.id)}
            </>
          ) : null}
        </View>
      );
    });
  };

  total = () => {
    let total = 0;
    this.state.productos
      .filter((p) => p.seleccionado)
      .forEach((p) => {
        p.variaciones.forEach((v) => {
          total += v.cantidad * v.valor;
        });
      });
    return (
      <NumberFormat
        value={total}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
        renderText={(nf) => (
          <Text style={{fontSize: 32, color: '#ffff'}}>{nf}</Text>
        )}
      />
    );
  };

  guardar = () => {
    console.log(this.state.values);
    Object.keys(Validaciones).forEach((k) => {
      let value = this.state.values[k];
      console.log('INPUT ', k, ' VALOR ', value);
      validar(this, value, k, Validaciones[k].validacion, false);
    });
    setTimeout(() => {
      if (totalErrores(this) > 0) {
        Alert.alert(
          'Información faltante',
          'Diligencie la información faltante para continuar el proceso.',
        );
        return;
      }

      const {cliente} = this.props.route.params;
      console.log('Cliente ', cliente);
    });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: COLORS.PRIMARY_COLOR}}>
        <Loader loading={this.state.cargando} />

        <Navbar back title={this.state.nombre_plan} {...this.props} />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 32,
          }}>
          {this.total()}
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#eeeeee',
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
          }}>
          <ScrollView
            style={{flex: 1, padding: 16}}
            showsVerticalScrollIndicator={false}>
            <View style={{flex: 1, paddingBottom: 32}}>
              {this.state.productos.map((p, i) => (
                <Card
                  key={p.id}
                  style={{
                    marginTop: 8,
                    marginHorizontal: 16,
                    borderRadius: 24,
                  }}>
                  <Card.Content>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          color: COLORS.PRIMARY_COLOR,
                          fontSize: 18,
                          marginBottom: 16,
                        }}>
                        {p.titulo}
                      </Text>
                      <Switch
                        value={p.seleccionado}
                        onValueChange={(estado) =>
                          this.seleccionarProducto(estado, p.id)
                        }
                      />
                    </View>
                    {this.renderVariaciones(p)}
                    {this.renderFormularios(p)}
                  </Card.Content>
                </Card>
              ))}
              <Button
                buttonStyle={[
                  styleButton.wrapper,
                  {padding: 24, marginVertical: 16},
                ]}
                onPress={() => this.guardar()}
                title="Guardar"
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: COLORS.PRIMARY_COLOR,
  },
  inactiveDotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: '#6D5F6F',
  },
  containerStyle: {
    padding: 0,
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  item: {
    elevation: 1,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    width: itemWidth,
    overflow: 'hidden',
  },
  slider: {
    marginTop: 15,
    height: '80%',
    overflow: 'visible',
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
});
