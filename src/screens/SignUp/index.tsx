import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert, Switch, PixelRatio, Keyboard } from "react-native";
import Header from "screens/SignUp/components/Header";

import { SERVER_ADDRESS, COLORS, MARGIN_HORIZONTAL, MARGIN_VERTICAL, CURVA } from "constants"
import Loader from "components/Loader"
import ModalWebView from 'components/ModalWebView';
import ModalPrompt from 'components/ModalPrompt';
import SignatureCapture from 'react-native-signature-capture';
import produce from 'immer'
import { Caption, FAB } from 'react-native-paper';
import { validar, totalErrores, renderErrores } from 'utils/Validar';
import ColorfullContianer from 'components/ColorfullContainer'
import Button from 'components/Button'
import InputMask from 'components/InputMask'
import InputText from 'components/InputText'
import Select from 'components/Select'
import InputDateTimerPicker from 'components/DatetimePicker'
import moment from 'moment'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Validator, { Execute } from 'components/Validator'
import {changeProps} from 'redux/actions/Usuario';
import {connect} from 'react-redux';
import {setSharedPreference} from 'utils/SharedPreference';


class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stepOneError: true,
            showHeader: true,
            step: 0,
            contratoVisualizacion: false,
            isEnabled: false,
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
            email: "",
            mailErrors: false,
            password1: "",
            password1Errors: false,
            password2: "",
            password2Errors: false,

            date: "",
            show: false,

            numWhatsapp: "",
            numWhatsappErrors: false,
            direccion: "",
            direccionErrors: false,
            fechaNac: "",
            numDocumento: "",
            numDocumentoErrors: false,

            visibleMpio: false,
            pickedMpio: null,

            visibleGenero: false,
            pickedGenero: null,
            genero: '',

            visibleDepto: false,
            pickedDepto: null,

            visibleTDoc: false,
            pickedTDoc: null,

            contratoContent: "",

            optsDepartamentos: [],
            optsMunicipios: [],
            optsTiposDocs: [],
            tipo_doc: '',

            inputCodeRegistration: "",
            inputCodeRegistrationError: false,
            inputCodeRegistrationMsgAlert: "",
            contratoValidationVisible: false,
            contratoValidated: false,
            textResponseCodeValidation: "",
            error: {},
            values: {},
            mostrarTerminos: false,
            terminosHtml: ''
        }

    }

    ValidationsStep1 = {}
    ValidationsStep2 = {}

    _keyboardDidShow = () => {
        this.setState({ showHeader: false })
    }
    _keyboardDidHide = () => {
        this.setState({ showHeader: true })
    }



    componentDidMount() {

        Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);

        if (this.props.route && this.props.route.params) {
            console.log(JSON.stringify(this.props.route.params))
            const { social } = this.props.route.params
            if (social) {
                this.setState({
                    email: social.email,
                    firstname: social.first_name,
                    lastname: social.last_name,
                    social_user_id: social.id
                })
            }
        }


        fetch(SERVER_ADDRESS + "api/config/departamentos/")
            .then(r => r.json())
            .then(response => {
                console.log(response)
                let deptos = []
                response.forEach((item) => {
                    deptos.push({ 'key': item.id, 'label': item.descripcion })
                })
                console.log('Deps ', deptos)
                this.setState({ optsDepartamentos: deptos })
            })

        fetch(SERVER_ADDRESS + "api/config/tipo-documentos/").then(r => r.json()).then(response => {
            let tipos = []
            response.forEach((item) => {
                tipos.push({ 'key': item.id, 'label': item.descripcion })
            })
            this.setState({ optsTiposDocs: tipos })
        })

        fetch(SERVER_ADDRESS + "api/config/contrato/").then(r => r.json()).then(response => {
            this.setState({ contratoContent: response[0].contenido_contrato })
        })
    }

    componentWillUnmount() {
        Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
    }

    onSwitchAcceptChange = () => {
        this.setState({ isEnabled: !this.state.isEnabled })

    }

    onChangeValue = (name, value) => {
        this.setState(produce(draft => {
            draft.values[name] = value
            draft[name] = value
        }))
    }

    onSwitchAcceptContratoChange = () => {
        // Enviar codigo de aprobacion
        if (!this.state.aceptacionContrato) {
            if (this.state.email == "") {
                Alert.alert("Debe ingresar un correo electrónico válido", "")
                this.setState({ step: 0 })
                return
            }
            this.setState({ contratoValidationVisible: true })
            const body = JSON.stringify({
                'email': this.state.email,
                'nombre': this.state.firstname
            })
            console.log('Enviar codigo ', body)
            fetch(SERVER_ADDRESS + "api/usuarios/registro/token/", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: body
            })
                .then(r => r.json())
                .then(response => {
                    if (response.activo) {
                        // this.setState({contratoValidationVisible: true})
                    } else {
                        if (response.non_field_errors) {
                            try {
                                this.setState({ msgAlertCode: response.non_field_errors[0] })
                            } catch (e) {
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
        console.log("Validar codigo")
        this.setState({ inputCodeRegistrationError: false, inputCodeRegistrationMsgAlert: "" })
        if (this.state.inputCodeRegistration == "") {
            this.setState({ inputCodeRegistrationError: true })
            return
        }
        this.setState({ loading: true })
        fetch(SERVER_ADDRESS + "api/usuarios/registro/token/validate/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'token': this.state.inputCodeRegistration
            })
        }).then(r => r.json()).then(response => {
            switch (response.status) {
                case "OK":
                    this.setState({ loading: false, contratoValidated: true, aceptacionContrato: true })
                    break
                case "novalido":
                    this.setState({ inputCodeRegistrationMsgAlert: "El código no es válido" })
                    break
                case "expired":
                    this.setState({ inputCodeRegistrationMsgAlert: "El código ha expirado" })
                    break
                case "used":
                    this.setState({ inputCodeRegistrationMsgAlert: "Este código ha sido usado" })
                    break
                default:
                    this.setState({ inputCodeRegistrationMsgAlert: "El código no es válido" })
            }
        }).catch((err) => {
            console.log(err.toString())
        }).finally(() => {
            this.setState({ loading: false })
            setTimeout(() => {
                if (this.state.inputCodeRegistrationMsgAlert != "") {
                    Alert.alert(this.state.inputCodeRegistrationMsgAlert, "")
                }
            }, 100)
            if (this.state.contratoValidated) {
                setTimeout(() => {
                    this.setState({ contratoValidationVisible: false })
                }, 2000)
            }
        })
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


    cargarMunicipios = (dep) => {
        this.setState({
            loading: true
        })
        fetch(SERVER_ADDRESS + `api/config/municipios?d=${dep}`).then(r => r.json()).then(response => {
            let mpios = []
            response.forEach((item) => {
                mpios.push({ 'key': item.id, 'label': item.descripcion })
            })
            this.setState({ optsMunicipios: mpios })
        }).finally(() => {
            this.setState({ loading: false })
        })
    }

    firmaGuardada = (result) => {
        this.enviar(result.encoded)
    }

    noMostrarTerminos = () => {
        console.log("Cerrar ")
        this.setState({ mostrarTerminos: false })
    }

    terminosYcondiciones = () => {
        this.setState({ mostrarTerminos: true })
        if (this.state.terminosHtml == '') {
            fetch(SERVER_ADDRESS + 'api/config/terminos/').then(r => r.json()).then(r => {
                this.setState({ terminosHtml: r[0].terminos_condiciones })
            })
        }
    }

    enviar = (firma) => {
        const _body = {
            user: {
                first_name: this.state.firstname,
                last_name: this.state.lastname,
                email: this.state.email,
                password: this.state.password1,
            },
            firma: firma,
            numero_whatsapp: this.state.numWhatsapp,
            genero: this.state.genero,
            departamento: this.state.dep,
            municipio: this.state.mun,
            direccion: this.state.direccion,
            fecha_nacimiento: this.state.fechaNac,
            tipo_documento_identidad: this.state.tipo_doc,
            num_documento_identidad: this.state.numDocumento,
            contrato_aprobado: this.state.aceptacionContrato
        }
        if (this.state.social_user_id) {
            _body.social_user_id = this.state.social_user_id
        }
        const body = JSON.stringify(_body)

        let statusCode = 0;
        fetch(SERVER_ADDRESS + "api/usuarios/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: body
        }).then(r => {
            statusCode = r.status
            return r
        }).then(r => r.json()).then(async r =>  {
            if (statusCode == 200 || statusCode == 201) {
                this.setState({ loading: false })
                fetch(`${SERVER_ADDRESS}api/login/`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({'username': this.state.email, 'password': this.state.password1 }),
                }).then(r => {
                    return r.json()
                }).then(async r => {
                    const { data, token } = r;

                    await setSharedPreference('userId', '' + data.id);
                    await setSharedPreference('auth-token', token);
                    setTimeout(() => {
                        Alert.alert("¡Te has registrado exitosamente!", "Ya puedes comenzar a vender con Servi")
                        this.props.userChangeProps({estadoDeSesion: 0});
                        
                    }, 400)
                }).catch(() => {
                    Alert.alert("¡Te has registrado exitosamente!", "Ya puedes comenzar a vender con Servi")
                    this.props.navigation.pop()
                })
            } else if (statusCode == 400) {
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
                this.setState({ loading: false })
                setTimeout(() => {
                    Alert.alert("Error", mensaje)
                }, 400)
            } else {
                this.setState({ loading: false })
                setTimeout(() => {
                    Alert.alert("Error", "Ha ocurrido un evento inesperado")
                }, 400)
            }
        }).catch((err) => {
            this.setState({ loading: false })
            setTimeout(() => {
                Alert.alert("Error", err.toString())
            }, 400)
        })
    }

    onPressRegister = () => {

        if (!this.state.isEnabled) {
            Alert.alert('Debes aceptar los términos y condiciones')
            return
        }
        if (!this.state.aceptacionContrato) {
            Alert.alert('Debes aceptar el contrato de corresponsalía')
            return
        }

        this.setState({ loading: true })
        this.refs["firma"].saveImage();
    }

    cerrarContrato = () => {
        this.setState({ contratoVisualizacion: false })
    }

    nextStep = (plus) => {
        if (plus > -1) {
            if (this.state.step == 0) {
                Execute(this.ValidationsStep1).then(() => {
                    this.setState({ step: 1 })
                }).catch(error => {

                })

            } else if (this.state.step == 1) {
                Execute(this.ValidationsStep2).then(() => {
                    this.setState({ step: 2 })
                }).catch(error => {

                })
            }
        }

    }

    stepOne = () => {
        return (
            <View style={{marginHorizontal:16}}>
                <InputText placeholder='Nombres' value={this.state.firstname} onChangeText={v => this.onChangeValue('firstname', v)} />
                <Validator value={this.state.firstname} required='Campo requerido' ref={ref => this.ValidationsStep1['firstname'] = ref} />

                <InputText marginTop={1} input={{ secureTextEntry: true }} placeholder={'Apellidos'} value={this.state.lastname} onChangeText={v => this.onChangeValue('lastname', v)} />
                <Validator value={this.state.lastname} required='Campo requerido' ref={ref => this.ValidationsStep1['lastname'] = ref} />

                <InputText
                    marginTop={1}
                    placeholder={'Correo electrónico'}
                    value={this.state.email} input={{ autoCompleteType: 'email', keyboardType: 'email-address' }}
                    onChangeText={v => this.onChangeValue('email', v)}
                />
                <Validator value={this.state.email} required email ref={ref => this.ValidationsStep1['email'] = ref} />

                <InputText marginTop={1} password placeholder={'Contraseña'} value={this.state.password1} onChangeText={v => this.onChangeValue('password1', v)} />
                <Validator required value={this.state.password1} ref={ref => this.ValidationsStep1['password1'] = ref} />

                <InputText marginTop={1} password placeholder={'Confirma tu contraseña'} value={this.state.password2} onChangeText={v => this.onChangeValue('password2', v)} />
                <Validator required value={this.state.password2} valueb={this.state.password1} message='Las contraseñas introducidas no coinciden' ref={ref => this.ValidationsStep1['password2'] = ref} />

                <View></View>

            </View>
        )
    }

    stepThree = () => {
        return (
            <React.Fragment>
                <View style={styles.containerSignIn}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.terminosYcondiciones}>
                        <Text>
                            Acepto los
                                    <Text style={styles.link}> términos y condiciones </Text>
                                    y las
                                    <Text style={styles.link}> políticas de tratamiento de datos</Text>
                        </Text>
                    </TouchableOpacity>
                    <Switch

                        thumbColor={this.state.isEnabled ? COLORS.SECONDARY_COLOR : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.onSwitchAcceptChange}
                        value={this.state.isEnabled}
                    />
                </View>

                <View style={styles.containerSignIn}>
                    <View style={{ flex: 1 }}>
                        <Text>
                            Acepto las condiciones en el
                                    <Text style={styles.link} onPress={() => this.setState({ contratoVisualizacion: true })}> contrato de corresponsalía </Text>
                        </Text>
                    </View>
                    <Switch

                        thumbColor={this.state.aceptacionContrato ? COLORS.SECONDARY_COLOR : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        disabled={this.state.aceptacionContrato}
                        onValueChange={this.onSwitchAcceptContratoChange}
                        value={this.state.aceptacionContrato}
                    />
                </View>

                <View style={{ marginTop: MARGIN_VERTICAL, paddingHorizontal: 42, paddingVertical: 16, backgroundColor: COLORS.GRIS, justifyContent: 'center', borderRadius: CURVA, elevation: 2 }}>


                    <SignatureCapture ref='firma' onSaveEvent={this.firmaGuardada} saveImageFileInExtStorage={false} minStrokeWidth={1} and maxStrokeWidth={4} showNativeButtons={false} style={{ width: '100%', aspectRatio: 16 / 9, marginVertical: 8 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 }}>
                        <Caption style={{ color: COLORS.NEGRO }}>Firmar Contrato</Caption>
                        <FAB icon='eraser' onPress={() => this.refs['firma'].resetImage()} style={{ backgroundColor: COLORS.ROJO }} color={COLORS.BLANCO} />
                    </View>


                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginVertical:32}}>
                        <TouchableOpacity  onPress={() => this.setState({ step: 1 })}>
                            <Text style={{fontSize:18,color:'#007aff'}}>Atrás</Text>
                        </TouchableOpacity>
                        <Button title='¡Empezar a vender!' onPress={this.onPressRegister}/>
                    </View>
            </React.Fragment>
        )
    }

    steps = (step) => {
        switch (step) {
            case 0:
                return this.stepOne()
                break;
            case 1:
                return this.stepTwo()
                break
            case 2:
                return this.stepThree()
                break
            default:
                break;
        }
    }

    render() {
        const step = parseInt(this.state.step)
        return (
            <ColorfullContianer style={styles.container}>

                <ModalWebView visible={this.state.contratoVisualizacion} html={this.state.contratoContent} cancelButtonText="Volver" onClose={this.cerrarContrato}></ModalWebView>
                <ModalWebView visible={this.state.mostrarTerminos} html={this.state.terminosHtml} cancelButtonText="Volver" onClose={this.noMostrarTerminos}></ModalWebView>

                <ModalPrompt
                    visible={this.state.contratoValidationVisible}
                    dismissModal={() => this.setState({ contratoValidationVisible: false })}
                    mt={16}
                    valid={this.state.contratoValidated}
                    actionDisabled={this.state.contratoValidated}
                    error={this.state.inputCodeRegistrationError}
                    textMessage={this.state.textResponseCodeValidation}
                    value={this.state.inputCodeRegistration}
                    onChangeText={(i) => this.setState({ inputCodeRegistration: i })}
                    onCodeValidation={this.validateCodeRegistration} reSend={this.onSwitchAcceptContratoChange}>

                </ModalPrompt>


                {this.state.showHeader && <Header navigation={this.props.navigation} />}
                <Loader loading={this.state.loading}></Loader>
                <View style={{ flex: 1, paddingHorizontal:0}}>
                    <ProgressSteps activeStep={this.state.step}>
                        <ProgressStep label="" nextBtnText='Siguiente' nextBtnStyle={{ backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: CURVA }} nextBtnTextStyle={{ color: '#fff' }} onNext={() => this.nextStep(1)} errors={true}>
                            {this.stepOne()}
                        </ProgressStep>

                        <ProgressStep label="" 
                        nextBtnStyle={{ backgroundColor: COLORS.PRIMARY_COLOR }} 
                        nextBtnStyle={{ backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: CURVA }} 
                        nextBtnTextStyle={{ color: '#fff' }} 
                        nextBtnText='Siguiente' 
                        onPrevious={() => this.setState({ step: 0 })} 
                        onNext={() => this.nextStep(2)} 
                        previousBtnText='Atrás' 
                        errors={true} 
                        >
                            <View style={{marginHorizontal:16}}>


                                <Select marginTop={1} value={this.state.genero} options={this.generoOpts} placeholder={'Seleccione un género'} onSelect={(item) => this.setState({ genero: item.key })} />

                                <InputDateTimerPicker placeholder='Fecha de nacimiento'
                                    marginTop={1}
                                    showTime={false}
                                    value={this.state.fechaNac} format='YYYY-MM-DD'
                                    onChange={(v) => this.setState({ 'fechaNac': v })}
                                />

                                <Select marginTop={1} value={this.state.tipo_doc} options={this.state.optsTiposDocs} placeholder={'Seleccione un tipo doc.'} onSelect={(item) => this.setState({ tipo_doc: item.key })} />


                                <InputText marginTop={1} input={{ keyboardType: 'decimal-pad' }} placeholder={'Número de documento'} value={this.state.numDocumento} onChangeText={no => this.setState({ numDocumento: no })} />


                                <Select marginTop={1} value={this.state.dep} options={this.state.optsDepartamentos} placeholder={'Seleccione un dep.'} onSelect={(item) => { this.setState({ dep: item.key }); this.cargarMunicipios(item.key) }} />

                                <Select marginTop={1} value={this.state.mun} options={this.state.optsMunicipios} placeholder={'Seleccione un mun.'} onSelect={(item) => this.setState({ mun: item.key })} />


                                <InputText marginTop={1} placeholder='Dirección' value={this.state.direccion} onChangeText={v => this.onChangeValue('direccion', v)} />

                                <Validator value={this.state.direccion} required='Campo requerido' ref={ref => this.ValidationsStep2['direccion'] = ref} />

                                <InputText marginTop={1} input={{ keyboardType: 'phone-pad' }} placeholder={'Número de WhatsApp'} value={this.state.numWhatsapp} onChangeText={v => this.onChangeValue('numWhatsapp', v)} />
                                <Validator value={this.state.numWhatsapp} required='Campo requerido' ref={ref => this.ValidationsStep2['numWhatsapp'] = ref} />


                            </View>
                        </ProgressStep>

                        <ProgressStep
                            label="Finalizar" previousBtnStyle={{alignSelf:'flex-start'}}
                            finishBtnText='¡Empezar a vender!'
                            errors={false}
                            nextBtnStyle={{ padding:4,backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: CURVA,marginLeft:16 }}
                            nextBtnTextStyle={{ color: '#fff',margin:0}}
                            previousBtnStyle={{textAlign:'left',fontSize:24,flex:1}}
                            removeBtnRow={true}
                            previousBtnText='Atrás'>
                            {this.stepThree()}
                        </ProgressStep>
                    </ProgressSteps>
                    
                </View>

            </ColorfullContianer>
        )
    }
}

const mapToActions = (dispatch) => {
    return {
      userChangeProps: (props) => {
        dispatch(changeProps(props));
      },
    };
};

export default connect(null, mapToActions)(SignUp);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BLANCO
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
        marginTop: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        backgroundColor: COLORS.BLANCO,
        height: 48,
        flex: 1,
        paddingHorizontal: 16
    },
    inputDatePicker: {
        width: '100%',
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
        fontWeight: '600',
        color: '#FFF',
        fontSize: 17
    },
    txtGoBack: {
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
        fontWeight: '500'
    }
})
