import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
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
  Text,
  HelperText,
  FAB,
} from 'react-native-paper';
import Loader from 'components/Loader';
import {COLORS} from 'constants';
import {styelCard, styleHeader} from 'styles';
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

    return this.props.listado.map((l, k) => (
      <Card
        elevation={1}
        style={{marginTop: 16, borderRadius: 16, overflow: 'hidden'}}>
        <Card.Content style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <Image
            source={{uri: l.imagen_portada}}
            style={{
              width: '30%',
              height: undefined,
              aspectRatio: 4 / 3,
              borderRadius: 16,
              marginRight: 16,
            }}
          />
          <View style={{flex: 1}}>
            <Title style={{marginBottom: 8}}>{l.tiutlo}</Title>
            <Paragraph style={{marginBottom: 4}}>{l.descripcion}</Paragraph>
            {parseFloat(l.progreso) >= 100 && (
              <Text style={{marginVertical: 8, color: Colors.green400}}>
                Capacitación completada <Icon name="check" />
                <Icon name="check" />
              </Text>
            )}
            <ProgressBar
              style={{flex: 1}}
              progress={parseFloat(l.progreso) / 100}
              color={COLORS.PRIMARY_COLOR}
            />
            <HelperText type="info">Progreso {l.progreso} %</HelperText>
          </View>
        </Card.Content>

        <Card.Actions style={{justifyContent: 'flex-end'}}>
          <Button
            icon="arrow-right"
            contentStyle={{flexDirection: 'row-reverse'}}
            onPress={() => this.detalle(l)}>
            Capacitarme
          </Button>
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

        <View style={styleHeader.wrapper}>
          <FAB
            onPress={this.onPressMenu}
            style={styleHeader.btnLeft}
            icon="menu"
          />
          <Text style={styleHeader.title}>
            Capacitaciones {this.props.cargando}
          </Text>
          <TouchableOpacity style={styleHeader.btnRight}></TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.cargando}
              onRefresh={this.props.cargar}
            />
          }>
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
