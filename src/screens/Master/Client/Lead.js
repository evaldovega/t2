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

import Icon from 'react-native-vector-icons/Entypo';
import {styleHeader} from 'styles';
import {loadClients, trash} from 'redux/actions/Clients';
import Swipeout from 'react-native-swipeout';
import {COLORS} from 'constants';

const genero = {
  M: require('utils/images/man.png'),
  F: require('utils/images/woman.png'),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey100,
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
    const acciones = [
      {
        onPress: () => {
          this.props.navigation.push('ClientSave', {id: item.id});
        },
        text: 'Editar',
        color: COLORS.PRIMARY_COLOR,
        backgroundColor: Colors.grey100,
        component: (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FAB icon="pencil" />
          </View>
        ),
      },
      {
        onPress: () => {
          this.props.navigation.push('ClientProfile', {id: item.id});
        },
        backgroundColor: Colors.grey100,
        text: 'Detalles',
        component: (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FAB icon="account-details" />
          </View>
        ),
      },
      {
        onPress: () => {
          let tel = item.numero_telefono.split(',')[0];
          Linking.openURL(
            Platform.OS === 'android' ? `tel:${tel}` : `telprompt:${tel}`,
          );
        },
        disabled: item.numero_telefono == '',
        text: 'Llamar',
        backgroundColor: Colors.grey100,
        color: '#ffff',
        component: (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FAB icon="phone" />
          </View>
        ),
      },
      {
        onPress: () => {
          this.borrar(item);
        },
        text: 'Borrar',
        backgroundColor: Colors.grey100,
        component: (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FAB
              color="#ffff"
              style={{backgroundColor: Colors.red400}}
              icon="delete"
            />
          </View>
        ),
      },
    ];

    const nombre = `${item.primer_nombre} ${item.segundo_nombre} ${item.primer_apellido} ${item.segundo_apellido}`;
    return (
      <Card
        style={{
          marginHorizontal: 16,
          borderRadius: 8,
          elevation: 1,
          overflow: 'hidden',
          padding: 0,
          marginBottom: 8,
        }}
        elevation={1}>
        <Swipeout
          backgroundColor="transparent"
          right={acciones}
          autoClose={true}>
          <Card.Content
            style={{
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Avatar.Image
              style={{marginRight: 16}}
              source={genero[item.genero]}
            />
            <View style={{flex: 1}}>
              <Title>{nombre}</Title>
              <Caption style={{color: COLORS.PRIMARY_COLOR}}>
                {item.numero_telefono}
              </Caption>
            </View>
          </Card.Content>
        </Swipeout>
      </Card>
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

  toggleFab = ({open}) => this.setState({open_fab: open});

  onPressMenu = () => {
    this.props.navigation.openDrawer();
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
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <View style={styleHeader.wrapper}>
          <TouchableOpacity
            style={styleHeader.btnLeft}
            onPress={this.onPressMenu}>
            <Icon name="menu" color="white" size={24} />
          </TouchableOpacity>
          <Text style={styleHeader.title}>Clientes</Text>
          <View></View>
        </View>

        <SafeAreaView style={{flex: 1, marginTop: 8}}>
          <VirtualizedList
            style={{flex: 1}}
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
        </SafeAreaView>

        {this.state.mostrar_ayuda && (
          <LottieView
            style={{width: '100%'}}
            source={require('../../../animations/swipe.json')}
            progress={this.state.progress}
            style={styles.sliderImage}
          />
        )}

        <FAB.Group
          open={this.state.open_fab}
          onStateChange={this.toggleFab}
          icon={this.state.open_fab ? 'minus' : 'plus'}
          actions={[
            {
              icon: 'account-plus',
              onPress: () => this.props.navigation.push('ClientSave', {id: ''}),
            },
            {
              icon: 'card-account-phone',
              onPress: () => this.props.navigation.push('ContactoAcliente'),
            },
          ]}></FAB.Group>
      </View>
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
