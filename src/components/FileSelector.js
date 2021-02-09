import {
  ALTURA,
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TEXTO_TAM,
} from 'constants';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import DocumentPicker from 'react-native-document-picker';
import ZoomIn from './ZoomIn';
const RNFS = require('react-native-fs');

export default function FileSelector(props) {
  const [filename, setFileName] = useState('');

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

  useEffect(() => {});

  const select = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    });
    console.log(res);
    setFileName(res.name);
    const uri = Platform.select({
      android: res.uri,
      ios: decodeURIComponent(res.uri)?.replace?.('file://', ''),
    });
    requestAnimationFrame(() => {
      RNFS.readFile(uri, 'base64')
        .then((c) => {
          if (props.onSelect) {
            props.onSelect(c);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const remove = () => {
    setFileName('');
    if (props.onSelect) {
      props.onSelect('');
    }
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={select}
        style={[style.wrapper, props.style, extra_style]}>
        <SimpleLineIcons size={24} name="paper-clip" />
        <Text numberOfLines={1} ellipsizeMode="head" style={style.text}>
          {filename != '' ? filename : 'Seleccione un archivo'}
        </Text>

        {filename != '' ? (
          <ZoomIn>
            <SimpleLineIcons
              onPress={remove}
              size={24}
              name="trash"
              color={COLORS.ROJO}
            />
          </ZoomIn>
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
      </TouchableOpacity>
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
    </React.Fragment>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    color: COLORS.NEGRO_N1,
    fontSize: TEXTO_TAM * 0.5,
    fontFamily: 'Mont-Regular',
    marginHorizontal: MARGIN_HORIZONTAL,
  },
});
