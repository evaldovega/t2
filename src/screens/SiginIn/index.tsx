import React, {memo, useCallback, useState, useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from "react-native";
import Header from "screens/SiginIn/components/Header";
import Input from "screens/SiginIn/components/Input";
import {Montserrat} from "utils/fonts";
import SvgFaceId from "svgs/signIn/SvgFaceId";
import {getBottomSpace} from "react-native-iphone-x-helper";
import {ROUTERS} from "utils/navigation";
import {SERVER_ADDRESS} from "constants"
import Loader from "components/Loader"

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            u: "",
            k: "",
            msg:"",
            loading:false,
            userborderColor: '#EAE8EA',
            passborderColor: '#EAE8EA',
            errorMsgUser: "",
            errorMsgPass: ""
        }
    }

    onPressSignIn = () => {
        this.setState({errorMsgUser: "", errorMsgPass: "", userborderColor:'#EAE8EA', passborderColor: '#EAE8EA'})
        if(this.state.u == ""){
            this.setState({userborderColor: "red", errorMsgUser: "ERROR"})
            return
        }
        if(this.state.k == ""){
            this.setState({passborderColor: "red", errorMsgPass: "ERROR"})
            return
        }

        this.setState({loading:true})
        fetch(SERVER_ADDRESS+"login/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'username': this.state.u,
                'password': this.state.k
            })
        }).then(r=>r.json()).then(response => {
            if(response.token) {
                this.setState({'msg': "Bienvenido"})
            }else{
                if(response.non_field_errors){
                    try{
                        this.setState({'msg': response.non_field_errors[0]})
                    }catch(e){
                        console.log(e)
                    }
                }
            }
        }).catch((error) => {
            this.setState({'msg': error.toString()})
        }).finally(() => {
            this.setState({loading:false})
            setTimeout(() => {
                Alert.alert(this.state.msg,"")
            }, 100)
        })
    }

    onPressForgot = () => {
        // this.state.navigate(ROUTERS.ForgotPassword);
        this.props.navigation.navigate(ROUTERS.ForgotPassword)
    }

    onPressRegister = () => {
        this.props.navigation.navigate(ROUTERS.SignUp)
    }

    render() {
        return (
            <View style={styles.container}>
                <Header/>
                <Loader loading={this.state.loading}></Loader>
                <Input mt={40} pass={false} errorMsg={this.state.errorMsgUser} borderColor={this.state.userborderColor} placeholder={'Usuario'} value={this.state.u} onChangeText={t=>this.setState({u:t})} />
                <Input mt={16} pass={true} errorMsg={this.state.errorMsgPass} borderColor={this.state.passborderColor} placeholder={'Contraseña'} value={this.state.k} onChangeText={p=>this.setState({k:p})} />
                <View style={styles.containerSignIn}>
                    <TouchableOpacity style={styles.btnSignIn} onPress={this.onPressSignIn}>
                        <Text style={styles.txtSignIn}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnForgot} onPress={this.onPressForgot}>
                    <Text style={styles.txtForgot}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <View style={styles.containerOr}>
                    <View style={styles.line}/>
                    <Text style={styles.txtOr}>o</Text>
                    <View style={styles.line}/>
                </View>

                <TouchableOpacity style={styles.btnSignFb} onPress={this.onPressRegister}>
                    <Text style={styles.txtSignInFb}>Regístrate</Text>
                </TouchableOpacity>

                { /*
                <TouchableOpacity style={styles.btnSignInGoogle}>
                    <Text style={styles.txtSignInFb}>Sign In With Google</Text>
                </TouchableOpacity>
                */ }
            </View>
        )
    }
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    containerSignIn: {
        flexDirection: 'row',
        marginHorizontal: 40,
        marginTop: 24
    },
    btnSignIn: {
        backgroundColor: '#0F4C81',
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
