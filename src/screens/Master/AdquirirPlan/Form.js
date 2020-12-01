import React from 'react';
import {TextInput} from 'react-native';

function Input() {
  return <TextInput ev-model="nombre" />;
}

class Form extends React.Component {
  state = {
    nombre: '',
  };

  render() {
    return <View>{this.props.children}</View>;
  }
}

export default Form;
