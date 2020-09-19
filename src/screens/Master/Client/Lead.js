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
            idRecord: c.recordID,
            nombre: c.givenName + ' ' + c.middleName,
            foto: c.thumbnailPath,
            telefonos: c.phoneNumbers,
            empresa: c.company,
          };
        });
        this.setState({
          contacts: contacts,
          contact_q: '',
          contacts_filter: [],
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
  renderContacto = () => {
    if (this.state.contacts.length == 0) {
      return;
    }
    const contact = this.state.contacts[this.state.visualizar_contacto];
    return (
      <View
        style={{
          margin: 32,
          borderRadius: 32,
          paddingBottom: 32,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}>
        <Searchbar
          placeholder="Buscar..."
          style={{elevation: 0}}
          value={this.state.contact_q}
          onChangeText={this.filterContacts}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{maxHeight: 400}}>
          <View style={{padding: 32}}>
            {this.state.contacts_filter.map((c) => {
              return (
                <List.Item
                  title={c.nombre}
                  left={(props) => (
                    <Avatar.Image {...props} source={{uri: c.foto}} />
                  )}
                  description={c.empresa}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Modal
          style={{flex: 1}}
          visible={this.state.mostrar_contactos}
          onDismiss={() => {
            this.setState({mostrar_contactos: false});
          }}>
          {this.renderContacto()}
        </Modal>
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
      </View>
    );
  }
}

export default connect()(Lead);
