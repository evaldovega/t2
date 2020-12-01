import {COLORS} from 'constants';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

function GradientContainer(props) {
  return (
    <LinearGradient
      colors={['#ffff', COLORS.BG_BLUE]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      {...props}>
      {props.children}
    </LinearGradient>
  );
}

export default GradientContainer;
