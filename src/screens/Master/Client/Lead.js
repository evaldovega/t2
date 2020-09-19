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
} from 'react-native-paper';

import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Entypo';
import {styleHeader} from 'styles';

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
    return this.state.contacts_filter[index];
  };
  getItemCount = () => {
    return this.state.contacts_filter.length;
  };

  Item = ({foto, nombre, empresa}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}>
        <Avatar.Image source={{uri: foto}} style={{marginRight: 8}} />
        <View style={{flex: 1}}>
          <Title>{nombre}</Title>
          <Paragraph>
            {}
            {empresa}
          </Paragraph>
        </View>
      </View>
    );
  };

  onPressMenu = () => {
    this.props.navigation.openDrawer();
  };

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
          <TouchableOpacity
            style={styleHeader.btnRight}
            onPress={this.loadContacts}>
            <Icon name="v-card" color="white" size={24} />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{flex: 1}}>
          <VirtualizedList
            data={this.state.contacts_filter}
            initialNumToRender={10}
            renderItem={({item}) => this.Item(item)}
            keyExtractor={(item) => item.recordID}
            getItemCount={this.getItemCount}
            getItem={this.getItem}
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default connect()(Lead);
