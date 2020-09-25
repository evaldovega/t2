import {
  ACTION_PRODUCTOS_CARGANDO,
  ACTION_PRODUCTOS_CARGADOS,
  ACTION_PRODUCTOS_ERROR,
} from '../Constantes';

import {Token} from '../Utils';
import {SERVER_ADDRESS} from '../../constants';

export const cargar = () => {
  return async (dispatch) => {
    dispatch({type: ACTION_PRODUCTOS_CARGANDO});
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/productos/', {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Productos cargados');
        console.log(r);
        setTimeout(() => {
          dispatch({type: ACTION_PRODUCTOS_CARGADOS, listado: r});
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_PRODUCTOS_ERROR, error: error.toString()});
      });
  };
};
