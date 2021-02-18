import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Loader from 'components/Loader';
import {styleInput} from 'styles';
import {loadClient, changeProp, save} from '../../../redux/actions/Clients';
import ColorfullContainer from 'components/ColorfullContainer';
import Navbar from 'components/Navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Select from 'components/Select';
import Validator, {Execute} from 'components/Validator';
import {CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL, COLORS} from 'constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
});

class ClientSave extends React.Component {
  state = {
    telefonos: '',
    num_telefono: '',
  };
  Validations = {};

  componentDidMount() {
    this.props.load(this.props.route.params.id);
    const item = this.props.route.params?.item;
    if (item) {
      this.props.changeProp('primer_nombre', item.primer_nombre);
      this.props.changeProp('segundo_nombre', item.segundo_nombre);
      this.props.changeProp('primer_apellido', item.primer_apellido);
      this.props.changeProp('segundo_apellido', item.segundo_apellido);
      this.props.changeProp('numero_telefono', item.numero_telefono);
      this.props.changeProp('correo_electronico', item.email);
    } else {
      console.log('No hay valores por defecto');
    }
  }

  componentDidUpdate(prev) {
    if (prev.error != this.props.error && this.props.error != '') {
      Alert.alert('Algo anda mal', this.props.error);
    }

    if (prev.success != this.props.success && this.props.success != '') {
      Alert.alert('Buen trabajo', this.props.success);
      this.props.navigation.pop();
    }

    if (prev.loading_client == true && this.props.loading_client == false) {
      this.setState({telefonos: this.props.numero_telefono});
    }
  }

  guardar = () => {
    let totalTelefonos = this.state.telefonos;
    let campoTelefono = this.state.num_telefono;
    if (totalTelefonos.replace(',', '').trim().length == 0) {
      this.setState({telefonos: campoTelefono});
    }

    setTimeout(() => {
      Execute(this.Validations)
        .then(() => {
          this.props.save(this.props);
        })
        .catch((error) => {});
    }, 100);
  };

  removerTelefono = (telefono, idx) => {
    let celulares = this.state.telefonos.split(',');
    celulares.splice(idx, 1);
    this.setState({telefonos: celulares.join(',')});
    this.props.changeProp('numero_telefono', celulares.join(','));
  };

  agregarTelefono = () => {
    let celulares = this.state.telefonos.split(',');
    if (this.state.num_telefono.length > 0) {
      celulares.push(this.state.num_telefono);
      this.setState({telefonos: celulares.join(','), num_telefono: ''});
      this.props.changeProp('numero_telefono', celulares.join(','));
    }
  };

  render() {
    return (
      <ColorfullContainer style={styles.container}>
        <Loader loading={this.props.loading} />
        <Navbar {...this.props} transparent title="Guardar cliente" back />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: MARGIN_HORIZONTAL,
              marginVertical: MARGIN_VERTICAL,
              backgroundColor: 'rgba(255,255,255,.5)',
              borderRadius: CURVA,
              padding: MARGIN_HORIZONTAL,
            }}>
            <Text style={styleInput.label}>Primer nombre *:</Text>
            <Validator
              ref={(r) => (this.Validations['pn'] = r)}
              value={this.props.primer_nombre}
              required>
              <InputText
                marginTop={1}
                value={this.props.primer_nombre}
                onChangeText={(i) => this.props.changeProp('primer_nombre', i)}
                input={{
                  keyboardType:
                    Platform.OS === 'ios'
                      ? 'ascii-capable'
                      : 'textPersonName|textCapWords',
                }}
              />
            </Validator>

            <Text style={styleInput.label}>Segundo nombre:</Text>
            <InputText
              marginTop={1}
              value={this.props.segundo_nombre}
              onChangeText={(i) => this.props.changeProp('segundo_nombre', i)}
              input={{
                keyboardType:
                  Platform.OS === 'ios'
                    ? 'ascii-capable'
                    : 'textPersonName|textCapWords',
              }}
            />

