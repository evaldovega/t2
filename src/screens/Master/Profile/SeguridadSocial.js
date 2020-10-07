import React from 'react';
import {
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import {
  Button,
  Paragraph,
  Title,
  Text,
  Card,
  FAB,
  Colors,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {COLORS} from 'constants';
import {connect} from 'react-redux';
import {subir, cargar, borrar} from 'redux/actions/SeguridadSocial';

class SeguridadSocial extends React.Component {
  state = {pdf: null};

  componentDidMount() {
    this.props.cargar();
  }

  componentDidUpdate(prev) {
    if (
      prev.error_subiendo != this.props.error_subiendo &&
      this.props.error_subiendo != ''
    ) {
      Alert.alert('Algo anda mal', this.props.error_subiendo);
    }
    if (
      prev.error_cargando != this.props.error_cargando &&
      this.props.error_cargando != ''
    ) {
      Alert.alert('Algo anda mal', this.props.error_cargando);
    }
  }

  seleccionar = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      console.log(JSON.stringify(res));

      const uri = Platform.select({
        android: res.uri,
        ios: decodeURIComponent(res.uri)?.replace?.('file://', ''),
      });
      res.uri = uri;
      /*
             const p='content://com.android.providers.downloads.documents/document/113'
            const RNFS = require('react-native-fs');
            RNFS.readFile(uri,'base64').then(c=>{
                console.log(c)
            }).catch(error=>{
                console.log(error)
            })*/
      setTimeout(() => {
        this.props.subir(res);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };
  borrar = (id) => {
    this.props.borrar(id);
  };
  renderPeriodos = () => {
    try {
      return this.props.archivos.map((a) => {
        return (
          <Card style={{marginTop: 8, borderRadius: 16}}>
            <Card.Title
              title={
                'Periodo ' + a.mes_correspondiente + ' ' + a.anio
              }></Card.Title>
            <Card.Content>
              <Text>Valor Cotizado 356.000</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="delete"
                loading={a.borrando}
                onPress={() => this.borrar(a.id)}
                color={Colors.red200}>
                {a.borrando ? 'Borrando...' : 'Borrar'}
              </Button>
            </Card.Actions>
          </Card>
        );
      });
    } catch (error) {}
  };
  render() {
    return (
      <SafeAreaView style={{marginTop: 32}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}>
          <Title style={{color: COLORS.PRIMARY_COLOR}}>Seguridad Social</Title>
          <FAB
            icon="sync"
            loading={this.props.cargando}
            small
            onPress={this.props.cargar}
          />
        </View>

        <Paragraph>Recuerda subir tu seguridad social cada mes.</Paragraph>
        {this.renderPeriodos()}
        <Button
          icon="upload"
          style={{marginTop: 32}}
          loading={this.props.subiendo}
          onPress={this.seleccionar}>
          {this.props.subiendo ? 'Subiendo archivo...' : 'Seleccionar Archivo'}
        </Button>
      </SafeAreaView>
    );
  }
}
const mapToState = (state) => {
  return {
    cargando: state.SeguridadSocial.cargando,
    archivos: state.SeguridadSocial.archivos,
    error_cargando: state.SeguridadSocial.error_cargando,
    subiendo: state.SeguridadSocial.subiendo,
    error_subiendo: state.SeguridadSocial.error_subiendo,
  };
};
const mapToDispatch = (dispatch) => {
  return {
    cargar: () => {
      dispatch(cargar());
    },
    subir: (file) => {
      dispatch(subir(file));
    },
    borrar: (id) => {
      dispatch(borrar(id));
    },
  };
};
export default connect(mapToState, mapToDispatch)(SeguridadSocial);
