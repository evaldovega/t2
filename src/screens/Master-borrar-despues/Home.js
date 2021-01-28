import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Navbar from 'components/Navbar';
import Chart from 'screens/StaticsHealth/components/Chart';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorfullContainer from 'components/ColorfullContainer';
import Balance from './Dashboard/Balance';

const Home = ({navigation}) => {
  return (
    <ColorfullContainer style={styles.container}>
      <Navbar menu title="Inicio" transparent navigation={navigation} />
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            marginHorizontal: 16,
          }}>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Profile')}>
            <Icon name="account-circle" size={32} color="white" />
            <Text style={styles.text}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Meta')}>
            <Icon name="flag" size={32} color="white" />
            <Text style={styles.text}>Mis metas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Dashboard')}>
            <Icon name="monitor-dashboard" size={32} color="white" />
            <Text style={styles.text}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            marginHorizontal: 16,
          }}>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Capacitaciones')}>
            <Icon name="school" size={32} color="white" />
            <Text style={styles.text}>Capacitaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Clientes')}>
            <Icon name="account-group" size={32} color="white" />
            <Text style={styles.text}>Clientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Soporte')}>
            <Icon name="face-agent" size={32} color="white" />
            <Text style={styles.text}>Soporte</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            marginHorizontal: 16,
          }}>
          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Notificaciones')}>
            <Icon name="bell" size={32} color="white" />
            <Text style={styles.text}>Notificaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Planes', {cliente_id: null})}>
            <Icon name="apps" size={32} color="white" />
            <Text style={styles.text}>Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.module]}
            onPress={() => navigation.navigate('Negocios')}>
            <Icon name="folder" size={32} color="white" />
            <Text style={styles.text}>Negocios</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
          <Text
            style={{
              alignSelf: 'center',
              fontFamily: 'Mont-Bold',
              marginTop: 40,
              fontSize: 20,
            }}>
            Mis logros
          </Text>
        </View>

        {/* <Balance id={this.props.id} token={this.props.token} /> */}

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
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  module: {
    width: '32%',
    padding: 16,
    margin: 1,
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: CURVA * 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: TITULO_TAM * 0.4,
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
  line: {
    height: 1,
    backgroundColor: '#F7F8F9',
    borderRadius: 16,
  },
});
