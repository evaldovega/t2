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
  TextInput,
  Alert,
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
  Checkbox,
  Divider,
} from 'react-native-paper';
import {
  styleHeader,
  styleInput,
  styleButton,
  styleText,
  checkbox,
} from 'styles';
import Loader from 'components/Loader';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ModalWebView from 'components/ModalWebView';
import {
  setMetaData,
  cargarFormulario,
} from '../../../redux/actions/ProductosTomar';
import {addOrden} from '../../../redux/actions/Clients';

import {COLORS} from 'constants';
import {Token} from 'redux/Utils';
import {SERVER_ADDRESS} from 'constants';

class Plan extends React.Component {
  state = {
    guardando: false,
    formulario_producto: [],
    formulario_plan: [],
  };

  handle_formulario_producto = (formulario_id, step, pregunta, valor) => {
    const formulario = this.state[step];
    let ref = formulario.find(
      (p) => p.pregunta == pregunta && p.formulario == formulario_id,
    );
    if (ref) {
      ref.respuesta = valor;
    }
    if (!ref) {
      formulario.push({
        pregunta: pregunta,
        formulario: formulario_id,
        respuesta: valor,
      });
    }
    this.setState({
      [step]: formulario,
    });
    console.log(formulario);
  };

  getValue = (formulario_id, step, pregunta) => {
    let ref = this.state[step].find(
      (p) => p.pregunta == pregunta && p.formulario == formulario_id,
    );
    return ref ? ref.respuesta : '';
  };
  componentDidMount() {
    this.props.setMetaData(
      this.props.route.params.cliente_id,
      this.props.route.params.producto_id,
      this.props.route.params.plan_id,
    );
    this.props.cargarFormulario(
      this.props.route.params.producto_id,
      this.props.route.params.plan_id,
    );
  }
  componentDidUpdate() {}

