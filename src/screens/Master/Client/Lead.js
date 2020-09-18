import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
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
  state = {contacts: []};
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
            nombre: c.givenName,
          };
        });
        this.setState({contacts: contacts});
      });
    }
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
      </View>
    );
  }
}

export default connect()(Lead);
