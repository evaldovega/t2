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
import {loadClient, taskRemove} from '../../../redux/actions/Clients';
import {COLORS} from 'constants';
import TaskList from '../Task/List';

const styles = StyleSheet.create({
  container: {flex: 1},
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
      <Avatar.Image
        size={64}
        source={{
          uri:
            'https://mk0careergirlda22ty0.kinstacdn.com/wp-content/uploads/2018/11/Victoria-Beckham-1.jpg',
        }}
      />
      <View style={{flex: 1, paddingHorizontal: 4}}>
        <Text
          style={[styleText.h1, {textAlign: 'center', color: Colors.primary}]}>
          {!this.props.loading &&
            this.props.primer_nombre +
              ' ' +
              this.props.segundo_nombre +
              ' ' +
              this.props.primer_apellido +
              ' ' +
              this.props.segundo_apellido}
        </Text>
        <Caption style={{color: Colors.primary}}>
          {this.props.numero_cedula || '...'}
        </Caption>
        <Caption>{this.props.correo_electronico || '...'}</Caption>
        <Caption>{this.props.numero_telefono || '...'}</Caption>
      </View>
      <FAB size={64} icon="phone" onPress={this.call} />
    </View>
  );

  render() {
    const nombre = `${this.props.primer_nombre} ${this.props.segundo_nombre} ${this.props.primer_apellido} ${this.props.segundo_apellido}`;
    return (
      <View style={styles.container}>
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Detalle Cliente</Text>
          <View></View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={() => this.props.load(this.props.route.params.id)}
            />
          }>
          <View style={{flex: 1, margin: 16}}>
            {this.props.loading && this.renderLoadingClientInfor()}

            {!this.props.loading ? this.renderInfoClient() : null}

            <Card
              style={{borderRadius: 16, marginTop: 32, elevation: 0}}
              elevation={2}>
              <Card.Title
                title="Planes Adquiridos"
                subtitle={
                  this.props.ordenes.length == 0 &&
                  'El cliente no ha adquirido ningún plan'
                }></Card.Title>
              <Card.Content>
                <FlatList
                  data={this.props.ordenes}
                  renderItem={this.renderProduct}
                  keyExtractor={(item) => item.id}
                />
              </Card.Content>
              <Card.Actions style={{marginTop: 16}}>
                <Button
                  icon="plus"
                  onPress={() =>
                    this.props.navigation.push('Planes', {
                      cliente_id: this.props.id,
                      nombre_cliente: nombre,
                    })
                  }>
                  {' '}
                  Añadir plan
                </Button>
              </Card.Actions>
            </Card>

            <Card
              style={{borderRadius: 16, marginTop: 32, elevation: 0}}
              elevation={2}>
              <Card.Title title="Tareas" subtitle=""></Card.Title>
              <Card.Content>
                <TaskList {...this.props} />
              </Card.Content>
              <Card.Actions style={{marginVertical: 32}}>
                <Button
                  icon="calendar-plus"
                  onPress={() =>
                    this.props.navigation.push('TaskSave', {
                      cliente_id: this.props.route.params.id,
                    })
                  }>
                  {' '}
                  Programar Tarea
                </Button>
              </Card.Actions>
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
