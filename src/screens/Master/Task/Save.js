import React from 'react';
import {
  View,
  ScrollView,
  Picker,
  TouchableNativeFeedback,
  Text,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  FAB,
  Avatar,
  Title,
  Colors,
  Caption,
  Subheading,
  Card,
  Button,
  Divider,
  TextInput,
} from 'react-native-paper';
import Loader from 'components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import {cargar} from '../../../redux/actions/TaskType';
import {taskSave} from '../../../redux/actions/Clients';

class TaskSave extends React.Component {
  state = {
    tipo_tarea: '',
    fecha_agendamiento: moment().toDate(),
    motivo_tarea: '',
    mostrar_fecha: false,
    mostrar_hora: false,
    data: moment().toDate(),
  };
  componentDidMount() {
    this.props.cargarTipos();
  }
  cambiarFecha = (e) => {
    this.setState({
      mostrar_fecha: false,
      fecha_agendamiento: moment(e.nativeEvent.timestamp).toDate(),
    });
  };
  cambiarHora = (e) => {
    let hora = moment(e.nativeEvent.timestamp);
    let fecha = moment(this.state.fecha_agendamiento);
    fecha.set({hour: hora.get('hour'), minute: hora.get('minute')});
    this.setState({mostrar_hora: false, fecha_agendamiento: fecha.toDate()});
  };
  guardar = () => {
    this.props.taskSave(this.props.route.params.cliente_id, {
      tipo_tarea: this.state.tipo_tarea,
      motivo_tarea: this.state.motivo_tarea,
      fecha_agendamiento: this.state.fecha_agendamiento,
    });
  };

  componentDidUpdate(prev) {
    if (prev.error != this.props.error && this.props.error != '') {
      Alert.alert('Algo anda mal', this.props.error);
    }
    if (prev.success != this.props.success && this.props.success != '') {
      Alert.alert('Buen trabajo', this.props.success);
      this.props.navigation.pop();
    }
  }

  render() {
    const fecha = moment(this.state.fecha_agendamiento).format('YYYY-MM-DD');
    const hora = moment(this.state.fecha_agendamiento).format('hh:mm a');
    return (
      <View style={{flex: 1}}>
        <Loader loading={this.props.loading} />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Agendar Tarea</Text>
          <FAB style={{opacity: 0}} />
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Card
              style={{borderRadius: 16, margin: 16, paddingVertical: 16}}
              elevation={2}>
              <Card.Content>
                <View style={styleInput.wrapper}>
                  <Picker
                    selectedValue={this.state.tipo_tarea}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({tipo_tarea: itemValue})
                    }
                    style={styleInput.input}>
                    {this.props.tipos.map((t) => (
                      <Picker.Item label={t.descripcion} value={t.id} />
                    ))}
                  </Picker>
                </View>

                <View
                  style={[
                    styleInput.wrapper,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text>{fecha}</Text>
                  <FAB
                    icon="calendar"
                    small
                    onPress={() => this.setState({mostrar_fecha: true})}
                  />
                </View>

                <View
                  style={[
                    styleInput.wrapper,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text>{hora}</Text>
                  <FAB
                    icon="clock"
                    small
                    onPress={() => this.setState({mostrar_hora: true})}
                  />
                </View>
                {this.state.mostrar_fecha && (
                  <DateTimePicker
                    value={this.state.fecha_agendamiento}
                    mode="date"
                    display="default"
                    onChange={this.cambiarFecha}
                    style={{flex: 1}}
                  />
                )}

                {this.state.mostrar_hora && (
                  <DateTimePicker
                    value={this.state.fecha_agendamiento}
                    is24Hour={false}
                    mode="time"
                    display="default"
                    onChange={this.cambiarHora}
                    style={{flex: 1}}
                  />
                )}

                <View style={styleInput.wrapper}>
                  <TextInput
                    style={styleInput.input}
                    multiline={true}
                    numberOfLines={4}
                    underlineColor="white"
                    placeholder="Motivo"
                    value={this.state.motivo_tarea}
                    onChangeText={(t) => this.setState({motivo_tarea: t})}
                  />
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  style={styleButton.wrapper}
                  dark={true}
                  color="white"
                  onPress={() => this.guardar()}>
                  Guardar
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapearEstado = (state) => {
  return {
    loading: state.Client.loading,
    error: state.Client.error,
    success: state.Client.success,
    cargarTipos: state.TaskType.cargar,
    tipos: state.TaskType.listado,
  };
};

const mapearAcciones = (dispatch) => {
  return {
    cargarTipos: () => {
      dispatch(cargar());
    },
    taskSave: (cliente, data) => {
      dispatch(taskSave(cliente, data));
    },
  };
};

export default connect(mapearEstado, mapearAcciones)(TaskSave);
