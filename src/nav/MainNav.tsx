import 'react-native-gesture-handler';
import React, {createRef, memo, useCallback, useRef} from 'react';
import {NavigationContainer, navigationRef, Navigator, ROUTERS, Screen} from "utils/navigation";
import {StackNavigationOptions} from "@react-navigation/stack";
// @ts-ignore
import ScalingDrawer from 'react-native-scaling-drawer';
import Walkthroughs from "screens/Walkthroughs";
import ForgotPass from "screens/ForgotPass";
import SignIn from "screens/SiginIn";
import StaticsHealth from "screens/StaticsHealth";
import Profile from "screens/Profile";
import Notification from "screens/Notification";
import SignUp from "screens/SignUp";
import LeftMenu from "screens/LeftMenu";
import {Platform} from "react-native";

const optionNavigator: any = {
    headerShown: false,
    gesturesEnabled: false,
};
const defaultScalingDrawerConfig = {
    scalingFactor: 0.8,
    minimizeFactor: 0.8,
    swipeOffset: 30,
    frontStyle: {
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowColor: '#FFF',
        shadowOpacity: 0,
        shadowRadius: 0,
    }
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
                    <Screen name={ROUTERS.Dashboard} component={StaticsHealth} options={optionNavigator}/>
                    <Screen name={ROUTERS.Profile} component={Profile} options={optionNavigator}/>
                    <Screen name={ROUTERS.Notification} component={Notification} options={optionNavigator}/>
                    <Screen name={ROUTERS.SignUp} component={SignUp} options={optionNavigator}/>
                </Navigator>
            </NavigationContainer>
        /*</ScalingDrawer>*/

    );
});

export default MainNavigation;
