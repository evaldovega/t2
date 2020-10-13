import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  VirtualizedList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import {
  Modal,
  Avatar,
  Title,
  Paragraph,
  Button,
  Searchbar,
  List,
  Provider,
  FAB,
  Card,
  Colors,
  Caption,
  Subheading,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Entypo';
import {styleHeader} from 'styles';
import {loadClients, trash} from 'redux/actions/Clients';
import {COLORS} from 'constants';

const genero = {
  M: require('utils/images/man.png'),
  F: require('utils/images/woman.png'),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
});

class Lead extends React.Component {
  state = {
    open_fab: false,
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
      <Card
        style={{
          marginVertical: 8,
          marginHorizontal: 16,
          borderRadius: 16,
          elevation: 0,
        }}
        elevation={1}>
        <Card.Content
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar.Image style={{marginRight: 8}} source={genero[item.genero]} />
          <View style={{flex: 1}}>
            <Subheading>{nombre}</Subheading>
            <Caption>{item.numero_telefono}</Caption>
          </View>
        </Card.Content>
        <Card.Actions style={{justifyContent: 'flex-end'}}>
          <Button
            icon="account-details"
            large
            onPress={() =>
              this.props.navigation.push('ClientProfile', {id: item.id})
            }>
            Detalles
          </Button>
          <Button
            icon="pencil"
            large
            onPress={() =>
              this.props.navigation.push('ClientSave', {id: item.id})
            }>
            Editar
          </Button>
          <Button
            icon="delete"
            color={Colors.red400}
            onPress={() => this.borrar(item)}>
            Borrar
          </Button>
        </Card.Actions>
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

        <SafeAreaView style={{flex: 1}}>
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
