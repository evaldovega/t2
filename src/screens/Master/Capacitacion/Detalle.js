import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {withAnchorPoint} from 'react-native-anchor-point';
import {Montserrat, Lato} from 'utils/fonts';

import Loader from 'components/Loader';
import {COLORS} from 'constants';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const dataTime = ['DAYS', 'WEEKS', 'MONTHS', 'YEARS'];

const {width, height} = Dimensions.get('screen');
import {styleText} from 'styles';
import {connect} from 'react-redux';
import {capacitacionDetalleCargar} from '../../../redux/actions';
import Navbar from 'components/Navbar';
import GradientContainer from 'components/GradientContainer';

class CapacitacionDetalle extends React.Component {
  state = {
    valueScale: new Animated.Value(0.02),
    scaleY: new Animated.Value(0.02),
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  onPressMenu = () => {
    this.props.navigation.pop();
  };

  componentDidMount() {
    this.vista = 0;
    this.props.cargar(this.props.route.params.item.id);
    Animated.timing(this.state.valueScale, {
      toValue: 1,
      duration: 500,
      easing: Easing.quad,
      delay: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.state.scaleY, {
      toValue: 1,
      duration: 800,
      easing: Easing.quad,
      delay: 0,
      useNativeDriver: true,
    }).start();
  }
  actividad = (seccion_id, actividad_id) => {
    this.props.navigation.push('Actividad', {
      capacitacion_id: this.props.route.params.item.id,
      seccion_index: seccion_id,
      actividad_index: actividad_id,
    });
  };
  getTransform = () => {
    let transform = {
      transform: [{scale: this.state.valueScale}],
    };
    return withAnchorPoint(
      transform,
      {x: 0.5, y: 0.5},
      {width: 42, height: 42},
    );
  };

  renderActividades = (id_seccion, actividades) => {
    if (actividades.length == 0) {
      return <Text>No hay actividades</Text>;
    }
    const countActivities = actividades.length;
    return actividades.map((a, key, arr) => {
      const last = key == countActivities - 1;
      return (
        <TouchableNativeFeedback
          key={key}
          onPress={() =>
            requestAnimationFrame(() => this.actividad(id_seccion, a.id))
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              paddingRight: 16,
              position: 'relative',
            }}>
            <View style={styles.shadowHole}>
              {(a.tipo != 'cuestionario' && a.visualizado) || a.aprobado ? (
                <Animated.View style={this.getTransform()}>
                  <View style={styles.pointInHole} />
                </Animated.View>
              ) : (
                <></>
              )}
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: -16,
                borderLeftColor: COLORS.PRIMARY_COLOR,
                borderLeftWidth: !last ? 1.5 : 0,
                paddingLeft: 25,
                paddingBottom: 16,
              }}>
              <Text style={{fontFamily: 'Roboto-Medium'}}>{a.titulo}</Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Light',
                  textTransform: 'capitalize',
                }}>
                {a.tipo}
              </Text>
            </View>

            <View>
              <SimpleLineIcons
                name="arrow-right"
                size={24}
                color={COLORS.PRIMARY_COLOR}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    });
  };

  renderSecciones = () => {
    if (!this.props.secciones) {
      return <Text>No hay secciones</Text>;
    }
    if (this.props.secciones && this.props.secciones.length == 0) {
      return <Text>No hay secciones</Text>;
    }
    return this.props.secciones.map((s, key) => {
      return (
        <View
          style={{
            borderRadius: 25,
            paddingLeft: 16,
            margin: 25,
            marginBottom: 32,
            backgroundColor: COLORS.BG_BLUE,
            borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
            borderWidth: 0.3,
          }}>
          <View key={key}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                marginVertical: 18,
              }}>
              {s.titulo}
            </Text>
            <View style={{marginBottom: 24, position: 'relative'}}>
              {this.renderActividades(s.id, s.actividades)}
            </View>
          </View>
        </View>
      );
    });
  };

  totalActividades = () => {
    if (this.props.secciones.length == 0) {
      return 0;
    }
    let total = 0;
    this.props.secciones.forEach((s) => {
      total += s.actividades.length;
    });
    return total;
  };

  render() {
    const {item} = this.props.route.params;
    const {video_introduccion} = this.props;
    if (this.top) {
      console.log(this.top);
    }
    return (
      <GradientContainer style={styles.container}>
        <Loader loading={this.props.cargando} />
        <Navbar back {...this.props} title="Detalle capacitación" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 16}}>
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.DARK,
                fontFamily: 'Roboto-Medium',
                fontSize: 32,
                marginTop: 16,
              }}>
              {item.titulo}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.SECONDARY_COLOR_LIGHTER,
                fontFamily: 'Roboto-Medium',
              }}>
              {item.descripcion}
            </Text>
          </View>

          {/*<View style={styles.containerInfo}>
            <View style={styles.col}>
              <Text style={styles.value}>{this.totalActividades()}</Text>
              <Text style={styles.title}>Actividades</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Text style={styles.value}>{this.totalActividades()}</Text>
              <Text style={styles.title}>Realizadas</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.col}>
              <Text style={styles.value}>{this.totalActividades()}</Text>
              <Text style={styles.title}>Faltantes</Text>
            </View>
          </View>*/}
          {this.renderSecciones()}
        </ScrollView>
      </GradientContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    secciones: state.Capacitacion.secciones,
    cargando: state.Capacitacion.cargando,
    video_introduccion: state.Capacitacion.video_introduccion,
  };
};
const mapToActions = (dispatch) => {
  return {
    cargar: (id) => {
      dispatch(capacitacionDetalleCargar(id));
    },
  };
};
export default connect(mapToState, mapToActions)(CapacitacionDetalle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadowHole: {
    borderRadius: 16,
    borderColor: COLORS.PRIMARY_COLOR,
    backgroundColor: COLORS.BG_GRAY,
    borderWidth: 1.5,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  pointInHole: {
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_COLOR,
    width: 24,
    height: 24,
  },
  section: {
    backgroundColor: COLORS.BG_GRAY,
    borderRadius: 24,
    marginHorizontal: 32,
    marginTop: 30,
    marginBottom: 10,
    shadowColor: 'rgba(0,0,0,1)',
    elevation: 5,
    padding: 32,
    elevation: 4,
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
  containerInfo: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 64,
  },
  col: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontFamily: Montserrat,
    fontSize: 20,
    color: '#1A051D',
  },
  title: {
    fontFamily: Lato,
    fontSize: 12,
    color: '#6D5F6F',
  },
  line: {
    width: 1,
    backgroundColor: '#EAE8EA',
    height: 32,
  },
});
