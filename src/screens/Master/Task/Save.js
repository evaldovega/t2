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
  Divider,
  TextInput,
} from 'react-native-paper';
import Loader from 'components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import {cargar} from '../../../redux/actions/TaskType';
import {taskSave} from '../../../redux/actions/Clients';
import Navbar from 'components/Navbar';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Validator, {Execute} from 'components/Validator';
import {CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL} from 'constants';
import ColorfullContainer from 'components/ColorfullContainer';
import Select from 'components/Select';
import InputMask from 'components/InputMask';

class TaskSave extends React.Component {
  state = {
    tipo_tarea: '',
    fecha_agendamiento: moment().toDate(),
    motivo_tarea: '',
    selectorDate: false,
    selectorHora: false,
    data: moment().toDate(),
  };
  Validations = {};

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
    Execute(this.Validations).then(() => {
      const fecha = moment(this.state.dia + ' ' + this.state.hora).toDate();
      this.props.taskSave(this.props.route.params.cliente_id, {
        tipo_tarea: this.state.tipo_tarea,
        motivo_tarea: this.state.motivo_tarea,
        fecha_agendamiento: fecha,
      });
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

  getFecha = () => {
    const {dia, hora} = this.state;
    if (dia != '' && hora) {
      return `${dia} ${hora}`;
    }
    return '';
  };

  render() {
    const {selectorDate, selectorHora} = this.state;
    const fecha = moment(this.state.fecha_agendamiento).format('YYYY-MM-DD');
    const hora = moment(this.state.fecha_agendamiento).format('hh:mm a');
    return (
      <ColorfullContainer style={{flex: 1}}>
        <Loader loading={this.props.loading} />
        <Navbar back transparent title="Agendar cita" {...this.props} />
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              marginVertical: MARGIN_VERTICAL,
              marginHorizontal: MARGIN_HORIZONTAL,
            }}>
            <View style={{borderRadius: CURVA}}>
              <Validator
                value={this.state.tipo_tarea}
                ref={(r) => (this.Validations['tipo'] = r)}
                required>
                <Select
                  marginTop={1}
                  placeholder="Seleccione un tipo de tarea"
                  value={this.state.tipo_tarea}
                  onSelect={(v) => this.setState({tipo_tarea: v.key})}
                  options={this.props.tipos.map((t) => ({
                    key: t.id,
                    label: t.descripcion,
                  }))}
                />
              </Validator>

              {selectorHora && (
                <DateTimePicker
                  display="default"
                  value={this.state.fecha_agendamiento}
                  mode="time"
                  is24Hour={true}
                  onChange={(d) => {
                    this.setState({
                      selectorHora: false,
                      hora: moment(d.nativeEvent.timestamp).format('HH:mm'),
                    });
                  }}
                />
              )}
              {selectorDate && (
                <DateTimePicker
                  display="default"
                  value={this.state.fecha_agendamiento}
                  mode="date"
                  onChange={(d) =>
                    this.setState({
                      selectorDate: false,
                      dia: moment(d.nativeEvent.timestamp).format('YYYY-MM-DD'),
                    })
                  }
                  is24Hour={true}
                />
              )}

              <Validator
                value={this.getFecha()}
                ref={(r) => (this.Validations['fecha'] = r)}
                required>
                <View style={{flexDirection: 'row'}}>
                  <InputMask
                    style={{flex: 1}}
                    marginTop={1}
                    value={this.state.dia}
                    onFocus={() => this.setState({selectorDate: true})}
                    onChangeText={(t) => this.setState({fecha: t})}
                    placeholder="0000-00-00"
                    mask={'[0000]-[00]-[00]'}
                  />
                  <InputMask
                    style={{flex: 1}}
                    marginTop={1}
                    value={this.state.hora}
                    onFocus={() => this.setState({selectorHora: true})}
                    onChangeText={(t) => this.setState({fecha: t})}
                    placeholder="00:00"
                    mask={'[00]:[00]'}
                  />
                </View>
              </Validator>

              <Validator
                value={this.state.motivo_tarea}
                ref={(r) => (this.Validations['motivo'] = r)}
                required>
                <InputText
                  marginTop={1}
                  input={{multiline: true, numberOfLines: 4}}
                  placeholder="Motivo"
                  value={this.state.motivo_tarea}
                  onChangeText={(t) => this.setState({motivo_tarea: t})}
                />
              </Validator>

              <Button
                marginTop={3}
                onPress={() => this.guardar()}
                title="Guardar"
              />
            </View>
          </View>
        </ScrollView>
      </ColorfullContainer>
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
