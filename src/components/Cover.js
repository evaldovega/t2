import React, {useState, useEffect} from 'react';
import {useComponentSize} from 'components';
import {Image, View, Animated, Easing} from 'react-native';

const Cover = (props) => {
  const [size, onLayout] = useComponentSize();
  const [height, setHeight] = useState(null);
  const scale = new Animated.Value(0);
  useEffect(() => {
    console.log(size);
    if (size) {
      if (props.onRender) {
        props.onRender(size);
      }
      setHeight(size.height);
      Animated.timing(scale, {
        toValue: 1,
        useNativeDriver: true,
        duration: 800,
      }).start();
    }
  }, size);

  return (
    <React.Fragment>
      <Image
        source={{uri: props.uri}}
        onLayout={onLayout}
        style={[
          {position: 'absolute', top: 0, left: 0, width: '100%'},
          props.style,
        ]}
      />

      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: height || '25%',
          backgroundColor: 'rgba(0,0,0,.6)',
        }}
      />
    </React.Fragment>
  );
};

export default Cover;
