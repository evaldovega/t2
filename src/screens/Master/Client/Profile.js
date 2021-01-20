import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Linking,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  FAB,
  Avatar,
  Title,
  Colors,
  Caption,
  Subheading,
  Card,
  Button,
  Divider,
} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import {loadClient, taskRemove, removeOrden} from 'redux/actions/Clients';
import ClientAgenda from './Agenda';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import NumberFormat from 'react-number-format';
import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';

import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ClienteOrdenes from './Ordenes';

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

  call = () => {
    if (this.props.numero_telefono == '') {
      Alert.alert('Número de teléfono no configurado', 'Hazlo ahora');
      this.props.navigation.push('ClientSave', {id: this.props.id});
      return;
    }
    let tel = this.props.numero_telefono.split(',')[0];
    Linking.openURL(
      Platform.OS === 'android' ? `tel:${tel}` : `telprompt:${tel}`,
    );
  };

  edit = () => {
    this.props.navigation.push('ClientSave', {id: this.props.id});
  };

  renderInfoClient = () => (
    <View
      style={{
        marginTop: MARGIN_VERTICAL,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{flex: 1, paddingHorizontal: 4}}
        onPress={this.edit}>
        <Text
          style={[
            {
              color: COLORS.NEGRO,
              fontFamily: 'Mont-Bold',
              fontSize: TITULO_TAM * 0.7,
            },
          ]}>
          {!this.props.loading &&
            this.props.primer_nombre +
              ' ' +
              this.props.segundo_nombre +
              ' ' +
              this.props.primer_apellido +
              ' ' +
              this.props.segundo_apellido}
        </Text>
        <Text style={{color: COLORS.NEGRO}}>
          {this.props.numero_cedula || '...'}
        </Text>
        <Text style={{color: COLORS.NEGRO}}>
          {this.props.correo_electronico || '...'}
        </Text>
        <Text style={{color: COLORS.NEGRO}}>
          {this.props.numero_telefono || '...'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={this.call}
        style={{
          backgroundColor: COLORS.PRIMARY_COLOR,
          width: 64,
          height: 64,
          borderRadius: CURVA,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons name="phone" size={32} color={COLORS.BLANCO} />
      </TouchableOpacity>
    </View>
  );

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
                width: 32,
                height: 32,
                borderRadius: CURVA,
              }}
              onPress={() =>
                this.props.navigation.push('TaskSave', {
                  cliente_id: this.props.route.params.id,
                })
              }>
              <AntDesign name="plus" color={COLORS.BLANCO} />
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
