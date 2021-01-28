import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Vibration,
  Alert,
} from 'react-native';
import ColorfullContainer from 'components/ColorfullContainer';
import {
  COLORS,
  CURVA,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
  SERVER_ADDRESS,
  TITULO_TAM,
  TEXTO_TAM,
} from 'constants';
import Navbar from 'components/Navbar';
import Button from 'components/Button';
import moment from 'moment';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ProgressChart} from 'react-native-chart-kit';
import Loader from 'components/Loader';
import {fetchConfig} from 'utils/Fetch';
const {width, height} = Dimensions.get('screen');

const chart_config = {
  backgroundColor: COLORS.VERDE,
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo: '#FFFF',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(110,85,246, ${opacity})`,
  style: {
    marginLeft: 32,
  },
};

class MetaListado extends React.Component {
  state = {
    cargando: false,
    msn: '',
    docs: [],
  };

  cargar = () => {
    this.setState({cargando: true, msn: 'Cargando metas...'});
    fetchConfig().then((config) => {
      const {url, headers} = config;

      fetch(`${url}metas/`, {
        headers: headers,
      })
        .then((r) => r.json())
        .then((data) => {
          this.setState({cargando: false, docs: data});
        })
        .catch((error) => {
          console.log(error);
          this.setState({cargando: false});
          Alert.alert('No se cargaron las metas', error.toString());
        });
    });
  };

  eliminar = (item) => {
    Vibration.vibrate();
    Alert.alert(
      'Se eliminara la meta. ¿Quieres eliminarla?',
      '',
      [
        {
          text: 'No',
          onPress: () => console.log('Conservar'),
          style: 'cancel',
        },
        {text: 'Si soy incapaz de cumplirla', onPress: () => this.anular(item)},
      ],
      {cancelable: false},
    );
  };

  anular = (item) => {
    this.setState({
      cargando: true,
      msn: 'Eliminando meta ' + item.id,
    });
    fetch(SERVER_ADDRESS + 'api/metas/' + item.id + '/', {
      method: 'delete',
      headers: {
        Authorization: 'Token ' + this.props.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    }).then((r) => {
      console.log(r);
      this.setState({cargando: false});
      this.cargar();
    });
  };

  componentDidMount() {
    this.cargar();
  }
  renderMetas = (docs) => {
    return docs.map((doc) => {
      const data = {
        data: [doc.valor_cumplido / doc.valor_meta],
      };
      return (
        <TouchableOpacity
          onLongPress={() => this.eliminar(doc)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: MARGIN_VERTICAL,
          }}>
          <ProgressChart
            hideLegend={true}
            width={110}
            height={100}
            chartConfig={chart_config}
            strokeWidth={16}
            data={data}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 16,
              borderRadius: CURVA,
            }}
          />
          <View style={{marginLeft: MARGIN_HORIZONTAL, flex: 1}}>
            <Text style={{fontFamily: 'Mont-Bold', fontSize: TITULO_TAM * 0.8}}>
              {doc.titulo}
            </Text>
            <Text style={{fontFamily: 'Mont-Regular', fontSize: TEXTO_TAM}}>
              {doc.valor_cumplido}/{doc.valor_meta} {doc.tipo_meta}
            </Text>
            <Text
              style={{fontFamily: 'Mont-Regular', fontSize: TEXTO_TAM * 0.5}}>
              {moment(doc.fecha_final_meta).fromNow()} {doc.fecha_final_meta}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push('MetaGuardar', {
                id: doc.id,
                callback: this.cargar,
              })
            }
            style={{
              width: 32,
              height: 32,
              backgroundColor: COLORS.VERDE,
              borderRadius: CURVA,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="edit" color={COLORS.BLANCO} size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    });
  };
  render() {
    const {docs} = this.state;
    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <Navbar {...this.props} transparent title="Mis metas" />
        <Loader loading={this.state.cargando} message={this.state.msn} />
        <ScrollView style={{flex: 1}}>
          <View style={{marginHorizontal: MARGIN_HORIZONTAL}}>
            {this.renderMetas(docs)}

            <Button
              marginTop={3}
              right={<AntDesign name="plus" size={24} color={COLORS.BLANCO} />}
              title="Ponerme una nueva meta"
              onPress={() =>
                this.props.navigation.push('MetaGuardar', {
                  callback: this.cargar,
                })
              }
            />
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToProps = (state) => {
  return {
    id: state.Usuario.id,
    token: state.Usuario.token,
  };
};

export default connect(mapToProps)(MetaListado);
