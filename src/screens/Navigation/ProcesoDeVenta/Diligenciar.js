import React, {useEffect, useRef, useState} from 'react';

import {View, Alert, StatusBar, KeyboardAvoidingView} from 'react-native';

import Loader from 'components/Loader';

import {
  COLORS,
  CURVA,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
  SERVER_ADDRESS,
  TITULO_TAM,
  TEXTO_TAM,
} from 'constants';

import {addOrden} from 'redux/actions/Clients';
import Navbar from 'components/Navbar';

import ZoomIn from 'components/ZoomIn';

import {fetchConfig} from 'utils/Fetch';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FormularioGeneral from './components/FormularioGeneral';
import Variaciones from './components/Variaciones';
import Finalizar from './components/Finalizar';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useImmer} from 'use-immer';
import ColorfullContainer from 'components/ColorfullContainer';
import ModalInputPin from './components/Finalizar/ModalInputPin';

const Tab = createBottomTabNavigator();

const NegocioDiligenciarInformacion = ({navigation, route}) => {
  const [plan, setPlan] = useState({});
  const [planes, setPlanes] = useState([]);
  const [currentTab, setCurrentTab] = useState('Datos generales');
  const [orden, setOrden] = useImmer({});
  const [formularioGeneral, setFormularioGeneral] = useState({});
  const [loader, setLoader] = useState({cargando: false, msn: ''});
  const {id: planId, orden_id: orderId, cliente} = route.params;
  const formularioGeneralRef = useRef();
  const variacionesRef = useRef();
  navigation.setOptions({tabBarVisible: false});

  const cargarPlan = async () => {
    setLoader({cargando: true, msn: 'Cargando plan...'});
    const {url, headers} = await fetchConfig();

    return fetch(`${url}planes/${planId}/`, {headers})
      .then((r) => r.json())
      .then((data) => {
        //console.log(JSON.stringify(data));
        const {
          titulo,
          imagen,
          precio,
          comision_fijo,
          comision_variable,
          formularios,
          planes,
        } = data;

        setPlan({titulo, imagen, precio, comision_fijo, comision_variable});
        if (formularios.length) {
          setFormularioGeneral(formularios[0]);
        } else {
          setTimeout(() => {
            Alert.alert(
              'Lo sentimos',
              'No se han asignado campos para diligencias',
              [
                {
                  title: 'Ok',
                  onPress: () => {
                    navigation.pop();
                  },
                },
              ],
              {cancelable: false},
            );
          }, 600);
        }
        console.log('Planes ', planes);
        setPlanes(planes);
        setLoader({cargando: false, msn: ''});
      })
      .catch((error) => {
        setLoader({cargando: false, msn: ''});
      });
  };

  const cargarOrden = async () => {
    if (orderId) {
      console.log('Cargar orden ', orderId);
      setLoader({cargando: true, msn: 'Cargando Orden...'});
      const {url, headers} = await fetchConfig();
      fetch(`${url}ordenes/${orderId}/`, {headers})
        .then((r) => {
          console.log(r.status);
          return r;
        })
        .then((r) => r.json())
        .then((data) => {
          console.log(JSON.stringify(data));
          setOrden((draft) => {
            draft.pasarela_financiacion = data.pasarela_financiacion;
            draft.documentacion_adicional = data.documentacion_adicional;
            draft.frecuencia_pago = data.frecuencia_pago;
            draft.metodo_pago = data.metodo_pago;
            draft.planes = data.planes;
            draft.formulario = data.formulario;
            draft.numero_referencia = data.numero_referencia;
            return draft;
          });
        })
        .catch((error) => {
          console.log(`${url}ordenes/${orden_id}/`);
          console.log(headers);
          console.log(error);
        })
        .finally(() => {
          setTimeout(() => {
            setLoader({cargando: false, msn: ''});
          }, 800);
        });
    }
  };

  const init = async () => {
    await cargarPlan();
    cargarOrden();
  };

  const preventBack = () => {
    return new Promise((resolve, reject) => {
      switch (currentTab) {
        case 'Datos generales':
          resolve();
          break;
        case 'Variaciones':
          navigation.navigate('Datos generales');
          break;
        case 'Finalizar':
          if (planes.length == 0) {
            navigation.navigate('Datos generales');
          } else {
            navigation.navigate('Variaciones');
          }
          break;
      }
      reject('');
    });
  };

  useEffect(() => {
    init();
  }, []);

  const {cargando, msn} = loader;
  const {
    formulario: formularioGeneralPrecargado,
    planes: planesPrecargados,
  } = orden;

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <ModalInputPin customer={{}} cancel={null} onConfirm={null} />
      <View style={{flex: 1}}>
        <Loader loading={cargando} message={msn} />
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />

        <Navbar
          back
          preventBack={preventBack}
          title={plan.titulo}
          navigation={navigation}
        />

        <Tab.Navigator>
          <Tab.Screen
            name="Datos generales"
            options={(navigation) => ({
              tabBarVisible: false,
              backgroundColor: 'transparent',
            })}
            children={({navigation}) => (
              <FormularioGeneral
                orderId={orderId}
                setCurrentTab={setCurrentTab}
                navigation={navigation}
                ref={formularioGeneralRef}
                formulario={formularioGeneral}
                planes={planes.length}
                datosPrecargados={formularioGeneralPrecargado}
              />
            )}
          />
          <Tab.Screen
            name="Variaciones"
            setCurrentTab={setCurrentTab}
            options={(navigation) => ({tabBarVisible: false})}
            children={({navigation}) => (
              <Variaciones
                orderId={orderId}
                ref={variacionesRef}
                navigation={navigation}
                productos={planes}
                datosPrecargados={planesPrecargados}
                setCurrentTab={setCurrentTab}
              />
            )}
          />
          <Tab.Screen
            name="Finalizar"
            options={(navigation) => ({tabBarVisible: false})}
            children={({navigation}) => (
              <Finalizar
                orderId={orderId}
                navigation={navigation}
                cliente={cliente}
                plan={planId}
                precio={plan.precio}
                planes={planes.length}
                setCurrentTab={setCurrentTab}
                formularioGeneralRef={formularioGeneralRef}
                variacionesRef={variacionesRef}
                order={orden}
              />
            )}
          />
        </Tab.Navigator>
      </View>
    </KeyboardAvoidingView>
  );
};

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

export default NegocioDiligenciarInformacion;
