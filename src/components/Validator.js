import React, {useEffect} from 'react';
import validate from 'utils/validate.min.js';
import {Text, Animated, easing} from 'react-native';

/*
const Validator = (props) => {
  const [errores, setError] = useState([]);

  useEffect(() => {
    if (props.constraints) {
      let _errores = [];
      if (props.valueb) {
        _errores = validate(
          {e: props.value, e2: props.valueb},
          {e: props.constraints},
        );
      } else {
        _errores = validate({e: props.value}, {e: props.constraints});
      }
      if (_errores) {
        setError(_errores['e']);
      } else {
        setError([]);
      }
    }
  }, [props.value, props.valueb]);

  return (
    <>
      {props.children}
      {errores.map((e) => (
        <Text>{e}</Text>
      ))}
    </>
  );
};*/

const required = {
  presence: {
    allowEmpty: false,
    message: '^Diligencie éste campo',
  },
};

const Error = (props) => {
  const v = new Animated.Value(0);

  useEffect(() => {
    v.setValue(0);
    Animated.timing(v, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [props.children]);
  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [-10, 0],
            }),
          },
        ],
      }}>
      <Text
        style={{
          backgroundColor: '#CD6155',
          color: '#ffff',
          borderRadius: 4,
          padding: 4,
          marginTop: 2,
        }}>
        {props.children}
      </Text>
    </Animated.View>
  );
};

class Validator extends React.PureComponent {
  state = {errores: []};

  execute = () => {
    const {value, valueb, constraints} = this.props;
    let _constraints = {};

    if (!constraints) {
      if (this.props.required) {
        _constraints = {...required};
        _constraints.presence.message = '^' + this.props.required;
      }
    } else {
      _constraints = constraints;
    }
    console.log(_constraints);

    let _errores = [];
    if (valueb) {
      _errores = validate({e: value, e2: valueb}, {e: _constraints});
    } else {
      _errores = validate({e: value}, {e: _constraints});
    }
    if (_errores) {
      this.setState({errores: _errores['e']});
    } else {
      this.setState({errores: []});
    }
    return _errores ? _errores['e'] : [];
  };

  componentDidUpdate(prev) {
    if (
      prev.value != this.props.value ||
      (this.props.valueb && this.props.valueb != prev.valueb)
    ) {
      this.execute();
    }
  }

  render() {
    const {errores} = this.state;
    return (
      <>
        {this.props.children}
        {errores.map((e) => (
          <Error>{e}</Error>
        ))}
      </>
    );
  }
}

export default Validator;
