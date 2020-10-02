import {
  ACTION_PRODUCTOS_CARGANDO,
  ACTION_PRODUCTOS_CARGADOS,
  ACTION_PRODUCTOS_ERROR,
} from '../Constantes';

import {SERVER_ADDRESS} from '../../constants';

export const cargar = () => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_PRODUCTOS_CARGANDO});

    fetch(SERVER_ADDRESS + 'api/productos/', {
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
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
