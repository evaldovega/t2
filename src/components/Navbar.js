import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {COLORS} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  onPressMenu = () => {
    requestAnimationFrame(() => {
      this.props.navigation.openDrawer();
    });
  };
  onBack = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <View style={[style.wrapper]}>
        {this.props.menu ? (
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            style={style.btnLeft}
            onPress={this.onPressMenu}>
            <SimpleLineIcons name="menu" size={24} color="#ffff" />
          </TouchableOpacity>
        ) : null}
        {this.props.back ? (
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            style={style.btnLeft}
            onPress={this.onBack}>
            <IconAntDesign name="arrowleft" size={24} color="#ffff" />
          </TouchableOpacity>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          <Text style={style.title}>{this.props.title}</Text>
        </View>
        <View style={style.btnRight}>
          <React.Fragment>
            {this.props.right ? (
              this.props.right
            ) : (
              <Image
                source={require('utils/images/icon_bg_dark.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            )}
          </React.Fragment>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.DARK,
    paddingHorizontal: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    overflow: 'hidden',
    elevation: 0.2,
  },
  title: {
    marginLeft: 16,
    fontFamily: 'Mont-Bold',
    fontSize: 17,
    color: '#ffff',
  },
  btnLeft: {
    zIndex: 1,
    elevation: 0,
  },
  btnRight: {elevation: 0},
});

export default Navbar;
