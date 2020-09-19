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
import Icon from 'react-native-vector-icons/Entypo';
import {Montserrat} from 'utils/fonts';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Colors,
} from 'react-native-paper';

import Loader from 'components/Loader';
import {COLORS} from 'constants';
import {styelCard, styleHeader} from 'styles';
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
  detalle(item) {
    this.props.navigation.push('CapacitacionDetalle', {item: item});
  }
  renderCapacitaciones() {
    if (this.props.listado.length == 0) {
      return <Text>No hay capacitaciones</Text>;
    }
    return this.props.listado.map((l, k) => (
      <Card
        elevation={0}
        style={{marginTop: 16, borderRadius: 16, overflow: 'hidden'}}>
        <ProgressBar
          progress={parseFloat(l.progreso) / 100}
          color={Colors.amber600}
        />
        <Card.Cover source={{uri: l.imagen_portada}} />
        <Card.Content>
          <Title>{l.tiutlo}</Title>
          <Paragraph>{l.descripcion}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => this.detalle(l)}>Realizar</Button>
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
        <View style={styleHeader.wrapper}>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            style={styleHeader.btnLeft}
            onPress={this.onPressMenu}>
            <Icon name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styleHeader.title}>
            Capacitaciones {this.props.cargando}
          </Text>
          <TouchableOpacity style={styleHeader.btnRight}></TouchableOpacity>
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
