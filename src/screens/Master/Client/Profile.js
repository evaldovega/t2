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
import {loadClient} from '../../../redux/actions/Clients';
const styles = StyleSheet.create({
  container: {flex: 1},
});

const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Plan superior',
    fecha: '2023-08-10',
    foto:
      'https://secureservercdn.net/198.71.233.109/1kf.e90.myftpupload.com/wp-content/uploads/2020/05/affection-1866868_1920-300x300.jpg',
  },
  {
    id: 2,
    nombre: 'Plan prevenir',
    fecha: '2022-08-10',
    foto:
      'https://secureservercdn.net/198.71.233.109/1kf.e90.myftpupload.com/wp-content/uploads/2020/05/familia_servi-300x267.jpeg',
  },
];

const VISITAS = [
  {
    id: 1,
    lugar: 'Plaza de la paz',
    fecha: '2020-11-01',
    des: 'Cerrar un nuevo plan',
  },
  {
    id: 2,
    lugar: 'Centtro comercial viva',
    fecha: '2020-12-30',
    des: 'Proponer ropa para los niños',
  },
];

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
        source={{uri: item.foto}}
        style={{width: 64, height: 64, borderRadius: 8, marginRight: 8}}
      />
      <View>
        <Subheading>{item.nombre}</Subheading>
        <Caption>Vence el {moment(item.fecha).format('lll')}</Caption>
      </View>
    </View>
  );

  renderVisit = ({item}) => (
    <View style={{flexDirection: 'row', marginTop: 8}}>
      <View
        style={{
          width: 64,
          height: 64,
          marginRight: 8,
          overflow: 'hidden',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.yellow100,
        }}>
        <View style={{width: '100%', backgroundColor: Colors.red400}}>
          <Subheading style={{color: Colors.white, textAlign: 'center'}}>
            {moment(item.fecha).format('MMM')}
          </Subheading>
        </View>
        <Title>{moment(item.fecha).format('DD')}</Title>
      </View>
      <View>
        <Subheading>{item.lugar}</Subheading>
        <Caption>{item.des}</Caption>
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
      <View>
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

            <Card style={{borderRadius: 16, marginTop: 32}} elevation={2}>
              <Card.Title
                title="Productos"
                subtitle="El cliente no ha adquirido ningún producto"></Card.Title>
              <Card.Content>
                <FlatList
                  data={PRODUCTOS}
                  renderItem={this.renderProduct}
                  keyExtractor={(item) => item.id}
                />
              </Card.Content>
              <Card.Actions style={{marginTop: 16}}>
                <Button
                  icon="plus"
                  onPress={() =>
                    this.props.navigation.push('ProductList', {
                      cliente_id: this.props.id,
                      nombre_cliente: nombre,
                    })
                  }>
                  {' '}
                  Añadir producto
                </Button>
              </Card.Actions>
            </Card>

            <Card style={{borderRadius: 16, marginTop: 32}} elevation={2}>
              <Card.Title title="Visitas" subtitle=""></Card.Title>
              <Card.Content>
                <FlatList
                  data={VISITAS}
                  renderItem={this.renderVisit}
                  keyExtractor={(item) => item.id}
                />
              </Card.Content>
              <Card.Actions style={{marginVertical: 32}}>
                <Button
                  icon="calendar-plus"
                  onPress={() =>
                    this.props.navigation.push('ProductList', {
                      cliente_id: this.props.id,
                    })
                  }>
                  {' '}
                  Programar Visita
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
    loading: state.Client.loading,
  };
};
const mapToActions = (dispatch) => {
  return {
    load: (id) => {
      dispatch(loadClient(id));
    },
  };
};

export default connect(mapToState, mapToActions)(ClientProfile);
