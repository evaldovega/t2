import React from 'react';
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
import LottieView from 'lottie-react-native';
import InputText from 'components/InputText';

import {
  Avatar,
  Title,
  FAB,
  Card,
  Colors,
  Caption,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {styleHeader} from 'styles';
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

class ClienteListado extends React.Component {
  state = {
    open_fab: false,
    progress: new Animated.Value(0),
    mostrar_ayuda: false,
    items: [],
    itemsOriginal: [],
    valorBusqueda: '',
  };

  getItem = (data, index) => {
    return this.state.items[index];
  };

  getItemCount = () => {
    return this.state.items.length;
  };

  Item = (item) => {
    const nombre = `${item.primer_nombre} ${item.segundo_nombre} ${item.primer_apellido} ${item.segundo_apellido}`;
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
        <View
          style={{
            paddingVertical: MARGIN_VERTICAL,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FAB
            icon="phone"
            color={COLORS.BLANCO}
            style={{
              borderWidth: 0.2,
              backgroundColor: COLORS.VERDE,
            }}
            onPress={() => this.call(item)}
          />
          <TouchableOpacity
            style={{flex: 1, marginLeft: 16}}
            onPress={() => this.detail(item)}>
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
            <Text
              style={{
                color: COLORS.NEGRO_N1,
                fontFamily: 'Mont-Regular',
                fontSize: 12,
              }}>
              {item.numero_telefono}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  borrar = (item) => {
    Alert.alert('Se borrara el cliente ' + item.primer_nombre, '', [
      {
        text: 'Mantener',
        style: 'cancel',
      },
      {text: 'Borrar', onPress: () => this.props.trash(item.id)},
    ]);
  };

  call = (item) => {
    let tel = item.numero_telefono.split(',')[0];
    Linking.openURL(
      Platform.OS === 'android' ? `tel:${tel}` : `telprompt:${tel}`,
    );
  };

  detail = (item) => {
    requestAnimationFrame(() => {
      this.props.navigation.push('ClientProfile', {id: item.id});
    });
  };

  componentDidMount() {
    this.props.load();
    this.setState({items: this.props.items});
  }

  componentDidUpdate(prev) {
    if (this.props.error != prev.error && this.props.error != '') {
      Alert.alert('Algo anda mal', this.props.error);
    }
    if (prev.success != this.props.success && this.props.success != '') {
      Alert.alert('Buen trabajo', this.props.success);
    }

    if (
      prev.items.length == 0 &&
      this.props.items.length > 0 &&
      this.state.items.length == 0
    ) {
      this.setState({items: this.props.items});

      AsyncStorage.getItem('ayuda1').then((a) => {
        console.log('Storage ', a);
        if (!a) {
          this.setState({mostrar_ayuda: true});
          Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
          setTimeout(() => {
            this.setState({mostrar_ayuda: false});
          }, 5000);
          AsyncStorage.setItem('ayuda1', '1');
        }
      });
    }
  }

  changeSearchInput = (t) => {
    this.setState({valorBusqueda: t});

    if (t != '') {
      const valorBusqueda = t.toUpperCase();
      let datafiltrada = this.props.items.filter(
        (item) =>
          item.primer_nombre.toUpperCase().includes(valorBusqueda) ||
          item.segundo_nombre.toUpperCase().includes(valorBusqueda) ||
          item.primer_apellido.toUpperCase().includes(valorBusqueda) ||
          item.segundo_apellido.toUpperCase().includes(valorBusqueda),
      );

      this.setState({items: datafiltrada});
    } else if (t == '') {
      this.setState({items: this.props.items});
    }
  };

  render() {
    const {items} = this.state;

    return (
      <ColorfullContainer style={styles.container}>
        <Navbar transparent back title="Clientes" {...this.props} />

        <View style={{marginHorizontal: MARGIN_HORIZONTAL}}>
          <InputText
            marginTop={1}
            placeholder={'Buscar'}
            onChangeText={(t) => this.changeSearchInput(t)}
            value={this.state.valorBusqueda}
          />
        </View>

        <VirtualizedList
          style={{flex: 1, marginTop: MARGIN_HORIZONTAL, overflow: 'visible'}}
          data={items}
          initialNumToRender={10}
          renderItem={({item}) => this.Item(item)}
          keyExtractor={(item) => item.id}
          getItemCount={this.getItemCount}
          getItem={this.getItem}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this.props.load}
            />
          }
        />

        <View
          style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 8}}>
          <FAB
            onPress={() => this.props.navigation.push('ClientSave', {id: ''})}
            color={COLORS.SECONDARY_COLOR_LIGHTER}
            style={{
              backgroundColor: COLORS.BG_GRAY,
              borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
              borderWidth: 0.2,
              marginRight: 8,
            }}
            icon="plus"
          />
          <FAB
            onPress={() => this.props.navigation.push('ContactoAcliente')}
            color={COLORS.SECONDARY_COLOR_LIGHTER}
            style={{
              backgroundColor: COLORS.BG_GRAY,
              borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
              borderWidth: 0.2,
            }}
            icon="card-account-phone"
          />
        </View>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    items: state.Clients.items,
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
