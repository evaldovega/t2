import React, {useEffect, useState} from 'react';
import validate from 'utils/validate.min.js';
import {Text} from 'react-native';

const Validator = (props) => {
  const [errores, setError] = useState([]);
  const [value, setValue] = useState('');
  const [valueB, setValueB] = useState(null);

  /*
  useEffect(()=>{
    setValue(props.value);
  })
  /*
  useEffect(()=>{
    if(props.value2){
      setValueB(props.value2)
    }
  })*/

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
};

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}

export default logProps(Validator);
