import React from 'react';
import Contacts from 'react-native-contacts';
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
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
  Card,
  Avatar,
  Button,
  Searchbar,
  Caption,
  Title,
} from 'react-native-paper';

import {changeProp} from '../../../redux/actions/Clients';
import {connect} from 'react-redux';

class ContactToClient extends React.Component {
  state = {
    loading: false,
    contacts: [],
    contacts_filter: [],
    contact_q: '',
    visualizar_contacto: 0,
    mostrar_contactos: false,
    open_fab: false,
    open_client: false,
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
        this.setState({
          loading: false,
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
    if (this.state.contact_q.length < 2) {
      if (this.state.contacts.length == 0) {
        this.setState({contacts_filter: this.state.contacts});
      }
      return;
    }
    let filtered = this.state.contacts.filter((c) =>
      c.nombre
        .toUpperCase()
        .includes(this.state.contact_q.trim().toUpperCase()),
    );
    this.setState({contacts_filter: filtered});
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
    return this.state.contacts_filter.length;
  };

  add = (item) => {
    this.props.navigation.push('ClientSave', {id: '', item: item});
  };

  Item = (item) => {
    return (
      <Card onPress={() => this.add(item)}>
        <Card.Content>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image size={64} source={{uri: item.foto}} />
            <View style={{marginLeft: 16, flex: 1}}>
              <Title>{item.nombre}</Title>
              <Caption>
                {item.telefonos} {item.email}
              </Caption>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styleHeader.wrapper}>
          <TouchableOpacity
            style={styleHeader.btnLeft}
            onPress={() => this.props.navigation.pop()}>
            <Icon name="arrowleft" color="white" size={24} />
          </TouchableOpacity>
          <Text style={styleHeader.title}>
            Clientes Potenciales {this.props.cargando}
          </Text>
          <View></View>
        </View>
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
            style={{flex: 1}}
            data={this.state.contacts_filter}
            initialNumToRender={10}
            renderItem={({item}) => this.Item(item)}
            keyExtractor={(item) => item.recordID}
            getItemCount={this.getItemCount}
            getItem={this.getItem}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.state.loadContacts}
              />
            }
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
