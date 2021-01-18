import React, {useState, useEffect} from 'react';
import {ALTURA, COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM} from 'constants';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import 'moment/locale/es';

const InputDateTimerPicker = (props) => {
  const {onChange} = props;

  const [value, setValue] = useState('');
  const [date, setDate] = useState(moment().toDate());
  const [hour, setHour] = useState(moment().toDate());

  const [showSelectDate, setShowSelectDate] = useState(false);
  const [showSelectHour, setShowSelectHour] = useState(false);

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
    if (onChange) {
      onChange(
        moment(date).format('YYYY-MM-DD') + ' ' + moment(hour).format('HH:mm'),
      );
    }
  }, [date, hour]);

  return (
    <React.Fragment>
      {showSelectDate && (
        <DateTimePicker
          display="default"
          value={date}
          mode="date"
          onChange={(d) => {
            setShowSelectDate(false);
            setDate(moment(d.nativeEvent.timestamp).toDate());
          }}
          is24Hour={true}
        />
      )}
      {showSelectHour && (
        <DateTimePicker
          display="default"
          value={hour}
          mode="time"
          onChange={(d) => {
            setShowSelectHour(false);
            setHour(moment(d.nativeEvent.timestamp).toDate());
          }}
          is24Hour={true}
        />
      )}

      <View style={[style.wrapper, props.style, extra_style]}>
        <SimpleLineIcons size={24} name="calendar" color="#787778" />
        <TouchableOpacity onPress={() => setShowSelectDate(true)}>
          <Text>{moment(date).format('YYYY-MM-DD')}</Text>
        </TouchableOpacity>
        <View
          style={{width: 1, backgroundColor: '#EAE8EA', height: ALTURA}}></View>
        <TouchableOpacity onPress={() => setShowSelectHour(true)}>
          <Text>{moment(hour).format('HH:mm')}</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

export default InputDateTimerPicker;

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
