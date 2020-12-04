import React from 'react';
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
  SafeAreaView,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {ROUTERS} from 'utils/navigation';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import GradientContainer from 'components/GradientContainer';
import Button from 'components/Button';
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
    Titulo: 'Conéctate y gana dinero \n vendiendo seguros',
  },
  {
    color: '#72D4C2',
    image: require('utils/images/presentation/B.png'),
    Titulo: 'Sin horarios \n actívate cuando quieras',
  },
  {
    color: '#113b50',
    image: require('utils/images/presentation/C.png'),
    Titulo: 'Genera ingresos \ny cumple tus metas',
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
      <View style={{flex: 1}}>
        <Image
          style={{
            width: '100%',
            height: '60%',
            alignSelf: 'center',
          }}
          resizeMode="contain"
          source={item.image}
        />
        <Text
          style={{
            marginTop: '10%',
            color: COLORS.NEGRO,
            fontFamily: 'Mont-Bold',
            fontSize: 18,
            textAlign: 'center',
          }}>
          {item.Titulo}
        </Text>
      </View>
    );
  };

  pagination = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: '10%',
      }}>
      <View
        style={{
          shadowOpacity: 16,
          backgroundColor:
            this.state.indexActive == 0 ? COLORS.ACCENT : COLORS.GRAY,
          paddingHorizontal: this.state.indexActive == 0 ? 8 : 0,
          borderRadius: 4,
          width: 8,
          height: 8,
          marginRight: 8,
        }}></View>
      <View
        style={{
          backgroundColor:
            this.state.indexActive == 1 ? COLORS.ACCENT : COLORS.GRAY,
          paddingHorizontal: this.state.indexActive == 1 ? 8 : 0,
          borderRadius: 4,
          width: 8,
          height: 8,
          marginRight: 8,
        }}></View>
      <View
        style={{
          backgroundColor:
            this.state.indexActive == 2 ? COLORS.ACCENT : COLORS.GRAY,
          paddingHorizontal: this.state.indexActive == 2 ? 8 : 0,
          borderRadius: 4,
          width: 8,
          height: 8,
        }}></View>
    </View>
  );

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <GradientContainer style={{flex: 1, paddingHorizontal: 16}}>
          <StatusBar
            translucent={true}
            backgroundColor={'transparent'}
            barStyle={'dark-content'}
          />

          <View style={styles.header}>
            <Image
              style={styles.logo}
              resizeMode={'contain'}
              source={require('utils/images/logo_black.png')}
            />

            <IconAntDesign
              onPress={() => this.props.navigation.push('FQA')}
              name="questioncircle"
              color={COLORS.VERDE}
              size={24}
            />
          </View>

          {this.pagination()}
          <Carousel
            data={data}
            renderItem={this.renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            inactiveSlideScale={0}
            inactiveSlideOpacity={0.4}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            onSnapToItem={(i) => this.setState({indexActive: i})}
          />

          <Button
            color="morado"
            title="Vende ya"
            marginBottom={3}
            onPress={this.vendeYa}
          />
        </GradientContainer>
      </SafeAreaView>
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
    padding: 0,
    margin: 0,
    overflow: 'hidden',
  },
  sliderContentContainer: {
    padding: 0,
    margin: 0,
  },
  logo: {
    width: 80,
    height: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10%',
    marginTop: '16%',
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
  svgIntro: {
    alignSelf: 'center',
  },
  title: {
    color: '#FFF',
    fontFamily: 'Mont-Bold',
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
