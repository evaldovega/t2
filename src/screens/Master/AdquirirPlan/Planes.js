import React from 'react';
import {COLORS, SERVER_ADDRESS} from 'constants';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import NumberFormat from 'react-number-format';
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
import ModalWebView from 'components/ModalWebView';
import Navbar from 'components/Navbar';
import GradientContainer from 'components/GradientContainer';

class Planes extends React.Component {
  state = {
    cargando: false,
    docs: [],
    modal_show: false,
    doc: {},
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
    this.setState({modal_show: true, doc: i});
    return;
  };

  adquirir = () => {
    console.log('ADQUIRIR');
    this.setState({modal_show: false});
    this.props.navigation.push('AdquirirPlan', {
      ...this.state.doc,
      cliente: this.props.route.params.cliente_id,
    });
  };

  onCLose = () => {
    this.setState({modal_show: false});
  };

  render() {
    return (
      <GradientContainer style={{flex: 1}}>
        <Navbar back title="Seleccione un Plan" {...this.props} />
        <ModalWebView
          html={this.state.doc.informacion}
          visible={this.state.modal_show}
          onClose={this.onCLose}
          footer={
            <TouchableOpacity
              mode="contained"
              style={{
                backgroundColor: COLORS.PRIMARY_COLOR,
                padding: 24,
                borderRadius: 24,
                alignSelf: 'flex-end',
              }}
              onPress={() => this.adquirir()}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  color: '#ffff',
                  fontSize: 18,
                }}>
                Crear Orden
              </Text>
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.docs.map((i, k) => {
            return (
              <TouchableOpacity
                key={k}
                onPress={() => this.seleccionar(i)}
                style={{
                  borderRadius: 24,
                  backgroundColor: COLORS.BG_BLUE,
                  marginTop: 16,
                  marginHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  elevation: 0,
                  borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                  borderWidth: 0.2,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={{uri: i.imagen}}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      overflow: 'hidden',
                      borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
                      borderWidth: 0.2,
                    }}
                  />
                  <View style={{flex: 1, marginLeft: 16}}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.DARK,
                        fontFamily: 'Roboto-Medium',
                      }}>
                      {i.titulo}
                    </Text>
                    <NumberFormat
                      value={i.precio}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'$'}
                      renderText={(nf) => (
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Roboto-Light',
                            color: COLORS.PRIMARY_COLOR,
                          }}>
                          {nf}
                        </Text>
                      )}
                    />
                  </View>
                  <Icon
                    name="arrowright"
                    size={32}
                    color={COLORS.PRIMARY_COLOR}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{height: 30}}></View>
        </ScrollView>
      </GradientContainer>
    );
  }
}

const mapearEstado = (state) => {
  return {
    token: state.Usuario.token,
  };
};

export default connect(mapearEstado, null)(Planes);
