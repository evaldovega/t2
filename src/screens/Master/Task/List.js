import React from 'react';
import {View, FlatList, TouchableNativeFeedback, Alert} from 'react-native';

import {COLORS} from 'constants';
import moment from 'moment';
import {Subheading, Title, Caption, Colors, Avatar} from 'react-native-paper';
import Detail from '../Product/Detail';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }

  eliminar = (item) => {
    Alert.alert(
      '¿Desea eliminar la tarea?',
      '',
      [
        {
          text: 'Conservar',
          onPress: () => console.log('Conservar'),
          style: 'cancel',
        },
        {text: 'Eliminar', onPress: () => this.props.taskRemove(item.id)},
      ],
      {cancelable: false},
    );
  };

  renderVisit = ({item}) => (
    <TouchableNativeFeedback
      onLongPress={() => this.eliminar(item)}
      onPress={() =>
        this.props.navigation.push('TaskSave', {
          id: item.id,
          cliente_id: '',
          reload: this.props.reload,
        })
      }>
      <View style={{flexDirection: 'row', marginTop: 8, alignItems: 'center'}}>
        <View
          style={{
            width: 64,
            height: 64,
            marginRight: 8,
            overflow: 'hidden',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            elevation: 2,
            marginBottom: 2,
            marginLeft: 2,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: COLORS.PRIMARY_COLOR_DARK_1,
            }}>
            <Subheading style={{color: Colors.white, textAlign: 'center'}}>
              {moment(item.fecha_agendamiento).format('MMM')}
            </Subheading>
          </View>
          <Title>{moment(item.fecha_agendamiento).format('DD')}</Title>
        </View>
        <View>
          <Subheading>{item.tipo_tarea}</Subheading>
          <Caption>{item.motivo_tarea}</Caption>
          <Caption>
            🕒 {moment(item.fecha_agendamiento).format('hh:mm a')}
          </Caption>
        </View>
      </View>
    </TouchableNativeFeedback>
  );

  render() {
    return (
      <FlatList
        data={this.props.tareas}
        renderItem={this.renderVisit}
        keyExtractor={(item) => item.id}
      />
    );
  }
}

export default TaskList;
