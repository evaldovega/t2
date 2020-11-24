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
import {FAB, List} from 'react-native-paper';
import {Montserrat, Lato} from 'utils/fonts';
import ArrowLeft from 'svgs/ArrowLeft';

import ArrowRight from 'svgs/ArrowRight';
import Check from 'svgs/Check';

import Loader from 'components/Loader';
import {COLORS} from 'constants';
import {styelCard, styleHeader} from 'styles';
import Icon from 'react-native-vector-icons/AntDesign';
const dataTime = ['DAYS', 'WEEKS', 'MONTHS', 'YEARS'];

const {width, height} = Dimensions.get('screen');
import {styleText} from 'styles';
import {connect} from 'react-redux';
import {capacitacionDetalleCargar} from '../../../redux/actions';
import Navbar from 'components/Navbar';

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
    return withAnchorPoint(transform, {x: 0, y: 0.5}, {width: 32, height: 32});
  };
  renderActividades = (id_seccion, actividades) => {
    if (actividades.length == 0) {
      return <Text>No hay actividades</Text>;
    }
    return actividades.map((a, key, arr) => {
      return (
        <TouchableNativeFeedback
          key={key}
          onPress={() => this.actividad(id_seccion, a.id)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginLeft: -32,
              position: 'relative',
            }}>
            {key + 1 < arr.length && (
              <Animated.View style={{transform: [{scaleY: this.state.scaleY}]}}>
                <View
                  style={{
                    width: 3,
                    height: '150%',
                    backgroundColor: COLORS.PRIMARY_COLOR,
                    position: 'absolute',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    shadowColor: 'rgba(0,0,0,.6)',
                    elevation: 0,
                    top: 0,
                    left: 19,
                  }}></View>
              </Animated.View>
            )}

            <Animated.View style={this.getTransform()}>
              <FAB
                ref={(v) => {
                  key == 0 ? (this.vista = v) : null;
                }}
                style={{
                  zIndex: 999,
                  marginRight: 8,
                  backgroundColor: COLORS.PRIMARY_COLOR,
                }}
                color="#ffff"
                animated={true}
                small
                icon={
                  (a.tipo != 'cuestionario' && a.visualizado) || a.aprobado
                    ? 'check'
                    : 'alert-octagon'
                }></FAB>
            </Animated.View>

            <View style={{flex: 1}}>
              <Text style={[styleText.h3, {marginTop: 0}]}>{a.titulo}</Text>
              <Text style={[styleText.small, {textTransform: 'capitalize'}]}>
                {a.tipo}
              </Text>
            </View>

            <View>
              <Icon name="right" size={24} color={COLORS.PRIMARY_COLOR} />
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    });
  };

  renderSecciones = () => {
    if (this.props.secciones.length == 0) {
      return <Text>No hay secciones</Text>;
    }
    return this.props.secciones.map((s, key) => {
      return (
        <View
          key={key}
          style={{flexDirection: 'column'}}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
          }}>
          {key == 100 && (
            <Animated.View style={{transform: [{scaleY: this.state.scaleY}]}}>
              <View
                style={{
                  width: 3,
                  height: 36 * (s.actividades.length + 1),
                  backgroundColor: COLORS.PRIMARY_COLOR,
                  position: 'absolute',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  shadowColor: 'rgba(0,0,0,.6)',
                  elevation: 0,
                  top: 90,
                  left: 19,
                }}></View>
            </Animated.View>
          )}
          <Text style={[styleText.h2]}>{s.titulo}</Text>
          <View style={{marginBottom: 24, position: 'relative'}}>
            {this.renderActividades(s.id, s.actividades)}
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
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <Loader loading={this.props.cargando} />
        <Navbar back {...this.props} title="Detalle capacitación" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 16}}>
            <Text style={[styleText.h1, {textAlign: 'center'}]}>
              {item.titulo}
            </Text>
          </View>

          <View style={styles.containerInfo}>
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
          </View>

          <View style={styles.content}>
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 32,
                elevation: 4,
                marginTop: -50,
                marginLeft: width / 2 - 64,
                marginBottom: 32,
              }}>
              <Image
                source={require('utils/images/ISO.png')}
                style={{width: 32, height: 32}}
              />
            </View>
            <Text>{item.descripcion}</Text>
            {this.renderSecciones()}
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: '#F7F8F9',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginHorizontal: 8,
    marginBottom: 30,
    shadowColor: 'rgba(0,0,0,.5)',
    elevation: 5,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHeader: {
    fontFamily: Montserrat,
    fontSize: 17,
    color: '#fff',
  },
  btnClose: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    zIndex: 1,
  },
  btnOption: {
    position: 'absolute',
    bottom: 20,
    right: 16,
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
