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
import {Montserrat} from 'utils/fonts';
import SvgHover from 'svgs/staticsHealth/SvgHover';
import SvgGlueco from 'svgs/staticsHealth/SvgGlueco';
import SvgEdit from 'svgs/staticsHealth/SvgEdit';
import SvgWeight from 'svgs/staticsHealth/SvgWeight';
import Chart from 'screens/StaticsHealth/components/Chart';

import {connect} from 'react-redux';
import {CambiarNombre} from '../../redux/actions/Usuario';
import {COLORS, MARGIN_VERTICAL} from 'constants';
import LottieView from 'lottie-react-native';
import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';

const {width, height} = Dimensions.get('screen');
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
          <View style={styles.containerChart}>
            <View style={styles.boxHeader}>
              <SvgGlueco />
              <Text style={styles.txtTitle}>
                Glueco <Text style={{color: '#ABA4AC'}}>(mg/Dl)</Text>
              </Text>
              <SvgEdit />
            </View>
            <Chart />
            <View style={styles.line} />
            <View style={styles.boxBottom}>
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottom}>See Details</Text>
              </TouchableOpacity>
              <View style={styles.lineVertical} />
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottomActive}>Set Goals</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.containerChart}>
            <View style={styles.boxHeader}>
              <SvgWeight />
              <Text style={styles.txtTitle}>
                Weight <Text style={{color: '#ABA4AC'}}>(kg)</Text>
              </Text>
              <SvgEdit />
            </View>
            <Chart />
            <View style={styles.line} />
            <View style={styles.boxBottom}>
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottom}>See Details</Text>
              </TouchableOpacity>
              <View style={styles.lineVertical} />
              <TouchableOpacity style={styles.btnBottom}>
                <Text style={styles.txtBtnBottomActive}>Set Goals</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    usuario: state.Usuario,
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
    fontFamily: Montserrat,
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
    marginTop: MARGIN_VERTICAL * 3,
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
