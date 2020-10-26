import React from 'react';
import {Text} from 'react-native';
import {styleInput} from 'styles';
import validate from 'utils/validate.min.js';

export const totalErrores = (scope) => {
  let total = 0;
  Object.keys(scope.state.error).forEach((k) => {
    total += scope.state.error[k].length;
  });
  return total;
};
export const validar = (scope, input, constraint, por_props = true) => {
  let errores = {};
  let object = {};
  if (por_props) {
    console.log('Buscar en props');
    object[input] = scope.props[input];
  } else {
    console.log('Buscar en state');
    object[input] = scope.state[input];
  }
  console.log(object[input]);

  let constraints = {};
  constraints[input] = constraint;
  console.log('Restricciones ', constraint);
  errores = validate(object, constraints);
  console.log('Error de validacion ', errores);
  if (errores && errores[input]) {
    console.log(errores);
    let r = {};
    r[input] = errores[input];
    errores = Object.assign(scope.state.error, r);
    scope.setState({error: errores});
  } else {
    let r = {};
    r[input] = [];
    errores = Object.assign(scope.state.error, r);
    scope.setState({error: errores});
  }
};

export const renderErrores = (scope, input) => {
  if (!scope.state.error[input]) {
    return;
  }
  return scope.state.error[input].map((e) => {
    return <Text style={styleInput.error}>{e}</Text>;
  });
};
