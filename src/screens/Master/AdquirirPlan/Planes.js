import React from 'react';
import {styleHeader} from 'styles';
import {COLORS, SERVER_ADDRESS} from 'constants';
import {connect} from 'react-redux';
import {View, Text, Alert, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  FAB,
  Avatar,
  Title,
  Colors,
  Caption,
  Subheading,
  Card,
  Button,
  Paragraph,
  List,
} from 'react-native-paper';

import Navbar from 'components/Navbar';

class Planes extends React.Component {
  state = {
    cargando: false,
    docs: [],
  };

  componentDidMount() {
    this.setState({cargando: true});
    fetch(SERVER_ADDRESS + 'api/planes/', {
      headers: {
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        this.setState({docs: r});
        this.setState({cargando: false});
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('No se pudó cargar los planes', error);
        this.props.navigation.pop();
      });
  }

  seleccionar = (i) => {
    console.log(i);
    this.props.navigation.push('AdquirirPlan', {
      ...i,
      cliente: this.props.route.params.cliente_id,
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Navbar back title="Seleccione un Plan" {...this.props} />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {this.state.docs.map((i, k) => {
            return (
              <TouchableOpacity
                key={k}
                onPress={() => this.seleccionar(i)}
                style={{
                  borderRadius: 24,
                  backgroundColor: '#ffff',
                  marginTop: 8,
                  marginHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                }}>
                <View style={{flex: 1}}>
                  <Title>{i.titulo}</Title>
                  <Paragraph>{i.precio}</Paragraph>
                </View>
                <Icon
                  name="arrowright"
                  size={32}
                  color={COLORS.PRIMARY_COLOR}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const mapearEstado = (state) => {
  return {
    token: state.Usuario.token,
  };
};

export default connect(mapearEstado, null)(Planes);
