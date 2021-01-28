import React, {useEffect} from 'react';
import validate from 'utils/validate.min.js';
import {Text, Animated, easing} from 'react-native';

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
      duration: 1000,
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
              outputRange: [-5, 0],
            }),
          },
        ],
      }}>
      <Text
        style={{
          color: '#CD6155',
          fontSize: 12,
          borderRadius: 4,
          padding: 4,
          marginTop: 2,
          marginLeft: 10,
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
        _constraints.presence = {};
        _constraints.presence.allowEmpty = false;
        _constraints.presence.message =
          '^' +
          (this.props.required.length > 0
            ? this.props.required
            : 'Diligencie éste campo');
      }
      if (this.props.email) {
        _constraints.email = {
          message:
            '^' +
            (this.props.email.length > 0 ? this.props.email : 'Email invalido'),
        };
      }
      if (this.props.url) {
        _constraints.url = {
          message:
            '^' + (this.props.url.length > 0 ? this.props.url : 'URL invalida'),
        };
      }
    } else {
      _constraints = constraints;
    }

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

export const Execute = (Validations) => {
  return new Promise((resolve, reject) => {
    let errores = [];
    Object.keys(Validations).forEach((v) => {
      if (Validations[v]) {
        const e = Validations[v].execute();
        if (e.length > 0) {
          errores = [...errores, {...e}];
        }
      }
    });
    if (errores.length == 0) {
      resolve();
    } else {
      reject(errores);
    }
  });
};

export default Validator;
