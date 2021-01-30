import React, {useEffect} from 'react';
import ColorfullContainer from 'components/ColorfullContainer';
import Navbar from 'components/Navbar';
import {connect} from 'react-redux';
import {loadClients} from 'redux/actions/Clients';
import {
  RefreshControl,
  VirtualizedList,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {COLORS, CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL} from 'constants';
import {Avatar} from 'react-native-paper';

const ClienteSelector = ({navigation, route, items, load, loading}) => {
  const {seleccionar} = route.params;

  useEffect(() => {
    if (items.length == 0) {
      load();
    }
  }, []);

  const getItem = (data, index) => {
    return items[index];
  };

  const getItemCount = () => {
    return items.length;
  };

  const Item = (item) => {
    const nombre = `${item.primer_nombre} ${item.segundo_nombre} ${item.primer_apellido} ${item.segundo_apellido}`;
    return (
      <View
        style={{
          marginHorizontal: MARGIN_HORIZONTAL,
          paddingVertical: MARGIN_VERTICAL,
          padding: 8,
          marginBottom: MARGIN_VERTICAL,
          borderRadius: CURVA,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            seleccionar(item);
            navigation.pop();
          }}>
          <Avatar.Image size={32} />
          <Text
            style={{
              flex: 1,
              marginLeft: 16,
              color: COLORS.NEGRO,
              fontSize: 16,
              fontFamily: 'Mont-Regular',
            }}>
            {nombre}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ColorfullContainer style={{flex: 1}}>
      <Navbar
        back
        transparent
        navigation={navigation}
        right={<></>}
        title="Seleccione un cliente"
      />
      <VirtualizedList
        style={{flex: 1, overflow: 'visible'}}
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
    </ColorfullContainer>
  );
};

const mapToState = (state) => {
  return {
    items: state.Clients.items,
    error: state.Clients.error,
    loading: state.Clients.loading,
  };
};

const mapToActions = (dispatch) => {
  return {
    load: () => {
      dispatch(loadClients());
    },
  };
};

export default connect(mapToState, mapToActions)(ClienteSelector);
