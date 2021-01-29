import {ALTURA, COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM} from 'constants';
import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';

export default function Button(props) {
  const small_reduccion = 0.5;
  const extra_style = {},
    extra_style_text = {};
  if (props.color) {
    switch (props.color) {
      case 'morado':
        extra_style.backgroundColor = COLORS.MORADO;
        break;
      case 'rojo':
        extra_style.backgroundColor = COLORS.ROJO;
        break;
    }
  }
  if (props.marginTop) {
    extra_style.marginTop = props.marginTop * MARGIN_VERTICAL;
  }
  if (props.marginBottom) {
    extra_style.marginBottom = props.marginBottom * MARGIN_VERTICAL;
  }
  if (props.small) {
    extra_style.height = ALTURA * small_reduccion;
    extra_style.paddingHorizontal = (ALTURA * small_reduccion) / 2;
    extra_style_text.fontSize = TEXTO_TAM * small_reduccion;
  }
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={() => requestAnimationFrame(() => props.onPress())}
      style={[style.wrapper, props.style, extra_style]}>
      {props.right}
      <Text style={[style.text, extra_style_text, props.style_text]}>
        {props.title} {props.disabled ? '...' : ''}
      </Text>
    </TouchableOpacity>
  );
}
const style = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.VERDE,
    height: ALTURA,
    paddingHorizontal: ALTURA / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CURVA,
    flexDirection: 'row',
  },
  text: {
    color: COLORS.BLANCO,
    fontSize: TEXTO_TAM * 0.8,
    fontFamily: 'Mont-Regular',
  },
});
