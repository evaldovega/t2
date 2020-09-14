import React, {memo, useCallback, useState} from "react";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
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
        <View style={[styles.container, {marginTop: props.mt}]}>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                placeholderTextColor={'#ABA4AC'}
                secureTextEntry={secure}
            />
            {props.pass && <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
              <SvgEyes/>
            </TouchableOpacity>}
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
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: Lato,
        padding: 0,
        margin: 0
    }
});
