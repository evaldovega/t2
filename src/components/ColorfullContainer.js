import {COLORS} from 'constants';
import React from 'react';
import {ImageBackground} from 'react-native';
const background = require('utils/images/fondo_colorido.png');

function ColorfullContainer(props) {
  return (
    <ImageBackground source={background} {...props}>
      {props.children}
    </ImageBackground>
  );
}

export default ColorfullContainer;
