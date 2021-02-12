import {ALTURA, COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM} from 'constants';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

export default function Input(props) {
  const [pass, setPass] = useState(false);
  const [isPass, setIsPass] = useState(false);

  const extra_style = {};
  if (props.color) {
    switch (props.color) {
      case 'morado':
        extra_style.backgroundColor = COLORS.MORADO;
        break;
    }
  }
  if (props.marginTop) {
    extra_style.marginTop = props.marginTop * MARGIN_VERTICAL;
  }

  useEffect(() => {
    if (props.password === true && !isPass) {
      setPass(true);
      setIsPass(true);
    } else {
      setPass(false);
      setIsPass(false);
    }
  }, [props.password]);

  return (
    <View style={[style.wrapper, props.style, extra_style]}>
      <TextInput
        {...props.input}
        disabled={props.disabled}
        secureTextEntry={pass === true ? true : false}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        autoCapitalize={
          isPass ||
          (props.input &&
            props.input.autoCompleteType &&
            props.input.autoCompleteType == 'email')
            ? 'none'
            : 'sentences'
        }
        style={[style.input, props.styleInput]}
      />
      {pass ? (
        <Entypo
          size={24}
          name={pass ? 'eye-with-line' : 'eye'}
          onPress={() => setPass(!pass)}
        />
      ) : null}
      {props.disabled && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '111%',
            height: ALTURA,
            backgroundColor: 'rgba(0,0,0,.1)',
            borderRadius: CURVA,
          }}></View>
      )}
    </View>
  );
}
const style = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.BLANCO,
    width: '100%',
    height: 32,
    borderRadius: CURVA,
    borderColor: '#EAE8EA',
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: COLORS.BLANCO,
    fontSize: TEXTO_TAM,
    fontFamily: 'Mont-Regular',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    fontFamily: 'Mont-Regular',
    fontSize: 14,
  },
});
