import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  VirtualizedList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Navbar from 'components/Navbar';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ColorfullContainer from 'components/ColorfullContainer';
import {connect} from 'react-redux';
import {getSharedPreference} from 'utils/SharedPreference';
import {fetchConfig} from 'utils/Fetch';
const Negocios = ({navigation, route, user}) => {
  const [loading, setLoading] = useState(false);
  const [orders, setorders] = useState([]);

  const {params = {}} = route;
  const {forceReload = false} = params;

  const load = async () => {
    setLoading(true);

    fetchConfig().then((config) => {
      const {url, headers} = config;
      console.log(`${url}ordenes/?v=${user.userId}`);
      fetch(`${url}ordenes/?v=${user.userId}`, {headers})
        .then((r) => r.json())
        .then((data) => {
          setLoading(false);

          setorders(data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    });
  };

  const getItem = (data, index) => {
    return orders[index];
  };

  const getItemCount = () => {
    return orders.length;
  };

  const Item = (item) => (
    <TouchableOpacity
      onPress={() => navigation.push('NegocioDetalle', {id: item.id})}>
      <View
        style={{
          marginTop: MARGIN_VERTICAL,
          backgroundColor: '#ffff',
          padding: 16,
          marginHorizontal: MARGIN_HORIZONTAL,
          borderRadius: CURVA,
        }}>
        <Text style={{marginBottom: 16, fontWeight: 'bold'}}>
          {item.plan_str}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text>Orden: {item.numero_orden}</Text>
          <Text
            style={{
              color: '#ffff',
              backgroundColor: COLORS.ACCENT,
              padding: 8,
              borderRadius: 8,
            }}>
            {item.estado_orden_str}
          </Text>
        </View>

        <Text>Cliente {item.cliente_str}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (forceReload) {
      load();
    }
  }, [forceReload]);

  return (
    <ColorfullContainer style={{flex: 1, background: '#fff'}}>
      <Navbar transparent title="Negocios" navigation={navigation} />
      <VirtualizedList
        style={{flex: 1, overflow: 'visible'}}
        data={orders}
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
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.MORADO,
          borderRadius: CURVA,
          padding: 16,
          margin: 16,
        }}
        onPress={() =>
          navigation.push('Planes', {
            cliente_id: null,
          })
        }>
        <AntDesign name="plus" size={16} color={COLORS.BLANCO} />
        <Text style={{color: COLORS.BLANCO, fontWeight: 'bold'}}>
          Crear nuevo negocio
        </Text>
      </TouchableOpacity>
    </ColorfullContainer>
  );
};
const mapToState = (state) => {
  return {
    user: state.Usuario,
  };
};
export default connect(mapToState)(Negocios);
