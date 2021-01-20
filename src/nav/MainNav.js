import 'react-native-gesture-handler';
import React, {memo, useCallback, useRef, Suspense} from 'react';
import {StatusBar, Text} from 'react-native';
import {
  NavigationContainer,
  navigationRef,
  Navigator,
  ROUTERS,
  Screen,
} from 'utils/navigation';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
// @ts-ignore

import Presentation from 'screens/Presentation';
import FQA from 'screens/FQA';

import ForgotPass from 'screens/ForgotPass';
import SignIn from 'screens/SiginIn';

import Notification from 'screens/Notification';
import SignUp from 'screens/SignUp';
import Master from '../screens/Master';

import CapacitacionDetalle from '../screens/Master/Capacitacion/Detalle';
import Actividad from '../screens/Master/Capacitacion/Actividad';
import ClienteSelector from '../screens/Master/Client/Selector';
const delay = 300;

const ClientSave = React.lazy(() => import('../screens/Master/Client/Save'));
const ContactToClient = React.lazy(() =>
  import('../screens/Master/Client/Import'),
);
const ClientProfile = React.lazy(() =>
  import('../screens/Master/Client/Profile'),
);
const ProductList = React.lazy(() => import('../screens/Master/Product/List'));

const ProductDetail = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(import('../screens/Master/Product/Detail')),
      delay,
    );
  });
});

const Plan = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('../screens/Master/Product/Plan')), delay);
  });
});
const Planes = React.lazy(() => {
  return Promise.all([
    import('../screens/Master/AdquirirPlan/Planes'),
    new Promise((resolve) => setTimeout(resolve, delay)),
  ]).then(([moduleExports]) => moduleExports);
});

import PlanDetale from 'screens/Master/AdquirirPlan/PlanDetalle';
import AdquirirPlan from '../screens/Master/AdquirirPlan/Completar';
import VariacionFormulario from '../screens/Master/AdquirirPlan/VariacionFormulario';
import MetaGuardar from '../screens/Meta/Guardar';

const TaskSave = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('../screens/Master/Task/Save')), delay);
  });
});

const SelecctorArchivo = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('../components/SelecctorArchivo')), delay);
  });
});

import OrdenDetalle from 'screens/Master/Client/OrdenDetalle';

import LoaderModule from '../components/LoaderModules';
import {Provider} from 'react-redux';
import configureStore from '../redux/configuracion';
import {COLORS} from 'constants';

const store = configureStore();

const optionNavigator: any = {
  headerShown: false,
  gesturesEnabled: false,
};

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.PRIMARY_COLOR,
    accent: COLORS.PRIMARY_COLOR,
  },
  animation: {},
};

const MainNavigation = memo(() => {
  const drawer = useRef();
  const onClose = useCallback(() => {
    // @ts-ignore
    drawer.current?.close();
  }, []);
  const onOpen = useCallback(() => {
    // @ts-ignore
    drawer.current?.open();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <NavigationContainer
          // @ts-ignore
          ref={navigationRef}>
          <Suspense fallback={<LoaderModule visible={true} />}>
            <Navigator
              screenOptions={{
                headerShown: false,
                gestureEnabled: false,
              }}
              initialRouteName="Presentation">
              <Screen
                name="Presentation"
                component={Presentation}
                options={optionNavigator}
              />
              <Screen
                name="ClienteSelector"
                component={ClienteSelector}
                options={optionNavigator}
              />
              <Screen name="FQA" component={FQA} options={optionNavigator} />
              <Screen
                name={ROUTERS.ForgotPassword}
                component={ForgotPass}
                options={optionNavigator}
              />
              <Screen
                name={ROUTERS.SignIn}
                component={SignIn}
                options={optionNavigator}
              />
              <Screen
                name={ROUTERS.Master}
                component={Master}
                options={optionNavigator}
              />

              <Screen
                name={ROUTERS.Notification}
                component={Notification}
                options={optionNavigator}
              />
              <Screen
                name={ROUTERS.SignUp}
                component={SignUp}
                options={optionNavigator}
              />

              <Screen
                name="CapacitacionDetalle"
                component={CapacitacionDetalle}
                options={optionNavigator}
              />
              <Screen
                name="Actividad"
                component={Actividad}
                options={optionNavigator}
              />
              <Screen
                name="ClientSave"
                component={ClientSave}
                options={optionNavigator}
              />

              {ContactToClient && (
                <Screen
                  name="ContactoAcliente"
                  component={ContactToClient}
                  options={optionNavigator}
                />
              )}

              <Screen
                name="ClientProfile"
                component={ClientProfile}
                options={optionNavigator}
              />
              {ProductList && (
                <Screen
                  name="ProductList"
                  component={ProductList}
                  options={optionNavigator}
                />
              )}
              {ProductDetail && (
                <Screen
                  name="ProductDetail"
                  component={ProductDetail}
                  options={optionNavigator}
                />
              )}
              {Plan && (
                <Screen
                  name="Plan"
                  component={Plan}
                  options={optionNavigator}
                />
              )}
              {TaskSave && (
                <Screen
                  name="TaskSave"
                  component={TaskSave}
                  options={optionNavigator}
                />
              )}
              {SelecctorArchivo && (
                <Screen
                  name="SelecctorArchivo"
                  component={SelecctorArchivo}
                  options={optionNavigator}
                />
              )}

              <Screen
                name="Planes"
                component={Planes}
                options={optionNavigator}
              />
              <Screen
                name="PlanDetale"
                component={PlanDetale}
                options={optionNavigator}
              />

              <Screen
                name="AdquirirPlan"
                component={AdquirirPlan}
                options={optionNavigator}
              />
              <Screen
                name="VariacionFormulario"
                component={VariacionFormulario}
                options={optionNavigator}
              />
              <Screen
                name="OrdenDetalle"
                component={OrdenDetalle}
                options={optionNavigator}
              />
              <Screen
                name="MetaGuardar"
                component={MetaGuardar}
                options={optionNavigator}
              />
            </Navigator>
          </Suspense>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
});

export default MainNavigation;
