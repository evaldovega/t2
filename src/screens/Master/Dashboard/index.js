import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import AntDesign from 'react-native-vector-icons/AntDesign';

import SvgEdit from 'svgs/staticsHealth/SvgEdit';
import Chart from 'screens/StaticsHealth/components/Chart';

import {connect} from 'react-redux';
import {CambiarNombre} from 'redux/actions/Usuario';
import {COLORS, CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL} from 'constants';
import LottieView from 'lottie-react-native';
import Navbar from 'components/Navbar';
import ProgressBar from 'components/ProgressBar';
import ColorfullContainer from 'components/ColorfullContainer';
import Balance from './Balance';

const {width, height} = Dimensions.get('screen');
const width_progress = width * 0.4;

class Dashboard extends React.Component {
  state = {
    progress: new Animated.Value(0),
  };

  componentDidMount() {
    // Animated.loop(
    //   Animated.timing(this.state.progress, {
    //     toValue: 1,
    //     duration: 5000,
    //     easing: Easing.linear,
    //     useNativeDriver: true,
    //   }),
    // ).start();
  }
  render() {
    return (
      <ColorfullContainer style={styles.container}>
        <Navbar transparent menu title="Dashboard" {...this.props}></Navbar>

        {/*<View style={styles.containerTime}>
          {dataTime.map((item) => {
            return (
              <TouchableOpacity style={styles.btnTime} key={item}>
                <Text style={styles.txtTime}>{item}</Text>
              </TouchableOpacity>
            );
          })}
          <SvgHover style={styles.svgHover} />
        </View>*/}

        <ScrollView showsVerticalScrollIndicator={false}>
          <Balance id={this.props.id} token={this.props.token} />

          <View style={styles.containerChart}>
            <View style={styles.boxHeader}>
              <Text style={styles.txtTitle}>
                Meta del mes{' '}
                <Text style={{color: '#ABA4AC'}}>(ventas/semana)</Text>
              </Text>
            </View>
            <Chart />
            <View style={styles.line} />
            {/* <View style={styles.boxBottom}>
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottom}>See Details</Text>
              </TouchableOpacity>
              <View style={styles.lineVertical} />
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottomActive}>Set Goals</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.containerChart}>
            <View style={styles.boxHeader}>
              <Text style={styles.txtTitle}>Clientes adquiridos</Text>
            </View>
            <Chart />
            <View style={styles.line} />
            {/* <View style={styles.boxBottom}>
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottom}>See Details</Text>
              </TouchableOpacity>
              <View style={styles.lineVertical} />
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottomActive}>Set Goals</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    usuario: state.Usuario,
    id: state.Usuario.id,
    token: state.Usuario.token,
  };
};
const mapToActions = (dispatch) => {
  return {
    cambiarNombreUsuario: (nombre) => {
      dispatch(CambiarNombre(nombre));
    },
  };
};
export default connect(mapToState, mapToActions)(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6979F8',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Mont-Bold',
    fontSize: 17,
    color: '#fff',
  },
  btnClose: {
    position: 'absolute',
    bottom: 20,
    left: 16,
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
    fontFamily: 'Mont-Regular',
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
    fontFamily: 'Mont-Regular',
    fontWeight: '500',
  },
  txtKeep: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Mont-Regular',
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerChart: {
    marginTop: MARGIN_VERTICAL * 3,
    borderRadius: CURVA,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: MARGIN_VERTICAL,
    marginHorizontal: MARGIN_HORIZONTAL,
    marginBottom: MARGIN_HORIZONTAL,
  },
  txtTitle: {
    marginLeft: 8,
    fontFamily: 'Mont-Regular',
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
    fontFamily: 'Mont-Regular',
  },
  txtBtnBottomActive: {
    fontSize: 14,
    color: '#0084F4',
    fontFamily: 'Mont-Regular',
  },
  lineVertical: {
    width: 1,
    backgroundColor: '#F7F8F9',
    borderRadius: 16,
  },
});
