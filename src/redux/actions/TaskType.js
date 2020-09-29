import {
  ACTION_TIPO_TAREA_CARGANDO,
  ACTION_TIPO_TAREA_CARGADAS,
  ACTION_TIPO_TAREA_ERROR,
} from '../Constantes';

import {Token} from '../Utils';
import {SERVER_ADDRESS} from '../../constants';

export const cargar = () => {
  return async (dispatch) => {
    dispatch({type: ACTION_TIPO_TAREA_CARGANDO});
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/config/tipo-tarea', {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Tipos de tareas cargados');
        console.log(r);
        setTimeout(() => {
          dispatch({type: ACTION_TIPO_TAREA_CARGADAS, listado: r});
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_TIPO_TAREA_ERROR, error: error.toString()});
      });
  };
};
