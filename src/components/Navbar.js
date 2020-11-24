import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  onPressMenu = () => {
    this.props.navigation.openDrawer();
  };
  onBack = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <LinearGradient
        style={style.wrapper}
        colors={['#24A483', '#24A483', COLORS.PRIMARY_COLOR]}>
        {this.props.menu ? (
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            style={style.btnLeft}
            onPress={this.onPressMenu}>
            <Icon name="menu" size={24} color="white" />
          </TouchableOpacity>
        ) : null}
        {this.props.back ? (
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            style={style.btnLeft}
            onPress={this.onBack}>
            <IconAntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        ) : null}
        <Text style={style.title}>{this.props.title}</Text>
        <View style={style.btnRight}>{this.props.right}</View>
      </LinearGradient>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
  },
  title: {
    fontFamily: 'Lato-Regular',
    fontSize: 17,
    color: '#fff',
  },
  btnLeft: {
    zIndex: 1,
    elevation: 0,
  },
  btnRight: {elevation: 0},
});

export default Navbar;
