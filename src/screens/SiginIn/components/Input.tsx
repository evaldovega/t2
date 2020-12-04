import React, {memo, useCallback, useState} from "react";
import {StyleSheet, TextInput, Text, TouchableOpacity, View} from "react-native";
import {Lato} from "utils/fonts";
import SvgEyes from "svgs/signIn/SvgEyes";
import {COLORS} from 'constants'

interface Props {
    mt?: number;
    pass?: boolean;
    placeholder:string;
    error?:boolean;
}

const Input = memo((props: Props) => {
    const [secure, setSecure] = useState(props.pass);

    const onPressIn = useCallback(() => {
        setSecure(false);
    }, []);

    const onPressOut = useCallback(() => {
        setSecure(true);
    }, []);

    return (
        <View>
            { props.error ? 
                <View>
                    <View style={[styles.container, {marginTop: props.mt, borderColor:'red'}]}>
                        <TextInput
                            style={[styles.input, props.styleInput]}
                            placeholder={props.placeholder}
                            placeholderTextColor={'#ABA4AC'}
                            secureTextEntry={secure}
                            value={props.value}
                            onChangeText={props.onChangeText}
                            onBlur={props.onBlur}
                            autoCapitalize={false}

                        />
                        {props.pass && <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
                        <SvgEyes/>
                        </TouchableOpacity>}
                    </View>
                    <Text style={[styles.textAlert]}>Este campo es requerido</Text>
                </View>
            :
                <View style={[styles.container, {marginTop: props.mt}]}>
                    <TextInput
                        style={[styles.input, props.styleInput]}
                        placeholder={props.placeholder}
                        placeholderTextColor={'#ABA4AC'}
                        secureTextEntry={secure}
                        value={props.value}
                        onChangeText={props.onChangeText}
                        onBlur={props.onBlur}
                        autoCapitalize={false}

                    />
                    {props.pass && <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
                    <SvgEyes/>
                    </TouchableOpacity>}
                </View>
            }
        </View>
    )
});

export default Input;

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        backgroundColor:COLORS.BLANCO,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    textAlert: {
        marginHorizontal: 40,
        alignItems: 'center',
        paddingHorizontal: 16,
        color: "red"
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: Lato,
        padding: 0,
        margin: 0
    }
});
