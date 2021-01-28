import React from 'react';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  SERVER_ADDRESS,
  TITULO_TAM,
  TEXTO_TAM,
} from 'constants';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import NumberFormat from 'react-number-format';
import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';
import ZoomIn from 'components/ZoomIn';
import InputText from 'components/InputText';

class Planes extends React.Component {
  state = {
    cargando: false,
    docs: [],
    docsOriginal: [],
    filtrado: [],
    modal_show: false,
    doc: {},
    valorBusqueda: '',
  };

  componentDidUpdate = (prev) => {};

  componentDidMount() {
    this.setState({cargando: true});
    fetch(SERVER_ADDRESS + 'api/planes/', {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        this.setState({docs: r, docsOriginal: r});
        this.setState({cargando: false});
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('No se pudó cargar los planes', error);
        this.props.navigation.pop();
      });
  }

  changeSearchInput = (t) => {
    this.setState({valorBusqueda: t});
    let valorBusqueda = t;
    if (valorBusqueda != '') {
      let datafiltrada = [];
      for (let i = 0; i < this.state.docs.length; i++) {
        if (
          this.state.docs[i].titulo
            .toUpperCase()
            .includes(valorBusqueda.toUpperCase())
        ) {
          datafiltrada.push(this.state.docs[i]);
        }
      }
      this.setState({docs: datafiltrada});
    } else if (t == '') {
      this.setState({docs: this.state.docsOriginal});
    }
  };

  seleccionar = (i) => {
    console.log(i);
    //this.setState({modal_show: true, doc: i});
    this.props.navigation.push('PlanDetale', {
      doc: i,
      cliente: this.props.route.params.cliente_id,
    });
    return;
  };

  render() {
    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <Navbar transparent back title="Seleccione un Plan" {...this.props} />
        <View style={{marginHorizontal: MARGIN_HORIZONTAL}}>
          <InputText
            marginTop={1}
            placeholder={'Buscar'}
            onChangeText={(t) => this.changeSearchInput(t)}
            value={this.state.valorBusqueda}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: MARGIN_HORIZONTAL}}>
          {this.state.docs.map((i, k) => {
            return (
              <ZoomIn>
                <TouchableOpacity
                  key={k}
                  onPress={() => this.seleccionar(i)}
                  style={{
                    borderRadius: CURVA,
                    marginTop: MARGIN_VERTICAL * 2,
                    elevation: 0,
                    overflow: 'hidden',
                    borderColor: COLORS.NEGRO,
                    borderWidth: 0.2,
                    backgroundColor: COLORS.BLANCO,
                  }}>
                  <View>
                    <Image
                      source={{uri: i.imagen}}
                      style={{
                        flex: 1,
                        height: 200,
                        overflow: 'hidden',
                        borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                        borderWidth: 0.2,
                      }}
                    />
                    <View
                      style={{
                        paddingVertical: MARGIN_VERTICAL,
                        paddingHorizontal: MARGIN_HORIZONTAL,
                      }}>
                      <Text
                        style={{
                          fontSize: TITULO_TAM * 0.6,
                          color: COLORS.NEGRO,
                          fontFamily: 'Mont-Bold',
                          marginTop: MARGIN_VERTICAL,
                        }}>
                        {i.titulo}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Mont-Regular',
                          fontSize: TEXTO_TAM * 0.6,
                          marginVertical: MARGIN_VERTICAL,
                        }}>
                        {i.descripcion ||
                          'Este plan no tiene una descripción por favor comunicarle al administrador.'}
                      </Text>
                      <NumberFormat
                        value={i.precio}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        renderText={(nf) => (
                          <Text
                            style={{
                              fontSize: TITULO_TAM * 0.6,
                              fontFamily: 'Mont-Bold',
                              color: COLORS.NEGRO_N1,
                              marginTop: MARGIN_VERTICAL,
                            }}>
                            {nf}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </ZoomIn>
            );
          })}
          <View style={{height: 30}}></View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapearEstado = (state) => {
  return {
    token: state.Usuario.token,
  };
};

export default connect(mapearEstado, null)(Planes);
