import React from 'react';
import {styleHeader} from 'styles';
import {COLORS, SERVER_ADDRESS} from 'constants';
import {connect} from 'react-redux';
import {View, Text, Alert} from 'react-native';

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
import {ScrollView} from 'react-native-gesture-handler';

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
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Seleccione un Plan</Text>
          <FAB style={{opacity: 0}} />
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {this.state.docs.map((i, k) => {
            return (
              <List.Item
                key={k}
                onPress={() => this.seleccionar(i)}
                title={i.name}
                description={i.price}
                left={(props) => <List.Icon {...props} icon="folder" />}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
              />
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
