import React, {memo, useCallback, useState, useEffect } from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert, Switch} from "react-native";
import Header from "screens/SignUp/components/Header";
import Input from "screens/SiginIn/components/Input";
import {Montserrat} from "utils/fonts";
import SvgFaceId from "svgs/signIn/SvgFaceId";
import {getBottomSpace} from "react-native-iphone-x-helper";
import {ROUTERS} from "utils/navigation";
import {SERVER_ADDRESS} from "constants"
import Loader from "components/Loader"

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnabled:false,
            loading: false,
            firstname: "",
            firstnameErrors: "",
            firstnameBorderColor: "",
            lastname: "",
            lastnameErrors: "",
            lastnameBorderColor: "",
            mail: "",
            mailErrors: "",
            mailBorderColor: "",
            password1: "",
            password1Errors: "",
            password1BorderColor: "",
            password2: "",
            password2Errors: "",
            password2BorderColor: "",
        }
    }

    onSwitchAcceptChange = () => {
        this.setState({isEnabled: !this.state.isEnabled})
    }

    onPressBack = () => {
        this.props.navigation.pop()
    }

    onPressRegister = () => {
        if(this.state.firstname == ""){
            this.setState({firstnameErrors: "ERRORS", firstnameBorderColor: "red"})
            return
        }
        if(this.state.lastname == ""){
            this.setState({lastnameErrors: "ERRORS", lastnameBorderColor: "red"})
            return
        }
        if(this.state.mail == ""){
            this.setState({mailErrors: "ERRORS", mailBorderColor: "red"})
            return
        }
        if(this.state.password1 == ""){
            this.setState({password1Errors: "ERRORS", password1BorderColor: "red"})
            return
        }
        if(this.state.password2 == ""){
            this.setState({password2Errors: "ERRORS", password2BorderColor: "red"})
            return
        }

        if(this.state.password1 != this.state.password2){
            Alert.alert("Las contraseñas no coinciden", "")
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Header/>
                    <Loader loading={this.state.loading}></Loader>
                    <Input mt={40} pass={false} errorMsg={this.state.firstnameErrors} borderColor={this.state.firstnameBorderColor} placeholder={'Nombres'} value={this.state.firstname} onChangeText={firstName=>this.setState({firstname:firstName})} />
                    <Input mt={16} pass={false} errorMsg={this.state.lastnameErrors} borderColor={this.state.lastnameBorderColor} placeholder={'Apellidos'} value={this.state.lastname} onChangeText={lastName=>this.setState({lastname:lastName})} />
                    <Input mt={16} pass={false} errorMsg={this.state.mailErrors} borderColor={this.state.mailBorderColor} placeholder={'Correo electrónico'} value={this.state.mail} onChangeText={email=>this.setState({mail:email})} />
                    <Input mt={16} pass={true} errorMsg={this.state.password1Errors} borderColor={this.state.password1BorderColor} placeholder={'Contraseña'} value={this.state.password1} onChangeText={p1=>this.setState({password1:p1})} />
                    <Input mt={16} pass={true} errorMsg={this.state.password2Errors} borderColor={this.state.password2BorderColor} placeholder={'Confirma tu contraseña'} value={this.state.password2} onChangeText={p2=>this.setState({password2:p2})} />
                    <View style={styles.containerSignIn}>
                        <Text style={{flex:1}}>Acepto los términos y condiciones las políticas de tratamiento de datos</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.onSwitchAcceptChange}
                            value={this.state.isEnabled}
                        />
                    </View>
                    <View style={styles.containerSignIn}>
                        <TouchableOpacity style={ this.state.isEnabled ? styles.btnSignIn : styles.btnSignInDisabled} disabled={!this.state.isEnabled} onPress={this.onPressRegister}>
                            <Text style={styles.txtSignIn}>Registrarme</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.containerSignIn}>
                        <TouchableOpacity style={styles.btnSignIn} onPress={this.onPressBack}>
                            <Text style={styles.txtSignIn}>Volver al inicio</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    containerSignIn: {
        flexDirection: 'row',
        marginHorizontal: 40,
        marginTop: 24,
        justifyContent: 'space-between'
    },
    btnSignIn: {
        backgroundColor: '#0F4C81',
        borderRadius: 24,
        flex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnSignInDisabled: {
        backgroundColor: '#415b71',
        borderRadius: 24,
        flex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtSignIn: {
        fontFamily: Montserrat,
        fontWeight: '600',
        color: '#FFF',
        fontSize: 17
    },
    btnFaceId: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#6979F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    btnForgot: {
        marginTop: 24,
        alignSelf: 'center'
    },
    txtForgot: {
        fontSize: 12,
        color: '#0F4C81',
        fontFamily: Montserrat,
        fontWeight: '500'
    },
    containerOr: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 40,
        marginTop: 24
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#F0F0F0'
    },
    txtOr: {
        marginHorizontal: 20,
        fontSize: 16,
        color: '#1A051D',
        fontFamily: Montserrat,
        fontWeight: 'normal'
    },
    btnSignFb: {
        marginHorizontal: 40,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6979F8',
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtSignInFb: {
        fontWeight: '600',
        fontSize: 17,
        color: '#FFF'
    },
    btnSignInGoogle: {
        marginHorizontal: 40,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FF647C',
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnSignUp: {
        alignSelf: 'center',
        marginTop: 10
    },
    txtSignUp: {
        fontSize: 12,
        color: '#0F4C81',
        fontFamily: Montserrat,
        fontWeight: '500'
    }
})
