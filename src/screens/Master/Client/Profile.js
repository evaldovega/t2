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
import {loadClient, taskRemove} from 'redux/actions/Clients';
import ClientAgenda from './Agenda';
import {COLORS} from 'constants';
import TaskList from '../Task/List';
import Navbar from 'components/Navbar';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.PRIMARY_COLOR},
});

class ClientProfile extends React.Component {
  componentDidMount() {
    this.props.load(this.props.route.params.id);
  }
  componentDidUpdate(prev) {
    const orden = this.props.route.params?.orden;
    const prev_orden = prev.route.params?.orden;

    if (orden && prev_orden != orden) {
      Alert.alert(
        'Orden ' + orden + ' generada',
        'Entrara en un proceso de validación',
      );
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

  renderProduct = ({item}) => (
    <View style={{flexDirection: 'row', marginTop: 8}}>
      <Image
        source={{uri: item.imagen_producto}}
        style={{width: 64, height: 64, borderRadius: 8, marginRight: 8}}
      />
      <View>
        <Subheading>{item.producto}</Subheading>
        <Caption>Nº {item.numero_orden}</Caption>
        <Caption>$ {item.precio_pagado}</Caption>
      </View>
    </View>
  );

  renderLoadingClientInfor = () => (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{width: 64, height: 64, borderRadius: 32}} />
        <View>
          <View
            style={[
              styleText.h1,
              {height: 26, width: 200, marginBottom: 4},
            ]}></View>
          <View style={{height: 20, width: 150, marginBottom: 4}}></View>
          <View style={{height: 20, width: 150, marginBottom: 4}}></View>
          <View style={{height: 20, width: 150}}></View>
        </View>
        <View style={{width: 64, height: 64, borderRadius: 32}} />
      </View>
    </SkeletonPlaceholder>
  );

  renderInfoClient = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{flex: 1, paddingHorizontal: 4}}
        onPress={this.edit}>
        <Title style={[{color: '#ffff'}]}>
          {!this.props.loading &&
            this.props.primer_nombre +
              ' ' +
              this.props.segundo_nombre +
              ' ' +
              this.props.primer_apellido +
              ' ' +
              this.props.segundo_apellido}
        </Title>
        <Caption style={{color: '#ffff'}}>
          {this.props.numero_cedula || '...'}
        </Caption>
        <Caption style={{color: '#ffff'}}>
          {this.props.correo_electronico || '...'}
        </Caption>
        <Caption style={{color: '#ffff'}}>
          {this.props.numero_telefono || '...'}
        </Caption>
      </TouchableOpacity>
      <FAB
        size={64}
        icon="phone"
        style={{elevation: 0, borderColor: '#ffff', borderWidth: 1}}
        onPress={this.call}
      />
    </View>
  );

  render() {
    const nombre = `${this.props.primer_nombre} ${this.props.segundo_nombre} ${this.props.primer_apellido} ${this.props.segundo_apellido}`;
    return (
      <View style={styles.container}>
        <Navbar
          back
          title="Detalle cliente"
          right={
            <FAB
              style={{elevation: 0, backgroundColor: 'transparent'}}
              onPress={this.edit}
              icon="pencil"
            />
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
          <View style={{padding: 16}}>
            {!this.props.loading ? this.renderInfoClient() : null}
          </View>

          <View
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: '#eeeeee',
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Title style={{color: COLORS.PRIMARY_COLOR}}>
                Planes Adquiridos
              </Title>
              <FAB
                icon="plus"
                small
                onPress={() =>
                  this.props.navigation.push('Planes', {
                    cliente_id: this.props.id,
                    nombre_cliente: nombre,
                  })
                }
              />
            </View>
            <Card
              style={{borderRadius: 16, marginTop: 32, elevation: 0}}
              elevation={2}>
              <Card.Content>
                <FlatList
                  data={this.props.ordenes}
                  renderItem={this.renderProduct}
                  keyExtractor={(item) => item.id}
                />
              </Card.Content>
            </Card>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Title style={{color: COLORS.PRIMARY_COLOR}}>Agenda</Title>
              <FAB
                icon="calendar-plus"
                small
                onPress={() =>
                  this.props.navigation.push('TaskSave', {
                    cliente_id: this.props.route.params.id,
                  })
                }
              />
            </View>
            <Card
              style={{borderRadius: 16, marginTop: 32, elevation: 0}}
              elevation={2}>
              <Card.Content>
                <ClientAgenda {...this.props} />
                {/*<TaskList {...this.props} />*/}
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapToState = (state) => {
  return {
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
  };
};

export default connect(mapToState, mapToActions)(ClientProfile);
