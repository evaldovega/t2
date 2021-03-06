import React, {useState, useImperativeHandle, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NumberFormat from 'react-number-format';
import {
  COLORS,
  TEXTO_TAM,
  MARGIN_VERTICAL,
  CURVA,
  MARGIN_HORIZONTAL,
} from 'constants';
import {useImmer} from 'use-immer';
import {useNavigation} from '@react-navigation/native';
import Validator, {Execute} from 'components/Validator';
import {chunkArray} from 'utils';

const Variacion = React.forwardRef(
  ({data, producto, datosPrecargados, orderId}, ref) => {
    const navigation = useNavigation();
    const Validaciones = {};

    const {
      id,
      titulo,
      cantidad_minima,
      cantidad_maxima,
      tipo_variacion,
      valor,
      formularios: formulariosVariacion,
    } = data;

    const [formularios, setFormularios] = useImmer([]);
    const [cantidad, setCantidad] = useState(0);

    const show_minus =
      formulariosVariacion && formulariosVariacion.length > 0 ? false : true;

    const variacionAgregada = (item, index) => {
      const {formulario} = item;
      setFormularios((draft) => {
        if (index > -1) {
          draft[index] = formulario;
        } else {
          draft.push(formulario);
        }
        return draft;
      });
      console.log(index);
      if (index < 0) {
        setCantidad(parseInt(cantidad) + 1);
      }
    };

    const add = () => {
      if (cantidad + 1 > cantidad_maxima) {
        Alert.alert(
          'No puedes agregar mas',
          `Solo puedes agregar ${cantidad_maxima} ${titulo}`,
        );
        return;
      }

      if (formulariosVariacion.length > 0) {
        requestAnimationFrame(() => {
          navigation.push('VariacionFormulario', {
            variacion: data,
            callback: variacionAgregada,
            index_form: -1,
          });
        });
      } else {
        setCantidad(cantidad + 1);
      }
    };

    const remove = (index) => {
      if (cantidad - 1 < 0) {
        return;
      }
      if (formulariosVariacion.length > 0) {
        setFormularios((draft) => {
          draft.splice(index, 1);
        });
      }
      setCantidad(cantidad - 1);
    };

    const edit = (index_form, preguntas) => {
      navigation.push('VariacionFormulario', {
        variacion: data,
        preguntas: preguntas,
        index_form: index_form,
        orderId,
        callback: variacionAgregada,
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        valid: () => {
          return Execute(Validaciones)
            .then(() => {
              const variacion = {
                id,
                valor: cantidad > 0 ? valor * (cantidad - cantidad_minima) : 0,
                cantidad,
                formularios: [],
              };
              variacion.formularios = formularios.map((f) => {
                return {
                  id: f.id,
                  campos: f.preguntas.map((p) => ({
                    id: p.id,
                    respuesta: p.respuesta,
                  })),
                };
              });
              return variacion;
            })
            .catch((error) => {
              throw `Revisa la secci??n: ${titulo}`;
            });
        },
        cantidad,
        total: () => {
          return cantidad > 0 ? valor * (cantidad - cantidad_minima) : 0;
        },
        formularios,
      }),
      [cantidad, total],
    );

    useEffect(() => {
      if (datosPrecargados) {
        const {
          cantidad: cantidadGuardada,
          formulario: forms,
        } = datosPrecargados;

        console.log('Cantidad actual ', cantidadGuardada);
        if (cantidadGuardada) {
          setCantidad(parseInt(cantidadGuardada));
        }
        if (forms && forms.length > 0) {
          const formulariosNew = [];
          const formAdd = chunkArray(forms, forms[0].cantidad_preguntas);
          formAdd.forEach((f) => {
            formulariosNew.push({preguntas: f});
          });
          setFormularios((draft) => {
            draft = formulariosNew;
            return draft;
          });
        }
      }
    }, [datosPrecargados]);

    const total =
      cantidad > 0 ? parseInt(valor) * (cantidad - cantidad_minima) : 0;

    return (
      <>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: COLORS.NEGRO,
              fontFamily: 'Mont-Regular',
              fontSize: TEXTO_TAM * 0.7,
            }}>
            {titulo}
          </Text>

          {cantidad_minima ? (
            <Text
              style={{
                color: COLORS.MORADO,
                fontFamily: 'Mont-Regular',
                fontSize: TEXTO_TAM * 0.5,
              }}>
              Inclu??do {cantidad_minima}
            </Text>
          ) : null}
        </View>

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
                disabled={orderId}
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={remove}>
                <AntDesign name="minus" color={COLORS.NEGRO} />
              </TouchableOpacity>
            ) : null}

            <Text
              style={{
                fontSize: TEXTO_TAM,
                fontFamily: 'Mont-Regular',
                color: COLORS.NEGRO,
              }}>
              {cantidad}
            </Text>

            <TouchableOpacity
              disabled={orderId}
              style={{
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={add}>
              <AntDesign name="plus" color={COLORS.NEGRO} />
            </TouchableOpacity>
          </View>

          <NumberFormat
            value={total}
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
          {formularios.map((f, key_form) => {
            const {preguntas} = f;

            if (preguntas) {
              const subsanar = preguntas.some((p) => p.subsanar);
              const allowEdit = (orderId && subsanar) || !orderId;

              const body = preguntas.map((p) => p.respuesta).splice(0, 3);
              return (
                <>
                  <View
                    key={key_form}
                    style={{
                      marginTop: 10,
                      padding: 8,
                      backgroundColor: 'rgba(255,255,255,.3)',
                      flex: 1,
                      alignSelf: 'stretch',
                      flexDirection: 'row',
                      alignItems: 'center',
                      elevation: 2,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.2,
                    }}>
                    {allowEdit && (
                      <TouchableOpacity
                        onPress={() => edit(key_form, preguntas)}
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: COLORS.PRIMARY_COLOR,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: CURVA,
                        }}>
                        <AntDesign name="edit" size={18} color="#ffff" />
                      </TouchableOpacity>
                    )}

                    {body.map((b) => (
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'stretch',
                          marginHorizontal: MARGIN_HORIZONTAL / 2,
                        }}>
                        <Text style={{fontFamily: 'Mont-Regular'}}>{b}</Text>
                      </View>
                    ))}
                    <View>
                      {!orderId && (
                        <TouchableOpacity
                          disabled={orderId}
                          onPress={() => remove(key_form)}
                          style={{
                            width: 32,
                            height: 32,
                            backgroundColor: COLORS.PRIMARY_COLOR,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: CURVA,
                          }}>
                          <AntDesign name="minus" size={18} color="#ffff" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              );
            }
          })}
        </View>

        {cantidad_minima > 0 ? (
          <Validator
            value={cantidad}
            ref={(r) => (Validaciones[`variacion`] = r)}
            constraints={{
              numericality: {
                greaterThanOrEqualTo: cantidad_minima,
                lessThanOrEqualTo: cantidad_maxima,
                message: `^Ingrese m??nimo ${cantidad_minima} ${titulo}`,
              },
            }}
          />
        ) : null}
      </>
    );
  },
);

export default Variacion;
