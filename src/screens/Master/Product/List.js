import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
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
import {cargar} from '../../../redux/actions/Productos';
import {COLORS} from 'constants';

class ProductList extends React.Component {
  seleccionar = (item) => {
    this.props.navigation.push('ProductDetail', {
      cliente_id: this.props.route.params.cliente_id,
      producto_id: item.id,
      nombre_cliente: this.props.route.params.nombre_cliente,
      nombre_producto: item.titulo,
    });
  };

  componentDidMount() {
    this.props.cargar();
  }

  renderItem = ({item}) => (
    <TouchableHighlight
      style={styles.item}
      underlayColor={Colors.primary}
      onPress={() => this.seleccionar(item)}>
      <Card elevation={2}>
        <Card.Cover source={{uri: item.imagen}} />
        <Card.Content>
          <Card.Title title={item.titulo} />
        </Card.Content>
      </Card>
    </TouchableHighlight>
  );

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Listado de Productos</Text>
          <View></View>
        </View>

        <View style={{marginHorizontal: 16}}>
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
                      height: 50,
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
                  }}>
                  <Text style={{color: COLORS.PRIMARY_COLOR}}>2</Text>
                </View>
                <View>
                  <Text style={[styleText.h2, {marginTop: 0}]}>
                    Seleccione un producto
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <SafeAreaView style={styles.container}>
          <FlatList
            style={{paddingTop: 16, paddingHorizontal: 16}}
            data={this.props.listado}
            renderItem={this.renderItem}
            numColumns={2}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.props.cargando}
                onRefresh={this.props.cargar}
              />
            }
          />
        </SafeAreaView>
      </View>
    );
  }
}
const mapToState = (state) => {
  return {
    cargando: state.Productos.cargando,
    listado: state.Productos.listado,
    error: state.Productos.error,
  };
};
const mapToAction = (dispatch) => {
  return {
    cargar: () => {
      dispatch(cargar());
    },
  };
};
export default connect(mapToState, mapToAction)(ProductList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    margin: 4,
  },
  title: {
    fontSize: 32,
  },
});
