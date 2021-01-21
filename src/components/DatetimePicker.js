import React, {useState, useEffect} from 'react';
import {ALTURA, COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM} from 'constants';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import 'moment/locale/es';

const InputDateTimerPicker = (props) => {
  const {onChange, showDate = true, showTime = true, value, label = ''} = props;

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

  const selectorTime = () => {
    if (showSelectHour === true) {
      return (
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <DateTimePicker
            style={{flex: 1}}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={date}
            mode="time"
            onChange={(d) => {
              console.log('Hour ', d);
              if (Platform.OS !== 'ios') {
                setShowSelectHour(false);
              }
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
          <SimpleLineIcons
            name="close"
            size={24}
            onPress={() => setShowSelectHour(false)}
          />
        </View>
      );
    }
  };

  const selectorDate = () => {
    if (showSelectDate) {
      return (
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <DateTimePicker
            style={{flex: 1}}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={date}
            mode="date"
            onChange={(d) => {
              if (Platform.OS !== 'ios') {
                setShowSelectDate(false);
              }

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
          <SimpleLineIcons
            name="close"
            size={24}
            onPress={() => setShowSelectDate(false)}
          />
        </View>
      );
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
      {label != '' && (
        <Text
          style={{
            fontFamily: 'Mont-Regular',
            marginTop: MARGIN_VERTICAL,
            marginBottom: MARGIN_VERTICAL * 0.8,
            color: COLORS.NEGRO_N1,
          }}>
          {label}
        </Text>
      )}
      <View style={[style.wrapper, props.style, extra_style]}>
        {showDate && (
          <React.Fragment>
            <SimpleLineIcons
              size={24}
              name="calendar"
              color="#787778"
              onPress={() => {
                setShowSelectDate(!showSelectDate);
                setShowSelectHour(false);
              }}
            />
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                setShowSelectDate(!showSelectDate);
                setShowSelectHour(false);
              }}>
              <Text style={{textAlign: 'center'}}>
                {moment(date).format('YYYY-MM-DD')}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
        {showTime && (
          <React.Fragment>
            <SimpleLineIcons
              size={24}
              name="clock"
              color="#787778"
              onPress={() => {
                setShowSelectHour(!showSelectHour);
                setShowSelectDate(false);
              }}
            />
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                setShowSelectHour(!showSelectHour);
                setShowSelectDate(false);
              }}>
              <Text style={{textAlign: 'center'}}>
                {moment(date).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
      {selectorDate()}
      {selectorTime()}
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
