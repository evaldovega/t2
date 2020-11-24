import React from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import {COLORS} from 'constants';

class ClientAgenda extends React.Component {
  render() {
    const markers = {};
    this.props.tareas.forEach((task) => {
      const date = moment(task.fecha_agendamiento).format('YYYY-MM-DD');
      if (!markers[date]) {
        markers[date] = {
          dots: [],
          selectedColor: COLORS.PRIMARY_COLOR,
          marked: true,
          selected: true,
        };
      }
      markers[date].dots.push({
        selectedDotColor: 'red',
        key: 'vacation',
        color: 'red',
      });
    });
    console.log(markers);
    return (
      <Calendar
        markedDates={markers}
        markingType={'multi-dot'}
        onDayPress={(day) => {
          console.log('selected day', day);
        }}
      />
    );
  }
}

export default ClientAgenda;
