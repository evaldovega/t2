import React from 'react';
import {
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  View,
  Modal,
} from 'react-native';
import {Title, Card, FAB} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {COLORS, CURVA, MARGIN_VERTICAL, TEXTO_TAM, TITULO_TAM} from 'constants';
import {connect} from 'react-redux';
import {subir, cargar, borrar} from 'redux/actions/SeguridadSocial';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

import Button from 'components/Button';
import InputText from 'components/InputText';
import Select from 'components/Select';

import moment from 'moment';

const MONTHS = [
  {label: 'Enero', key: 1},
  {label: 'Febrero', key: 2},
  {label: 'Marzo', key: 3},
  {label: 'Abril', key: 4},
  {label: 'Mayo', key: 5},
  {label: 'Junio', key: 6},
  {label: 'Julio', key: 7},
  {label: 'Agosto', key: 8},
  {label: 'Septiembre', key: 9},
  {label: 'Octubre', key: 10},
  {label: 'Noviembre', key: 11},
  {label: 'Diciembre', key: 12},
];

class SeguridadSocial extends React.Component {
  state = {
    pdf: null,
    periodo: moment().format('M'),
    year: moment().format('YYYY'),
    mostrar: false,
  };

  componentDidMount() {
    console.log(moment().format('M'));
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

    if (
      !this.props.subiendo &&
      prev.subiendo &&
      this.props.error_cargando == ''
    ) {
      this.setState({mostrar: false});
    }
  }

  mostrar = (v) => {
    this.setState({mostrar: v});
  };

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

      this.props.subir(res, this.state.year + '-' + this.state.periodo + '-01');
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
          <Card
            style={{
              marginTop: MARGIN_VERTICAL,
              borderRadius: CURVA,
              elevation: 0,
            }}>
            <Card.Title
              title={
                'Mes de ' + a.mes_correspondiente_display + ' ' + a.anio
              }></Card.Title>
            <Card.Actions>
              <Button
                icon="delete"
                loading={a.borrando}
                onPress={() => this.borrar(a.id)}
                color="rojo"
                title={a.borrando ? 'Borrando...' : 'Borrar'}
              />
            </Card.Actions>
          </Card>
        );
      });
    } catch (error) {}
  };

  ventana = () => (
    <Modal transparent={true} animationType="fade" visible={this.state.mostrar}>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,.6)',
          justifyContent: 'center',
          alignContent: 'center',
          flex: 1,
        }}>
        <View
          style={{
            backgroundColor: '#ffff',
            overflow: 'hidden',
            borderRadius: CURVA,
            alignSelf: 'center',
            elevation: 3,
            width: '80%',
            minHeight: 400,
          }}>
          <View
            style={{
              backgroundColor: COLORS.MORADO,
              paddingTop: 20,
              paddingLeft: 24,
              paddingBottom: 23,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#ffff',
                  fontFamily: 'Mont-Bold',
                  fontSize: TITULO_TAM * 0.7,
                }}>
                Seguridad Social
              </Text>
              <FAB
                icon="close"
                onPress={() => this.mostrar(false)}
                style={{backgroundColor: 'transparent', elevation: 0}}
              />
            </View>
            <Text
              style={{
                fontSize: TEXTO_TAM * 0.7,
                color: '#FFF',
                fontFamily: 'Mont-Regular',
              }}>
              Recuerda cargarla cada mes.
            </Text>
          </View>
          <View style={{padding: 42}}>
            <Text>Periodo</Text>
            <Select
              marginTop={1}
              placeholder={this.state.periodo}
              value={this.state.periodo}
              onSelect={(item) => this.setState({periodo: item.key})}
              options={MONTHS}
            />

            <Text style={{marginTop: MARGIN_VERTICAL}}>Año</Text>
            <InputText
              marginTop={1}
              input={{keyboardType: 'decimal-pad'}}
              value={this.state.year}
              onChangeText={(year) => this.setState({year: year})}
            />

            <Button
              icon="upload"
              style={{marginTop: 32}}
              loading={this.props.subiendo}
              onPress={this.seleccionar}
              title={
                this.props.subiendo ? 'Enviando...' : 'Seleccionar Archivo'
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  render() {
    return (
      <SafeAreaView style={{marginTop: 32}}>
        {this.ventana()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}>
          <Text
            style={{
              color: COLORS.NEGRO,
              fontFamily: 'Mont-Bold',
              fontSize: TITULO_TAM * 0.8,
            }}>
            Seguridad Social
          </Text>
        </View>

        {this.renderPeriodos()}

        <Button
          marginTop={2}
          onPress={() => this.mostrar(true)}
          title="Subir seguridad social"
        />
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
    subir: (file, fecha) => {
      dispatch(subir(file, fecha));
    },
    borrar: (id) => {
      dispatch(borrar(id));
    },
  };
};
export default connect(mapToState, mapToDispatch)(SeguridadSocial);
