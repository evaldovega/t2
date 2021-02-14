import React from 'react';
import ColorfullContainer from 'components/ColorfullContainer';
import {
  COLORS,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  SERVER_ADDRESS,
} from 'constants';
import Navbar from 'components/Navbar';
import InputText from 'components/InputText';
import InputDateTimerPicker from 'components/DatetimePicker';
import Select from 'components/Select';
import Button from 'components/Button';
import Validator, {Execute} from 'components/Validator';
import Loader from 'components/Loader';
import {View, Text, Alert} from 'react-native';
import {connect} from 'react-redux';
import {fetchConfig} from 'utils/Fetch';

class MetaGuardar extends React.Component {
  state = {
    msn: '',
    loading: false,
    titulo: '',
    tipo_meta: 'ventas',
    fecha_inicio_meta: '',
    fecha_final_meta: '',
    valor_meta: '',
  };
  Validations = {};

  cargar = async (id) => {
    try {
      this.setState({loading: true, msn: 'Cargando...'});
      const {url, headers} = await fetchConfig();

      fetch(`${url}metas/${id}/`, {
        headers,
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          this.setState({
            loading: false,
            ...data,
            valor_meta: data.valor_meta.toString(),
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({loading: false});
          Alert.alert('No se cargo la meta', error.toString());

          this.props.navigation.pop();
        });
    } catch (error) {
      this.setState({loading: false});
      Alert.alert('No se cargo la meta', error.toString());
      this.props.navigation.pop();
    }
  };

  guardar = () => {
    Execute(this.Validations).then(() => {
      this.setState({loading: true});
      const data = {
        user: this.props.id,
        titulo: this.state.titulo,
        tipo_meta: this.state.tipo_meta,
        valor_meta: this.state.valor_meta,
        fecha_inicio_meta: this.state.fecha_inicio_meta,
        fecha_final_meta: this.state.fecha_final_meta,
      };
      let id = '';

      if (this.props.route.params.id) {
        id = this.props.route.params.id + '/';
      }

      const method = this.props.route.params.id ? 'PUT' : 'POST';
      this.setState({loading: true, msn: 'Guardando...'});
      try {
        console.log(data);
        fetch(SERVER_ADDRESS + 'api/metas/' + id, {
          method: method,
          body: JSON.stringify(data),
          headers: {
            Authorization: 'Token ' + this.props.token,
            Accept: 'application/json',
            'content-type': 'application/json',
          },
        })
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            this.setState({loading: false});
            this.props.navigation.pop();
            if (this.props.route.params.callback) {
              this.props.route.params.callback();
            }
          })
          .catch((error) => {
            this.setState({loading: false});
            Alert.alert('No se guardo la meta', error.toString());
          });
      } catch (error) {
        this.setState({loading: false});
        Alert.alert('No se guardo la meta', error.toString());
      }
    });
  };

  componentDidMount() {
    if (this.props.route.params.id) {
      this.cargar(this.props.route.params.id);
    }
  }

  render() {
    const {tipo_meta = 'ventas', loading, msn} = this.state;

    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <Navbar {...this.props} transparent back title="Guardar Meta" />
        <Loader message={msn} loading={loading} />
        <View style={{flex: 1, paddingHorizontal: MARGIN_HORIZONTAL}}>
          <Validator
            ref={(r) => (this.Validations['p1'] = r)}
            value={this.state.titulo}
            required="Comó quieres identificar la meta">
            <InputText
              value={this.state.titulo}
              onChangeText={(v) => this.setState({titulo: v})}
              marginTop={1}
              placeholder="Titulo"
            />
          </Validator>

          <Text
            style={{
              fontFamily: 'Mont-Regular',
              marginTop: MARGIN_VERTICAL * 2,
            }}>
            {tipo_meta == 'ventas'
              ? 'Número de ventas que quieres alcanzar'
              : tipo_meta == 'clientes'
              ? 'Número de clientes que quieres conseguir'
              : 'Meta'}
          </Text>
          <Validator
            ref={(r) => (this.Validations['p3'] = r)}
            value={this.state.valor_meta}
            required="Ingresa una meta">
            <InputText
              input={{keyboardType: 'number-pad'}}
              value={this.state.valor_meta}
              onChangeText={(v) => this.setState({valor_meta: v})}
              marginTop={1}
              placeholder=""
            />
          </Validator>

          <Text
            style={{
              fontFamily: 'Mont-Regular',
              marginTop: MARGIN_VERTICAL * 2,
            }}>
            Especifica una fecha inicial y final para lograr tu meta
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 4}}>
              <Validator
                ref={(r) => (this.Validations['p4'] = r)}
                required="OOPS"
                value={this.state.fecha_inicio_meta}>
                <InputDateTimerPicker
                  value={this.state.fecha_inicio_meta}
                  format="YYYY-MM-DD"
                  onChange={(v) => this.setState({fecha_inicio_meta: v})}
                  marginTop={1}
                  placeholder="YYYY-MM-DD"
                  showTime={false}
                />
              </Validator>
            </View>
            <View style={{flex: 1, marginLeft: 4}}>
              <InputDateTimerPicker
                input={{keyboardType: 'number-pad'}}
                format="YYYY-MM-DD"
                value={this.state.fecha_final_meta}
                onChange={(v) => this.setState({fecha_final_meta: v})}
                marginTop={1}
                placeholder="YYYY-MM-DD"
                showTime={false}
              />

              <Validator
                ref={(r) => (this.Validations['p5'] = r)}
                required="OOPS"
                value={this.state.fecha_final_meta}></Validator>
            </View>
          </View>

          <Button marginTop={3} title="Guardar" onPress={this.guardar} />
        </View>
      </ColorfullContainer>
    );
  }
}

const mapToProps = (state) => {
  return {
    id: state.Usuario.userId,
    token: state.Usuario.token,
  };
};

export default connect(mapToProps)(MetaGuardar);
