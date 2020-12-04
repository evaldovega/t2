import React, {useEffect} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import NumberFormat from 'react-number-format';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  SERVER_ADDRESS,
  TEXTO_TAM,
  TITULO_TAM,
} from 'constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ZoomIn from 'components/ZoomIn';

import Loader from 'components/Loader';
const Sound = require('react-native-sound');

class ClienteOrdenes extends React.PureComponent {
  sonido_item = null;
  state = {
    cargando: false,
    message: '',
  };

  eliminar = (item) => {
    Vibration.vibrate();
    Alert.alert(
      'Se Anulara la orden ',
      '',
      [
        {
          text: 'Conservar',
          onPress: () => console.log('Conservar'),
          style: 'cancel',
        },
        {text: 'Anular', onPress: () => this.anular(item)},
      ],
      {cancelable: false},
    );
  };

  anular = (item) => {
    this.setState({
      cargando: true,
      message: 'Anulando orden ' + item.numero_orden,
    });
    fetch(SERVER_ADDRESS + 'api/ordenes/' + item.id + '/', {
      method: 'delete',
      headers: {
        Authorization: 'Token ' + this.props.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    }).then((r) => {
      console.log(r);
      this.setState({cargando: false});
      this.props.removeOrden(item);
    });
  };

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'rgba(255,255,255,.5)',
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          borderWidth: 0.4,
          borderRadius: CURVA,
          padding: MARGIN_VERTICAL,
          marginBottom: MARGIN_VERTICAL,
        }}
        onLongPress={() => this.eliminar(item)}>
        <ZoomIn animacion={item.animacion}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: MARGIN_VERTICAL * 2,
              marginHorizontal: MARGIN_HORIZONTAL,
            }}>
            <View style={{}}>
              <Text
                style={{
                  fontFamily: 'Mont-Bold',
                  fontSize: TITULO_TAM * 0.6,
                  color: COLORS.NEGRO_N1,
                }}>
                {item.plan}
              </Text>
              <Text
                style={{
                  fontFamily: 'Mont-Regular',
                  fontSize: TEXTO_TAM,
                  marginBottom: MARGIN_VERTICAL,
                }}>
                {item.numero_orden}
              </Text>
              <NumberFormat
                value={item.precio_pagado}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
                renderText={(nf) => (
                  <Text
                    style={{
                      fontFamily: 'Mont-Regular',
                      fontSize: TEXTO_TAM * 0.6,
                    }}>
                    {nf}
                  </Text>
                )}
              />
              <Text
                style={{fontFamily: 'Mont-Regular', fontSize: TEXTO_TAM * 0.6}}>
                {item.estado_orden_str}
              </Text>
            </View>
          </View>
        </ZoomIn>
      </TouchableOpacity>
    );
  };

  planes = () => {
    //const nombre = `${this.props.primer_nombre} ${this.props.segundo_nombre} ${this.props.primer_apellido} ${this.props.segundo_apellido}`;
    requestAnimationFrame(() => {
      this.props.navigation.push('Planes', {
        cliente_id: this.props.cliente,
      });
    });
  };

  componentDidMount() {
    this.sonido_item = new Sound(require('sounds/item.mp3'), (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
    });
  }

  componentDidUpdate(prev) {
    if (prev.ordenes.length < this.props.ordenes.length) {
      if (this.sonido_item) {
        this.sonido_item.play();
      }
    }
  }
  render() {
    return (
      <View style={{paddingBottom: MARGIN_VERTICAL * 2}}>
        <Loader message={this.state.message} loading={this.state.cargando} />
        <View
          style={{
            flexDirection: 'row',
            marginTop: MARGIN_VERTICAL,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: COLORS.NEGRO,
              fontFamily: 'Mont-Regular',
              fontWeight: 'bold',
              fontSize: TITULO_TAM * 0.7,
              marginVertical: MARGIN_VERTICAL,
            }}>
            Planes Adquiridos
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.MORADO,
              width: 32,
              height: 32,
              borderRadius: CURVA,
            }}
            onPress={this.planes}>
            <AntDesign name="plus" color={COLORS.BLANCO} />
          </TouchableOpacity>
        </View>

        {this.props.ordenes.length == 0 ? (
          <View
            style={{
              backgroundColor: 'rgba(84,4,118,.03)',
              borderRadius: CURVA,
              padding: MARGIN_HORIZONTAL,
            }}>
            <Text
              style={{
                fontFamily: 'Mont-Regular',
                textAlign: 'center',
                color: COLORS.NEGRO_N1,
              }}>
              No hay órdenes generadas
            </Text>
          </View>
        ) : null}

        <FlatList
          data={this.props.ordenes}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

export default ClienteOrdenes;
