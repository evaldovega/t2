import {
  ALTURA,
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TEXTO_TAM,
} from 'constants';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
const {width, height} = Dimensions.get('screen');
export default function Select(props) {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [options, setOptions] = useState([]);

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
    if (props.options && options.length == 0) {
      setOptions(props.options);
    }
    let label = options.find((o) => o.key == props.value);
    if (label) {
      label = label.label;
    } else {
      label = props.placeholder;
    }
    setLabel(label);
  });

  const onSelect = (item) => {
    setVisible(false);
    if (props.onSelect) {
      props.onSelect(item);
    }
  };
  const onCancel = () => {
    setVisible(false);
    if (props.onCancel) {
      props.onCancel(item);
    }
  };
  const show = () => {
    console.log('Mostrar select');
    setVisible(true);
    if (props.onShow) {
      props.onShow();
    }
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={show}
        style={[style.wrapper, props.style, extra_style]}>
        <Text style={[style.text]}>{label}</Text>
        <SimpleLineIcons size={24} name="arrow-down" color="#EAE8EA" />
      </TouchableOpacity>
      <ModalFilterPicker
        optionTextStyle={{
          flex: 1,
          textAlign: 'left',
          color: '#000',
          fontSize: TEXTO_TAM,
          fontFamily: 'Mont-Regular',
        }}
        cancelButtonStyle={{
          backgroundColor: COLORS.MORADO,
          flex: 0,
          color: COLORS.BLANCO,
          paddingVertical: MARGIN_VERTICAL,
          paddingHorizontal: MARGIN_HORIZONTAL,
          borderRadius: CURVA,
        }}
        cancelButtonTextStyle={{
          textAlign: 'center',
          fontFamily: 'Mont-Regular',
          fontSize: TEXTO_TAM,
          color: COLORS.BLANCO,
        }}
        listContainerStyle={{
          flex: 0,
          width: width * 0.8,
          minHeight: height * 0.4,
          maxHeight: height * 0.7,
          backgroundColor: COLORS.BLANCO,
          borderRadius: CURVA,
          marginVertical: MARGIN_VERTICAL,
        }}
        visible={visible}
        onSelect={onSelect}
        onCancel={onCancel}
        options={options}
      />
    </React.Fragment>
  );
}
const style = StyleSheet.create({
  wrapper: {
    zIndex: 999,
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
    color: COLORS.NEGRO,
    fontSize: TEXTO_TAM * 0.7,
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
