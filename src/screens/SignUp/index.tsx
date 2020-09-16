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
            msgAlert: "",
            firstname: "",
            firstnameErrors: "",
            firstnameBorderColor: '#EAE8EA',
            lastname: "",
            lastnameErrors: "",
            lastnameBorderColor: '#EAE8EA',
            mail: "",
            mailErrors: "",
            mailBorderColor: '#EAE8EA',
            password1: "",
            password1Errors: "",
            password1BorderColor: '#EAE8EA',
            password2: "",
            password2Errors: "",
            password2BorderColor: '#EAE8EA',

            date: "2020-09-15",
            show: false,

            numWhatsapp:"",
            numWhatsappErrors: "",
            numWhatsappBorderColor: '#EAE8EA',
            direccion: "",
            direccionErrors: "",
            direccionBorderColor: '#EAE8EA',
            fechaNac: "",
            numDocumento:"",
            numDocumentoErrors:"",
            numDocumentoBorderColor: '#EAE8EA',
            
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
        Alert.prompt('Aceptación de contrato de carrotaje', "Hemos enviado un código al correo electrónico que has indicado. Por favor ingrésalo para verificar tu aceptación", text=>{
            console.log(text)
        })
    }

    onSwitchAcceptChange = () => {
        this.setState({isEnabled: !this.state.isEnabled})
    }
    onSwitchAcceptContratoChange = () => {
        // Enviar codigo de aprobacion
        if(!this.state.aceptacionContrato){
            fetch(SERVER_ADDRESS+"", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    'email': this.state.mail
                })
            }).then(r => r.json()).then(response => {

            }).catch((err) => {
                console.log(err.toString())
            }).finally(() => {

            })
        }

        this.setState({aceptacionContrato: !this.state.aceptacionContrato})
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
        this.setState({
            firstname: "",
            firstnameErrors: "",
            firstnameBorderColor: '#EAE8EA',
            lastname: "",
            lastnameErrors: "",
            lastnameBorderColor: '#EAE8EA',
            mail: "",
            mailErrors: "",
            mailBorderColor: '#EAE8EA',
            password1: "",
            password1Errors: "",
            password1BorderColor: '#EAE8EA',
            password2: "",
            password2Errors: "",
            password2BorderColor: '#EAE8EA',
        })

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
                first_name: this.state.firstname,
                last_name: this.state.lastname,
                email:this.state.mail,
                password: this.state.password1
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
        })

    }
    cerrarContrato = () => {
        this.setState({contratoVisualizacion: false})
    } 

    render() {
        return (
            <View style={styles.container}>
                
                <ModalWebView visible={this.state.contratoVisualizacion} html={this.state.contratoContent} cancelButtonText="Volver" onClose={this.cerrarContrato}></ModalWebView>
                <ScrollView>
                    <View>
                        <Header/>
                        <Loader loading={this.state.loading}></Loader>
                        <Input mt={60} pass={false} errorMsg={this.state.firstnameErrors} borderColor={this.state.firstnameBorderColor} placeholder={'Nombres'} value={this.state.firstname} onChangeText={firstName=>this.setState({firstname:firstName})} />
                        <Input mt={16} pass={false} errorMsg={this.state.lastnameErrors} borderColor={this.state.lastnameBorderColor} placeholder={'Apellidos'} value={this.state.lastname} onChangeText={lastName=>this.setState({lastname:lastName})} />
                        <Input mt={16} pass={false} errorMsg={this.state.mailErrors} borderColor={this.state.mailBorderColor} placeholder={'Correo electrónico'} value={this.state.mail} onChangeText={email=>this.setState({mail:email})} />
                        <Input mt={16} pass={true} errorMsg={this.state.password1Errors} borderColor={this.state.password1BorderColor} placeholder={'Contraseña'} value={this.state.password1} onChangeText={p1=>this.setState({password1:p1})} />
                        <Input mt={16} pass={true} errorMsg={this.state.password2Errors} borderColor={this.state.password2BorderColor} placeholder={'Confirma tu contraseña'} value={this.state.password2} onChangeText={p2=>this.setState({password2:p2})} />
                        
                        <View style={[styles.line, {marginTop:20}]}></View>
                        <View style={styles.containerSignIn}>
                            <Text>INFORMACIÓN COMPLEMENTARIA</Text>
                        </View>
                        
                        {/* Formulario complementario */}
                        <Input mt={30} pass={false} placeholder={'Número de WhatsApp'} errorMsg={this.state.numWhatsappErrors} borderColor={this.state.numWhatsappBorderColor} value={this.state.firstname} onChangeText={whatsapp=>this.setState({numWhatsapp:whatsapp})} />
                        
                        <View style={styles.containerDropdown}>
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
                                mode="date"
                                placeholder="Fecha de nacimiento"
                                format="YYYY-MM-DD"
                                minDate="2016-05-01"
                                maxDate="2016-06-01"
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
                                onDateChange={(date) => {this.setState({date: date})}}
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
                                onValueChange={this.onSwitchAcceptContratoChange}
                                value={this.state.aceptacionContrato}
                            />
                        </View>

                        <View style={styles.containerSignIn}>
                            <TouchableOpacity style={ this.state.isEnabled ? styles.btnSignIn : styles.btnSignInDisabled} disabled={!this.state.isEnabled} onPress={this.onPressRegister}>
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
