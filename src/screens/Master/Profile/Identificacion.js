import React from 'react';
import {Title, Subheading, Button, Text} from 'react-native-paper';
import {Image, View, StyleSheet, Alert} from 'react-native';
import {connect} from 'react-redux';
import {subirFotoIde} from 'redux/actions/Usuario';
import {COLORS} from 'constants';
import ImagePicker from 'react-native-image-crop-picker';

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
    return (
      <>
        <Title style={{color: COLORS.PRIMARY_COLOR}}>Documentación</Title>
        <Subheading>Identificación</Subheading>
        <View style={{position: 'relative'}}>
          <Image
            style={{
              width: '100%',
              aspectRatio: 16 / 9,
              borderRadius: 16,
              backgroundColor: 'gray',
            }}
            source={{uri: this.props.ide_foto_frente}}
          />
        </View>

        <Button
          icon="camera"
          loading={this.props.subiendo_ide}
          onPress={() => this.capturar('frente')}>
          Foto Frente
        </Button>

        <Image
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            borderRadius: 16,
            backgroundColor: 'gray',
          }}
          source={{uri: this.props.ide_foto_respaldo}}
        />
        <Button
          icon="camera"
          loading={this.props.subiendo_ide}
          onPress={() => this.capturar('respaldo')}>
          Foto Respaldo
        </Button>
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
