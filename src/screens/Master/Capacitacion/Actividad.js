import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {withAnchorPoint} from 'react-native-anchor-point';
import {WebView} from 'react-native-webview';
import YoutubePlayer, {getYoutubeMeta} from 'react-native-youtube-iframe';
import {Card, Button, Switch, FAB, Title, Paragraph} from 'react-native-paper';
import {CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from 'components/Loader';
const {width, height} = Dimensions.get('screen');
import {styleText, styleHeader, styleButton} from 'styles';
import {connect} from 'react-redux';
import {
  capacitacionDetalleObtenerActividad,
  actividadMarcarLeida,
  actividadSeleccionarOpcion,
  actividadEnviarCuestionario,
} from '../../../redux/actions';
import {COLORS} from 'constants';
import Check from 'svgs/Check';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Navbar from 'components/Navbar';
import GradientContainer from 'components/GradientContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingBottom: 20,
    paddingTop: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

class Actividad extends React.Component {
  state = {
    capacitacion_id: '',
    seccion_id: '',
    actividad_id: '',
    estado_video: '',
    reproducir: false,
    video_cover: '',
    opacidad: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
    this.reproductor = React.createRef();
  }

  componentDidMount() {
    const {
      capacitacion_id,
      seccion_index,
      actividad_index,
    } = this.props.route.params;
    this.setState({
      seccion_id: seccion_index,
      actividad_id: actividad_index,
      capacitacion_id: capacitacion_id,
    });
    this.props.cargar(seccion_index, actividad_index);
    Animated.timing(this.state.opacidad, {
      toValue: 1,
      duration: 1000,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start(() => {
      console.log('Fin animacion');
    });
  }

  componentDidUpdate(prev) {
    if (this.state.video_cover == '' && this.props.data.tipo == 'video') {
      const {data} = this.props;
      getYoutubeMeta(data.enlace_externo.split('?v=')[1]).then((meta) => {
        this.setState({video_cover: meta.thumbnail_url});
      });
    }
    console.log('ERRROR ', this.props.error);
    if (this.props.error != '' && this.props.error != prev.error) {
      Alert.alert('Algo anda mal', this.props.error);
    }

    if (
      this.props.cuestionario_aprobado != prev.cuestionario_aprobado &&
      this.props.cuestionario_aprobado
    ) {
      Alert.alert('Felicitaciones', 'Actividad completada correctamente');
      this.props.navigation.pop();
    }
  }

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
                    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                    <style>
                    p{
                        textAlign:'justify'
                    }
                    body{
                        textAlign:'justify';
                        padding:32px
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
      <View
        style={{
          flex: 1,
          padding: 0,
          marginVertical: 24,
          marginHorizontal: 24,
          backgroundColor: COLORS.BG_GRAY,
          borderRadius: 20,
          overflow: 'hidden',
          borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
          borderWidth: 0.3,
        }}>
        <WebView
          showsVerticalScrollIndicator={true}
          originWhitelist={['*']}
          source={{html: html}}
        />
      </View>
    );
  };

  renderOpcion = (opcion, pregunta, index_pregunta, index_opcion) => {
    return (
      <CheckBox
        key={index_opcion}
        onPress={() =>
          this.props.seleccionarOpcion(
            this.state.seccion_id,
            this.state.actividad_id,
            pregunta.id,
            opcion.id,
          )
        }
        title={opcion.opcion}
        checkedColor={COLORS.PRIMARY_COLOR}
        checked={pregunta.seleccionada == opcion.id}
        style={{backgroundColor: 'transparent'}}
      />
    );
  };

  enviarCuestionario = () => {
    let data = [],
      error = false;
    for (let p of this.props.data.preguntas) {
      if (!p.seleccionada) {
        Alert.alert('Conteste todas las preguntas', p.pregunta);
        error = true;
        break;
      }
      data.push({pregunta: p.id, respuesta: p.seleccionada});
    }

    this.props.enviarCuestionario(
      this.state.capacitacion_id,
      this.state.seccion_id,
      this.state.actividad_id,
      data,
    );
  };

  renderCuestionario = (data) => {
    if (data.tipo != 'cuestionario') {
      return;
    }
    const preguntas = data.preguntas.map((p, k) => {
      return (
        <Card
          key={k}
          style={{
            borderRadius: 16,
            marginBottom: 16,
            backgroundColor: COLORS.BG_GRAY,
            borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
            borderWidth: 0.3,
          }}>
          <Card.Content>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                color: COLORS.SECONDARY_COLOR_LIGHTER,
                fontSize: 18,
                marginBottom: 20,
              }}>
              {p.pregunta}
            </Text>
            {p.opciones.map((o, k2) => this.renderOpcion(o, p, k, k2))}
            {p.error && p.error != '' ? (
              <View style={{flexDirection: 'row'}}>
                <Icon name="closecircle" size={18} color="red" />
                <Text style={{marginLeft: 8, color: 'red', fontWeight: 'bold'}}>
                  {p.error}
                </Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      );
    });

    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: 4,
          borderRadius: 20,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, padding: 16}}>{preguntas}</View>
          <View style={{padding: 16}}>
            <TouchableOpacity
              style={styleButton.wrapper}
              onPress={this.enviarCuestionario}>
              <Text style={styleButton.text}>Enviar Respuestas</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  onStateChange = (state) => {
    console.log('Cambio de estado');
    console.log(state);
    this.setState({estado_video: state});
    switch (state) {
      case 'ended':
        Alert.alert('Buen trabajo', 'Actividad completada');
        this.marcarLeida(this.state.seccion_id, this.state.actividad_id, true);
        break;
    }
  };

  playVideo = () => {
    this.setState({reproducir: !this.state.reproducir});
    if (this.state.estado_video != 'playing') {
      //this.reproductor.current?.play()
    }
  };

  renderVideo = (data) => {
    if (data.tipo != 'video') {
      return;
    }
    return (
      <View
        style={{
          overflow: 'hidden',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 250,
        }}>
        {this.state.estado_video != 'playing' &&
        this.state.video_cover != '' ? (
          <Image
            style={{
              zIndex: 4,
              width: '100%',
              height: '100%',
              position: 'absolute',
              bottom: -10,
              left: 0,
            }}
            source={{uri: this.state.video_cover}}></Image>
        ) : null}

        <YoutubePlayer
          webViewStyle={{width: '100%', zIndex: 2}}
          ref={this.reproductor}
          height={300}
          play={this.state.reproducir}
          videoId={data.enlace_externo.split('?v=')[1]}
          initialPlayerParams={{
            rel: false,
            controls: true,
            modestbranding: true,
          }}
          onChangeState={this.onStateChange}
        />
      </View>
    );
  };

  render() {
    const {data, cargando} = this.props;
    console.log(data.preguntas);

    return (
      <GradientContainer style={styles.container}>
        <Loader loading={cargando} />
        <Navbar back title={data.tipo} {...this.props} />

        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'stretch',
            }}>
            {/*<Card
              style={{
                borderRadius: 16,
                marginHorizontal: 16,
                marginTop: 32,
                marginBottom: 8,
              }}
              elevation={4}>
              {this.renderVideo(data)}
              <Card.Content>
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    marginBottom: 20,
                    flexDirection: 'column',
                  }}>
                  <Title>{data.titulo}</Title>

                  {data.tipo == 'cuestionario' && (
                    <View style={{}}>
                      <Paragraph>
                        Intentos {data.intentos_user}/{data.intentos}
                      </Paragraph>
                      <Paragraph>Calificacion {data.calificacion}</Paragraph>
                    </View>
                  )}

                  {data.tipo == 'video' && this.state.video_cover != '' && (
                    <FAB
                      icon={
                        this.state.estado_video == 'playing' ? 'pause' : 'play'
                      }
                      loading={this.state.estado_video == 'buffering'}
                      onPress={this.playVideo}
                    />
                  )}

                  {data.tipo == 'lectura' ? (
                    <View
                      style={{
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
              </Card.Content>
            </Card>*/}
            <View>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 24,
                  textAlign: 'center',
                  color: COLORS.DARK,
                  marginVertical: 16,
                }}>
                {data.titulo}
              </Text>
              {data.tipo == 'lectura' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={{fontFamily: 'Roboto-Light'}}>
                    Marcar como leido
                  </Text>
                  <Switch
                    value={data.visualizado}
                    onValueChange={() => this.marcarLeida()}></Switch>
                </View>
              ) : null}
            </View>

            {this.renderLectura(data)}
            {this.renderCuestionario(data)}
          </View>
        </View>
      </GradientContainer>
    );
  }
}

const mapToState = (state) => {
  return {
    data: state.Capacitacion.actividad_seleccionada,
    cargando: state.Capacitacion.cargando,
    error: state.Capacitacion.error,
    cuestionario_aprobado: state.Capacitacion.cuestionario_aprobado,
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
    seleccionarOpcion: (seccion_id, actividad_id, index_pregunta, opcion) => {
      dispatch(
        actividadSeleccionarOpcion(
          seccion_id,
          actividad_id,
          index_pregunta,
          opcion,
        ),
      );
    },
    enviarCuestionario: (capacitacion_id, seccion_id, actividad, data) => {
      dispatch(
        actividadEnviarCuestionario(
          capacitacion_id,
          seccion_id,
          actividad,
          data,
        ),
      );
    },
  };
};

export default connect(mapToState, mapToActions)(Actividad);
