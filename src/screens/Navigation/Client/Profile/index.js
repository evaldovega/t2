import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Linking,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Card} from 'react-native-paper';
import {loadClient, taskRemove, removeOrden} from 'redux/actions/Clients';

import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ClienteOrdenes from './components/Ordenes';
import ClientAgenda from './components/Agenda';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.BLANCO},
});

class ClientProfile extends React.Component {
  componentDidMount() {
    this.props.load(this.props.route.params.id);
  }

  componentDidUpdate(prev) {
    const orden = this.props.route.params?.orden;
    const prev_orden = prev.route.params?.orden;

    if (orden && prev_orden != orden) {
    }

    if (this.props.error != prev.error && this.props.error != '') {
      Alert.alert('Algo anda mal', this.props.error);
    }
  }

  call = (tel) => {
    Linking.openURL(
      Platform.OS === 'android' ? `tel:${tel}` : `telprompt:${tel}`,
    );
  };

  edit = () => {
    this.props.navigation.push('ClientSave', {
      id: this.props.id,
      item: this.props,
    });
  };

  wp = (tel) => {
    if (tel.startsWith('+57')) {
      Linking.openURL(`whatsapp://send?phone=${tel}`);
    } else if (tel.startsWith('57')) {
      Linking.openURL(`whatsapp://send?phone=+${tel}`);
    } else {
      Linking.openURL(`whatsapp://send?phone=+57${tel}`);
    }
  };

  renderInfoClient = () => {
    const {numero_telefono} = this.props;
    const telefonos =
      numero_telefono && numero_telefono != ''
        ? numero_telefono.split(',')
        : [];
    const nombre = [
      this.props.primer_nombre,
      this.props.segundo_nombre,
      this.props.primer_apellido,
      this.props.segundo_apellido,
    ];
    return (
      <View
        style={{
          marginTop: MARGIN_VERTICAL,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{paddingRight: 24, flex: 1}}>
          <TouchableOpacity
            style={{flex: 1, paddingHorizontal: 4}}
            onPress={this.edit}>
            <Text
              style={[
                {
                  color: COLORS.NEGRO,
                  fontFamily: 'Mont-Bold',
                  fontSize: TITULO_TAM * 0.7,
                  textDecorationLine: 'underline',
                },
              ]}>
              {!this.props.loading && nombre.filter((n) => n != '').join(' ')}{' '}
              <AntDesign name="edit" />
            </Text>
            <Text style={{color: COLORS.NEGRO}}>
              {this.props.numero_cedula || '...'}
            </Text>
            <Text style={{color: COLORS.NEGRO}}>
              {this.props.correo_electronico || '...'}
            </Text>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 16}}>
            {telefonos.map((tel, i) => {
              if (tel.length > 0) {
                return (
                  <View
                    key={{i}}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 8,
                    }}>
                    <FontAwesome
                      size={24}
                      onPress={() => this.wp(tel)}
                      name="whatsapp"
                      color={COLORS.PRIMARY_COLOR}
                    />
                    <View
                      style={{
                        backgroundColor: COLORS.PRIMARY_COLOR,
                        borderRadius: CURVA,
                        padding: 2,
                        marginHorizontal: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: COLORS.BLANCO}}>{tel}</Text>
                    </View>
                    <Ionicons
                      size={24}
                      onPress={() => this.call(tel)}
                      name="call"
                      color={COLORS.PRIMARY_COLOR}
                    />
                  </View>
                );
              }
            })}
          </View>
        </View>
      </View>
    );
  };

  renderAgenda = () => {
    if (!this.props.loading) {
      return (
        <React.Fragment>
          <View
            style={{
              flexDirection: 'row',
              marginTop: MARGIN_VERTICAL,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.NEGRO,
                fontFamily: 'Mont-Regular',
                fontWeight: 'bold',
                fontSize: TITULO_TAM * 0.7,
              }}>
              Agenda
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.MORADO,
                borderRadius: CURVA,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              onPress={() =>
                this.props.navigation.push('TaskSave', {
                  cliente_id: this.props.route.params.id,
                })
              }>
              <AntDesign name="plus" color={COLORS.BLANCO} />
              <Text style={{color: COLORS.BLANCO}}>Agendar cita</Text>
            </TouchableOpacity>
          </View>
          <Card
            style={{
              borderRadius: CURVA,
              marginTop: MARGIN_VERTICAL,
              marginBottom: MARGIN_VERTICAL,
              elevation: 0,
              borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
              borderWidth: 0.2,
            }}
            elevation={2}>
            <Card.Content>
              <ClientAgenda
                {...this.props}
                cliente={this.props.route.params.id}
              />
            </Card.Content>
          </Card>
        </React.Fragment>
      );
    }
  };

  render() {
    const nombre = `${this.props.primer_nombre} ${this.props.segundo_nombre} ${this.props.primer_apellido} ${this.props.segundo_apellido}`;
    return (
      <ColorfullContainer style={styles.container}>
        <Navbar
          back
          transparent
          title="Detalle cliente"
          right={
            <TouchableOpacity
              onPress={this.edit}
              style={{
                backgroundColor: COLORS.MORADO,
                width: 32,
                height: 32,
                borderRadius: CURVA,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AntDesign name="edit" color={COLORS.BLANCO} />
            </TouchableOpacity>
          }
          {...this.props}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={() => this.props.load(this.props.route.params.id)}
            />
          }>
          <View style={{marginHorizontal: MARGIN_HORIZONTAL, minHeight: 150}}>
            {!this.props.loading ? this.renderInfoClient() : null}
          </View>

          <View
            style={{
              flex: 1,
              marginHorizontal: MARGIN_HORIZONTAL * 1.2,
            }}>
            {!this.props.loading && (
              <ClienteOrdenes
                token={this.props.token}
                removeOrden={this.props.removeOrden}
                loading={this.props.loading}
                navigation={this.props.navigation}
                ordenes={this.props.ordenes}
                cliente={this.props.id}
              />
            )}

            {this.renderAgenda()}
          </View>
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    token: state.Usuario.token,
    id: state.Client.id,
    primer_nombre: state.Client.primer_nombre,
    segundo_nombre: state.Client.segundo_nombre,
    primer_apellido: state.Client.primer_apellido,
    segundo_apellido: state.Client.segundo_apellido,
    numero_cedula: state.Client.numero_cedula,
    correo_electronico: state.Client.correo_electronico,
    numero_telefono: state.Client.numero_telefono,
    ordenes: state.Client.ordenes,
    tareas: state.Client.tareas,
    loading: state.Client.loading,
    error: state.Client.error,
    success: state.Client.success,
  };
};
const mapToActions = (dispatch) => {
  return {
    load: (id) => {
      dispatch(loadClient(id));
    },
    taskRemove: (id) => {
      dispatch(taskRemove(id));
    },
    removeOrden: (orden) => {
      dispatch(removeOrden(orden));
    },
  };
};

export default connect(mapToState, mapToActions)(ClientProfile);
