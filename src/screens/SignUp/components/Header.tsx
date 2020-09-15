import React, {memo} from 'react';
import {StyleSheet, Text, View} from "react-native";
import SvgLogo from "svgs/signIn/SvgLogo";
import {Montserrat} from "utils/fonts";
import SvgPerson from "svgs/signIn/SvgPerson";
import {getStatusBarHeight} from "react-native-iphone-x-helper";

const Header = memo(() => {
    return (
        <View style={styles.container}>
            <SvgLogo/>
            <Text style={styles.txtWelcome}>¡Hola!</Text>
            <Text style={styles.txtTo}>Crea tu cuenta en Servi</Text>
            <View style={styles.circle}/>
            <SvgPerson style={styles.svgPerson}/>
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
        color: '#1A051D',
        fontWeight: '600',
        fontFamily: Montserrat,
        marginTop: 40
    },
    txtTo: {
        fontSize: 24,
        color: '#1A051D',
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
