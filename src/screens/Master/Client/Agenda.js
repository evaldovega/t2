import React, {useEffect, useState} from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {View, ScrollView, Text} from 'react-native';
import moment from 'moment';
import {COLORS} from 'constants';
import {Title} from 'react-native-paper';
import TaskList from '../Task/List';
import API from 'utils/Axios';

const ClientAgenda = ({cliente, navigation, taskRemove}) => {
  const [tasks, setTasks] = useState([]);
  const [tasksInDay, setTasksInDay] = useState([]);

  const slots = [];
  let start = moment().startOf('day').set({hour: 6, minute: 0});
  let end = moment().endOf('day').set({hour: 21, minute: 59});
  while (start < end) {
    slots.push(start.clone());
    start.add(15, 'minutes');
  }
  const markers = {};
  if (tasks.length > 0) {
    tasks.forEach((task) => {
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
        key: task.id,
        color: 'red',
      });
    });
  }

  const loadTasks = () => {
    API('clientes/' + cliente + '/')
      .then((response) => {
        const {tareas} = response.data;
        setTasks(tareas);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const reload = () => {
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={{marginBottom: 16}}>
      <Calendar
        markedDates={markers}
        markingType={'multi-dot'}
        onDayPress={(day) => {
          const marker = markers[day.dateString];
          if (marker && marker.dots && marker.dots.length > 0) {
            const task_ids = marker.dots.map((m) => m.key);
            const task_day = tasks.filter((task) => task_ids.includes(task.id));
            setTasksInDay(task_day);
          }
        }}
      />

      <TaskList
        reload={reload}
        navigation={navigation}
        tareas={tasksInDay}
        taskRemove={taskRemove}
      />
    </View>
  );
};

export default ClientAgenda;