  renderInput = (formulario_id, step, pregunta, tipo) => {
    if (tipo != 'input') {
      return;
    }
    return (
      <View style={styleInput.wrapper}>
        <TextInput
          style={styleInput.input}
          returnKeyType="next"
          value={this.getValue(formulario_id, step, pregunta)}
          onChangeText={(t) =>
            this.handle_formulario_producto(formulario_id, step, pregunta, t)
          }
        />
      </View>
    );
  };
  renderInputNumber = (formulario_id, step, pregunta, tipo) => {
    if (tipo != 'inputnumber') {
      return;
    }
    return (
      <View style={styleInput.wrapper}>
        <TextInput
          style={styleInput.input}
          returnKeyType="next"
          keyboardType="decimal-pad"
          value={this.getValue(formulario_id, step, pregunta)}
          onChangeText={(t) =>
            this.handle_formulario_producto(formulario_id, step, pregunta, t)
          }
        />
      </View>
    );
  };
  renderChoices = (formulario_id, step, pregunta, tipo, opciones) => {
    if (tipo != 'radiochoices') {
      return;
    }
    return opciones.map((o, k) => {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() =>
            this.handle_formulario_producto(formulario_id, step, pregunta, o.id)
          }>
          <View style={checkbox.wrapper}>
            <Checkbox
              status={
                this.getValue(formulario_id, step, pregunta) == o.id
                  ? 'checked'
                  : 'unchecked'
              }
              color={COLORS.PRIMARY_COLOR}></Checkbox>
            <Text style={[styleText.h3, {flex: 1, marginTop: 0}]}>
              {o.opcion}
            </Text>
          </View>
        </TouchableHighlight>
      );
    });
  };

  renderFormulario = (step) => {
    if (this.props[step] && this.props[step].preguntas) {
      return this.props[step].preguntas.map((p, k) => {
        return (
          <View key={100 + k} style={{marginTop: 8}}>
            <Text style={[styleText.h3, {marginBottom: 16, marginLeft: 16}]}>
              {p.pregunta}
            </Text>
            {this.renderInput(this.props[step].id, step, p.id, p.tipo_pregunta)}
            {this.renderInputNumber(
              this.props[step].id,
              step,
              p.id,
              p.tipo_pregunta,
            )}
            {this.renderChoices(
              this.props[step].id,
              step,
              p.id,
              p.tipo_pregunta,
              p.opciones,
            )}
          </View>
        );
      });
    }
  };

  cargandoFormulario = () => {
    if (this.props.cargando) {
      return (
        <>
          <SkeletonPlaceholder>
            <View
              style={{
                width: '100%',
                height: 30,
                borderRadius: 16,
                marginTop: 8,
              }}></View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                width: '80%',
                height: 30,
                borderRadius: 16,
                marginTop: 8,
              }}></View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              marginTop={8}
              marginBottom={8}
              flexDirection="row"
              alignItems="center">
              <SkeletonPlaceholder.Item
                width={40}
                height={30}
                borderRadius={50}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={30}
                borderRadius={50}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </>
      );
    }
  };

  guardar = async () => {
    console.log(
      this.state.formulario_producto.length,
      this.props.formulario_producto.preguntas.length,
    );

    if (
      this.state.formulario_producto.length <
      this.props.formulario_producto.preguntas.length
    ) {
      Alert.alert(
        'Información de producto incompleta',
        'Por favor diligenciar todos los campos',
      );
      return;
    }
    if (
      this.state.formulario_plan.length <
      this.props.formulario_plan.preguntas.length
    ) {
      Alert.alert(
        'Información de plan incompleta',
        'Por favor diligenciar todos los campos',
      );
    }
    let i = this.state.formulario_producto.find((p) => p.respuesta == '');
    if (i) {
      Alert.alert(
        'Hay alguno campos vacios',
        'Por favor diligenciar todos los campos del producto',
      );
      return;
    }
    i = this.state.formulario_plan.find((p) => p.respuesta == '');
    if (i) {
      Alert.alert(
        'Hay alguno campos vacios',
        'Por favor diligenciar todos los campos del plan',
      );
      return;
    }
    this.setState({guardando: true});
    const token = await Token();
    console.log(token);
    const data = {
      plan: this.props.route.params.plan_id,
      cliente: this.props.route.params.cliente_id,
      form_producto: this.state.formulario_producto,
      form_plan: this.state.formulario_plan,
    };
    fetch(
      SERVER_ADDRESS +
        'api/productos/' +
        this.props.route.params.producto_id +
        '/registrar/',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'Token ' + token,
        },
      },
    )
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        this.setState({guardando: false});
        this.props.addOrden(r);
        this.props.navigation.navigate('ClientProfile', {
          orden: r.numero_orden,
        });
      })
      .catch((error) => {
        this.setState({guardando: false});
        Alert.alert('Algo anda mal', error.toString());
      });
  };
  cerrar = () => {
    this.setState({guardando: false});
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <Loader loading={this.state.guardando} onClose={this.cerrar} />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Completar Compra</Text>
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
                        height: 200,
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

              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => this.props.navigation.navigate('ProductList')}>
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
                    </View>
                  </View>
                </Card.Content>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => this.props.navigation.navigate('ProductDetail')}>
                <Card.Content style={{marginTop: 16, paddingBottom: 16}}>
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
                      <Text style={{color: 'white'}}>3</Text>
                    </View>
                    <View>
                      <Text style={[styleText.h2, {marginTop: 0}]}>
                        {this.props.route.params.nombre_plan}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </TouchableHighlight>
            </Card>

            <Card style={{borderRadius: 16, marginTop: 32}} elevation={4}>
              <Card.Content style={{}}>
                <View
                  style={{
                    position: 'relative',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingBottom: 16,
                  }}>
                  <View
                    style={{
                      width: 2,
                      height: 32,
                      position: 'absolute',
                      backgroundColor: COLORS.PRIMARY_COLOR,
                      top: -32,
                      left: 15,
                    }}></View>
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
                    }}>
                    <Text style={{color: COLORS.PRIMARY_COLOR}}>4</Text>
                  </View>
                  <View>
                    <Text style={[styleText.h2, {marginTop: 0}]}>
                      Completa los datos
                    </Text>
                  </View>
                </View>

                {this.renderFormulario('formulario_producto')}
                {this.cargandoFormulario()}
              </Card.Content>
              <Divider />
              <Card.Content>
                {this.renderFormulario('formulario_plan')}
              </Card.Content>
              <Divider style={{marginVertical: 16}} />
              <Card.Content>
                {!this.props.cargando && (
                  <TouchableHighlight
                    style={styleButton.wrapper}
                    onPress={this.guardar}>
                    <Text style={styleButton.text}>Guardar</Text>
                  </TouchableHighlight>
                )}
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapToState = (state) => {
  return {
    cargando: state.ProductosTomar.cargando,
    formulario_producto: state.ProductosTomar.formulario_producto,
    formulario_plan: state.ProductosTomar.formulario_plan,
    error: state.ProductosTomar.error,
  };
};
const mapToAction = (dispatch) => {
  return {
    setMetaData: (cliente_id, producto_id, plan_id) => {
      dispatch(setMetaData(cliente_id, producto_id, plan_id));
    },
    cargarFormulario: (producto_id, plan_id) => {
      dispatch(cargarFormulario(producto_id, plan_id));
    },
    addOrden: (orden) => {
      dispatch(addOrden(orden));
    },
  };
};

export default connect(mapToState, mapToAction)(Plan);
