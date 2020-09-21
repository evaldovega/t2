import {
  ACTION_CLIENTS_LOADING,
  ACTION_CLIENTS_LOADED,
  ACTION_CLIENTS_ERROR,
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
      headers: {},
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
