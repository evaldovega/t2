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
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from 'components/Loader';
import {styleHeader, styleInput, styleButton} from 'styles';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {loadClient, changeProp, save} from '../../../redux/actions/Clients';
import {validar, totalErrores, renderErrores} from 'utils/Validar';
import ColorfullContainer from 'components/ColorfullContainer';
import Navbar from 'components/Navbar';
import Button from 'components/Button';
import InputText from 'components/InputText';
import InputMask from 'components/InputMask';
import Select from 'components/Select';
import {CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL} from 'constants';

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
    values: {},
  };

  componentDidMount() {
    this.props.load(this.props.route.params.id);
    const item = this.props.route.params?.item;
    if (item) {
      this.props.changeProp('primer_nombre', item.primer_nombre);
      this.props.changeProp('primer_apellido', item.primer_apellido);
      this.props.changeProp('segundo_apellido', item.segundo_apellido);
      this.props.changeProp('numero_telefono', item.telefonos);
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
      this.props.navigation.navigate('ProfileClient');
    }
  }

  guardar = () => {
    Object.keys(validations).forEach((k) => {
      validar(this, k, validations[k]);
    });
    console.log(this.state.error);
    if (totalErrores(this) > 0) {
      Alert.alert('Complete todos los campos', '');
    } else {
      this.props.save(this.props);
    }
  };

  render() {
    return (
      <ColorfullContainer style={styles.container}>
        <Loader loading={this.props.loading} />
        <Navbar {...this.props} title="Guardar cliente" back />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: MARGIN_HORIZONTAL,
              marginVertical: MARGIN_VERTICAL,
              backgroundColor: 'rgba(255,255,255,.5)',
              borderRadius: CURVA,
              padding: MARGIN_HORIZONTAL,
            }}>
            <Text style={styleInput.label}>Primer nombre:</Text>
            <InputText
              marginTop={1}
              value={this.props.primer_nombre}
              onChangeText={(i) => this.props.changeProp('primer_nombre', i)}
              onBlur={() =>
                validar(
                  this,
                  this.props.primer_nombre,
                  'primer_nombre',
                  validations.primer_nombre,
                )
              }
              input={{keyboardType: 'textPersonName|textCapWords'}}
            />
            {renderErrores(this, 'primer_nombre')}

            <Text style={styleInput.label}>Segundo nombre:</Text>
            <InputText
              marginTop={1}
              value={this.props.segundo_nombre}
              onChangeText={(i) => this.props.changeProp('segundo_nombre', i)}
              onBlur={() =>
                validar(
                  this,
                  this.props.segundo_nombre,
                  'segundo_nombre',
                  validations.segundo_nombre,
                )
              }
              input={{keyboardType: 'textPersonName|textCapWords'}}
            />
            {renderErrores(this, 'segundo_nombre')}

            <Text style={styleInput.label}>Primer apellido:</Text>
            <InputText
              marginTop={1}
              value={this.props.primer_apellido}
              onChangeText={(i) => this.props.changeProp('primer_apellido', i)}
              onBlur={() =>
                validar(
                  this,
                  this.props.primer_apellido,
                  'primer_apellido',
                  validations.primer_apellido,
                )
              }
              input={{keyboardType: 'textPersonName|textCapWords'}}
            />
            {renderErrores(this, 'primer_apellido')}

            <Text style={styleInput.label}>Segundo apellido:</Text>
            <InputText
              marginTop={1}
              value={this.props.segundo_apellido}
              onChangeText={(i) => this.props.changeProp('segundo_apellido', i)}
              onBlur={() =>
                validar(
                  this,
                  this.props.segundo_apellido,
                  'segundo_apellido',
                  validations.segundo_apellido,
                )
              }
              input={{keyboardType: 'textPersonName|textCapWords'}}
            />
            {renderErrores(this, 'segundo_apellido')}

            <Text style={styleInput.label}>Número de documento:</Text>
            <InputText
              marginTop={1}
              value={this.props.numero_cedula}
              onChangeText={(i) => this.props.changeProp('numero_cedula', i)}
              onBlur={() =>
                validar(
                  this,
                  this.props.numero_cedula,
                  'numero_cedula',
                  validations.numero_cedula,
                )
              }
              input={{keyboardType: 'number-pad'}}
            />
            {renderErrores(this, 'numero_cedula')}

            <Text style={styleInput.label}>Genero:</Text>
            <Select
              value={this.props.genero}
              onSelect={(item) => this.props.changeProp('genero', item.key)}
              options={[
                {key: 'F', label: 'Mujer'},
                {key: 'M', label: 'Hombre'},
              ]}
            />

            <Text style={styleInput.label}>Número de teléfono:</Text>
            <InputText
              marginTop={1}
              value={this.props.numero_telefono}
              onChangeText={(i) => this.props.changeProp('numero_cedula', i)}
              onBlur={() =>
                validar(
                  this,
                  this.props.numero_telefono,
                  'numero_telefono',
                  validations.numero_telefono,
                )
              }
              input={{keyboardType: 'number-pad'}}
            />
            {renderErrores(this, 'numero_telefono')}

            <Text style={styleInput.label}>Email:</Text>
            <InputText
              marginTop={1}
              value={this.props.correo_electronico}
              onChangeText={(i) =>
                this.props.changeProp('correo_electronico', i)
              }
              onBlur={() =>
                validar(
                  this,
                  this.props.correo_electronico,
                  'correo_electronico',
                  validations.correo_electronico,
                )
              }
              input={{keyboardType: 'email-address'}}
            />
            {renderErrores(this, 'correo_electronico')}

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
