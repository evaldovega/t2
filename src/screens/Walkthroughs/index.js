import React, {memo, useCallback, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Image,
  Animated,
  Easing,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {Button, Colors, Title, Paragraph} from 'react-native-paper';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {ROUTERS} from 'utils/navigation';

const {width: viewportWidth} = Dimensions.get('window');

function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = '100%';
const slideWidth = wp(80);
const itemHorizontalMargin = wp(2);
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

import {connect} from 'react-redux';
import {initUsuario} from 'redux/actions/Usuario';
import {COLORS} from 'constants';

const data = [
  {
    color: '#00C48C',
    animation: require('../../animations/sales.json'),
    Titulo: 'Conéctate y gana',
    Texto: 'Conéctate y gana vendiendo seguros con Servi',
  },
  {
    color: '#00817A',
    animation: require('../../animations/relot.json'),
    Titulo: 'Sin horarios',
    Texto: 'Actívate cuando quieras',
  },
  {
    color: '#00C48C',
    animation: require('../../animations/metas.json'),
    Titulo: 'Gana',
    Texto: 'Genera ingresos y cumple tus metas',
  },
];

class Walkthroughs extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    indexActive: 0,
    progress: new Animated.Value(0),
  };

  componentDidMount() {
    this.props.initUsuario();
    Animated.loop(
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }
  vendeYa = () => {
    if (this.props.logeado) {
      this.props.navigation.navigate('Master');
    } else {
      this.props.navigation.navigate(ROUTERS.SignIn);
    }
  };

  renderItem = ({item}) => {
    return (
      <View style={[styles.item, {backgroundColor: item.color}]}>
        <LottieView
          loop={true}
          style={{width: '100%'}}
          source={item.animation}
          progress={this.state.progress}
          style={styles.sliderImage}
        />
        <View style={{flex: 1}}>
          <Title style={styles.title}>{item.Titulo}</Title>
          <Paragraph style={styles.des}>{item.Texto}</Paragraph>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('utils/images/LOGO.png')}></Image>
          <Pagination
            dotsLength={3}
            activeDotIndex={this.state.indexActive}
            dotStyle={styles.dotStyle}
            inactiveDotStyle={styles.inactiveDotStyle}
            containerStyle={styles.containerStyle}
            inactiveDotScale={1}
          />
        </View>
        <View style={styles.boxCarousel}>
          <Carousel
            data={data}
            renderItem={this.renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            inactiveSlideScale={0.95}
            inactiveSlideOpacity={0.4}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            onSnapToItem={(i) => this.setState({indexActive: i})}
          />
        </View>
        <Button
          backgroundColor={COLORS.PRIMARY_COLOR}
          dark={true}
          mode="contained"
          style={{borderRadius: 16, margin: 24, padding: 8}}
          onPress={this.vendeYa}>
          ¡Vende ya {this.props.nombre}!
        </Button>
      </View>
    );
  }
}

const mapToState = (state) => {
  return {
    nombre: state.Usuario.nombre,
    logeado: state.Usuario.logeado,
  };
};
const mapToActions = (dispatch) => {
  return {
    initUsuario: () => {
      dispatch(initUsuario());
    },
  };
};
export default connect(mapToState, mapToActions)(Walkthroughs);

const styles = StyleSheet.create({
  slider: {
    marginTop: 15,
    height: '100%',
    overflow: 'visible', // for custom animations
    padding: 0,
    margin: 0,
  },
  logo: {
    width: 200,
    height: 60,
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  sliderImage: {
    width: '80%',
    alignSelf: 'center',
    flex: 1,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: COLORS.PRIMARY_COLOR,
  },
  inactiveDotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: '#6D5F6F',
  },
  containerStyle: {
    padding: 0,
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 56,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxCarousel: {
    flex: 1,
  },
  btnSignIn: {
    backgroundColor: '#102e4d',
    borderRadius: 24,
    marginHorizontal: 45,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 50,
  },
  txtSignIn: {
    color: '#FBFBFB',
    fontSize: 17,
    fontWeight: '600',
  },
  item: {
    borderRadius: 16,
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  svgIntro: {
    alignSelf: 'center',
  },
  title: {
    color: '#FFF',

    marginTop: 50,
    marginLeft: 24,
    marginRight: 16,
  },
  des: {
    color: '#FFFFFF',
    marginTop: 16,
    marginLeft: 24,
    marginRight: 16,
  },
});
