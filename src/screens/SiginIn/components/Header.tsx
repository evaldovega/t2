import React, {memo} from 'react';
import {StyleSheet, Text, View, Image} from "react-native";
import {getStatusBarHeight} from "react-native-iphone-x-helper";

const Header = memo(() => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('utils/images/ISO.png')}></Image>
            <Text style={styles.txtWelcome}>¡Hola!</Text>
            <Text style={styles.txtTo}>Inicia en Servi</Text>
            {/* <View style={styles.circle}/> */}
            {/* <SvgPerson style={styles.svgPerson}/> */}
            <Image style={styles.image} source={require('screens/SiginIn/components/HeaderImage.png')}></Image>
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
    txtWelcome: {
        fontSize: 32,
        color: '#209a91',
        fontWeight: '600',
        marginTop: 40
    },
    txtTo: {
        fontSize: 24,
        color: '#00817a',
        fontWeight: '500'
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
