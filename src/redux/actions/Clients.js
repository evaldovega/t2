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
  ACTION_CLIENT_DELETING,
  ACTION_CLIENT_DELETED,
  ACTION_CLIENTS_REMOVE,
  ACTION_CLIENTS_ADD,
  ACTION_CLIENTS_EDIT,
  ACTION_CLIENT_CLEAN,
  ACTION_CLIENT_ADD_ORDEN,
  ACTION_CLIENT_SAVED_TASK,
  ACTION_CLIENT_SAVING_TASK,
  ACTION_CLIENT_ERROR_TASK,
  ACTION_CLIENT_REMOVED_TASK,
  ACTION_CLIENT_REMOVING_TASK,
  ACTION_CLIENT_ERROR_REMOVING_TASK,
} from '../Constantes';

import {SERVER_ADDRESS} from '../../constants';

export const loadClients = () => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CLIENTS_LOADING});
    console.log('Loading clients');

    fetch(SERVER_ADDRESS + 'api/clientes/', {
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
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
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CLIENT_CLEAN});
    if (id == '') {
      return;
    }
    dispatch({type: ACTION_CLIENT_LOADING});

    fetch(SERVER_ADDRESS + 'api/clientes/' + id, {
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Loaded clients');
        console.log(r);
        setTimeout(() => {
          dispatch({type: ACTION_CLIENT_LOADED, data: r});
        }, 1000);
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
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CLIENT_SAVEING});

    let method = props.id > 0 ? 'PUT' : 'POST';
    let url = props.id > 0 ? 'api/clientes/' + props.id + '/' : 'api/clientes/';
    let data = {
      primer_nombre: props.primer_nombre,
      segundo_nombre: props.segundo_nombre,
      primer_apellido: props.primer_apellido,
      segundo_apellido: props.segundo_apellido,
      numero_cedula: props.numero_cedula,
      numero_telefono: props.numero_telefono,
      correo_electronico: props.correo_electronico,
      genero: props.genero,
    };
    console.log(data);
    fetch(SERVER_ADDRESS + url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);

        dispatch({type: ACTION_CLIENT_SAVED});
        if (props.id != '') {
          dispatch({type: ACTION_CLIENTS_EDIT, item: r});
        } else {
          dispatch({type: ACTION_CLIENTS_ADD, item: r});
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENT_SAVED_ERROR, error: error.toString()});
      });
  };
};

export const trash = (id) => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CLIENT_DELETING});

    fetch(SERVER_ADDRESS + 'api/clientes/' + id + '/', {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((r) => {
        dispatch({type: ACTION_CLIENT_DELETED});
        dispatch({type: ACTION_CLIENTS_REMOVE, id: id});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENTS_ERROR, error: error});
      });
  };
};

export const taskRemove = (id) => {
  return async (dispatch, getState) => {
    console.log('Borrar tarea ' + id);
    dispatch({type: ACTION_CLIENT_REMOVING_TASK});

    fetch(SERVER_ADDRESS + 'api/tareas/' + id + '/', {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((r) => {
        dispatch({type: ACTION_CLIENT_REMOVED_TASK, id: id});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENT_ERROR_REMOVING_TASK, error: error});
      });
  };
};

export const addOrden = (orden) => {
  return (dispatch) => {
    dispatch({type: ACTION_CLIENT_ADD_ORDEN, orden: orden});
  };
};

export const taskSave = (cliente, data) => {
  return async (dispatch, getState) => {
    console.log('Guardar Tarea');
    dispatch({type: ACTION_CLIENT_SAVING_TASK});

    fetch(SERVER_ADDRESS + 'api/clientes/' + cliente + '/asignar/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        dispatch({type: ACTION_CLIENT_SAVED_TASK, task: r});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CLIENT_ERROR_TASK, error: error.toString()});
      });
  };
};
