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
import NumberFormat from 'react-number-format';
import Navbar from 'components/Navbar';
import GradientContainer from 'components/GradientContainer';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
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

  edit = () => {
    this.props.navigation.push('ClientSave', {id: this.props.id});
  };

  renderProduct = ({item}) => (
    <View style={{flexDirection: 'row', marginTop: 8}}>
      <Image
        source={{uri: item.imagen_producto}}
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          marginRight: 8,
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          borderWidth: 0.2,
        }}
      />
      <View style={{marginLeft: 8}}>
        <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>
          {item.producto}
        </Text>
        <Text style={{fontFamily: 'Roboto-Light', fontSize: 12}}>
          Nº {item.numero_orden}
        </Text>
        <NumberFormat
          value={item.precio_pagado}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
          renderText={(nf) => (
            <Text style={{fontFamily: 'Roboto-Light', fontSize: 12}}>{nf}</Text>
          )}
        />
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
        <Text
          style={[
            {
              color: COLORS.PRIMARY_COLOR,
              fontFamily: 'Roboto-Medium',
              fontSize: 18,
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
        <Caption style={{color: COLORS.DARK}}>
          {this.props.numero_cedula || '...'}
        </Caption>
        <Caption style={{color: COLORS.DARK}}>
          {this.props.correo_electronico || '...'}
        </Caption>
        <Caption style={{color: COLORS.DARK}}>
          {this.props.numero_telefono || '...'}
        </Caption>
      </TouchableOpacity>
      <FAB
        size={64}
        icon="phone"
        color={COLORS.SECONDARY_COLOR_LIGHTER}
        style={{
          elevation: 0,
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          backgroundColor: 'transparent',
          borderWidth: 0.2,
        }}
        onPress={this.call}
      />
    </View>
  );

  planes = () => {
    const nombre = `${this.props.primer_nombre} ${this.props.segundo_nombre} ${this.props.primer_apellido} ${this.props.segundo_apellido}`;
    requestAnimationFrame(() => {
      this.props.navigation.push('Planes', {
        cliente_id: this.props.id,
        nombre_cliente: nombre,
      });
    });
  };

  renderPlanes = () => {
    if (!this.props.loading) {
      if (this.props.ordenes.length > 0) {
        return (
          <React.Fragment>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.SECONDARY_COLOR_MUTED,
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  marginRight: 16,
                }}>
                Planes Adquiridos
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this.planes}>
                <EvilIcons name="cart" size={24} color={COLORS.PRIMARY_COLOR} />
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    color: COLORS.PRIMARY_COLOR,
                  }}>
                  Vender plan
                </Text>
              </TouchableOpacity>
            </View>
            <Card
              style={{
                borderRadius: 24,
                marginTop: 32,
                elevation: 0,
                borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                borderWidth: 0.2,
              }}
              elevation={2}>
              <Card.Content>
                <FlatList
                  data={this.props.ordenes}
                  renderItem={this.renderProduct}
                  keyExtractor={(item) => item.id}
                />
              </Card.Content>
            </Card>
          </React.Fragment>
        );
      } else {
        return (
          <View
            style={{backgroundColor: '#ffff', padding: 16, borderRadius: 16}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Thin',
                fontSize: 16,
              }}>
              No ha comprado ningún plan
            </Text>
            <Button icon="plus" onPress={this.planes}>
              Vender uno ahora
            </Button>
          </View>
        );
      }
    }
  };

  renderAgenda = () => {
    if (!this.props.loading) {
      return (
        <React.Fragment>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.SECONDARY_COLOR_MUTED,
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                marginRight: 16,
              }}>
              Agenda
            </Text>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() =>
                this.props.navigation.push('TaskSave', {
                  cliente_id: this.props.route.params.id,
                })
              }>
              <EvilIcons
                name="calendar"
                color={COLORS.PRIMARY_COLOR}
                size={24}
              />
              <Text
                style={{
                  color: COLORS.PRIMARY_COLOR,
                  fontFamily: 'Roboto-Medium',
                }}>
                Agendar cita
              </Text>
            </TouchableOpacity>
          </View>
          <Card
            style={{
              borderRadius: 24,
              marginTop: 32,
              elevation: 0,
              borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
              borderWidth: 0.2,
            }}
            elevation={2}>
            <Card.Content>
              <ClientAgenda {...this.props} />
            </Card.Content>
          </Card>
        </React.Fragment>
      );
    }
  };

  render() {
    const nombre = `${this.props.primer_nombre} ${this.props.segundo_nombre} ${this.props.primer_apellido} ${this.props.segundo_apellido}`;
    return (
      <GradientContainer style={styles.container}>
        <Navbar
          back
          title="Detalle cliente"
          right={
            <TouchableOpacity
              onPress={this.edit}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SimpleLineIcons color="#ffff" name="pencil" />
              <Text
                style={{
                  marginLeft: 4,
                  color: '#ffff',
                  fontFamily: 'Roboto-Thint',
                }}>
                Editar
              </Text>
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
          <View style={{padding: 16, minHeight: 150}}>
            {!this.props.loading ? this.renderInfoClient() : null}
          </View>

          <View
            style={{
              flex: 1,
              padding: 16,
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
            }}>
            {this.renderPlanes()}
            {this.renderAgenda()}
          </View>
        </ScrollView>
      </GradientContainer>
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