            <Validator
              ref={(r) => (this.Validations['pa'] = r)}
              value={this.props.primer_apellido}
              required>
              <Text style={styleInput.label}>Primer apellido *:</Text>
              <InputText
                marginTop={1}
                value={this.props.primer_apellido}
                onChangeText={(i) =>
                  this.props.changeProp('primer_apellido', i)
                }
                input={{
                  keyboardType:
                    Platform.OS === 'ios'
                      ? 'ascii-capable'
                      : 'textPersonName|textCapWords',
                }}
              />
            </Validator>

            <Text style={styleInput.label}>Segundo apellido:</Text>
            <InputText
              marginTop={1}
              value={this.props.segundo_apellido}
              onChangeText={(i) => this.props.changeProp('segundo_apellido', i)}
              input={{
                keyboardType:
                  Platform.OS === 'ios'
                    ? 'ascii-capable'
                    : 'textPersonName|textCapWords',
              }}
            />

            <Validator
              ref={(r) => (this.Validations['nd'] = r)}
              value={this.props.numero_cedula}
              required>
              <Text style={styleInput.label}>Número de documento *:</Text>
              <InputText
                marginTop={1}
                value={this.props.numero_cedula}
                onChangeText={(i) => this.props.changeProp('numero_cedula', i)}
                input={{keyboardType: 'number-pad'}}
              />
            </Validator>

            <Text style={styleInput.label}>Género:</Text>
            <Select
              value={this.props.genero}
              onSelect={(item) => this.props.changeProp('genero', item.key)}
              options={[
                {
                  key: 'masculino',
                  label: 'Masculino',
                },
                {
                  key: 'femenino',
                  label: 'Femenino',
                },
                {
                  key: 'otro',
                  label: 'Otro',
                },
              ]}
            />

            <Validator
              ref={(r) => (this.Validations['nt'] = r)}
              value={this.state.telefonos}
              required>
              <Text style={styleInput.label}>Número de teléfono *:</Text>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <InputText
                  marginTop={0}
                  style={{flex: 1, marginRight: 6}}
                  value={this.state.num_telefono}
                  onChangeText={(i) => this.setState({num_telefono: i})}
                  input={{keyboardType: 'number-pad'}}
                />
                <Button title="+" onPress={() => this.agregarTelefono()} />
              </View>
              <View style={{marginVertical: MARGIN_VERTICAL}}>
                {this.state.telefonos.split(',').map((tel, i) => {
                  if (tel.length > 0) {
                    return (
                      <TouchableOpacity
                        style={{marginVertical: 6}}
                        onPress={() => this.removerTelefono(tel, i)}>
                        <Text
                          style={{
                            backgroundColor: '#ababab',
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            borderRadius: CURVA,
                          }}>
                          <FontAwesome
                            size={16}
                            name="times"
                            color={'#FFFFFF'}
                          />{' '}
                          {tel}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            </Validator>

            <Text style={styleInput.label}>Email:</Text>
            <InputText
              marginTop={1}
              value={this.props.correo_electronico}
              onChangeText={(i) =>
                this.props.changeProp('correo_electronico', i)
              }
              input={{keyboardType: 'email-address'}}
            />

            <Button
              marginTop={2}
              onPress={() => this.guardar()}
              title="Guardar"
            />
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    id: state.Client.id,
    primer_nombre: state.Client.primer_nombre,
    segundo_nombre: state.Client.segundo_nombre,
    primer_apellido: state.Client.primer_apellido,
    segundo_apellido: state.Client.segundo_apellido,
    correo_electronico: state.Client.correo_electronico,
    numero_telefono: state.Client.numero_telefono,
    numero_cedula: state.Client.numero_cedula,
    genero: state.Client.genero,
    loading: state.Client.loading,
    error: state.Client.error,
    success: state.Client.success,
    loading_client: state.Client.loading_client,
  };
};
const mapToActions = (dispatch) => {
  return {
    load: (id) => {
      dispatch(loadClient(id));
    },
    changeProp: (prop, value) => {
      dispatch(changeProp(prop, value));
    },
    save: (props) => {
      dispatch(save(props));
    },
  };
};

export default connect(mapToState, mapToActions)(ClientSave);
