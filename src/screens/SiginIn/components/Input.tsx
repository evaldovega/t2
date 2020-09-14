import React, {memo, useCallback, useState} from "react";
import {StyleSheet, TextInput, Text, TouchableOpacity, View} from "react-native";
import {Lato} from "utils/fonts";
import SvgEyes from "svgs/signIn/SvgEyes";

interface Props {
    mt?: number;
    pass?: boolean;
    placeholder:string
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
            <View style={[styles.container, {marginTop: props.mt, borderColor:props.borderColor}]}>
                <TextInput
                    style={[styles.input, props.styleInput]}
                    placeholder={props.placeholder}
                    placeholderTextColor={'#ABA4AC'}
                    secureTextEntry={secure}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    autoCapitalize={false}

                />
                {props.pass && <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
                <SvgEyes/>
                </TouchableOpacity>}
            </View>
            {props.errorMsg != "" ? <Text style={[styles.textAlert]}>Este campo es requerido</Text> : null}
        </View>
    )
});

export default Input;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 40,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8EA',
        height: 48,
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
