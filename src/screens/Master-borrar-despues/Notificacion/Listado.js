import React from 'react';
import ColorfullContainer from 'components/ColorfullContainer';
import NavBar from 'components/Navbar';
import {
  COLORS,
  SERVER_ADDRESS,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
  CURVA,
} from 'constants';
import {
  ScrollView,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';

class NotificacionListado extends React.Component {
  state = {
    loading: false,
    docs: [],
  };

  load = () => {
    this.setState({loading: true});
    fetch(SERVER_ADDRESS + 'api/notificaciones/', {
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Token ' + this.props.token,
      },
    })
      .then((r) => r.json())
      .then((docs) => {
        console.log(docs);
        this.setState({loading: false, docs: docs});
      })
      .catch((error) => {
        this.setState({loading: false});
      });
  };

  detail = (doc) => {
    switch (doc.related_object_type) {
      case 'ordenes':
        this.props.navigation.push('OrdenDetalle', {id: doc.related_object_id});
        break;
    }
  };

  componentDidMount() {
    this.load();
  }

  render() {
    const {docs, loading} = this.state;
    console.log(doc.length);
    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <NavBar back menu transparent title="Notificaciones" {...this.props} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.load()}
            />
          }>
          {!loading && docs.length == 0 ? (
            <Text>No hay notificaciones</Text>
          ) : null}
          {docs.map((doc) => (
            <TouchableOpacity
              onPress={() => this.detail(doc)}
              style={{
                marginHorizontal: MARGIN_HORIZONTAL,
                paddingVertical: MARGIN_VERTICAL,
                padding: 0,
                marginBottom: MARGIN_VERTICAL,
                backgroundColor: 'rgba(255,255,255,.7)',
                borderRadius: CURVA,
              }}>
              <View
                style={{
                  paddingVertical: MARGIN_VERTICAL,
                  paddingHorizontal: MARGIN_HORIZONTAL,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: 'Mont-Regular'}}>
                  {doc.contenido}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ColorfullContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    token: state.Usuario.token,
  };
};

export default connect(mapToState)(NotificacionListado);
