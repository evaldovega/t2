import React, {useState, useEffect} from 'react';
import {ALTURA, COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM} from 'constants';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import 'moment/locale/es';

const InputDateTimerPicker = (props) => {
  const {onChange, showTime = true, value} = props;

  const [date, setDate] = useState(new Date());

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

  const triggerOnChange = (_date) => {
    if (onChange) {
      console.log('Change to ', _date);
      onChange(_date);
    }
  };

  useEffect(() => {
    if (value && value != '') {
      const defaultValue =
        value != '' && moment(value).isValid()
          ? moment(value).toDate()
          : moment().toDate();

      setDate(defaultValue);
    }
  }, [value]);

  return (
    <React.Fragment>
      {showSelectDate && (
        <DateTimePicker
          display="default"
          value={date}
          mode="date"
          onChange={(d) => {
            setShowSelectDate(false);

            if (d.nativeEvent && d.nativeEvent.timestamp) {
              const newDate = moment(d.nativeEvent.timestamp);
              const valueDate = moment(date);

              valueDate
                .date(newDate.format('D'))
                .month(newDate.format('M') - 1)
                .year(newDate.format('YYYY'));

              triggerOnChange(valueDate.format('YYYY-MM-DD HH:mm'));
            }
          }}
          is24Hour={true}
        />
      )}
      {showSelectHour && (
        <DateTimePicker
          display="default"
          value={date}
          mode="time"
          onChange={(d) => {
            console.log('Hour ', d);
            setShowSelectHour(false);
            if (d.nativeEvent && d.nativeEvent.timestamp) {
              const newDate = moment(d.nativeEvent.timestamp);
              const valueDate = moment(date);
              valueDate
                .minutes(newDate.format('mm'))
                .hour(newDate.format('HH'));
              triggerOnChange(valueDate.format('YYYY-MM-DD HH:mm'));
            }
          }}
          is24Hour={true}
        />
      )}

      <View style={[style.wrapper, props.style, extra_style]}>
        <SimpleLineIcons
          size={24}
          name="calendar"
          color="#787778"
          onPress={() => setShowSelectDate(true)}
        />
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setShowSelectDate(true)}>
          <Text style={{textAlign: 'center'}}>
            {moment(date).format('YYYY-MM-DD')}
          </Text>
        </TouchableOpacity>
        {showTime && (
          <React.Fragment>
            <SimpleLineIcons
              size={24}
              name="clock"
              color="#787778"
              onPress={() => setShowSelectHour(true)}
            />
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => setShowSelectHour(true)}>
              <Text style={{textAlign: 'center'}}>
                {moment(date).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
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
