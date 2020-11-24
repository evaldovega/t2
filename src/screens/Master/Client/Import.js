import React from 'react';
import Contacts from 'react-native-contacts';

import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  Alert,
  VirtualizedList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {styleHeader} from 'styles';
import {
  Colors,
  Card,
  Avatar,
  Button,
  Searchbar,
  Caption,
  Title,
} from 'react-native-paper';

import {changeProp} from '../../../redux/actions/Clients';
import {connect} from 'react-redux';
import Navbar from 'components/Navbar';

class PreventDoubleTap extends React.Component {
  disabled = false;
  onPress = (...args) => {
    if (this.disabled) return;
    this.disabled = true;
    console.log('Desactivar');
    this.props.navigation.push('ClientSave', {id: '', item: args[0]});
    setTimeout(() => {
      this.disabled = false;
    }, 2000);
    this.props.onPress && this.props.onPress(...args);
  };
}

class ContactToClient extends PreventDoubleTap {
  state = {
    loading: false,
    contacts: [],
    contacts_filter: [],
    total_elementos: 0,
    contact_q: '',
    visualizar_contacto: 0,
    mostrar_contactos: false,
    open_fab: false,
    open_client: false,
  };

  construct() {
    this.contatcs = [];
  }

  load = () => {
    this.setState({loading: true});
    Contacts.getAll((err, contacts) => {
      contacts = contacts.map((c, i) => {
        let nombre = c.givenName + ' ' + c.middleName + ' ' + c.familyName;
        let email =
          c.emailAddresses && c.emailAddresses.length > 0
            ? c.emailAddresses[0].email
            : '';
        return {
          recordID: c.recordID,
          nombre: nombre,
          primer_nombre: c.givenName,
          primer_apellido: c.middleName,
          segundo_apellido: c.familyName,
          foto: c.thumbnailPath,
          telefonos: c.phoneNumbers.map((t) => t.number).join(','),
          empresa: c.company,
          email: email,
        };
      });
      this.contacts = contacts;
      this.setState({
        loading: false,
        contact_q: '',
        contacts_filter: contacts,
        total_elementos: contacts.length,
        mostrar_contactos: true,
      });
    });
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
      this.load();
    } else {
      this.load();
    }
  };

  filterContacts = (q) => {
    this.setState({contact_q: q, contacts_filter: []});

    let filtered = this.contacts.filter((c) =>
      c.nombre
        .toUpperCase()
        .includes(this.state.contact_q.trim().toUpperCase()),
    );
    this.setState({
      contacts_filter: filtered,
      total_elementos: filtered.length,
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this.loadContacts();
    }, 800);
  }

  getItem = (data, index) => {
    return this.state.contacts_filter[index];
  };

  getItemCount = () => {
    return this.state.total_elementos;
  };

  Item = (item) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.primary}
        {...this.props}
        onPress={() => this.onPress(item)}>
        <Card>
          <Card.Content>
            <Title>{item.nombre}</Title>
            <Caption>
              {item.telefonos} {item.email}
            </Caption>
          </Card.Content>
        </Card>
      </TouchableHighlight>
    );
  };

  refresh() {
    return (
      <RefreshControl
        refreshing={this.state.loading}
        onRefresh={this.state.loadContacts}
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Navbar back title="Importat contacto" {...this.props} />
        {!this.state.loading && (
          <Searchbar
            style={{
              borderWidth: 0,
              elevation: 0,
              backgroundColor: 'transparent',
              color: 'white',
            }}
            placeholder="Buscar..."
            onChangeText={this.filterContacts}
            value={this.state.contact_q}
          />
        )}

        <SafeAreaView style={{flex: 1}}>
          <VirtualizedList
            maxToRenderPerBatch={7}
            windowSize={2}
            removeClippedSubviews={true}
            style={{flex: 1}}
            data={this.state.contacts_filter}
            initialNumToRender={10}
            renderItem={({item}) => this.Item(item)}
            keyExtractor={(item) => item.recordID}
            getItemCount={this.getItemCount}
            getItem={this.getItem}
            refreshControl={this.refresh()}
          />
        </SafeAreaView>
      </View>
    );
  }
}
const mapToActions = (dispatch) => {
  return {
    changeProp: (prop, value) => {
      dispatch(changeProp(prop, value));
    },
  };
};
export default connect(null, mapToActions)(ContactToClient);
