import React, {memo} from 'react';
import {StyleSheet, Text, View, Image} from "react-native";
import SvgLogo from "svgs/signIn/SvgLogo";
import {Montserrat} from "utils/fonts";
import SvgPerson from "svgs/signIn/SvgPerson";
import {getStatusBarHeight} from "react-native-iphone-x-helper";
import { COLORS } from 'constants';

const Header = memo(() => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} resizeMode='contain' source={require('utils/images/icon.png')}></Image>
            <Text style={styles.txtWelcome}>¡Hola!</Text>
            <Text style={styles.txtTo}>Crea tu cuenta {'\n'}en Servi</Text>
            {/* <View style={styles.circle}/> */}
            {/* <SvgPerson style={styles.svgPerson}/> */}
            <Image style={styles.image} source={require('screens/SignUp/components/HeaderImage.png')}></Image>
        </View>
    )
});

export default Header;

const styles = StyleSheet.create({
    container: {
        marginTop: getStatusBarHeight(true) + 20,
        paddingLeft: 40,
        paddingTop: 30,
        height: 176
    },
    txtWelcome: {
        fontSize: 32,
        color: COLORS.PRIMARY_COLOR,
        fontWeight: '600',
        fontFamily: Montserrat,
        marginTop: 30
    },
    logo: {
        width: 60,
        height: 60
    },
    image: {
        width: 240,
        height: 240,
        position: 'absolute',
        right: -60,
        top: -10
    },
    txtTo: {
        fontSize: 24,
        color: COLORS.PRIMARY_COLOR_DARK_1,
        fontWeight: '500',
        fontFamily: Montserrat
    },
    circle: {
        width: 176,
        height: 176,
        borderRadius: 88,
        backgroundColor: '#FF647C',
        position: 'absolute',
        right: -88
    },
    svgPerson: {
        position: 'absolute',
        right: 0,
        top: 22
    }
});
