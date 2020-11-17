import React from 'react';
import {Text} from 'react-native';
import {styleInput} from 'styles';
import validate from 'utils/validate.min.js';
import produce from 'immer';

export const totalErrores = (scope) => {
  let total = 0;
  console.log(Object.keys(scope.state.error));
  Object.keys(scope.state.error).forEach((k) => {
    console.log(k, ' Tiene ', scope.state.error[k].length, ' errores');
    total += scope.state.error[k].length;
  });
  return total;
};

export const validar = (
  scope,
  input,
  key_error,
  constraint,
  por_props = true,
) => {
  let errores = {};
  let object = {};

  scope.setState(
    produce((draft) => {
      draft.values[key_error] = input;
    }),
  );

  if (por_props) {
    object[key_error] = scope.props[input];
  } else {
    //object[input] = scope.state[input];
    object[key_error] = input;
  }

  let constraints = {};
  constraints[key_error] = constraint;

  errores = validate(object, constraints);

  if (errores && errores[key_error]) {
    //let r = {};
    //r[input] = errores[input];
    //errores = Object.assign(scope.state.error, r);
    //scope.setState({error: {...errores}});
    scope.setState(
      produce((draft) => {
        console.log('Input ', key_error, 'Error ');
        draft.error[key_error] = errores[key_error];
      }),
    );
  } else {
    scope.setState(
      produce((draft) => {
        draft.error[key_error] = [];
      }),
    );
    let r = {};
    r[input] = [];
    //errores = Object.assign(scope.state.error, r);
    //scope.setState({error: errores});
  }
};

export const renderErrores = (scope, input) => {
  if (!scope.state.error[input]) {
    console.log(input, 'No encontrado');
    return;
  }
  return scope.state.error[input].map((e) => {
    return <Text style={styleInput.error}>{e}</Text>;
  });
};
