import React, {useState} from 'react';
import {Title, Paragraph, Button, Avatar} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import {Modal, View, Image, Text} from 'react-native';

class ModalCapacitarse extends React.Component {
  state = {mostrar: false};

  constructor(props) {
    super(props);
  }

  capacitarme = () => {
    this.setState({mostrar: false});
    setTimeout(() => {
      this.props.navigation.navigate('Capacitaciones');
    }, 100);
  };

  componentDidMount() {
    this.setState({mostrar: !this.props.habilitado});
  }

  componentDidUpdate(prev) {
    if (
      prev.habilitado != this.props.habilitado &&
      this.props.ready_validation
    ) {
      this.setState({mostrar: !this.props.habilitado});
    }
  }

  render() {
    let nombre = this.props.nombre;

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={this.props.visible}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,.6)',
            justifyContent: 'center',
            alignContent: 'center',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: '#ffff',
              borderRadius: 24,
              alignSelf: 'center',
              elevation: 3,
              width: '80%',
            }}>
            <View
              style={{
                padding: 64,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                elevation={2}
                source={require('utils/images/icon.png')}
                style={{
                  backgroundColor: '#ffff',
                  alignSelf: 'center',
                  width: 32,
                  height: 32,
                  marginBottom: 16,
                  resizeMode: 'contain',
                }}
              />
              <Title style={{textAlign: 'center', marginBottom: 20}}>
                ¡Hola, {nombre}!
              </Title>
              <Paragraph style={{textAlign: 'center'}}>
                Bienvenido(a) a Servi. Completa el entrenamiento para empezar a
                vender.
              </Paragraph>
              <LottieView
                autoPlay
                autoSize
                loop
                style={{width: '100%'}}
                source={require('animations/educacion.json')}
              />
              <Button onPress={this.capacitarme}>Continuar</Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalCapacitarse;
