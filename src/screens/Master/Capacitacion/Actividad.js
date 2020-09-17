import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {withAnchorPoint} from 'react-native-anchor-point';
import SvgBack from 'svgs/profile/SvgBack';
import {WebView} from 'react-native-webview';
import {Checkbox, Button, Switch} from 'react-native-paper';

import ArrowRight from 'svgs/ArrowRight';
import ArrowLeft from 'svgs/ArrowLeft';

import Loader from 'components/Loader';
const {width, height} = Dimensions.get('screen');
import {styleText, styleHeader} from 'styles';
import {connect} from 'react-redux';
import {
  capacitacionDetalleObtenerActividad,
  actividadMarcarLeida,
  actividadSeleccionarOpcion,
} from '../../../redux/actions';
import {COLORS} from 'constants';
import Check from 'svgs/Check';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    minHeight: height,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

class Actividad extends React.Component {
  componentDidMount() {
    const {seccion_index, actividad_index} = this.props.route.params;
    this.props.cargar(seccion_index, actividad_index);
    console.log('Componente creado actividad ', actividad_index);
  }

  componentDidUpdate() {}

  marcarLeida = () => {
    let nuevo_estado = this.props.data.visualizado
      ? !this.props.data.visualizado
      : true;
    const {seccion_index, actividad_index} = this.props.route.params;
    this.props.marcarLeida(seccion_index, actividad_index, nuevo_estado);
  };

  renderLectura = (data) => {
    if (data.tipo != 'lectura') {
      return;
    }
    let html = `
            <html lang='es'>
                <head>
                    <meta name='viewport' content='width=device-width,user-scale=no'/>
                    <style>
                    p{
                        textAlign:'justify'
                    }
                    body{
                        margin:32px;
                        textAlign:'justify'
                    }
                    img{
                        maxWidth:100%
                    }
                    </style>
                </head>
                <body>
                ${data.contenido}
                </body>
            </html>
        `;
    return (
      <WebView
        scalesPageToFit
        automaticallyAdjustContentInsets={false}
        originWhitelist={['*']}
        source={{html: html}}></WebView>
    );
  };

  renderOpcion = (opcion, pregunta, index_pregunta, index_opcion) => {
    return (
      <TouchableOpacity
        key={index_opcion}
        onPress={() => this.props.seleccionarOpcion(index_pregunta, opcion.id)}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={
              pregunta.seleccionada == opcion.id ? 'checked' : 'unchecked'
            }
            color={COLORS.PRIMARY_COLOR}></Checkbox>
          <Text style={{flex: 1}}>{opcion.opcion}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderCuestionario = (data) => {
    if (data.tipo != 'cuestionario') {
      return;
    }
    const preguntas = data.preguntas.map((p, k) => {
      return (
        <View key={k}>
          <Text style={[styleText.h2, {marginBottom: 20}]}>{p.pregunta}</Text>
          {p.opciones.map((o, k2) => this.renderOpcion(o, p, k, k2))}
        </View>
      );
    });

    return (
      <View>
        {preguntas}
        <Button mode="contained" color={COLORS.PRIMARY_COLOR} dark={true}>
          Enviar Respuestas
        </Button>
      </View>
    );
  };

  render() {
    const {data} = this.props;
    console.log('Tipo actividad ' + data.tipo);
    return (
      <View style={styles.container}>
        <View style={styleHeader.wrapper}>
          <Text style={[styleHeader.title]}>Actividad</Text>
          <TouchableOpacity
            style={styleHeader.btnLeft}
            onPress={() => this.props.navigation.pop()}>
            <ArrowLeft width={24} height={24} color={'#ffff'} />
          </TouchableOpacity>
          <TouchableOpacity style={styleHeader.btnRight}></TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
              <Text
                style={[styleText.h1, {marginBottom: 20, textAlign: 'center'}]}>
                {data.titulo}
              </Text>
              {data.tipo == 'lectura' ? (
                <View
                  style={{
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <Text style={styleText.small}>Marcar como leido</Text>
                  <Switch
                    value={data.visualizado}
                    onValueChange={() => this.marcarLeida()}></Switch>
                </View>
              ) : null}
            </View>

            <View style={styles.content}>
              {this.renderLectura(data)}
              {this.renderCuestionario(data)}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapToState = (state) => {
  return {
    data: state.Capacitacion.actividad_seleccionada,
  };
};
const mapToActions = (dispatch) => {
  return {
    cargar: (seccion, actividad) => {
      dispatch(capacitacionDetalleObtenerActividad(seccion, actividad));
    },
    marcarLeida: (seccion_index, actividad_index, estado) => {
      dispatch(actividadMarcarLeida(seccion_index, actividad_index, estado));
    },
    seleccionarOpcion: (index_pregunta, opcion) => {
      dispatch(actividadSeleccionarOpcion(index_pregunta, opcion));
    },
  };
};

export default connect(mapToState, mapToActions)(Actividad);
