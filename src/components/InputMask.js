import {ALTURA, COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM} from 'constants';
import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';

export default function InputMask(props) {
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
  return (
    <View style={[style.wrapper, props.style, extra_style]}>
      <TextInputMask
        {...props.input}
        editable={!props.disabled}
        style={[style.input]}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onBlur={props.onBlur}
        mask={props.mask}
      />
    </View>
  );
}
const style = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.BLANCO,
    width: '100%',
    height: ALTURA,
    borderRadius: CURVA,
    borderColor: '#EAE8EA',
    borderWidth: 1,
    paddingHorizontal: 16,
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
  },
});
