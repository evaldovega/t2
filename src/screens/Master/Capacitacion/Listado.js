import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Montserrat} from 'utils/fonts';
import SvgOption from 'svgs/staticsHealth/SvgOptions';
import SvgSetting from 'svgs/staticsHealth/SvgSetting';
import SvgHover from 'svgs/staticsHealth/SvgHover';
import SvgGlueco from 'svgs/staticsHealth/SvgGlueco';
import SvgEdit from 'svgs/staticsHealth/SvgEdit';
import SvgWeight from 'svgs/staticsHealth/SvgWeight';

import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

import Loader from 'components/Loader';
import {COLORS} from 'constants';
import {styelCard} from 'styles';
const dataTime = ['DAYS', 'WEEKS', 'MONTHS', 'YEARS'];

import {connect} from 'react-redux';
import {capacitacionesCargar} from '../../../redux/actions';

class CapacitacionListado extends React.Component {
  onPressMenu = () => {
    this.props.navigation.openDrawer();
  };

  componentDidMount() {
    this.props.cargar();
  }
  detalle(item, key) {
    this.props.navigation.push('CapacitacionDetalle', {item: item, key: key});
  }
  renderCapacitaciones() {
    if (this.props.listado.length == 0) {
      return;
    }
    return this.props.listado.map((l, k) => (
      <Card style={{marginTop: 16}}>
        <Card.Cover source={{uri: l.imagen_portada}} />
        <Card.Content>
          <Title>{l.tiutlo}</Title>
          <Paragraph>{l.descripcion}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => this.detalle(l, k)}>Realizar</Button>
        </Card.Actions>
      </Card>
    ));
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <Loader loading={this.props.cargando} />
        <View style={styles.header}>
          <Text style={styles.title}>Capacitaciones {this.props.cargando}</Text>
          <TouchableOpacity style={styles.btnClose} onPress={this.onPressMenu}>
            <SvgOption />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOption}>
            <SvgSetting />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, paddingHorizontal: 16, paddingVertical: 8}}>
            {this.renderCapacitaciones()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapToState = (state) => {
  return {
    listado: state.Capacitaciones.listado,
    cargando: state.Capacitaciones.cargando,
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
    backgroundColor: '#F7F8F9',
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
  title: {
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
});
