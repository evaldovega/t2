import React, {memo, useCallback} from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity, Image,KeyboardAvoidingView,ScrollView,Platform} from "react-native";
import SvgClose from "svgs/forgotPass/SvgClose";
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";
import {Lato, Montserrat} from "utils/fonts";
import { SERVER_ADDRESS, COLORS, MARGIN_HORIZONTAL } from 'constants';

import {validar, totalErrores, renderErrores} from 'utils/Validar';
import Loader from "components/Loader"
import ColorfullContainer from 'components/ColorfullContainer'
import Button from 'components/Button'
import InputText from 'components/InputText'
import { TextInput } from 'react-native-paper';

const validations = {
    email: {
        email:{message:'^Email invalido'},
        presence: {allowEmpty: false, message: '^Este campo es requerido'},
    },
    codeInput:{
        presence: {allowEmpty: false, message: '^Ingrese el codigo que se le ha enviado'},
    },
    password1:{
        presence: {allowEmpty: false, message: '^Este campo es requerido'},
    },
    password2:{
        equality:{
            attribute:"password1",
            message:'^Las contraseñas introducidas no coinciden!',
        },
        presence: {allowEmpty: false, message: '^Este campo es requerido'},
    },
}
class ForgotPass extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values:{},
            error:{},
            email: "",
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
        
        validar(this,this.state.email,'email',validations.email,false)
        if(this.state.error['email'].length>0){
            return
        }

        this.setState({loading:true})
        let statusCode = 0;
        fetch(SERVER_ADDRESS+"recovery/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'email': this.state.email,
            })
        }).then(r => {
            statusCode = r.status
            return r
        }).then(r => r.json()).then(response => {
            if(statusCode == 200 || statusCode == 201){
                console.log(response)
                if(response.status == "OK"){
                    this.setState({codeSent:true, msg: "Se ha enviado un código a tu correo electrónico"})
                }else if(response.non_field_errors){
                    try{
                        this.setState({codeSent:false, msg: response.non_field_errors[0]})
                    }catch(err){
                        console.log(err)
                    }
                }else if(response.email){
                    Alert.alert('Hay algunos problemas',response.email.join('\n'))
                }
            }else if(statusCode == 400){
                let mensaje = ""
                let r = response
                let cantidadCampos = 0;
                
                for (const key in r) {
                    if (key == "user") {
                        mensaje += `- ${key}\n`
                        for (const key2 in r[key]) {
                            mensaje += `-- ${key2}: ${r[key][key2]}\n`
                        }
                    } else if (key == "non_field_errors") {
                        mensaje += `${r[key][0]}`
                    } else {
                        mensaje += `- ${key}: ${r[key][0]}\n`
                    }
                }
                setTimeout(function(){
                    Alert.alert("Error", mensaje)
                },400);
            }else{
                setTimeout(function(){
                    Alert.alert("Error", "Se ha presentado un inconveniente")
                },400);
            }
        }).catch((err) => {
            this.setState({msg: err.toString()})
        }).finally(() => {
            this.setState({loading:false})
        })
    }

    onCodeInput = () => {
        validar(this,this.state.codeInput,'codeInput',validations.codeInput,false)
        if(this.state.error['codeInput'].length>0){
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
        validar(this,this.state.password1,'password1', validations.password1,false)
        validar(this,{password1:this.state.password1,password2:this.state.password2},'password2', validations.password2,false)

        if(this.state.error['password1'].length>0 || this.state.error['password2'].length>0){
            return
        }
        

        this.setState({loading:true})
        let statusCode = 0;
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
        }).then(r => {
            statusCode = r.status
            return r
        }).then(r => r.json()).then(r => {
            if (statusCode == 200 || statusCode == 201){
                if(r.status == "OK"){
                    setTimeout(() => {
                        Alert.alert("Listo", "Contraseña cambiada con éxito")
                    }, 400)
                    this.props.navigation.pop()
                }else{
                    //this.setState({msgPassword: "Algo anda mal"})
                    console.log(r)
                    Alert.alert("Algo anda mal",r.password.join(','))
                }
            }else if(statusCode == 400){
                let mensaje = ""
                for (const key in r) {
                    if (key == "user") {
                        // mensaje += `- ${key}\n`
                        for (const key2 in r[key]) {
                            mensaje += `${key2}: ${r[key][key2]}\n`
                        }
                    } else if (key == "non_field_errors") {
                        mensaje += `${r[key][0]}`
                    } else {
                        mensaje += `${key}: ${r[key][0]}\n`
                    }
                }
                setTimeout(() => {
                    Alert.alert("Error", mensaje)
                }, 400)
            }else{

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
            
                <ColorfullContainer style={{flex:1}}>
                    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                    <ScrollView style={{flex:1,paddingHorizontal:MARGIN_HORIZONTAL}}>
                    <Loader loading={this.state.loading}></Loader>
                    
                    <View style={styles.header}>
                    
                        <TouchableOpacity onPress={this.onPressForgot}>
                            <SvgClose />
                        </TouchableOpacity>
                    </View>

                    <Image style={styles.forgotImage} source={require('utils/images/recuperar.png')}></Image>
                    <Text style={styles.title}>Olvidaste tu contraseña?</Text>
                    <Text style={styles.des}>
                        {this.state.codeSent == false ? "No te preocupes! Te ayudaremos a \n reestablecer tu contraseña" : this.state.codeValidated == false ? "Ingresa el código enviado a tu \n correo electrónico": "Ingresa tu nueva contraseña"}
                    </Text>
                    
                    { this.state.codeSent == false && this.state.codeValidated == false ? 
                        <View>
                            <InputText marginTop={3} placeholder='Correo electronico' value={this.state.email} onChangeText={m => this.setState({email:m})} onBlur={() =>validar(this,this.state.email,'email', validations.email,false)}/>
                            <View>{renderErrores(this, 'email')}</View>
                            <Button marginTop={1} title='Recuperar contraseña' onPress={this.onPressRecovery}/>
                            
                        </View>
                    : this.state.codeValidated == false ?
                        <View>
                            <InputText marginTop={3}  placeholder={'Ingresa el código'} value={this.state.codeInput} onChangeText={code => this.setState({codeInput:code})} onBlur={() =>validar(this,this.state.codeInput,'codeInput', validations.codeInput,false)} />
                            <View>{renderErrores(this, 'codeInput')}</View>
                            <Button marginTop={1} title='Validar' onPress={this.onCodeInput}/>
                        </View>

                        :
                        <View>
                            <InputText marginTop={3} password  placeholder={'Contraseña'} value={this.state.password1} onChangeText={pass1 => this.setState({password1:pass1})} onBlur={() =>validar(this,this.state.password1,'password1', validations.password1,false)}/>
                            <View>{renderErrores(this, 'password1')}</View>
                            <InputText marginTop={1} password  placeholder={'Confirma la contraseña'} value={this.state.password2} onChangeText={pass2 => this.setState({password2:pass2})} onBlur={() =>validar(this,{password1:this.state.password1,password2:this.state.password2},'password2', validations.password2,false)}/>
                            <View>{renderErrores(this, 'password2')}</View>
                            <Button marginTop={1} onPress={this.onChangePassword} title='Cambiar contraseña' />

                        </View>
                    }
                    
                    </ScrollView>
                
            </KeyboardAvoidingView>
            </ColorfullContainer>
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
        marginTop: getStatusBarHeight(true)+MARGIN_HORIZONTAL,
        marginLeft: 32,
        marginRight: 16,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    logo: {
        marginTop: 32,
        alignSelf: 'center',
        width: 60,
        height: 60
    },
    title: {
        color: COLORS.NEGRO,
        fontSize: 24,
        fontWeight: '500',
        marginTop: 32,
        fontFamily: 'Mont-Bold',
        alignSelf: 'center'
    },
    des: {
        fontFamily: 'Mont-Regular',
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
