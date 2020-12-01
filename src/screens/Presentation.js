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
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {ROUTERS} from 'utils/navigation';
import LinearGradient from 'react-native-linear-gradient';
import GradientContainer from 'components/GradientContainer';
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
    color: '#113b50',
    image: require('utils/images/presentation/A.png'),
    Titulo: 'CONÉCTATE Y GANA',
    subtitle: 'vendiendo seguros',
  },
  {
    color: '#72D4C2',
    image: require('utils/images/presentation/B.png'),
    Titulo: 'SIN HORARIOS',
    subtitle: 'actívate cuando quieras',
  },
  {
    color: '#113b50',
    image: require('utils/images/presentation/C.png'),
    Titulo: 'GENERA INGRESOS',
    subtitle: 'y cumple tus metas',
  },
];

class Presentation extends React.Component {
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
      <View
        style={{
          width: itemWidth,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: '100%',
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
          }}
          source={item.image}
        />

        <View
          style={{
            width: '100%',
            margin: 0,
            backgroundColor: item.color,
            paddingBottom: 24,
            borderBottomRightRadius: 64,
            borderBottomLeftRadius: 64,
          }}>
          <Text
            style={{
              color: '#ffff',
              fontFamily: 'Roboto-Black',
              fontSize: 24,
              textAlign: 'center',
              marginTop: 16,
            }}>
            {item.Titulo}
          </Text>
          <Text
            style={{
              color: '#ffff',
              fontFamily: 'Roboto-Medium',
              fontSize: 16,
              textAlign: 'center',
              marginTop: -4,
            }}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <GradientContainer style={{flex: 1}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />

        <View style={styles.header}>
          <Image
            style={styles.logo}
            resizeMode={'contain'}
            source={require('utils/images/logo_black.png')}></Image>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                shadowOpacity: 16,
                backgroundColor:
                  this.state.indexActive == 0 ? COLORS.ACCENT : COLORS.GRAY,
                borderRadius: 4,
                width: 8,
                height: 8,
                marginRight: 8,
              }}></View>
            <View
              style={{
                backgroundColor:
                  this.state.indexActive == 1 ? COLORS.ACCENT : COLORS.GRAY,
                borderRadius: 4,
                width: 8,
                height: 8,
                marginRight: 8,
              }}></View>
            <View
              inner
              useArt // <- set this prop to use non-native shadow on ios
              style={{
                backgroundColor:
                  this.state.indexActive == 2 ? COLORS.ACCENT : COLORS.GRAY,
                borderRadius: 4,
                width: 8,
                height: 8,
              }}></View>
          </View>
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

        <View
          style={{
            flexDirection: 'row',
            margin: 12,
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              borderRadius: 64,
              padding: 16,
              flex: 1,
              backgroundColor: COLORS.ACCENT,
              elevation: 4,
              alignSelf: 'center',
              marginHorizontal: 4,
            }}
            onPress={() => requestAnimationFrame(() => this.vendeYa())}>
            <Text
              style={{
                color: '#ffff',
                textAlign: 'center',
                fontFamily: 'Roboto-Black',
                fontSize: 18,
              }}>
              ¡Vende ya!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderRadius: 64,
              padding: 16,
              marginHorizontal: 4,
              backgroundColor: COLORS.BG_BLUE,
              elevation: 4,
              alignSelf: 'center',
            }}
            onPress={() => this.props.navigation.push('FQA')}>
            <Text
              style={{
                color: COLORS.DARK,
                textAlign: 'center',
                fontFamily: 'Roboto-Black',
                fontSize: 18,
              }}>
              FAQ
            </Text>
          </TouchableOpacity>
        </View>
      </GradientContainer>
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
export default connect(mapToState, mapToActions)(Presentation);

const styles = StyleSheet.create({
  slider: {
    marginTop: 8,
    height: '100%',
    overflow: 'hidden', // for custom animations
    padding: 0,
    margin: 0,
  },
  logo: {
    width: 80,
    aspectRatio: 1,
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  sliderImage: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
  containerStyle: {
    padding: 0,
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_BLUE,
  },
  header: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 1,
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
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 64,
    borderBottomEndRadius: 64,
    width: itemWidth,
    height: slideHeight,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  svgIntro: {
    alignSelf: 'center',
  },
  title: {
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginTop: 8,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  des: {
    color: '#FFFFFF',
    marginTop: 16,
    marginLeft: 24,
    marginRight: 16,
  },
});
