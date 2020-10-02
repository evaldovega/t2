import {
  ACTION_PRODUCTOS_SET_METADATA,
  ACTION_PRODUCTOS_CARGANDO_DETALLE,
  ACTION_PRODUCTOS_DETALLE_CARGADO,
  ACTION_PRODUCTOS_ERROR_CARANDO_DETALLE,
  ACTION_PRODUCTOS_CARGANDO_FORMULARIO,
  ACTION_PRODUCTOS_FORMULARIO_CARGADO,
  ACTION_PRODUCTOS_ERROR_CARANDO_FORMULARIO,
} from '../Constantes';

import {SERVER_ADDRESS} from '../../constants';

export const setMetaData = (cliente_id, producto_id, plan_id) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_PRODUCTOS_SET_METADATA,
      producto_id: producto_id,
      plan_id: plan_id,
    });
  };
};
export const cargar = (producto_id) => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_PRODUCTOS_CARGANDO_DETALLE});

    fetch(SERVER_ADDRESS + 'api/productos/' + producto_id + '/', {
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Productos detalle cargado ', producto_id);
        console.log(r);
        setTimeout(() => {
          dispatch({type: ACTION_PRODUCTOS_DETALLE_CARGADO, detalle: r});
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: ACTION_PRODUCTOS_ERROR_CARANDO_DETALLE,
          error: error.toString(),
        });
      });
  };
};

export const cargarFormulario = (producto_id, plan_id) => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_PRODUCTOS_CARGANDO_FORMULARIO});

    fetch(
      SERVER_ADDRESS +
        'api/productos/' +
        producto_id +
        '/formulario/?plan=' +
        plan_id,
      {
        headers: {
          Authorization: 'Token ' + getState().Usuario.token,
        },
      },
    )
      .then((r) => r.json())
      .then((r) => {
        dispatch({
          type: ACTION_PRODUCTOS_FORMULARIO_CARGADO,
          formulario_producto: r.formulario_producto,
          formulario_plan: r.formulario_plan,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: ACTION_PRODUCTOS_ERROR_CARANDO_FORMULARIO,
          error: error.toString(),
        });
      });
  };
};
