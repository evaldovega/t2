import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  RefreshControl,
  Alert,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {Montserrat} from 'utils/fonts';
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Colors,
  HelperText,
  FAB,
} from 'react-native-paper';
import Loader from 'components/Loader';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
  NOTIMAGE,
} from 'constants';
import {connect} from 'react-redux';
import {capacitacionesCargar} from '../../../redux/actions';

import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';
import Button from 'components/Button';

const {width, height} = Dimensions.get('screen');
const width_progress = width * 0.4;
class CapacitacionListado extends React.Component {
  state = {
    filter: '2',
  };

  componentDidMount() {
    this.props.cargar();
  }

  detalle(item) {
    this.props.navigation.push('CapacitacionDetalle', {item: item});
  }

  componentDidUpdate(prev) {
    if (prev.error != this.props.error && this.props.error != '') {
      Alert.alert('Algo anda mal', this.props.error);
    }
  }

  renderCapacitaciones() {
    if (!this.props.listado) {
      return <Text>No hay capacitaciones</Text>;
    }

    if (this.props.listado.length == 0) {
      return <Text>No hay capacitaciones</Text>;
    }

    const {filter} = this.state;
    let listado = [],
      t = '';

    switch (filter) {
      case '1':
        t = 'en curso';
        listado = this.props.listado.filter(
          (l) => parseFloat(l.progreso) > 0 && parseFloat(l.progreso) < 100,
        );
        break;
      case '2':
        t = 'pendientes';
        listado = this.props.listado.filter((l) => parseFloat(l.progreso) == 0);
        break;
      case '3':
        t = 'terminadas';
        listado = this.props.listado.filter(
          (l) => parseFloat(l.progreso) == 100,
        );
        break;
    }
    if (listado.length == 0) {
      return (
        <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 16}}>
          No hay capacitaciones {t}
        </Text>
      );
    }

    return listado.map((l, k) => (
      <Card
        style={{
          marginTop: MARGIN_VERTICAL,
          borderRadius: CURVA,
          overflow: 'hidden',
          elevation: 0,
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          borderWidth: 0.3,
        }}>
        <Card.Cover
          style={{height: 140}}
          source={{uri: l.imagen_portada || NOTIMAGE}}
        />
        {parseFloat(l.progreso) > 0 && parseFloat(l.progreso) < 100 && (
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: COLORS.PRIMARY_COLOR,
              borderRadius: 4,
              padding: 8,
            }}>
            <Text style={{color: '#ffff'}}>En curso</Text>
          </View>
        )}
        <View style={{}}>
          <Card.Content>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text
                style={{
                  marginTop: MARGIN_VERTICAL,
                  marginBottom: MARGIN_VERTICAL * 2,
                  color: COLORS.NEGRO,
                  textAlign: 'left',
                  fontSize: TITULO_TAM * 0.7,
                  fontFamily: 'Mont-Bold',
                }}>
                {l.titulo}
              </Text>
              <Text>Tiempo estimado {l.tiempo_estimado || '...'}</Text>
              {parseFloat(l.progreso) >= 100 && (
                <Text style={{marginVertical: 8, color: Colors.green400}}>
                  Capacitación completada <Icon name="check" />
                  <Icon name="check" />
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <View style={{alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      width: width_progress,
                      height: 10,
                      borderRadius: CURVA,
                      overflow: 'hidden',
                      borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                      borderWidth: 0.3,
                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.PRIMARY_COLOR,
                        height: 10,
                        borderTopRightRadius: CURVA,
                        width: width_progress * (l.progreso / 100),
                      }}></View>
                  </View>
                </View>
                <Text style={styles.progress}>{l.progreso}%</Text>
              </View>
            </View>
          </Card.Content>

          <Card.Actions
            style={{justifyContent: 'center', marginTop: MARGIN_VERTICAL}}>
            <Button
              title="Capacitarme"
              onPress={() =>
                requestAnimationFrame(() => {
                  this.detalle(l);
                })
              }
            />
          </Card.Actions>
        </View>
      </Card>
    ));
  }

  render() {
    const {filter} = this.state;
    return (
      <ColorfullContainer style={styles.container}>
        <Navbar back title="Capacitaciones" transparent {...this.props} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.cargando}
              onRefresh={this.props.cargar}
            />
          }>
          <View
            style={{
              flex: 1,
              paddingHorizontal: MARGIN_HORIZONTAL,
              paddingVertical: MARGIN_VERTICAL,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({filter: '1'})}
                style={{
                  backgroundColor:
                    filter == '1' ? COLORS.PRIMARY_COLOR : 'transparent',
                  padding: 8,
                  borderRadius: CURVA,
                }}>
                <Text>En curso</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor:
                    filter == '2' ? COLORS.PRIMARY_COLOR : 'transparent',
                  padding: 8,
                  borderRadius: CURVA,
                }}
                onPress={() => this.setState({filter: '2'})}>
                <Text>Pendientes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor:
                    filter == '3' ? COLORS.PRIMARY_COLOR : 'transparent',
                  padding: 8,
                  borderRadius: CURVA,
                }}
                onPress={() => this.setState({filter: '3'})}>
                <Text>Terminados</Text>
              </TouchableOpacity>
            </View>
            {this.renderCapacitaciones()}
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    listado: state.Capacitaciones.listado,
    cargando: state.Capacitaciones.cargando,
    error: state.Capacitaciones.error,
  };
};
const mapToActions = (dispatch) => {
  return {
    cargar: () => {
      dispatch(capacitacionesCargar());
    },
  };
};
export default connect(mapToState, mapToActions)(CapacitacionListado);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progress: {
    marginLeft: MARGIN_VERTICAL,
    color: COLORS.PRIMARY_COLOR,
    fontFamily: 'Mont-Regular',
    fontSize: 12,
  },
  containerTime: {
    flexDirection: 'row',
    height: 48,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#FFF',
  },
  btnTime: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTime: {
    fontFamily: Montserrat,
    fontSize: 12,
    color: '#1A051D',
  },
  svgHover: {
    position: 'absolute',
    bottom: 0,
    left: 40,
  },
  boxStatus: {
    margin: 16,
    backgroundColor: '#FFA26B',
    borderRadius: 16,
    paddingTop: 20,
    paddingLeft: 24,
    paddingBottom: 23,
  },
  txtGood: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: Montserrat,
    fontWeight: '500',
  },
  txtKeep: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: Montserrat,
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerChart: {
    borderRadius: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  txtTitle: {
    marginLeft: 8,
    fontFamily: Montserrat,
    fontSize: 14,
    color: '#1A051D',
    flex: 1,
  },
  line: {
    height: 1,
    backgroundColor: '#F7F8F9',
    borderRadius: 16,
  },
  boxBottom: {
    flexDirection: 'row',
  },
  btnBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  txtBtnBottom: {
    fontSize: 14,
    color: '#ABA4AC',
    fontFamily: Montserrat,
  },
  txtBtnBottomActive: {
    fontSize: 14,
    color: '#0084F4',
    fontFamily: Montserrat,
  },
  lineVertical: {
    width: 1,
    backgroundColor: '#F7F8F9',
    borderRadius: 16,
  },
});
