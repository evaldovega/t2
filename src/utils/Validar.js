import React from 'react';
import {Text} from 'react-native';
import {styleInput} from 'styles';
import validate from 'utils/validate.min.js';
import produce from 'immer';

export const totalErrores = (scope) => {
  let total = 0;

  Object.keys(scope.state.error).forEach((k) => {
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
  return new Promise((resolve, reject) => {
    let start = new Date().getTime();
    let errores = {};
    let object = {};
    let value = null;

    if (typeof input == 'object') {
      value = input[key_error];
      object = input;
    } else {
      value = input;
      object[key_error] = input;
    }

    value = !value ? '' : value;

    requestAnimationFrame(() => {
      scope.setState(
        produce((draft) => {
          draft.values[key_error] = value;
        }),
      );
    });

    /*
    try{
      
      let state=scour(scope.state.values).set(key_error,value)
      scope.setState({values:{...state.get(key_error).value}})
    }catch(error){
      console.log(error)
    }*/

    let constraints = {};
    constraints[key_error] = constraint;
    errores = validate(object, constraints);

    if (errores && errores[key_error]) {
      scope.setState(
        produce((draft) => {
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
    }
    let end = new Date().getTime();
    console.log('Duracion ', end - start);
    resolve(errores);
  });
};

export const renderErrores = (scope, input) => {
  if (!scope.state.error[input]) {
    return;
  }
  return scope.state.error[input].map((e) => {
    return <Text style={styleInput.error}>{e}</Text>;
  });
};
