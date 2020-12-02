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
  useColorScheme,
} from 'react-native';
import {Text, Card, FAB, DataTable} from 'react-native-paper';
import {Button} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import TextInputMask from 'react-native-text-input-mask';
import produce from 'immer';
import Loader from 'components/Loader';
import GradientContainer from 'components/GradientContainer';
import Carousel, {Pagination} from 'react-native-snap-carousel';

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
import PlanFormulario from './PlanFormulario';

const {width, height} = Dimensions.get('screen');
let Validaciones = {};

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
    saludo: {msn: 'Hola'},
    data: {},
  };

  componentDidMount() {
    const {id, titulo, productos, precio} = this.props.route.params;
    this.setState({nombre_plan: titulo, precio: precio, cargando: true});
    fetch(SERVER_ADDRESS + 'api/planes/' + id + '/', {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        const formularios = r.formularios.map((formulario) => {
          formulario.preguntas = formulario.preguntas.map((pregunta) => {
            return {...pregunta, ...{mostrar_selector: false, respuesta: ''}};
          });
          return formulario;
        });

        const productos = r.planes.map((producto) => {
          producto.variaciones = producto.variaciones.map((v) => {
            return {
              ...v,
              ...{
                _formularios: [],
                cantidad: 0,
                cantidad_min: v.cantidad_minima.toString(),
              },
            };
          });

          if (producto.formularios) {
            producto.formularios = producto.formularios.map((f) => {
              f.preguntas = f.preguntas.map((p) => {
                return {
                  ...p,
                  ...{
                    producto: producto.id,
                    mostrar_selector: false,
                    respuesta: '',
                  },
                };
              });
              return f;
            });
          }

          return {...producto, ...{seleccionado: false}};
        });

        this.setState({
          productos: productos,
          formularios: formularios,
          cargando: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({cargando: false});
        Alert.alert('Información no cargada', 'Intentelo nuevamente');
        this.props.navigation.pop();
      });
    /*
      setTimeout(()=>{
        this.setState(function(prev,current){
          console.log("Update state")
          let state=scour(prev).set('saludo.msn','chao')
            return state.get('saludo.msn').value
        })
        
      },5000)*/
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

  //********************* VARIACION *****************/

  variacionAgregada = (data) => {
    const {plan, variacion, formulario} = data;
    this.setState(
      produce((draft) => {
        let v = draft.productos
          .find((p) => p.id == plan)
          .variaciones.find((v) => v.id == variacion);
        v._formularios.push(formulario);
        v.cantidad++;
      }),
    );
  };

  removerFormularioVariation = (variacion, key_form) => {
    const {plan, id} = variacion;
    this.setState(
      produce((draft) => {
        let v = draft.productos
          .find((p) => p.id == plan)
          .variaciones.find((v) => v.id == id);
        v._formularios.splice(key_form, 1);
        v.cantidad--;
      }),
    );
  };

  addVariation = (variacion) => {
    if (variacion.formularios && variacion.formularios.length > 0) {
      requestAnimationFrame(() => {
        this.props.navigation.push('VariacionFormulario', {
          variacion: variacion,
          variacionAgregada: this.variacionAgregada,
        });
      });
    } else {
      this.setState(
        produce((draft) => {
          draft.productos
            .find((p) => p.id == variacion.plan)
            .variaciones.find((v) => v.id == variacion.id).cantidad += 1;
        }),
      );
    }
  };
  //producto_id, k_f, k_p, k, v, pregunta_id
  responderPregunta = (pregunta, campo, valor) => {
    this.setState(
      produce((draft) => {
        draft.productos
          .find((p) => p.id == pregunta.producto)
          .formularios.find((f) => f.id == pregunta.formulario)
          .preguntas.find((p) => p.id == pregunta.id)[campo] = valor;
        draft.values['pregunta' + pregunta.id] = valor;
      }),
    );
  };

  //--------------Choice
  abrirOpciones = (pregunta, estado = true) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.productos
          .find((p) => p.id == pregunta.producto)
          .formularios.find((f) => f.id == pregunta.formulario)
          .preguntas.find((p) => p.id == pregunta.id);
        _pregunta.mostrar_selector = estado;
      }),
    );
    this.onBlur(pregunta);
  };
  seleccionarOpcion = (pregunta, opcion) => {
    this.setState(
      produce((draft) => {
        let _pregunta = draft.productos
          .find((p) => p.id == pregunta.producto)
          .formularios.find((f) => f.id == pregunta.formulario)
          .preguntas.find((p) => p.id == pregunta.id);
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
              this.responderPregunta(pregunta, 'respuesta', value);
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
              this.responderPregunta(pregunta, 'respuesta', formatted);
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

  renderFormulario = (formulario) => {
    return (
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
            marginBottom: 24,
          }}>
          {formulario.titulo}
        </Text>
        {this.renderPreguntas(formulario)}
      </View>
    );
  };

  renderFormularios = (producto) => {
    if (!producto.seleccionado) {
      console.log('Producto no seleccionado');
      return;
    }
    if (producto.formularios) {
      return producto.formularios.map((formulario, k_f) => {
        return this.renderFormulario(formulario);
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
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: '#566573',
                fontFamily: 'Roboto-Medium',
                fontSize: 16,
                marginTop: 24,
                marginBottom: 20,
              }}>
              {v.titulo}
            </Text>
          </View>
          {v.tipo_variacion == 'numerico' ? (
            <>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 18}}>{v.cantidad}</Text>
                <NumberFormat
                  value={v.valor * v.cantidad}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  renderText={(nf) => (
                    <Text
                      style={{
                        fontSize: 24,
                        flex: 1,
                        textAlign: 'center',
                      }}>
                      {nf}
                    </Text>
                  )}
                />
                <FAB
                  icon="plus"
                  small
                  style={{
                    backgroundColor: COLORS.BG_GRAY,
                    borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                    borderWidth: 0.2,
                    elevation: 0,
                  }}
                  onPress={() => this.addVariation(v)}
                />
              </View>

              {renderErrores(this, 'variacion' + v.id)}

              <View
                style={{
                  marginTop: 16,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {v._formularios.map((f, key_form) => {
                  const {preguntas} = f;
                  if (preguntas) {
                    const header = preguntas
                      .map((p) => p.pregunta)
                      .splice(0, 3);
                    const body = preguntas.map((p) => p.respuesta).splice(0, 3);

                    return (
                      <React.Fragment>
                        {key_form == 0 ? (
                          <View
                            style={{
                              flex: 1,
                              alignSelf: 'stretch',
                              flexDirection: 'row',
                            }}>
                            {header.map((h, index_header) => (
                              <View style={{flex: 1, alignSelf: 'stretch'}}>
                                <Text style={{fontFamily: 'Roboto-Black'}}>
                                  {h}
                                </Text>
                              </View>
                            ))}
                            <View></View>
                          </View>
                        ) : null}
                        <View
                          style={{
                            marginTop: 8,
                            borderBottomWidth: 0.2,
                            borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                            flex: 1,
                            alignSelf: 'stretch',
                            flexDirection: 'row',
                          }}>
                          {body.map((b) => (
                            <View style={{flex: 1, alignSelf: 'stretch'}}>
                              <Text style={{fontFamily: 'Roboto-Light'}}>
                                {b}
                              </Text>
                            </View>
                          ))}
                          <View>
                            <FAB
                              icon="minus"
                              small
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: COLORS.ACCENT,
                                borderWidth: 0.2,
                                elevation: 0,
                              }}
                              color={COLORS.ACCENT}
                              onPress={() =>
                                this.removerFormularioVariation(v, key_form)
                              }
                            />
                          </View>
                        </View>
                      </React.Fragment>
                    );
                  }
                })}
              </View>
            </>
          ) : null}
        </View>
      );
    });
  };

  total = () => {
    let total = parseFloat(this.state.precio);
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
          <Text
            style={{
              fontSize: 32,
              color: COLORS.PRIMARY_COLOR,
              fontFamily: 'Roboto-Medium',
            }}>
            {nf}
          </Text>
        )}
      />
    );
  };

  renderProduct = (p) => {
    return (
      <View
        key={p.id}
        style={{
          paddingVertical: 16,
          marginTop: 16,
          borderRadius: 24,
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          borderWidth: 0.2,
        }}>
        <React.Fragment>
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Image
              source={{uri: p.imagen}}
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                marginRight: 16,
                borderWidth: 0.2,
                borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
              }}
            />
            <Text
              style={{
                flex: 1,
                color: COLORS.SECONDARY_COLOR_LIGHTER,
                fontSize: 18,
                marginBottom: 16,
                fontFamily: 'Roboto-Medium',
              }}>
              {p.id} {p.titulo}
            </Text>
            <Switch
              value={p.seleccionado}
              onValueChange={(estado) => this.seleccionarProducto(estado, p.id)}
            />
          </View>
          {this.renderFormularios(p)}
          <View style={{paddingHorizontal: 16}}>
            {this.renderVariaciones(p)}
          </View>
        </React.Fragment>
      </View>
    );
  };

  guardar = async () => {
    this.setState({cargando: true});
    let hubo_errores = false;
    let total = parseFloat(this.state.precio);
    this.state.productos
      .filter((p) => p.seleccionado)
      .forEach((p) => {
        p.variaciones.forEach((v) => {
          total += v.cantidad * v.valor;
        });
      });

    const {id, titulo, productos} = this.props.route.params;
    const {cliente} = this.props.route.params;

    let data = {
      plan: id,
      cliente: cliente,
      total_pagado: total,
      metodo_pago: 'contado',
      planes: [],
      formularios: [],
    };

    for await (let formulario of this.state.formularios) {
      let total_errores = await this['ref-form-' + formulario.id].validar();
      console.log('Errores ', total_errores);
      if (total_errores > 0) {
        hubo_errores = true;
        Alert.alert(
          formulario.titulo,
          'Diligencie la información faltante para continuar el proceso.',
        );
        this.setState({cargando: false});
        return;
      } else {
        data.formularios.push(
          this['ref-form-' + formulario.id].obtenerValores(),
        );
      }
    }
    if (hubo_errores) {
      return;
    }

    const productsSelected = this.state.productos.find((p) => p.seleccionado);
    if (!productsSelected) {
      Alert.alert('Selecciona algunos productos', '');
      this.setState({cargando: false});
      return;
    }

    Object.keys(Validaciones).forEach((k) => {
      let value = this.state.values[k];
      validar(this, value, k, Validaciones[k].validacion, false);
    });

    setTimeout(() => {
      if (totalErrores(this) > 0) {
        Alert.alert(
          'Información faltante',
          'Diligencie la información faltante para continuar el proceso.',
        );
        this.setState({cargando: false});
        return;
      }

      this.state.productos
        .filter((p) => p.seleccionado)
        .forEach((p) => {
          let plan = {id: p.id, variaciones: [], formularios: []};

          p.variaciones.forEach((v) => {
            let variacion = {id: v.id, valor: v.cantidad, formularios: []};
            v._formularios.forEach((f) => {
              variacion.formularios.push({
                id: f.id,
                campos: f.preguntas.map((p) => ({
                  id: p.id,
                  respuesta: p.respuesta,
                })),
              });
            });
            plan.variaciones.push(variacion);
          });

          p.formularios.forEach((f) => {
            let formulario = {
              id: f.id,
              campos: f.preguntas.map((p) => ({
                id: p.id,
                respuesta: p.respuesta,
              })),
            };
            plan.formularios.push(formulario);
          });

          data.planes.push(plan);
        });

      console.log(JSON.stringify(data));
      fetch(SERVER_ADDRESS + 'api/ordenes/registrar/', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          Authorization: 'Token ' + this.props.token,
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      })
        .then((r) => r.json())
        .then((r) => {
          console.log(r);
          this.setState({guardando: false});
          setTimeout(() => {
            Alert.alert(
              'Orden ' + r.numero_orden + ' ' + r.estado_orden_str,
              'Instrucciones enviadas a ' +
                r.cliente_str +
                ' para finalizar el proceso de compra.',
            );
            this.props.navigation.pop();
          }, 800);
        })
        .catch((error) => {
          console.log(error);
          this.setState({cargando: false});
        });
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <GradientContainer style={{flex: 1}}>
          <Loader loading={this.state.cargando} />
          <Navbar back title={this.state.nombre_plan} {...this.props} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBotton: 8,
            }}>
            {this.total()}
          </View>
          <View
            style={{
              position: 'relative',
            }}></View>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                margin: 16,
              }}>
              <View style={{flex: 1, paddingBottom: 32}}>
                {this.state.formularios.map((formulario) => (
                  <PlanFormulario
                    ref={(r) => (this[`ref-form-${formulario.id}`] = r)}
                    formulario={formulario}
                  />
                ))}

                {this.state.productos.map((p, i) => this.renderProduct(p))}

                <Button
                  buttonStyle={[styleButton.wrapper, {fontSize: 32}]}
                  onPress={() => this.guardar()}
                  title="Vender"
                />
              </View>
            </View>
          </ScrollView>
        </GradientContainer>
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
