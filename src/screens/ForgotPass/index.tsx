import React, {memo, useCallback} from 'react';
import {useNavigation} from "@react-navigation/native";
import {View, StyleSheet, Text, Alert, TouchableOpacity, Image,KeyboardAvoidingView,ScrollView,Platform} from "react-native";
import SvgLogo from "svgs/forgotPass/SvgLogo";
import SvgClose from "svgs/forgotPass/SvgClose";
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";
import SvgLogoKey from "svgs/forgotPass/SvgLogoKey";
import {Lato, Montserrat} from "utils/fonts";
import Input from "screens/SiginIn/components/Input";
import { SERVER_ADDRESS, COLORS } from 'constants';
import Loader from "components/Loader"

class ForgotPass extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mail: "",
            loading:false,
            mailborderColor: '#EAE8EA',
            errorMsgMail: "",
            msg: "",
            codeSent: false,
            codeInput: "",
            errorMsgCode: "",
            codeborderColor: '#EAE8EA',
            msgCode: "",
            codeValidated: false,
            msgCodeValidated: "",
            errorPass1: "",
            errorPass2: "",
            password1:"",
            password2:"",
            password1BorderColor: '#EAE8EA',
            password2BorderColor: '#EAE8EA',
            msgPassword: ""
        }
    }

    onPressForgot = () =>{
        this.props.navigation.goBack()
    }

    onPressRecovery = () => {
        if(this.state.mail == ""){
            this.setState({mailborderColor: "red", errorMsgMail: "ERROR"})
            return
        }

        this.setState({loading:true})
        fetch(SERVER_ADDRESS+"recovery/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'email': this.state.mail,
            })
        }).then(r => r.json()).then(response => {
            console.log(response)
            if(response.status == "OK"){
                this.setState({codeSent:true, msg: "Se ha enviado un código a tu correo electrónico"})
            }else if(response.non_field_errors){
                try{
                    this.setState({codeSent:false, msg: response.non_field_errors[0]})
                }catch(err){
                    console.log(err)
                }
            }
        }).catch((err) => {
            this.setState({msg: err.toString()})
        }).finally(() => {
            this.setState({loading:false})
            setTimeout(() => {
                Alert.alert(this.state.msg,"")
            }, 100)
        })
    }

    onCodeInput = () => {
        if(this.state.codeInput == ""){
            this.setState({codeborderColor: "red", errorMsgCode: "ERROR"})
            return
        }
        this.setState({loading:true})
        fetch(SERVER_ADDRESS + "recovery/validate_token/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'token': this.state.codeInput,
            })
        }).then(r => r.json()).then(response => {
            console.log(response)
            if(response.status == "OK"){
                this.setState({msgCodeValidated: "Código válido", codeValidated: true})
            }else if(response.status == "notfound"){
                this.setState({msgCodeValidated: "Código inválido", codeValidated: false})
            }else if(response.non_field_errors){
                try{
                    this.setState({msgCodeValidated: response.non_field_errors[0]})
                }catch(err){
                    console.log(err.toString())
                }
            }
        }).catch((err) => {
            this.setState({msgCodeValidated: err.toString()})
        }).finally(() => {
            this.setState({loading:false})
            setTimeout(() => {
                Alert.alert(this.state.msgCodeValidated,"")
            }, 100)
        })
    }

    onChangePassword = () => {
        this.setState({pass1borderColor:"", errorPass1:"", pass2borderColor:"", errorPass2:""})
        if(this.state.password1 == ""){
            this.setState({pass1borderColor: "red", errorPass1: "ERROR"})
            return
        }
        if(this.state.password2 == ""){
            this.setState({pass2borderColor: "red", errorPass2: "ERROR"})
            return
        }
        
        if(this.state.password1 != this.state.password2){
            Alert.alert("Las contraseñas no coinciden", "")
            return
        }

        this.setState({loading:true})
        fetch(SERVER_ADDRESS+"recovery/confirm/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'token': this.state.codeInput,
                'password': this.state.password1
            })
        }).then(r => r.json()).then(response => {
            if(response.status == "OK"){
                this.setState({msgPassword: "Contraseña cambiada con éxito"})
                this.props.navigation.pop()
            }else{
                //this.setState({msgPassword: "Algo anda mal"})
                console.log(response)
                Alert.alert("Algo anda mal",response.password.join(','))
            }
        }).catch((err) => {
            console.log(err)
            this.setState({msgPassword: err.toString()})
        }).finally(() => {
            this.setState({loading:false})
            
        })
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                <ScrollView>
                <Loader loading={this.state.loading}></Loader>
                <View style={styles.header}>
                <Image style={styles.logo} resizeMode='contain' source={require('utils/images/icon.png')}></Image>
                    <TouchableOpacity onPress={this.onPressForgot}>
                        <SvgClose />
                    </TouchableOpacity>
                </View>
                <Image style={styles.forgotImage} source={require('screens/ForgotPass/ForgotPassImage.png')}></Image>
                <Text style={styles.title}>Olvidaste tu contraseña?</Text>
                <Text style={styles.des}>
                    {this.state.codeSent == false ? "No te preocupes! Te ayudaremos a \n reestablecer tu contraseña" : this.state.codeValidated == false ? "Ingresa el código enviado a tu \n correo electrónico": "Ingresa tu nueva contraseña"}
                </Text>
                
                { this.state.codeSent == false && this.state.codeValidated == false ? 
                    <View>
                        <Input mt={40} pass={false} errorMsg={this.state.errorMsgMail} borderColor={this.state.mailborderColor} placeholder={'Correo electrónico'} value={this.state.mail} onChangeText={m => this.setState({mail:m})} />
                        <View style={styles.containerSignIn}>
                            <TouchableOpacity style={styles.btnSignIn} onPress={this.onPressRecovery}>
                                <Text style={styles.txtSignIn}>Recuperar contraseña</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                : this.state.codeValidated == false ?
                    <View>
                        <Input mt={40} pass={false} styleInput={{fontFamily:"Montserrat-Black",fontSize:22,textAlign:"center"}} errorMsg={this.state.errorMsgCode} borderColor={this.state.codeborderColor} placeholder={'Ingresa el código'} value={this.state.codeInput} onChangeText={code => this.setState({codeInput:code})} />
                        <View style={styles.containerSignIn}>
                            <TouchableOpacity style={styles.btnSignIn} onPress={this.onCodeInput}>
                                <Text style={styles.txtSignIn}>Validar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    :
                    <View>
                        <Input mt={40} pass={true} errorMsg={this.state.errorPass1} borderColor={this.state.password1BorderColor} placeholder={'Contraseña'} value={this.state.password1} onChangeText={pass1 => this.setState({password1:pass1})} />
                        <Input mt={40} pass={true} errorMsg={this.state.errorPass2} borderColor={this.state.password2BorderColor} placeholder={'Confirma la contraseña'} value={this.state.password2} onChangeText={pass2 => this.setState({password2:pass2})} />
                        <View style={styles.containerSignIn}>
                            <TouchableOpacity style={styles.btnSignIn} onPress={this.onChangePassword}>
                                <Text style={styles.txtSignIn}>Cambiar contraseña</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

export default ForgotPass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    containerShow: {
        opacity: 1
    },
    containerHide: {
        opacity: 0
    },
    containerSignIn: {
        flexDirection: 'row',
        marginHorizontal: 40,
        marginTop: 24
    },
    forgotImage: {
        width:223,
        height:195,
        alignSelf: 'center',
    },
    btnSignIn: {
        backgroundColor: COLORS.SECONDARY_COLOR,
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
        alignSelf: 'center',
        width: 60,
        height: 60
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
