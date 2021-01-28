import React from 'react';
import {Title, Subheading, Card} from 'react-native-paper';
import {Image, View, StyleSheet, Alert, Linking, Text} from 'react-native';
import {connect} from 'react-redux';
import {subirFotoIde} from 'redux/actions/Usuario';
import {COLORS, MARGIN_VERTICAL, TITULO_TAM} from 'constants';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from 'components/Button';

class ProfileIdentificacion extends React.Component {
  capturar = (lado) => {
    ImagePicker.openCamera({}).then((image) => {
      ImagePicker.openCropper({width: 600, height: 400, path: image.path}).then(
        (crop) => {
          ImagePicker.cleanSingle(image.path);
          this.props.subir(crop, lado);
        },
      );
    });
  };

  componentDidUpdate(prev) {
    if (
      prev.error_subiendo_ide != this.props.error_subiendo_ide &&
      this.props.error_subiendo_ide != ''
    ) {
      Alert.alert('Algo anda mal', this.props.error_subiendo_ide);
    }
  }

  render() {
    console.log(this.props.ide_foto_respaldo);
    return (
      <>
        <Text
          style={{
            color: COLORS.NEGRO,
            marginTop: MARGIN_VERTICAL * 3,
            fontFamily: 'Mont-Bold',
            fontSize: TITULO_TAM * 0.7,
          }}>
          Documento de Identificación
        </Text>

        <Card style={{marginTop: 8, borderRadius: 16, overflow: 'hidden'}}>
          <TouchableOpacity
            onProgress={() => {
              Linking.openURL(this.props.ide_foto_frente);
            }}>
            <Card.Cover source={{uri: this.props.ide_foto_frente}} />
          </TouchableOpacity>

          {/* <Card.Title title="Frente"></Card.Title> */}
          {/* <Card.Content></Card.Content>
          <Card.Actions>
            
          </Card.Actions> */}
        </Card>
        <Button
          marginTop={1}
          icon="camera"
          loading={this.props.subiendo_ide}
          title="Tomar foto de frente"
          onPress={() => this.capturar('frente')}
        />

        <Card style={{marginTop: 8, borderRadius: 16, overflow: 'hidden'}}>
          <Card.Cover source={{uri: this.props.ide_foto_respaldo}} />
          {/* <Card.Title title="Respaldo"></Card.Title> */}
          {/* <Card.Content></Card.Content>
          <Card.Actions>
            
          </Card.Actions> */}
        </Card>
        <Button
          marginTop={1}
          icon="camera"
          loading={this.props.subiendo_ide}
          onPress={() => this.capturar('respaldo')}
          title="Tomar foto de respaldo"
        />
      </>
    );
  }
}

const mapToState = (state) => {
  return {
    subiendo_ide: state.Usuario.subiendo_ide,
    ide_foto_frente: state.Usuario.ide_foto_frente,
    ide_foto_respaldo: state.Usuario.ide_foto_respaldo,
    error_subiendo_ide: state.Usuario.error_subiendo_ide,
  };
};
const mapToAction = (dispatch) => {
  return {
    subir: (image, lado) => {
      dispatch(subirFotoIde(image, lado));
    },
  };
};

export default connect(mapToState, mapToAction)(ProfileIdentificacion);
