import React from 'react';
import {
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  View,
  Modal,
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
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native-gesture-handler';
import moment from 'moment';

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
      setTimeout(() => {
        this.props.subir(
          res,
          this.state.year + '-' + this.state.periodo + '-01',
        );
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
                'Mes de ' + a.mes_correspondiente_display + ' ' + a.anio
              }></Card.Title>
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
            borderRadius: 24,
            alignSelf: 'center',
            elevation: 3,
            width: '80%',
            minHeight: 400,
          }}>
          <View
            style={{
              backgroundColor: '#FFA26B',
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
              <Title style={{color: '#ffff'}}>Seguridad Social</Title>
              <FAB
                icon="close"
                onPress={() => this.mostrar(false)}
                style={{backgroundColor: 'transparent', elevation: 0}}
              />
            </View>
            <Text style={{fontSize: 20, color: '#FFF', fontWeight: '500'}}>
              Recuerda cargarla cada mes 👍
            </Text>
          </View>
          <View style={{padding: 42}}>
            <Text>Periodo</Text>
            <DropDownPicker
              items={[
                {label: 'Enero', value: 1},
                {label: 'Febrero', value: 2},
                {label: 'Marzo', value: 3},
                {label: 'Abril', value: 4},
                {label: 'Mayo', value: 5},
                {label: 'Junio', value: 6},
                {label: 'Julio', value: 7},
                {label: 'Agosto', value: 8},
                {label: 'Septiembre', value: 9},
                {label: 'Octubre', value: '10'},
                {label: 'Noviembre', value: '11'},
                {label: 'Diciembre', value: '12'},
              ]}
              defaultValue={this.state.periodo}
              containerStyle={{
                height: 56,
                borderRadius: 24,
                marginTop: 16,
              }}
              style={{
                backgroundColor: '#fafafa',
                borderWidth: 1,
                borderColor: '#fafafa',
              }}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa', borderRadius: 24}}
              onChangeItem={(item) =>
                this.setState({
                  periodo: item.value,
                })
              }
            />

            <Text>Año</Text>
            <TextInput
              keyboardType="decimal-pad"
              value={this.state.year}
              style={{backgroundColor: '#fafafa'}}
              onChangeText={(year) => this.setState({year: year})}
            />

            <Button
              icon="upload"
              style={{marginTop: 32}}
              loading={this.props.subiendo}
              onPress={this.seleccionar}>
              {this.props.subiendo ? 'Enviando...' : 'Seleccionar Archivo'}
            </Button>
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
          <Title style={{color: COLORS.PRIMARY_COLOR}}>Seguridad Social</Title>
        </View>

        <Paragraph>Recuerda subir tu seguridad social cada mes.</Paragraph>
        {this.renderPeriodos()}

        <Button onPress={() => this.mostrar(true)}>
          Cargar seguridad social
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
    subir: (file, fecha) => {
      dispatch(subir(file, fecha));
    },
    borrar: (id) => {
      dispatch(borrar(id));
    },
  };
};
export default connect(mapToState, mapToDispatch)(SeguridadSocial);
