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

class Lead extends React.Component {
  state = {
    open_fab: false,
    progress: new Animated.Value(0),
    mostrar_ayuda: false,
  };

  getItem = (data, index) => {
    return this.props.items[index];
  };

  getItemCount = () => {
    return this.props.items.length;
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
  }

  componentDidUpdate(prev) {
    if (this.props.error != prev.error && this.props.error != '') {
      Alert.alert('Algo anda mal', this.props.error);
    }
    if (prev.success != this.props.success && this.props.success != '') {
      Alert.alert('Buen trabajo', this.props.success);
    }

    if (prev.items.length == 0 && this.props.items.length > 0) {
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

  render() {
    return (
      <ColorfullContainer style={styles.container}>
        <Navbar transparent menu title="Clientes" {...this.props} />
        <View style={{paddingHorizontal: MARGIN_HORIZONTAL}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 16,
              borderWidth: 0.2,
              borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
              borderRadius: 24,
              padding: 12,
            }}>
            <EvilIcons
              name="search"
              color={COLORS.SECONDARY_COLOR_LIGHTER}
              size={32}
              style={{}}
            />
            <TextInput
              placeholder="Buscar cliente..."
              style={{
                flex: 1,
                color: COLORS.SECONDARY_COLOR_LIGHTER,
                padding: 0,
                margin: 0,
              }}
            />
          </View>
        </View>
        <VirtualizedList
          style={{flex: 1, overflow: 'visible'}}
          data={this.props.items}
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
export default connect(mapToState, mapToActions)(Lead);
