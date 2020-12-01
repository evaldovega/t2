import {SERVER_ADDRESS} from '../../constants';
import {
  ACTION_SUBIENDO_SC,
  ACTION_SC_SUBIDA,
  ACTION_ERROR_SUBIENDO_SC,
  ACTION_CARGANDO_SC,
  ACTION_SC_CARGADAS,
  ACTION_ERROR_CARGANDO_SC,
  ACTION_BORRANDO_SC,
  ACTION_SC_BORRADA,
  ACTION_ERROR_BORRANDO_SC,
} from '../Constantes';
const RNFetchBlob = require('rn-fetch-blob').default;

export const cargar = () => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CARGANDO_SC});
    fetch(SERVER_ADDRESS + 'api/seguridadsocial/', {
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        dispatch({type: ACTION_SC_CARGADAS, archivos: data});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_ERROR_CARGANDO_SC, error: error.toString()});
      });
  };
};

export const borrar = (id) => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_BORRANDO_SC, id: id});
    fetch(SERVER_ADDRESS + 'api/seguridadsocial/' + id + '/', {
      method: 'delete',
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
      },
    })
      .then((data) => {
        console.log(data);
        dispatch({type: ACTION_SC_BORRADA, id: id});
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: ACTION_ERROR_BORRANDO_SC,
          id: id,
          error: error.toString(),
        });
      });
  };
};

export const subir = (file, fecha) => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_SUBIENDO_SC});
    RNFetchBlob.fetch(
      'POST',
      SERVER_ADDRESS + 'api/usuarios/aportes/',
      {
        Authorization: 'Token ' + getState().Usuario.token,
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'archivo',
          filename: file.name,
          type: file.type,
          data: RNFetchBlob.wrap(file.uri),
        },
        {name: 'user', data: getState().Usuario.id.toString()},
        {name: 'fecha', data: fecha},
        {name: 'token', data: getState().Usuario.token},
      ],
    )
      .then((resp) => {
        if (resp.respInfo.status == 200) {
          console.log(resp);
          const response = resp.json();
          dispatch({type: ACTION_SC_SUBIDA, archivo: response});
        } else {
          dispatch({type: ACTION_ERROR_SUBIENDO_SC, error: resp.text()});
        }
      })
      .catch((error) => {
        dispatch({type: ACTION_ERROR_SUBIENDO_SC, error: error.toString()});
      });
  };
};
