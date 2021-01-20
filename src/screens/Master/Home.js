import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Navbar from 'components/Navbar';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorfullContainer from 'components/ColorfullContainer';

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
          <View style={{flex: 1}}></View>
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
});
