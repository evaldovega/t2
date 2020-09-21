import {
  ACTION_CLIENTS_LOADING,
  ACTION_CLIENTS_LOADED,
  ACTION_CLIENTS_ERROR,
  ACTION_CLIENT_LOADING,
  ACTION_CLIENT_LOADED,
  ACTION_CLIENT_ERROR,
  ACTION_CLIENT_CHANGE_PROP,
  ACTION_CLIENT_SAVED_ERROR,
  ACTION_CLIENT_SAVED,
  ACTION_CLIENT_SAVEING,
} from '../Constantes';
import {Token} from '../Utils';
import {SERVER_ADDRESS} from '../../constants';

export const loadClients = () => {
  return async (dispatch) => {
    dispatch({type: ACTION_CLIENTS_LOADING});
    console.log('Loading clients');
    let token = await Token();
    console.log(token);
    fetch(SERVER_ADDRESS + 'api/clientes/', {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Loaded clients');
        console.log(r);
        dispatch({type: ACTION_CLIENTS_LOADED, items: r});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENTS_ERROR, error: error.toString()});
      });
  };
};

export const loadClient = (id) => {
  return async (dispatch) => {
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/clientes/' + id, {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Loaded clients');
        console.log(r);
        dispatch({type: ACTION_CLIENT_LOADED, data: r});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENT_ERROR, error: error.toString()});
      });
  };
};

export const changeProp = (prop, value) => {
  return (dispatch) => {
    dispatch({type: ACTION_CLIENT_CHANGE_PROP, prop: prop, value: value});
  };
};

export const save = (props) => {
  return async (dispatch) => {
    dispatch({type: ACTION_CLIENT_SAVEING});
    let token = await Token();
    let method = props.id > 0 ? 'PUT' : 'POST';
    let url = props.id > 0 ? 'api/clientes/' + props.id + '/' : 'api/clientes/';
    let data = {
      primer_nombre: props.primer_nombre,
      segundo_nombre: props.segundo_nombre,
      primer_apellido: props.primer_apellido,
      segundo_apellido: props.segundo_apellido,
      numero_cedula: props.numero_cedula,
      correo_electronico: props.correo_electronico,
      genero: props.genero,
    };
    console.log(data);
    fetch(SERVER_ADDRESS + url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        Authorization: 'Token ' + token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        dispatch({type: ACTION_CLIENT_SAVED});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENT_SAVED_ERROR, error: error.toString()});
      });
  };
};