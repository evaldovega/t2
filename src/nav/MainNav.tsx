import 'react-native-gesture-handler';
import React, {createRef, memo, useCallback, useRef,Suspense} from 'react';
import {StatusBar,Text} from 'react-native'
import {NavigationContainer, navigationRef, Navigator, ROUTERS, Screen} from "utils/navigation";
import {StackNavigationOptions} from "@react-navigation/stack";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {Platform} from "react-native";
// @ts-ignore
import ScalingDrawer from 'react-native-scaling-drawer';
import Walkthroughs from "screens/Walkthroughs";
import ForgotPass from "screens/ForgotPass";
import SignIn from "screens/SiginIn";
import StaticsHealth from "screens/StaticsHealth";
import Profile from "screens/Profile";
import Notification from "screens/Notification";
import SignUp from "screens/SignUp";
import Master from '../screens/Master'
import LeftMenu from "screens/LeftMenu";

import CapacitacionDetalle from '../screens/Master/Capacitacion/Detalle'
import Actividad from '../screens/Master/Capacitacion/Actividad'

const ClientSave = React.lazy(() => import('../screens/Master/Client/Save'));
const ContactToClient = React.lazy(() => import('../screens/Master/Client/Import'));
const ClientProfile =   React.lazy(()=>import('../screens/Master/Client/Profile'));
const ProductList   =   React.lazy(()=>import('../screens/Master/Product/List'))
const ProductDetail =   React.lazy(()=>import('../screens/Master/Product/Detail'))
const Plan =   React.lazy(()=>import('../screens/Master/Product/Plan'))
const TaskSave  =   React.lazy(()=>import('../screens/Master/Task/Save'))


import LoaderModule from '../components/LoaderModules'
import {Provider} from 'react-redux'
import configureStore from '../redux/configuracion'
import { COLORS } from 'constants';



const store=configureStore()

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
        /* <ScalingDrawer
            ref={drawer}
            content={<LeftMenu onClose={onClose} onOpen={onOpen}/>}
            {...defaultScalingDrawerConfig}
        >*/
        <Suspense fallback={<LoaderModule visible={true}/>}>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'}/>
                    <NavigationContainer
                        // @ts-ignore
                        ref={navigationRef}>

                        <Navigator
                            screenOptions={{
                                headerShown: false,
                                gestureEnabled:false
                            }}
                            initialRouteName={ROUTERS.Onboarding}
                        >
                            
                            <Screen name={ROUTERS.Onboarding} component={Walkthroughs} options={optionNavigator}/>
                            <Screen name={ROUTERS.ForgotPassword} component={ForgotPass} options={optionNavigator}/>
                            <Screen name={ROUTERS.SignIn} component={SignIn} options={optionNavigator}/>
                            <Screen name={ROUTERS.Master} component={Master} options={optionNavigator}/>
                            <Screen name={ROUTERS.Profile} component={Profile} options={optionNavigator}/>
                            <Screen name={ROUTERS.Notification} component={Notification} options={optionNavigator}/>
                            <Screen name={ROUTERS.SignUp} component={SignUp} options={optionNavigator}/>

                            <Screen name='CapacitacionDetalle' component={CapacitacionDetalle} options={optionNavigator}/>
                            <Screen name='Actividad' component={Actividad}  options={optionNavigator}/>
                            <Screen name='ClientSave' component={ClientSave}  options={optionNavigator}/>
                            {ContactToClient && <Screen name='ContactoAcliente' component={ContactToClient} options={optionNavigator}/>}
                            {ClientProfile && <Screen name='ClientProfile' component={ClientProfile} options={optionNavigator}/>}
                            {ProductList && <Screen name='ProductList' component={ProductList} options={optionNavigator}/>}
                            {ProductDetail && <Screen name='ProductDetail' component={ProductDetail} options={optionNavigator} />}
                            {Plan && <Screen name='Plan' component={Plan} options={optionNavigator} />}
                            {TaskSave && <Screen name='TaskSave' component={TaskSave} options={optionNavigator}/>}
                        </Navigator>
                    </NavigationContainer>
                </PaperProvider>
            </Provider>
        </Suspense>
    );
});

export default MainNavigation;
