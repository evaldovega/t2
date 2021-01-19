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
import Loader from 'components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import {cargar} from '../../../redux/actions/TaskType';
import {taskSave} from '../../../redux/actions/Clients';
import Navbar from 'components/Navbar';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Validator, {Execute} from 'components/Validator';
import {CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL, COLORS} from 'constants';
import ColorfullContainer from 'components/ColorfullContainer';
import Select from 'components/Select';

import InputDateTimerPicker from 'components/DatetimePicker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
class TaskSave extends React.Component {
  state = {
    tipo_tarea: '',
    fecha_agendamiento: '',
    fecha_vencimiento: '',
    recordatorio_minutos: '30',
    motivo_tarea: '',
    selectorDate: false,
    selectorHora: false,
    data: moment().toDate(),
  };
  Validations = {};

  componentDidMount() {
    this.props.cargarTipos();
    this.setState({
      fecha_agendamiento: moment().format(),
      fecha_vencimiento: moment().add(3, 'day').format(),
    });
  }

  guardar = () => {
    Execute(this.Validations).then(() => {
      if (
        moment(this.state.fecha_agendamiento).isAfter(
          moment(this.state.fecha_vencimiento),
        )
      ) {
        Alert.alert(
          'Algo anda mal',
          'La fecha de vencimiento debe ser mayor a la del agendamiento',
        );
        return;
      }
      this.props.taskSave(this.props.route.params.cliente_id, {
        tipo_tarea: this.state.tipo_tarea,
        motivo_tarea: this.state.motivo_tarea,
        fecha_agendamiento: this.state.fecha_agendamiento,
        fecha_vencimiento: this.state.fecha_vencimiento,
        recordatorio_minutos: this.state.recordatorio_minutos,
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

  render() {
    const agov = moment(this.state.fecha_vencimiento).fromNow();

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

              <Validator
                value={this.state.motivo_tarea}
                ref={(r) => (this.Validations['motivo'] = r)}
                required>
                <InputText
                  marginTop={1}
                  input={{multiline: true, numberOfLines: 4}}
                  placeholder="Observaciones"
                  value={this.state.motivo_tarea}
                  onChangeText={(t) => this.setState({motivo_tarea: t})}
                />
              </Validator>

              <Validator
                value={this.state.fecha_agendamiento}
                ref={(r) => (this.Validations['fecha'] = r)}
                required>
                <InputDateTimerPicker
                  marginTop={1}
                  label="Fecha de agendamiento"
                  value={this.state.fecha_agendamiento}
                  onChange={(v) => this.setState({fecha_agendamiento: v})}
                />
              </Validator>

              <Validator
                value={this.state.fecha_vencimiento}
                ref={(r) => (this.Validations['fecha_vencimiento'] = r)}
                required>
                <InputDateTimerPicker
                  label={`Fecha de vencimiento ${agov}`}
                  value={this.state.fecha_vencimiento}
                  onChange={(v) => this.setState({fecha_vencimiento: v})}
                />
              </Validator>

              <Validator
                value={this.state.recordatorio_minutos}
                ref={(r) => (this.Validations['recordatorio_minutos'] = r)}
                required>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 16,
                  }}>
                  <SimpleLineIcons name="clock" size={18} />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 4,
                      fontFamily: 'Mont-Regular',
                      marginTop: MARGIN_VERTICAL,
                      marginBottom: MARGIN_VERTICAL * 0.8,
                      color: COLORS.NEGRO_N1,
                    }}>
                    Recordatorio
                  </Text>
                  <InputText
                    placeholder=""
                    styleInput={{textAlign: 'center'}}
                    input={{keyboardType: 'number-pad'}}
                    value={this.state.recordatorio_minutos}
                    onChangeText={(t) =>
                      this.setState({recordatorio_minutos: t})
                    }
                    style={{flex: 1, marginHorizontal: 4}}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Mont-Regular',
                      marginTop: MARGIN_VERTICAL,
                      marginBottom: MARGIN_VERTICAL * 0.8,
                      color: COLORS.NEGRO_N1,
                    }}>
                    Min. antes
                  </Text>
                </View>
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
