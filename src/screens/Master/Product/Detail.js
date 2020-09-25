import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
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
} from 'react-native-paper';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ModalWebView from 'components/ModalWebView';
import {cargar} from '../../../redux/actions/ProductosTomar';
import {COLORS} from 'constants';

class ProductDetail extends React.Component {
  state = {
    ver_detalle: false,
  };
  componentDidMount() {
    this.props.cargar(this.props.route.params.producto_id);
  }

  detalle = (e) => {
    e.stopPropagation();
    this.setState({ver_detalle: true});
  };
  cerrarDetalle = () => {
    this.setState({ver_detalle: false});
  };

  tomar = (plan) => {
    this.props.navigation.push('Plan', {
      cliente_id: this.props.route.params.cliente_id,
      producto_id: this.props.route.params.producto_id,
      plan_id: plan.id,
      nombre_cliente: this.props.route.params.nombre_cliente,
      nombre_producto: this.props.route.params.nombre_producto,
      nombre_plan: plan.titulo,
    });
  };

  renderPlanes = () => {
    if (this.props.detalle.planes) {
      return this.props.detalle.planes.map((p) => {
        return (
          <Card
            style={{
              borderRadius: 16,
              marginTop: 8,
              backgroundColor: COLORS.SECONDARY_COLOR,
            }}
            elevation={1}>
            <Card.Content>
              <Subheading style={{color: Colors.white}}>{p.titulo}</Subheading>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: Colors.white,
                  flex: 1,
                }}>
                {p.precio}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button color="white" onPress={() => this.tomar(p)}>
                Tomar
              </Button>
            </Card.Actions>
          </Card>
        );
      });
    }
  };

  cargandoPlanes = () => {
    if (this.props.cargando) {
      return (
        <>
          <SkeletonPlaceholder>
            <View
              style={{
                width: '100%',
                height: 120,
                borderRadius: 16,
                marginTop: 8,
              }}></View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                width: '100%',
                height: 120,
                borderRadius: 16,
                marginTop: 8,
              }}></View>
          </SkeletonPlaceholder>
        </>
      );
    }
  };

  render() {
    const html = `
        <html lang='es'>
            <head>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
            </head>
            <body>
            ${this.props.detalle.informacion_producto}
            </body>
        </html>
        `;
    return (
      <View style={{flex: 1}}>
        <ModalWebView
          visible={this.state.ver_detalle}
          onClose={this.cerrarDetalle}
          html={html}
        />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Listado de Planes</Text>
          <FAB style={{opacity: 0}} />
        </View>
        <ScrollView>
          <View style={{flex: 1, padding: 16}}>
            <Card style={{borderRadius: 16, marginTop: 16}} elevation={0}>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => this.props.navigation.navigate('Clientes')}>
                <Card.Content style={{paddingTop: 16}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 2,
                        height: 150,
                        position: 'absolute',
                        backgroundColor: COLORS.PRIMARY_COLOR,
                        top: 0,
                        left: 15,
                      }}></View>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 8,
                        backgroundColor: COLORS.PRIMARY_COLOR,
                      }}>
                      <Text style={{color: 'white'}}>1</Text>
                    </View>
                    <View>
                      <Text style={[styleText.h2, {marginTop: 0}]}>
                        {this.props.route.params.nombre_cliente}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </TouchableHighlight>

              <Card.Content style={{marginTop: 16}}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => this.props.navigation.navigate('ProductList')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 8,
                        backgroundColor: COLORS.PRIMARY_COLOR,
                      }}>
                      <Text style={{color: 'white'}}>2</Text>
                    </View>
                    <View>
                      <Text style={[styleText.h2, {marginTop: 0}]}>
                        {this.props.route.params.nombre_producto}
                      </Text>
                      <Button onPress={this.detalle}>Detalles</Button>
                    </View>
                  </View>
                </TouchableHighlight>
              </Card.Content>

              <Card.Content style={{marginTop: 16}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: COLORS.PRIMARY_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8,
                      backgroundColor: 'white',
                    }}>
                    <Text style={{color: COLORS.PRIMARY_COLOR}}>2</Text>
                  </View>
                  <View>
                    <Text style={[styleText.h2, {marginTop: 0}]}>
                      Seleccione un plan
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {this.cargandoPlanes()}
            {this.renderPlanes()}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapToState = (state) => {
  return {
    cargando: state.ProductosTomar.cargando,
    detalle: state.ProductosTomar.detalle,
    error: state.ProductosTomar.error,
  };
};
const mapToAction = (dispatch) => {
  return {
    cargar: (producto_id) => {
      dispatch(cargar(producto_id));
    },
  };
};
export default connect(mapToState, mapToAction)(ProductDetail);
