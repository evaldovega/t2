import React, {memo, useCallback} from 'react';
import {useNavigation} from "@react-navigation/native";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import SvgLogo from "svgs/forgotPass/SvgLogo";
import SvgClose from "svgs/forgotPass/SvgClose";
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";
import SvgLogoKey from "svgs/forgotPass/SvgLogoKey";
import {Lato, Montserrat} from "utils/fonts";

const ForgotPass = memo(() => {
    const navigation = useNavigation();

    const onPressForgot = useCallback(()=>{
      navigation.goBack();
    },[])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SvgLogo/>
                <TouchableOpacity onPress={onPressForgot}>
                    <SvgClose/>
                </TouchableOpacity>
            </View>
            <SvgLogoKey style={styles.logo}/>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.des}>
                Do not worry! We will help you recover{'\n'}your password 🔑
            </Text>
            <View style={[styles.box, {marginTop: 40}]}>
                <Text style={styles.titleBox}>Send Your Email ✉️</Text>
                <Text style={styles.desBox}>We will send new passwor your email:</Text>
                <Text style={styles.valueBox}>t***9@gmail.com</Text>
            </View>
            <View style={[styles.box, {marginTop: 24}]}>
                <Text style={styles.titleBox}>Send Your Phone Number 📲️</Text>
                <Text style={styles.desBox}>
                    We will send new passwor your{'\n'}
                    phone number:<Text style={styles.valueBox}> +8*******90</Text>
                </Text>
            </View>
            <TouchableOpacity style={styles.btnSignUp}>
                <Text style={styles.txtSignUp}>Don’t Have Account? Sign UP</Text>
            </TouchableOpacity>
        </View>
    )
});

export default ForgotPass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    header: {
        flexDirection: 'row',
        marginTop: getStatusBarHeight(true),
        marginLeft: 32,
        marginRight: 16,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        marginTop: 32,
        alignSelf: 'center'
    },
    title: {
        color: '#1A051D',
        fontSize: 24,
        fontWeight: '500',
        marginTop: 32,
        fontFamily: Montserrat,
        alignSelf: 'center'
    },
    des: {
        fontFamily: Lato,
        color: '#6D5F6F',
        textAlign: 'center',
        marginTop: 7
    },
    box: {
        marginHorizontal: 32,
        borderRadius: 6,
        backgroundColor: '#F7F8F9',
        padding: 24
    },
    titleBox: {
        textTransform: 'uppercase',
        color: '#3F3356',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: Lato
    },
    desBox: {
        fontFamily: Lato,
        color: '#ABA4AC',
        fontSize: 14,
        marginTop: 9
    },
    valueBox: {
        fontFamily: Lato,
        color: '#1A051D',
        fontSize: 14,
        marginTop: 9
    },
    btnSignUp: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: getBottomSpace(),
    },
    txtSignUp: {
        fontSize: 12,
        color: '#0F4C81',
        fontFamily: Montserrat,
        fontWeight: '500'
    }
});
