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
import {Checkbox, Button, Switch, FAB, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

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
    paddingTop: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
    minHeight: height,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

class Actividad extends React.Component {
  state = {
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
    const {seccion_index, actividad_index} = this.props.route.params;
    this.setState({seccion_id: seccion_index, actividad_id: actividad_index});
    this.props.cargar(seccion_index, actividad_index);
    Animated.timing(this.state.opacidad, {
      toValue: 1,
      duration: 2000,
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
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: 'white',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
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
      <TouchableOpacity
        key={index_opcion}
        onPress={() =>
          this.props.seleccionarOpcion(
            this.state.seccion_id,
            this.state.actividad_id,
            pregunta.id,
            opcion.id,
          )
        }>
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
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, padding: 32}}>{preguntas}</View>
        </ScrollView>

        <View style={{padding: 16}}>
          <Button mode="contained" color={COLORS.PRIMARY_COLOR} dark={true}>
            Enviar Respuestas
          </Button>
        </View>
      </View>
    );
  };

  onStateChange = (state) => {
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
          marginTop: -20,
          overflow: 'hidden',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          height: 250,
        }}>
        {/*
        <View
          style={{
            zIndex: 4,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 250,
            backgroundColor: 'transparent',
          }}></View>*/}

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
    const {data} = this.props;
    console.log(data.preguntas);
    return (
      <View style={styles.container}>
        <View style={styleHeader.wrapper}>
          <TouchableOpacity
            style={styleHeader.btnLeft}
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            onPress={() => this.props.navigation.pop()}>
            <Icon name="arrowleft" color="white" size={24} />
          </TouchableOpacity>
          <Text style={[styleHeader.title]}>Actividad</Text>
          <TouchableOpacity style={styleHeader.btnRight}></TouchableOpacity>
        </View>

        <View style={styles.container}>
          {this.renderVideo(data)}

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'stretch',
            }}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Title style={[styleText.h1, {flex: 1}]}>{data.titulo}</Title>
              {data.tipo == 'video' && this.state.video_cover != '' ? (
                <FAB
                  icon={this.state.estado_video == 'playing' ? 'pause' : 'play'}
                  loading={this.state.estado_video == 'buffering'}
                  onPress={this.playVideo}
                />
              ) : null}
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

            {this.renderLectura(data)}
            {this.renderCuestionario(data)}
          </View>
        </View>
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
  };
};

export default connect(mapToState, mapToActions)(Actividad);
