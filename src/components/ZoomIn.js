import React, {useEffect, useState} from 'react';
import {Animated} from 'react-native';
const ZoomIn = (props) => {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0);
  const [animacion, setAnimacion] = useState('');

  const _in = () => {
    opacity.setValue(0);
    scale.setValue(0);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimacion('in');
    });
  };
  const _out = () => {
    opacity.setValue(1);
    scale.setValue(1);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimacion('out');
    });
  };
  useEffect(() => {
    setAnimacion(props.animacion || 'in');
  });

  useEffect(() => {
    switch (animacion) {
      case 'in':
        _in();
        break;
      case 'out':
        _out();
        break;
    }
  }, [animacion]);

  return (
    <Animated.View style={{opacity: opacity, transform: [{scale: scale}]}}>
      {props.children}
    </Animated.View>
  );
};

export default ZoomIn;
