import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Picker,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from 'components/Loader';
import {styleHeader, styleInput, styleButton} from 'styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {loadClient, changeProp, save} from '../../../redux/actions/Clients';
import {validar, renderErrores} from 'utils/Validar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
});

const validations = {
  primer_nombre: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
  },
  segundo_nombre: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
  },
  primer_apellido: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
  },
  segundo_apellido: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
  },
  numero_cedula: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
  },
  numero_telefono: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
  },
  correo_electronico: {
    presence: {allowEmpty: false, message: '^Este campo es requerido'},
    email: {message: '^Correo electrónico invalido'},
  },
};

class ClientSave extends React.Component {
  state = {
    error: {},
  };

  componentDidMount() {
    if (this.props.route.params.id) {
      this.props.load(this.props.route.params.id);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styleHeader.wrapper}>
          <TouchableOpacity
            style={styleHeader.btnLeft}
            onPress={() => this.props.navigation.pop()}>
            <Icon name="arrowleft" color="white" size={24} />
          </TouchableOpacity>
          <Text style={styleHeader.title}>Guardar Cliente</Text>
          <View></View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 16}}>
            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Primer nombre"
                value={this.props.primer_nombre}
                onChangeText={(i) => this.props.changeProp('primer_nombre', i)}
                onBlur={() =>
                  validar(this, 'primer_nombre', validations.primer_nombre)
                }
              />
            </View>
            {renderErrores(this, 'primer_nombre')}

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Segundo nombre"
                value={this.props.segundo_nombre}
                onChangeText={(i) => this.props.changeProp('segundo_nombre', i)}
                onBlur={() =>
                  validar(this, 'segundo_nombre', validations.segundo_nombre)
                }
              />
            </View>
            {renderErrores(this, 'segundo_nombre')}

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Primer apellido"
                value={this.props.primer_apellido}
                onChangeText={(i) =>
                  this.props.changeProp('primer_apellido', i)
                }
                onBlur={() =>
                  validar(this, 'primer_apellido', validations.primer_apellido)
                }
              />
            </View>
            {renderErrores(this, 'primer_apellido')}

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Segundo apellido"
                value={this.props.segundo_apellido}
                onChangeText={(i) =>
                  this.props.changeProp('segundo_apellido', i)
                }
                onBlur={() =>
                  validar(
                    this,
                    'segundo_apellido',
                    validations.segundo_apellido,
                  )
                }
              />
            </View>
            {renderErrores(this, 'segundo_apellido')}

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Número de documento"
                keyboardType="number-pad"
                value={this.props.numero_cedula}
                onChangeText={(i) => this.props.changeProp('numero_cedula', i)}
                onBlur={() =>
                  validar(this, 'numero_cedula', validations.numero_cedula)
                }
              />
            </View>
            {renderErrores(this, 'numero_cedula')}

            <View style={styleInput.wrapper}>
              <Picker
                selectedValue={this.props.genero}
                onValueChange={(itemValue, itemIndex) =>
                  this.props.changeProp('genero', itemValue)
                }
                style={styleInput.input}>
                <Picker.Item label="Mujer" value="F" />
                <Picker.Item label="Hombre" value="M" />
              </Picker>
            </View>

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Número de teléfono"
                keyboardType="number-pad"
                value={this.props.numero_telefono}
                onChangeText={(i) =>
                  this.props.changeProp('numero_telefono', i)
                }
                onBlur={() => validar(this, validations.numero_telefono)}
              />
            </View>
            {renderErrores(this, 'numero_telefono')}

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Email"
                keyboardType="email-address"
                value={this.props.correo_electronico}
                onChangeText={(i) =>
                  this.props.changeProp('correo_electronico', i)
                }
                onBlur={() =>
                  validar(
                    this,
                    'correo_electronico',
                    validations.correo_electronico,
                  )
                }
              />
            </View>
            {renderErrores(this, 'correo_electronico')}

            <TouchableNativeFeedback
              style={styleButton.wrapper}
              onPress={() => this.props.save(this.props)}>
              <Text style={styleButton.text}>Guardar</Text>
            </TouchableNativeFeedback>
          </View>
        </ScrollView>
      </View>
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
