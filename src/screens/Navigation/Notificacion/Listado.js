import React from 'react';
import ColorfullContainer from 'components/ColorfullContainer';
import NavBar from 'components/Navbar';
import moment from 'moment';
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
import {SimpleLineIcons} from 'react-native-vector-icons/SimpleLineIcons';

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
        this.props.navigation.push('NegocioDetalle', {
          id: doc.related_object_id,
        });
        break;
    }
  };

  componentDidMount() {
    this.load();
  }

  render() {
    const {docs, loading} = this.state;

    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <NavBar back transparent title="Notificaciones" {...this.props} />
        {!loading && docs.length == 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, textAlign: 'center'}}>
              No hay notificaciones
            </Text>
          </View>
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.load()}
            />
          }>
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
                <View>
                  <Text style={{fontFamily: 'Mont-Regular'}}>
                    {doc.contenido}
                  </Text>
                  <Text style={{fontSize: 11, marginTop: 5, color: '#aaaaaa'}}>
                    {moment(doc.fecha_creacion).format('dddd hh:mm a')}
                  </Text>
                </View>
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
