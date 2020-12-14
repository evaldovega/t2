import React, {useState, useCallback, useEffect} from 'react';
import {View, Animated, Easing} from 'react-native';
import {COLORS, CURVA} from 'constants';
import {useComponentSize} from 'components';

const ProgressBar = (props) => {
  const [size, onLayout] = useComponentSize();
  const [width, setWidth] = useState(1);
  const scale = new Animated.Value(0);

  useEffect(() => {
    if (size) {
      scale.setValue(width);
      const w = size.width * (props.progress / 100);
      setWidth(w);
      console.log(w);
      Animated.timing(scale, {
        toValue: w,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [props.progress, size]);

  return (
    <View style={[{alignItems: 'center'}, props.style]} onLayout={onLayout}>
      {size && (
        <View
          style={{
            backgroundColor: 'white',
            width: size.width,
            height: props.height,
            borderRadius: CURVA,
            overflow: 'hidden',
            borderColor: COLORS.SECONDARY_COLOR_LIGHTER,
            borderWidth: 0.3,
          }}>
          <View
            style={{
              backgroundColor: COLORS.PRIMARY_COLOR,
              height: props.height,
              borderTopRightRadius: CURVA,
              width: width,
            }}
          />
        </View>
      )}
    </View>
  );
};

ProgressBar.defaultProps = {
  progress: 0,
  height: 10,
};

export default ProgressBar;
