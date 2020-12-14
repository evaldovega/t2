import React from 'react';
import {
  View,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Switch,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-paper';
import NumberFormat from 'react-number-format';
import produce from 'immer';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Loader from 'components/Loader';
import ColorfullContainer from 'components/ColorfullContainer';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Select from 'components/Select';
import FileSelector from 'components/FileSelector';

import {
  COLORS,
  CURVA,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
  SERVER_ADDRESS,
  TITULO_TAM,
  TEXTO_TAM,
} from 'constants';
import {connect} from 'react-redux';
import {addOrden} from 'redux/actions/Clients';
import Navbar from 'components/Navbar';
import PlanFormulario from './PlanFormulario';
import ZoomIn from 'components/ZoomIn';
import Validator, {Execute} from 'components/Validator';
import {chunkArray} from 'utils';
import Cover from 'components/Cover';
const {width, height} = Dimensions.get('screen');

class AdquirirPlan extends React.Component {
  state = {
    btn_txt: 'Vender',
    marginTop: 1,
    amount: 0,
    indexActive: 0,
    nombre_plan: '',
    cargando: false,
    formularios: [],
    productos: [],
    mostrar_selector: false,
    data: {},
  };
  Validations = {};

  loadPlan = (id) => {
    this.setState({cargando: true, msn: 'Cargando plan...'});
    return fetch(SERVER_ADDRESS + 'api/planes/' + id + '/', {
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
          titulo: r.titulo,
          imagen: r.imagen,
          precio: r.precio,
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
  };

  loadOrder = (id) => {
    try {
      this.setState({
        btn_txt: 'Subsanar',
        cargando: true,
        msn: 'Cargando orden...',
      });
      fetch(SERVER_ADDRESS + 'api/ordenes/' + id + '/')
        .then((r) => r.json())
        .then((data) => {
          //this.state.formularios
          const form_order = data.formulario;
          const planes_guardades = data.planes;
          this.setState({
            documentacion_adicional: data.documentacion_adicional,
          });

          this.setState(
            produce((draft) => {
              draft.metodo_pago = data.metodo_pago;
              if (draft.metodo_pago == 'financiacion') {
                draft.numero_referencia = data.identificacion_cliente;
              }
              draft.formularios = draft.formularios.map((form) => {
                form.preguntas = form.preguntas.map((p) => {
                  let pregunta_precargada = form_order.find(
                    (fo) => fo.pregunta == p.id && fo.formulario == form.id,
                  );
                  if (pregunta_precargada) {
                    p.respuesta = pregunta_precargada.opcion_respuesta
                      ? pregunta_precargada.opcion_respuesta
                      : pregunta_precargada.respuesta;
                  } else {
                    console.log('pregunta no encontrada');
                  }
                  return p;
                });
                return form;
              });

              draft.productos = draft.productos.map((producto) => {
                let producto_guardado = planes_guardades.find(
                  (p) => p.plan == producto.plan_hijo,
                );
                if (producto_guardado) {
                  producto.seleccionado = true;
                  producto.variaciones = producto.variaciones.map(
                    (variacion) => {
                      const v = producto_guardado.variaciones.find(
                        (_v) =>
                          parseInt(_v.variacion) == parseInt(variacion.id),
                      );
                      if (v) {
                        variacion.cantidad = parseInt(v.valor);
                        if (v.formulario.length > 0) {
                          const formularios = chunkArray(
                            v.formulario,
                            v.formulario.length / parseInt(v.valor),
                          );
                          formularios.forEach((items) => {
                            const formulario_variacion = {
                              id: items[0].formulario,
                              preguntas: [],
                            };
                            items.forEach((item) => {
                              formulario_variacion.preguntas.push({
                                id: item.pregunta,
                                pregunta: item.pregunta_str,
                                respuesta: item.opcion_respuesta
                                  ? item.opcion_respuesta
                                  : item.respuesta,
                              });
                            });
                            variacion._formularios.push(formulario_variacion);
                          });
                        }
                      }
                      return variacion;
                    },
                  );
                }
                return producto;
              });

              draft.cargando = false;
            }),
          );
        });
    } catch (error) {
      this.props.navigation.pop();
      Alert.alert('No se pudo cargar la orden', error.toString());
    }
  };

  componentDidMount() {
    const {id, orden_id} = this.props.route.params;
    this.loadPlan(id).then(() => {
      if (orden_id) {
        this.loadOrder(orden_id);
      }
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
        } else {
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

  editFormularioVariation = (variacion, index_form, preguntas) => {
    requestAnimationFrame(() => {
      this.props.navigation.push('VariacionFormulario', {
        variacion: variacion,
        preguntas: preguntas,
        index_form: index_form,
        variacionAgregada: this.variacionEditada,
      });
    });
  };
  variacionEditada = (data, index_form) => {
    const {plan, variacion, formulario} = data;
    this.setState(
      produce((draft) => {
        let v = draft.productos
          .find((p) => p.id == plan)
          .variaciones.find((v) => v.id == variacion);
        v._formularios[index_form] = formulario;
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

  removeVariation = (variacion) => {
    this.setState(
      produce((draft) => {
        draft.productos
          .find((p) => p.id == variacion.plan)
          .variaciones.find((v) => v.id == variacion.id).cantidad -= 1;
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

  renderVariaciones = (producto) => {
    if (!producto.seleccionado) {
      return;
    }

    return producto.variaciones.map((v, i) => {
      const show_minus =
        v.formularios && v.formularios.length > 0 ? false : true;
      return (
        <View style={{}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: COLORS.NEGRO,
                fontFamily: 'Mont-Regular',
                fontSize: TEXTO_TAM * 0.7,
              }}>
              {v.titulo}
            </Text>
            {v.cantidad_min && (
              <Text
                style={{
                  color: COLORS.MORADO,
                  fontFamily: 'Mont-Regular',
                  fontSize: TEXTO_TAM * 0.5,
                }}>
                Gratis {v.cantidad_min}
              </Text>
            )}
          </View>
          {v.tipo_variacion == 'numerico' ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: MARGIN_VERTICAL,
                }}>
                <View
                  style={{
                    width: '40%',
                    flexDirection: 'row',
                    padding: MARGIN_VERTICAL,
                    backgroundColor: COLORS.BLANCO,
                    borderRadius: CURVA,
                    elevation: 3,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {show_minus ? (
                    <TouchableOpacity
                      style={{
                        width: 32,
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => this.removeVariation(v)}>
                      <AntDesign name="minus" color={COLORS.NEGRO} />
                    </TouchableOpacity>
                  ) : null}
                  <Text
                    style={{
                      fontSize: TEXTO_TAM,
                      fontFamily: 'Mont-Regular',
                      color: COLORS.NEGRO,
                    }}>
                    {v.cantidad}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: 32,
                      height: 32,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.addVariation(v)}>
                    <AntDesign name="plus" color={COLORS.NEGRO} />
                  </TouchableOpacity>
                </View>

                <NumberFormat
                  value={v.valor * (v.cantidad - v.cantidad_min)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  renderText={(nf) => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: MARGIN_HORIZONTAL,
                        backgroundColor: 'rgba(110,85,246,.1)',
                        borderRadius: CURVA,
                        paddingHorizontal: MARGIN_HORIZONTAL,
                      }}>
                      <Text
                        style={{
                          fontSize: TEXTO_TAM,
                          fontFamily: 'Mont-Regular',
                          color: COLORS.NEGRO_N1,
                        }}>
                        {nf}
                      </Text>
                    </View>
                  )}
                />
              </View>

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
                        <View
                          style={{
                            marginTop: 8,
                            borderBottomWidth: 0.2,
                            borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                            flex: 1,
                            alignSelf: 'stretch',
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.editFormularioVariation(
                                v,
                                key_form,
                                preguntas,
                              )
                            }
                            style={{
                              width: 32,
                              height: 32,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderColor: COLORS.NEGRO_N1,
                              borderRadius: CURVA,
                              borderWidth: 0.3,
                            }}>
                            <AntDesign name="edit" />
                          </TouchableOpacity>

                          {body.map((b) => (
                            <View
                              style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                marginHorizontal: MARGIN_HORIZONTAL / 2,
                              }}>
                              <Text style={{fontFamily: 'Mont-Regular'}}>
                                {b}
                              </Text>
                            </View>
                          ))}
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                this.removerFormularioVariation(v, key_form)
                              }
                              style={{
                                width: 32,
                                height: 32,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: COLORS.NEGRO_N1,
                                borderRadius: CURVA,
                                borderWidth: 0.3,
                              }}>
                              <AntDesign name="minus" />
                            </TouchableOpacity>
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
        p.variaciones.forEach((v, i) => {
          if (v.cantidad_min) {
            if (v.cantidad > parseInt(v.cantidad_min)) {
              total += v.cantidad * v.valor;
            }
          } else {
            total += v.cantidad * v.valor;
          }
        });
      });
    return (
      <ZoomIn>
        <NumberFormat
          value={total}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
          renderText={(nf) => (
            <Text
              style={{
                fontSize: TITULO_TAM * 1.3,
                color: COLORS.BLANCO,
                textAlign: 'center',
                fontFamily: 'Mont-Bold',
                marginBottom: MARGIN_VERTICAL * 3,
              }}>
              {nf}
            </Text>
          )}
        />
      </ZoomIn>
    );
  };

  renderProduct = (p, key) => {
    return (
      <View
        key={p.id}
        style={{
          paddingVertical: MARGIN_HORIZONTAL,
          borderTopWidth: key > 0 ? 0.3 : 0,
          borderColor: '#EAE8EA',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              flex: 1,
              color: COLORS.NEGRO,
              fontSize: TITULO_TAM * 0.7,
              marginBottom: 16,
              fontFamily: 'Mont-Bold',
            }}>
            {p.titulo}
          </Text>
          <Switch
            value={p.seleccionado}
            onValueChange={(estado) => this.seleccionarProducto(estado, p.id)}
          />
        </View>

        {this.renderVariaciones(p)}
      </View>
    );
  };

  guardar = () => {
    this.setState({cargando: true, msn: 'Guardando Orden'});
    requestAnimationFrame(async () => {
      let total = parseFloat(this.state.precio);
      this.state.productos
        .filter((p) => p.seleccionado)
        .forEach((p) => {
          p.variaciones.forEach((v) => {
            if (v.cantidad_min) {
              if (v.cantidad > parseInt(v.cantidad_min)) {
                total += v.cantidad * v.valor;
              }
            } else {
              total += v.cantidad * v.valor;
            }
          });
        });

      const {id, cliente} = this.props.route.params;

      let data = {
        plan: id,
        cliente: cliente,
        total_pagado: total,
        metodo_pago: '',
        planes: [],
        formularios: [],
      };

      Execute(this.Validations)
        .then(async () => {
          data.metodo_pago = this.state.metodo_pago;
          data.numero_referencia = this.state.numero_referencia;
          data.archivo = this.state.archivo_contrato;
          let hubo_errores = false;
          for await (let formulario of this.state.formularios) {
            let total_errores = this['ref-form-' + formulario.id].validar();
            if (total_errores.length > 0) {
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
          const productsSelected = this.state.productos.find(
            (p) => p.seleccionado,
          );
          if (!productsSelected) {
            Alert.alert('Selecciona algunos productos', '');
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
          //-----_Enviar console.log(JSON.stringify(data));
          const method = this.props.route.params.orden_id ? 'PUT' : 'POST';
          if (this.props.route.params.orden_id) {
            data.orden = this.props.route.params.orden_id;
          }
          try {
            fetch(SERVER_ADDRESS + 'api/ordenes/registrar/', {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                Authorization: 'Token ' + this.props.token,
                Accept: 'application/json',
                'content-type': 'application/json',
              },
            })
              .then((r) => r.json())
              .then((r) => {
                this.setState({cargando: false});
                if (r.error) {
                  Alert.alert(r.error, '');
                } else {
                  if (r.numero_orden) {
                    this.props.navigation.navigate('ClientProfile');
                    Alert.alert(
                      'Orden ' + r.numero_orden + ' ' + r.estado_orden_str,
                      'Instrucciones enviadas a ' +
                        r.cliente_str +
                        ' para finalizar el proceso de compra.',
                      [
                        {
                          text: 'Perfecto',
                          onPress: () => {
                            this.props.addOrden(r);
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  } else {
                    console.log(r);
                    this.setState({cargando: false});
                  }
                }
              })
              .catch((error) => {
                console.log(error);
                this.setState({cargando: false});
                Alert.alert('Orden no guardada', error.toString());
              });
          } catch (error) {
            this.setState({cargando: false});
            Alert.alert('Error al guardar', error.toString());
          }
        })
        .catch((error) => {
          this.setState({cargando: false});
        });
    });
  };

  renderFinanciacion = () => {
    return (
      <View>
        <FileSelector
          marginTop={1}
          onSelect={(doc) => {
            this.setState({archivo_contrato: doc});
          }}
        />
        {!this.state.documentacion_adicional ? (
          <Validator
            ref={(r) => (this.Validations['archivo_contrato'] = r)}
            value={this.state.archivo_contrato}
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
          ref={(r) => (this.Validations['numero_referencia'] = r)}
          value={this.state.numero_referencia}
          required="Ingrese el número de contrato con la entidad">
          <InputText
            marginTop={1}
            label="Número de contrato"
            placeholder="Número de contrato"
            marginTop={2}
            value={this.state.numero_referencia}
            onChangeText={(t) => this.setState({numero_referencia: t})}
          />
        </Validator>
      </View>
    );
  };

  coverRender = (size) => {
    console.log(size.height);
    if (size) {
      this.setState({marginTop: size.height});
    }
  };

  render() {
    const {imagen, titulo, msn, marginTop} = this.state;

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
          <Loader loading={this.state.cargando} message={msn} />
          <StatusBar
            translucent={true}
            backgroundColor={'transparent'}
            barStyle={'light-content'}
          />
          <Cover
            uri={imagen}
            style={{height: '25%'}}
            onRender={this.coverRender}
          />

          <Navbar
            transparent
            back
            title={titulo}
            {...this.props}
            icon_color={COLORS.BLANCO}
            style_title={{color: COLORS.BLANCO}}
          />

          {this.total()}

          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                marginHorizontal: MARGIN_HORIZONTAL,
              }}>
              <View style={{flex: 1, paddingBottom: 32}}>
                {this.state.formularios.map((formulario) => (
                  <PlanFormulario
                    ref={(r) => (this[`ref-form-${formulario.id}`] = r)}
                    formulario={formulario}
                  />
                ))}

                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,.5)',
                    borderRadius: CURVA,
                    paddingHorizontal: MARGIN_HORIZONTAL,
                    marginTop: MARGIN_VERTICAL,
                  }}>
                  {this.state.productos.map((p, i) => this.renderProduct(p, i))}
                </View>

                {!this.state.cargando && (
                  <Validator
                    ref={(r) => (this.Validations['metodo_pago'] = r)}
                    value={this.state.metodo_pago}
                    required="Seleccione un metodo de pago">
                    <Select
                      marginTop={1}
                      value={this.state.metodo_pago}
                      placeholder="Metodo pago"
                      onSelect={(v) => {
                        this.setState({metodo_pago: v.key});
                      }}
                      options={[
                        {key: 'contado', label: 'Contado'},
                        {key: 'financiacion', label: 'Financiación'},
                      ]}
                    />
                  </Validator>
                )}

                {this.state.metodo_pago == 'financiacion'
                  ? this.renderFinanciacion()
                  : null}

                {!this.state.cargando && (
                  <Button
                    marginTop={4}
                    onPress={() => this.guardar()}
                    title={this.state.btn_txt}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </ColorfullContainer>
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
