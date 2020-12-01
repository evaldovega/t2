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
import {Text, Paragraph} from 'react-native-paper';
import {Button} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import produce from 'immer';
import scour from 'scourjs';
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
    const {id, titulo, productos} = this.props.route.params;
    this.setState({nombre_plan: titulo});
    fetch(SERVER_ADDRESS + 'api/planes/' + id + '/', {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let data = {
          plan: '',
          cliente: '',
          total_pagado: 0,
          metodo_pago: '',
          planes: [],
        };

        const productos = r.planes.map((p) => {
          let plan = {id: p.id, variaciones: []};

          p.variaciones = p.variaciones.map((v) => {
            let variacion = {id: v.id, valor: v.cantidad_minima};
            if (v.formularios) {
              //variaciones.formularios=[]
            }
            return {...v, ...{cantidad: v.cantidad_minima.toString()}};
          });

          if (p.formularios) {
            plan.formularios = [];
            p.formularios = p.formularios.map((f) => {
              let formulario = {id: f.id, campos: []};
              f.preguntas = f.preguntas.map((p) => {
                formulario.campos.push({id: p.id, respuesta: ''});
                return {
                  ...p,
                  ...{mostrar_selector: false},
                };
              });
              plan.formularios.push(formulario);
              return f;
            });
          }
          data.planes.push(plan);

          return {...p, ...{seleccionado: false}};
        });

        console.log(data.planes);
        this.setState({productos: productos});
      })
      .catch((error) => {
        console.log(error);
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
            <View style={{marginTop: 16}} key={k_p}>
              <Text style={{fontFamily: 'Roboto-Light', fontSize: 14}}>
                {p.pregunta}:
              </Text>
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
                    padding: 8,
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
                      console.log(
                        'Opcion seleccionada ',
                        producto.id,
                        k_f,
                        k_p,
                        p.key,
                        p,
                      );
                      this.responderPregunta(
                        producto.id,
                        k_f,
                        k_p,
                        'respuesta',
                        p.key,
                        p.id,
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

  renderVariantionForm = (form) => {
    console.log(form.titulo);
    return (
      <View style={{width: '100%'}}>
        <Text>{form.titulo}</Text>
      </View>
    );
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

              <Carousel
                data={v.formularios}
                renderItem={this.renderVariantionForm}
                sliderWidth={width}
                itemWidth={width}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={0.4}
              />
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
          marginHorizontal: 16,
          borderRadius: 24,
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          borderWidth: 0.2,
        }}>
        <View style={{padding: 16}}>
          <View
            style={{
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
              {p.titulo}
            </Text>
            <Switch
              value={p.seleccionado}
              onValueChange={(estado) => this.seleccionarProducto(estado, p.id)}
            />
          </View>
          {this.renderVariaciones(p)}
          {this.renderFormularios(p)}
        </View>
      </View>
    );
  };

  guardar = () => {
    const productsSelected = this.state.productos.find((p) => p.seleccionado);
    if (!productsSelected) {
      Alert.alert('Selecciona algunos productos', '');
      return;
    }
    console.log(this.state.values);
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
        return;
      }

      const {cliente} = this.props.route.params;
      console.log('Cliente ', cliente);
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
