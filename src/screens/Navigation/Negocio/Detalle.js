import React from 'react';
import NavBar from 'components/Navbar';
import {ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {
  COLORS,
  SERVER_ADDRESS,
  TEXTO_TAM,
  TITULO_TAM,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
  CURVA,
} from 'constants';
import NumberFormat from 'react-number-format';
import ColorfullContainer from 'components/ColorfullContainer';
import {chunkArray} from 'utils';
import Button from 'components/Button';

class NegocioDetalle extends React.Component {
  state = {
    doc: {},
  };
  load = () => {
    try {
      fetch(
        SERVER_ADDRESS + 'api/ordenes/' + this.props.route.params.id + '/',
        {
          headers: {
            Authorization: 'Token ' + this.props.token,
          },
        },
      )
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          this.setState({doc: data});
        });
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.load();
  }

  renderFormularioPlan = (doc) => {
    if (doc.formulario) {
      return doc.formulario.map((item) => {
        return (
          <View
            style={{
              marginTop: MARGIN_VERTICAL,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Mont-Bold',
                fontSize: TITULO_TAM * 0.6,
              }}>
              {item.pregunta_str}
            </Text>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Mont-regular',
                marginLeft: 8,
              }}>
              {item.respuesta}
            </Text>
          </View>
        );
      });
    }
  };

  renderPersonas = (personas) => {
    if (personas && personas.length > 0) {
      const data = personas.map((persona) => {
        return persona.map((p) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: MARGIN_VERTICAL / 2,
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Mont-Bold',
                fontSize: TITULO_TAM * 0.6,
              }}>
              {p.pregunta_str}
            </Text>
            <Text style={{flex: 1, fontFamily: 'Mont-regular', marginLeft: 8}}>
              {p.respuesta}
            </Text>
          </View>
        ));
      });
      return <View style={{marginTop: MARGIN_VERTICAL}}>{data}</View>;
    }
  };

  renderVariaciones = (plan) => {
    if (plan.variaciones) {
      return plan.variaciones.map((v) => {
        let valor = parseInt(v.valor);
        let personas = chunkArray(v.formulario, valor);

        return (
          <View>
            <Text
              style={{
                color: COLORS.NEGRO_n1,
                fontFamily: 'Mont-regular',
                fontSize: TEXTO_TAM * 0.5,
              }}>
              {v.variacion_str}
            </Text>
            <NumberFormat
              value={v.valor}
              displayType={'text'}
              thousandSeparator={true}
              prefix={''}
              renderText={(nf) => (
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Mont-Bold',
                    fontSize: TITULO_TAM * 0.7,
                    color: COLORS.VERDE,
                  }}>
                  {nf}
                </Text>
              )}
            />
            {this.renderPersonas(personas)}
          </View>
        );
      });
    }
  };

  renderPlanes = (doc) => {
    if (doc.planes && doc.planes.length > 0) {
      return doc.planes.map((plan) => {
        return (
          <View
            style={{
              marginTop: MARGIN_VERTICAL * 2,
              borderRadius: CURVA,
              backgroundColor: 'rgba(255,255,255,.6)',
              padding: MARGIN_VERTICAL,
              borderBottomWidth: 0.2,
              borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
            }}>
            <Text
              style={{
                color: COLORS.NEGRO,
                fontFamily: 'Mont-regular',
                fontSize: TEXTO_TAM * 0.7,
              }}>
              {plan.plan_str}
            </Text>
            {this.renderVariaciones(plan)}
          </View>
        );
      });
    }
  };

  render() {
    const {doc} = this.state;

    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <NavBar {...this.props} back transparent title="Detalle Orden" />
        <ScrollView style={{flex: 1}}>
          <View style={{flex: 1, paddingHorizontal: MARGIN_HORIZONTAL}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: TITULO_TAM * 0.9,
              }}>
              {this.state.doc.plan_str || '...'}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: TITULO_TAM * 0.8,
              }}>
              {this.state.doc.numero_orden || '...'}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 'Mont-Bold',
                fontSize: TITULO_TAM * 0.7,
              }}>
              {this.state.doc.estado_orden_str || '...'}
            </Text>
            <NumberFormat
              value={doc.precio_pagado}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={(nf) => (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: TITULO_TAM * 0.7,
                    color: COLORS.VERDE,
                  }}>
                  {nf}
                </Text>
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8,
              }}>
              <Text style={{fontWeight: 'bold'}}>Metodo de pago:</Text>
              <Text>{doc.metodo_pago}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8,
              }}>
              <Text style={{fontWeight: 'bold'}}>Frecuencia de pago:</Text>
              <Text>Cada {doc.frecuencia_pago} Mes(s)</Text>
            </View>

            {this.renderFormularioPlan(doc)}
            {this.renderPlanes(doc)}
          </View>
        </ScrollView>
        {doc && doc.estado_orden == 4 ? (
          <Button
            title="Subsanar"
            onPress={() =>
              this.props.navigation.push('NegocioDiligenciarInformacion', {
                id: doc.plan,
                orden_id: doc.id,
                cliente: doc.cliente,
                callback: this.load,
              })
            }
          />
        ) : null}
      </ColorfullContainer>
    );
  }
}
const mapToState = (state) => {
  return {
    token: state.Usuario.token,
  };
};
export default connect(mapToState)(NegocioDetalle);
