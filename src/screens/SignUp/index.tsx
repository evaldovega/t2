import React, {memo, useCallback, useState, useEffect } from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Picker, Text, Alert, Switch, Linking} from "react-native";
import Header from "screens/SignUp/components/Header";
import Input from "screens/SiginIn/components/Input";
import {Montserrat} from "utils/fonts";
import SvgFaceId from "svgs/signIn/SvgFaceId";
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";
import {ROUTERS} from "utils/navigation";
import {SERVER_ADDRESS, COLORS} from "constants"
import Loader from "components/Loader"
import ModalFilterPicker from 'react-native-modal-filter-picker';
import DatePicker from 'react-native-datepicker'
import ModalWebView from 'components/ModalWebView';
import ModalPrompt from 'components/ModalPrompt';


class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contratoVisualizacion: false,
            isEnabled:false,
            loading: false,
            isCodeSent: false,
            aceptacionContrato: false,
            aceptacionCodigoEnviado: false,
            aceptacionContratoUser: false,
            msgAlertCode: "",
            msgAlert: "",

            firstname: "",
            firstnameErrors: false,
            lastname: "",
            lastnameErrors: false,
            mail: "",
            mailErrors: false,
            password1: "",
            password1Errors: false,
            password2: "",
            password2Errors: false,

            date: "2020-09-15",
            show: false,

            numWhatsapp:"",
            numWhatsappErrors: false,
            direccion: "",
            direccionErrors: false,
            fechaNac: "",
            numDocumento:"",
            numDocumentoErrors:false,
            
            visibleMpio: false,
            pickedMpio: null,
            
            visibleGenero: false,
            pickedGenero: null,

            visibleDepto: false,
            pickedDepto: null,

            visibleTDoc: false,
            pickedTDoc: null,

            contratoContent:"",

            optsDepartamentos: [],
            optsMunicipios: [],
            optsTiposDocs: [],

            inputCodeRegistration:"",
            inputCodeRegistrationError: false,
            inputCodeRegistrationMsgAlert: "",
            contratoValidationVisible: false,
            contratoValidated: false,
            textResponseCodeValidation: "",
        }
    }

    componentDidMount() {
        fetch(SERVER_ADDRESS+"api/config/departamentos/").then(r=>r.json()).then(response=>{
            let deptos = []
            response.forEach((item) => {
                deptos.push({'key': item.id, 'label':item.descripcion})
            })
            this.setState({optsDepartamentos: deptos})
        })

        fetch(SERVER_ADDRESS+"api/config/tipo-documentos/").then(r=>r.json()).then(response => {
            let tipos = []
            response.forEach((item) => {
                tipos.push({'key': item.id, 'label': item.descripcion})
            })
            this.setState({optsTiposDocs: tipos})
        })

        fetch(SERVER_ADDRESS+"api/config/contrato/").then(r=>r.json()).then(response => {
            this.setState({contratoContent: response[0].contenido_contrato})
        })
    }

    onSwitchAcceptChange = () => {
        this.setState({isEnabled: !this.state.isEnabled})
    }
    onSwitchAcceptContratoChange = () => {
        // Enviar codigo de aprobacion
        if(!this.state.aceptacionContrato){
            if(this.state.mail == ""){
                Alert.alert("Debe ingresar un correo electrónico válido", "")
                return
            }
            this.setState({contratoValidationVisible: true})
            fetch(SERVER_ADDRESS+"api/usuarios/registro/token/", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    'email': this.state.mail
                })
            }).then(r => r.json()).then(response => {
                if(response.activo){
                    // this.setState({contratoValidationVisible: true})
                }else{
                    if(response.non_field_errors){
                        try{
                            this.setState({msgAlertCode: response.non_field_errors[0]})
                        }catch(e){
                            console.log(e)
                        }
                    }
                }
            }).catch((err) => {
                console.log(err.toString())
            }).finally(() => {

            })
        }
    }

    validateCodeRegistration = () => {
        this.setState({inputCodeRegistrationError: false, inputCodeRegistrationMsgAlert:""})
        if(this.state.inputCodeRegistration == ""){
            this.setState({inputCodeRegistrationError: true})
            return
        }
        this.setState({loading: true})
        fetch(SERVER_ADDRESS+"api/usuarios/registro/token/validate/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'token': this.state.inputCodeRegistration
            })
        }).then(r=> r.json()).then(response => {
            switch(response.status){
                case "OK":
                    this.setState({loading: false, contratoValidated: true, aceptacionContrato: true})
                    break
                case "novalido":
                    this.setState({inputCodeRegistrationMsgAlert: "El código no es válido"})
                    break
                case "expired":
                    this.setState({inputCodeRegistrationMsgAlert: "El código ha expirado"})
                    break
                case "used":
                    this.setState({inputCodeRegistrationMsgAlert: "Este código ha sido usado"})
                    break
                default:
                    this.setState({inputCodeRegistrationMsgAlert: "El código no es válido"})
            }
        }).catch((err) => {
            console.log(err.toString())
        }).finally(() => {
            this.setState({loading: false})
            setTimeout(() => {
                if(this.state.inputCodeRegistrationMsgAlert != ""){
                    Alert.alert(this.state.inputCodeRegistrationMsgAlert,"")
                }
            }, 100)
            if(this.state.contratoValidated){
                setTimeout(() => {
                    this.setState({contratoValidationVisible:false})
                }, 2000)
            }
        })
    }

    onPressBack = () => {
        this.props.navigation.pop()
    }

    /* Modal para selección de genero */
    generoOpts = [
        {
            key: 'masculino',
            label: "Masculino"
        },
        {
            key: 'femenino',
            label: "Femenino"
        },
        {
            key: 'otro',
            label: "Otro"
        }
    ]
    generoOnShow = () => {
        this.setState({ visibleGenero: true });
    }

    generoOnSelect = (picked) => {
        this.setState({
            pickedGenero: {key:picked.key, label:picked.label},
            visibleGenero: false
        })
    }

    generoOnCancel = () => {
        this.setState({
            visibleGenero: false
        });
    }

    deptoOnShow = () => {
        this.setState({ visibleDepto: true });
    }

    deptoOnSelect = (picked) => {
        this.setState({
            pickedDepto: {key:picked.key, label:picked.label},
            visibleDepto: false,
            loading: true
        })
        fetch(SERVER_ADDRESS+`api/config/municipios?d=${picked.key}`).then(r=>r.json()).then(response => {
            let mpios = []
            response.forEach((item) => {
                mpios.push({'key': item.id, 'label': item.descripcion})
            })
            this.setState({optsMunicipios: mpios})
        }).finally(() => {
            this.setState({loading: false})
        })
    }

    deptoOnCancel = () => {
        this.setState({
            visibleDepto: false
        });
    }
  

    mpioOnShow = () => {
        this.setState({ visibleMpio: true });
    }

    mpioOnSelect = (picked) => {
        this.setState({
            pickedMpio: {key:picked.key, label:picked.label},
            visibleMpio: false
        })
    }

    mpioOnCancel = () => {
        this.setState({
            visibleMpio: false
        });
    }


    tdocOnShow = () => {
        this.setState({ visibleTDoc: true });
    }

    tdocOnSelect = (picked) => {
        this.setState({
            pickedTDoc: {key:picked.key, label:picked.label},
            visibleTDoc: false
        })
    }

    tdocOnCancel = () => {
        this.setState({
            visibleTDoc: false
        });
    }

    onPressRegister = () => {

        if(this.state.firstname == ""){
            this.setState({firstnameErrors: true})
            return
        }
        if(this.state.lastname == ""){
            this.setState({lastnameErrors: true})
            return
        }
        if(this.state.mail == ""){
            this.setState({mailErrors: true})
            return
        }
        if(this.state.password1 == ""){
            this.setState({password1Errors: true})
            return
        }
        if(this.state.password2 == ""){
            this.setState({password2Errors: true})
            return
        }

        if(this.state.password1 != this.state.password2){
            Alert.alert("Las contraseñas no coinciden", "")
            return
        }

        if(this.state.pickedGenero == null){
            return
        }

        if(this.state.numWhatsapp == ""){
            this.setState({numWhatsappErrors: true})
            return
        }

        if(this.state.pickedDepto == null){
            return
        }
        if(this.state.pickedMpio == null){
            return
        }
        if(this.state.direccion == ""){
            this.setState({direccionErrors: true})
            return
        }
        if(this.state.fechaNac == ""){
            return
        }
        if(this.state.pickedTDoc == null){
            return
        }
        if(this.state.numDocumento == ""){
            this.setState({numDocumentoErrors: true})
            return
        }
        if(!this.state.isEnabled){
            return
        }
        if(!this.state.aceptacionContrato){
            return
        }
        


        this.setState({loading:true})
        fetch(SERVER_ADDRESS+"api/usuarios/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                user:{
                    first_name: this.state.firstname,
                    last_name: this.state.lastname,
                    email:this.state.mail,
                    password: this.state.password1,
                },
                numero_whatsapp: this.state.numWhatsapp,
                genero: this.state.pickedGenero.key,
                departamento: this.state.pickedDepto.key,
                municipio: this.state.pickedMpio.key,
                direccion: this.state.direccion,
                fecha_nacimiento: this.state.fechaNac,
                tipo_documento_identidad: this.state.pickedTDoc.key,
                num_documento_identidad: this.state.numDocumento,
                contrato_aprobado: this.state.aceptacionContrato
            })
        }).then(r => r.json()).then(response => {
            this.setState({msgAlert: "Usuario registrado"})
        }).catch((err) => {
            this.setState({msgAlert: err.toString()})
        }).finally(() => {
            this.setState({loading:false})
            setTimeout(() => {
                Alert.alert(this.state.msgAlert,"")
            }, 100)
            if(this.state.msgAlert == "Usuario registrado"){
                setTimeout(() => {
                    this.props.navigation.pop();    
                }, 1500);
            }
        })

    }
    cerrarContrato = () => {
        this.setState({contratoVisualizacion: false})
    } 

    render() {
        return (
            <View style={styles.container}>
                
                <ModalWebView visible={this.state.contratoVisualizacion} html={this.state.contratoContent} cancelButtonText="Volver" onClose={this.cerrarContrato}></ModalWebView>
                <ModalPrompt visible={this.state.contratoValidationVisible} mt={16} valid={this.state.contratoValidated} actionDisabled={this.state.contratoValidated} error={this.state.inputCodeRegistrationError} textMessage={this.state.textResponseCodeValidation} value={this.state.inputCodeRegistration} onChangeText={i=>this.setState({inputCodeRegistration: i})} onCodeValidation={this.validateCodeRegistration}></ModalPrompt>
                <ScrollView>
                    <View>
                        <Header/>
                        <Loader loading={this.state.loading}></Loader>
                        <Input mt={60} pass={false} error={this.state.firstnameErrors} placeholder={'Nombres'} value={this.state.firstname} onChangeText={firstName=>this.setState({firstname:firstName})} />
                        <Input mt={16} pass={false} error={this.state.lastnameErrors} placeholder={'Apellidos'} value={this.state.lastname} onChangeText={lastName=>this.setState({lastname:lastName})} />
                        <Input mt={16} pass={false} error={this.state.mailErrors} placeholder={'Correo electrónico'} value={this.state.mail} onChangeText={email=>this.setState({mail:email})} />
                        <Input mt={16} pass={true} error={this.state.password1Errors} placeholder={'Contraseña'} value={this.state.password1} onChangeText={p1=>this.setState({password1:p1})} />
                        <Input mt={16} pass={true} error={this.state.password2Errors} placeholder={'Confirma tu contraseña'} value={this.state.password2} onChangeText={p2=>this.setState({password2:p2})} />
                        
                        <View style={[styles.line, {marginTop:20}]}></View>
                        <View style={styles.containerSignIn}>
                            <Text>INFORMACIÓN COMPLEMENTARIA</Text>
                        </View>
                        
                        {/* Formulario complementario */}
                        <Input mt={30} pass={false} placeholder={'Número de WhatsApp'} error={this.state.numWhatsappErrors} value={this.state.numWhatsapp} onChangeText={whatsapp=>this.setState({numWhatsapp:whatsapp})} />
                        
                        <View style={[styles.containerDropdown, this.state.pickedGenero ? null : styles.errorDropDown]}>
                            <TouchableOpacity style={styles.btnInputSelect} onPress={this.generoOnShow}>
                                <Text>{this.state.pickedGenero ? this.state.pickedGenero.label : "Seleccionar género" }</Text>
                            </TouchableOpacity>     
                            <ModalFilterPicker
                                visible={this.state.visibleGenero}
                                onSelect={this.generoOnSelect}
                                onCancel={this.generoOnCancel}
                                options={this.generoOpts}
                            />
                        </View>

                        <View style={styles.containerDropdown}>
                            <TouchableOpacity style={styles.btnInputSelect} onPress={this.deptoOnShow}>
                                <Text>{this.state.pickedDepto ? this.state.pickedDepto.label : "Seleccionar departamento" }</Text>
                            </TouchableOpacity>     
                            <ModalFilterPicker
                                visible={this.state.visibleDepto}
                                onSelect={this.deptoOnSelect}
                                onCancel={this.deptoOnCancel}
                                options={this.state.optsDepartamentos}
                            />
                        </View>

                        <View style={styles.containerDropdown}>
                            <TouchableOpacity style={styles.btnInputSelect} onPress={this.mpioOnShow}>
                                <Text>{this.state.pickedMpio ? this.state.pickedMpio.label : "Seleccionar municipio" }</Text>
                            </TouchableOpacity>      
                            <ModalFilterPicker
                                visible={this.state.visibleMpio}
                                onSelect={this.mpioOnSelect}
                                onCancel={this.mpioOnCancel}
                                options={this.state.optsMunicipios}
                            />
                        </View>
                        
                        <Input mt={16} pass={false} errorMsg={this.state.direccionErrors} borderColor={this.state.direccionBorderColor} placeholder={'Dirección'} value={this.state.direccion} onChangeText={dir=>this.setState({direccion:dir})} />
                        <View style={styles.inputDatePickerContainer}>
                            <DatePicker
                                style={styles.inputDatePicker}
                                date={this.state.fechaNac}
                                mode="date"
                                placeholder="Fecha de nacimiento"
                                format="YYYY-MM-DD"
                                minDate="1990-01-01"
                                maxDate="2040-06-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth:0,
                                        height:48,
                                        marginTop:5,
                                        alignItems:'flex-start'
                                    }
                                }}
                                onDateChange={(date) => {this.setState({fechaNac: date})}}
                            />
                        </View>

                        <View style={styles.containerDropdown}>
                            <TouchableOpacity style={styles.btnInputSelect} onPress={this.tdocOnShow}>
                                <Text>{this.state.pickedTDoc ? this.state.pickedTDoc.label : "Seleccionar tipo de documento" }</Text>
                            </TouchableOpacity>      
                            <ModalFilterPicker
                                visible={this.state.visibleTDoc}
                                onSelect={this.tdocOnSelect}
                                onCancel={this.tdocOnCancel}
                                options={this.state.optsTiposDocs}
                            />
                        </View>
                        <Input mt={16} pass={false} errorMsg={this.state.numDocumentoErrors} borderColor={this.state.numDocumentoBorderColor} placeholder={'Número de documento'} value={this.state.numDocumento} onChangeText={no=>this.setState({numDocumento:no})} />



                        <View style={styles.containerSignIn}>
                            <View style={{flex:1}}>
                                <Text>
                                    Acepto los
                                    <Text style={styles.link} onPress={()=>Linking.openURL('https://google.com')}> términos y condiciones </Text>
                                    y las
                                    <Text style={styles.link} onPress={()=>Linking.openURL('https://google.com')}> políticas de tratamiento de datos</Text>
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.PRIMARY_COLOR, true: COLORS.SECONDARY_COLOR_LIGHTER }}
                                thumbColor={this.state.isEnabled ? COLORS.SECONDARY_COLOR : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={this.onSwitchAcceptChange}
                                value={this.state.isEnabled}
                            />
                        </View>

                        <View style={styles.containerSignIn}>
                            <View style={{flex:1}}>
                                <Text>
                                    Acepto las condiciones en el
                                    <Text style={styles.link} onPress={()=>this.setState({contratoVisualizacion: true})}> contrato de carrotaje </Text>
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.PRIMARY_COLOR, true: COLORS.SECONDARY_COLOR_LIGHTER }}
                                thumbColor={this.state.aceptacionContrato ? COLORS.SECONDARY_COLOR : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                disabled={this.state.aceptacionContrato}
                                onValueChange={this.onSwitchAcceptContratoChange}
                                value={this.state.aceptacionContrato}
                            />
                        </View>

                        <View style={styles.containerSignIn}>
                            <TouchableOpacity style={ this.state.isEnabled && this.state.aceptacionContrato ? styles.btnSignIn : styles.btnSignInDisabled} disabled={this.state.isEnabled && this.state.aceptacionContrato ? false : true} onPress={this.onPressRegister}>
                                <Text style={styles.txtSignIn}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.containerSignIn, {marginBottom:30}]}>
                            <TouchableOpacity style={styles.btnBack} onPress={this.onPressBack}>
                                <Text style={styles.txtGoBack}>¿Ya tienes una cuenta? Inicia sesión</Text>
                            </TouchableOpacity>
                        </View>
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
    containerDropdown: {
        marginHorizontal: 0,
        marginTop: 16
    },
    containerDropdownPicker: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        height: 48,
    },
    dropdownPicker: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        height: 48,
    },
    link: {
        color: COLORS.PRIMARY_COLOR
    },
    errorDropDown: {
        borderColor: 'red',
    },
    btnSignIn: {
        backgroundColor: COLORS.SECONDARY_COLOR,
        borderRadius: 24,
        flex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnInputSelect: {
        marginHorizontal: 40,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        backgroundColor: 'white',
        height: 48,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    inputDatePickerContainer: {
        marginHorizontal: 40,
        marginTop:16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        height: 48,
        flex: 1,
        paddingHorizontal: 16
    },
    inputDatePicker: {
        width:'100%',
        height: 48,
    },
    btnSignInDisabled: {
        backgroundColor: COLORS.SECONDARY_COLOR_MUTED,
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
    txtGoBack: {
        fontFamily: Montserrat,
        fontWeight: '600',
        color: '#FFF',
        fontSize: 14
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
    btnBack: {
        backgroundColor: COLORS.PRIMARY_COLOR,
        borderRadius: 24,
        flex: 1,
        height: 48,
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
