import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  Animated,
  Easing,
  StatusBar,
  View,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Alert,
  VirtualizedList,
  RefreshControl,
  SafeAreaView,
  TextInput,
} from 'react-native';

import InputText from 'components/InputText';

import {FAB} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {loadClients, trash} from 'redux/actions/Clients';
import {COLORS, CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL} from 'constants';
import Navbar from 'components/Navbar';
import ColorfullContainer from 'components/ColorfullContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLANCO,
  },
});

const ClienteListado = ({navigation, clients, load, trash, loading, route}) => {
  const [items, setItems] = useState([]);
  const [itemsOriginal, setItemsOriginal] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState('');
  const {seleccionar} = route.params;
  const getItem = (data, index) => {
    return items[index];
  };

  const getItemCount = () => {
    return items.length;
  };

  const Item = (item) => {
    const nombre = `${item.primer_nombre}${
      item.segundo_nombre ? ' ' + item.segundo_nombre : ''
    } ${item.primer_apellido}${
      item.segundo_apellido ? ' ' + item.segundo_apellido : ''
    }`;
    return (
      <View
        style={{
          marginHorizontal: MARGIN_HORIZONTAL,
          paddingVertical: MARGIN_VERTICAL,
          padding: 0,
          marginBottom: MARGIN_VERTICAL,
          backgroundColor: 'rgba(255,255,255,.7)',
          borderRadius: CURVA,
        }}>
        <Text
          style={{
            marginTop: MARGIN_VERTICAL,
            marginBottom: MARGIN_VERTICAL,
            color: COLORS.NEGRO,
            fontSize: 18,
            fontFamily: 'Mont-Regular',
          }}>
          {nombre}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <FAB
            icon="eye"
            small
            color={COLORS.BLANCO}
            style={{
              borderWidth: 0.2,
              backgroundColor: COLORS.VERDE,
              marginRight: 8,
            }}
            onPress={() => detail(item)}
          />
          <FAB
            icon="pencil"
            small
            color={COLORS.BLANCO}
            style={{
              borderWidth: 0.2,
              backgroundColor: COLORS.VERDE,
              marginRight: 8,
            }}
            onPress={() => edit(item.id, item)}
          />
          <FAB
            icon="phone"
            small
            color={COLORS.BLANCO}
            style={{
              borderWidth: 0.2,
              backgroundColor: COLORS.VERDE,
              marginRight: 8,
            }}
            onPress={() => call(item)}
          />
          {seleccionar ? (
            <TouchableOpacity
              onPress={() => seleccionar(item)}
              style={{
                padding: 8,
                justifyContent: 'center',
                backgroundColor: COLORS.PRIMARY_COLOR,
                borderRadius: CURVA,
              }}>
              <Text style={{color: '#ffff'}}>Asignar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const borrar = (item) => {
    Alert.alert('Se borrara el cliente ' + item.primer_nombre, '', [
      {
        text: 'Mantener',
        style: 'cancel',
      },
      {text: 'Borrar', onPress: () => trash(item.id)},
    ]);
  };

  const call = (item) => {
    let tel = item.numero_telefono.split(',')[0];
    Linking.openURL(
      Platform.OS === 'android' ? `tel:${tel}` : `telprompt:${tel}`,
    );
  };

  const detail = (item) => {
    requestAnimationFrame(() => {
      navigation.push('ClientProfile', {id: item.id});
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setItems(clients);
  }, [clients]);

  const changeSearchInput = (t) => {
    setValorBusqueda(t);
    if (t != '') {
      const valorBusqueda = t.toUpperCase();
      let datafiltrada = clients.filter(
        (item) =>
          item.primer_nombre.toUpperCase().includes(valorBusqueda) ||
          item.segundo_nombre.toUpperCase().includes(valorBusqueda) ||
          item.primer_apellido.toUpperCase().includes(valorBusqueda) ||
          item.segundo_apellido.toUpperCase().includes(valorBusqueda),
      );
      setItems(datafiltrada);
    } else if (t == '') {
      setItems(clients);
    }
  };

  const edit = (id, item) => {
    navigation.push('ClientSave', {id: id, item: item});
  };

  return (
    <ColorfullContainer style={styles.container}>
      <Navbar navigation={navigation} transparent back title="Clientes" />

      <View style={{marginHorizontal: MARGIN_HORIZONTAL}}>
        <InputText
          marginTop={1}
          placeholder={'Buscar'}
          onChangeText={(t) => changeSearchInput(t)}
          value={valorBusqueda}
        />
      </View>

      <VirtualizedList
        style={{flex: 1, marginTop: MARGIN_HORIZONTAL, overflow: 'visible'}}
        data={items}
        initialNumToRender={10}
        renderItem={({item}) => Item(item)}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      />

      <TouchableOpacity
        style={{
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.MORADO,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: CURVA,
          marginHorizontal: 16,
        }}
        onPress={() => navigation.push('ClientSave', {id: ''})}>
        <AntDesign name="plus" color={COLORS.BLANCO} />
        <Text style={{color: COLORS.BLANCO}}>Registrar un nuevo cliente</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.MORADO,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: CURVA,
          marginHorizontal: 16,
          marginVertical: 10,
        }}
        onPress={() => navigation.push('ContactToClient')}>
        <AntDesign name="user" color={COLORS.BLANCO} />
        <Text style={{color: COLORS.BLANCO}}>Importar un contacto</Text>
      </TouchableOpacity>
    </ColorfullContainer>
  );
};

const mapToState = (state) => {
  return {
    clients: state.Clients.items,
    error: state.Clients.error,
    loading: state.Clients.loading,
    success: state.Clients.success,
  };
};

const mapToActions = (dispatch) => {
  return {
    load: () => {
      dispatch(loadClients());
    },
    trash: (id) => {
      dispatch(trash(id));
    },
  };
};
export default connect(mapToState, mapToActions)(ClienteListado);
