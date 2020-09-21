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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
});

class ClientSave extends React.Component {
  state = {
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    numero_cedula: '',
    correo_electronico: '',
    numero_telefono: '',
    genero: '',
  };
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
                value={this.state.primer_nombre}
                onChangeText={(i) => this.setState({primer_nombre: i})}
              />
            </View>
            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Segundo nombre"
                value={this.state.segundo_nombre}
                onChangeText={(i) => this.setState({segundo_nombre: i})}
              />
            </View>
            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Primer apellido"
                value={this.state.primer_apellido}
                onChangeText={(i) => this.setState({primer_apellido: i})}
              />
            </View>
            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Segundo apellido"
                value={this.state.segundo_apellido}
                onChangeText={(i) => this.setState({segundo_apellido: i})}
              />
            </View>
            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Número de documento"
                keyboardType="number-pad"
                value={this.state.numero_cedula}
                onChangeText={(i) => this.setState({numero_cedula: i})}
              />
            </View>

            <View style={styleInput.wrapper}>
              <Picker
                selectedValue={this.state.genero}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({genero: itemValue})
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
                value={this.state.numero_telefono}
                onChangeText={(i) => this.setState({numero_telefono: i})}
              />
            </View>

            <View style={styleInput.wrapper}>
              <TextInput
                style={styleInput.input}
                placeholder="Email"
                keyboardType="email-address"
                value={this.state.correo_electronico}
                onChangeText={(i) => this.setState({correo_electronico: i})}
              />
            </View>

            <TouchableNativeFeedback style={styleButton.wrapper}>
              <Text style={styleButton.text}>Guardar</Text>
            </TouchableNativeFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect()(ClientSave);
