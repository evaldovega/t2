import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
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
} from 'react-native-paper';

import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Entypo';
import {styleHeader} from 'styles';
import {loadClients} from 'redux/actions/Clients';
import {Colors} from 'react-native/Libraries/NewAppScreen';
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
    contacts: [],
    contacts_filter: [],
    contact_q: '',
    visualizar_contacto: 0,
    mostrar_contactos: false,
    open_fab: false,
  };
  loadContacts = async () => {
    if (Platform.OS == 'android') {
      let p = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        },
      );
      if (p != 'granted') {
        Alert.alert('Algo anda mal', 'Permiso no concedido');
        return;
      }
      Contacts.getAll((err, contacts) => {
        contacts = contacts.map((c) => {
          return {
            recordID: c.recordID,
            nombre: c.givenName + ' ' + c.middleName,
            foto: c.thumbnailPath,
            telefonos: c.phoneNumbers,
            empresa: c.company,
          };
        });
        this.setState({
          contacts: contacts,
          contact_q: '',
          contacts_filter: contacts,
          mostrar_contactos: true,
        });
      });
    }
  };

  filterContacts = (q) => {
    this.setState({contact_q: q, contacts_filter: []});
    if (this.state.contact_q.length < 4) {
      return;
    }
    let filtered = this.state.contacts.filter((c) =>
      c.nombre.includes(this.state.contact_q),
    );
    this.setState({contacts_filter: filtered});
  };

  getItem = (data, index) => {
    return this.props.items[index];
  };
  getItemCount = () => {
    return this.props.items.length;
  };

  Item = (item) => {
    return (
      <Card
        style={{marginVertical: 8, marginHorizontal: 8, borderRadius: 16}}
        elevation={4}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Avatar.Image
              style={{marginRight: 8}}
              source={genero[item.genero]}
            />
            <View style={{flex: 1}}>
              <Title>
                {item.primer_nombre} {item.segundo_nombre}{' '}
                {item.primer_apellido} {item.segundo_apellido}
              </Title>
              <Paragraph></Paragraph>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={{justifyContent: 'flex-end'}}>
          <Button
            icon="pencil"
            large
            onPress={() =>
              this.props.navigation.push('ClientSave', {id: item.id})
            }>
            Editar
          </Button>
          <Button icon="delete" color={Colors.red100}>
            Borrar
          </Button>
        </Card.Actions>
      </Card>
    );
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
          <Text style={styleHeader.title}>
            Clientes Potenciales {this.props.cargando}
          </Text>
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
              onPress: () => this.props.navigation.push('ClientSave'),
            },
            {icon: 'application-import', onPress: () => this.loadContacts},
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
  };
};

const mapToActions = (dispatch) => {
  return {
    load: () => {
      dispatch(loadClients());
    },
  };
};
export default connect(mapToState, mapToActions)(Lead);
