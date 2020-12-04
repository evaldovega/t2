import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
  COLORS,
  CURVA,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TITULO_TAM,
} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: new Animated.Value(-10),
    };
  }

  onPressMenu = () => {
    requestAnimationFrame(() => {
      this.props.navigation.openDrawer();
    });
  };
  onBack = () => {
    this.props.navigation.pop();
  };

  componentDidMount() {
    Animated.timing(
      this.state.value,
      {toValue: 0, duration: 500, useNativeDriver: true},
      Easing,
    ).start();
  }

  render() {
    const extra_styles = {};
    if (this.props.transparent) {
      extra_styles.backgroundColor = 'transparent';
    }
    let ICON_COLOR = COLORS.NEGRO_N1;
    if (this.props.icon_color) {
      ICON_COLOR = this.props.icon_color;
    }
    const {value} = this.state;

    return (
      <React.Fragment>
        <Animated.View
          style={{
            transform: [
              {
                translateY: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-16, 0],
                }),
              },
            ],
          }}>
          <View style={[style.wrapper, extra_styles]}>
            {this.props.menu ? (
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                style={style.btnLeft}
                onPress={this.onPressMenu}>
                <SimpleLineIcons name="menu" size={20} color={ICON_COLOR} />
              </TouchableOpacity>
            ) : null}
            {this.props.back ? (
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                style={style.btnLeft}
                onPress={this.onBack}>
                <SimpleLineIcons
                  name="arrow-left"
                  size={20}
                  color={ICON_COLOR}
                />
              </TouchableOpacity>
            ) : null}
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={[style.title, this.props.style_title]}>
                {this.props.title}
              </Text>
            </View>
            <View style={style.btnRight}>
              <React.Fragment>
                {this.props.right ? (
                  this.props.right
                ) : (
                  <Image
                    source={require('utils/images/icon.png')}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                  />
                )}
              </React.Fragment>
            </View>
          </View>
        </Animated.View>
      </React.Fragment>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    borderBottomLeftRadius: CURVA,
    borderBottomRightRadius: CURVA,
    backgroundColor: COLORS.BLANCO,
    paddingHorizontal: MARGIN_HORIZONTAL,
    minHeight: 96,
    paddingTop: 24 + getStatusBarHeight(),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    overflow: 'hidden',
  },
  title: {
    marginHorizontal: MARGIN_HORIZONTAL,
    fontSize: TITULO_TAM * 0.8,
    color: COLORS.NEGRO,
    fontFamily: 'Mont-Bold',
    textAlign: 'center',
    flex: 1,
  },
  btnLeft: {
    zIndex: 1,
    elevation: 0,
  },
  btnRight: {elevation: 0},
});

export default Navbar;
