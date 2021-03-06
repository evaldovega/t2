import {
  ACTION_CLIENT_LOADING,
  ACTION_CLIENT_LOADED,
  ACTION_CLIENT_ERROR,
  ACTION_CLIENT_CHANGE_PROP,
  ACTION_CLIENT_SAVED_ERROR,
  ACTION_CLIENT_SAVEING,
  ACTION_CLIENT_SAVED,
  ACTION_CLIENT_CLEAN,
  ACTION_CLIENT_ADD_ORDEN,
  ACTION_CLIENT_REMOVE_ORDEN,
  ACTION_CLIENT_SAVED_TASK,
  ACTION_CLIENT_SAVING_TASK,
  ACTION_CLIENT_ERROR_TASK,
  ACTION_CLIENT_REMOVED_TASK,
  ACTION_CLIENT_REMOVING_TASK,
  ACTION_CLIENT_ERROR_REMOVING_TASK,
} from '../Constantes';
import produce from 'immer';

const initial_state = {
  loading: false,
  loading_client: false,
  clear: true,
  id: '',
  primer_nombre: '',
  segundo_nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  numero_cedula: '',
  correo_electronico: '',
  numero_telefono: '',
  ordenes: [],
  tareas: [],
  genero: '',
  error: '',
  success: '',
};

export default Client = (state = initial_state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CLIENT_LOADING:
      case ACTION_CLIENT_SAVEING:
        draft.loading = true;
        draft.error = '';
        draft.success = '';
        break;
      case ACTION_CLIENT_CLEAN:
        draft.clear = true;
        draft.loading_client = true;
        draft.error = '';
        draft.success = '';
        draft.id = '';
        draft.primer_nombre = '';
        draft.segundo_nombre = '';
        draft.primer_apellido = '';
        draft.segundo_apellido = '';
        draft.numero_cedula = '';
        draft.numero_telefono = '';
        draft.genero = '';
        draft.correo_electronico = '';
        draft.ordenes = [];
        draft.tareas = [];
        break;
      case ACTION_CLIENT_CHANGE_PROP:
        console.log('Modificar ', action.prop, action.value);
        draft[action.prop] = action.value;
        break;
      case ACTION_CLIENT_LOADED:
        draft.loading = false;
        draft.loading_client = false;
        draft.id = action.data.id;
        draft.primer_nombre = action.data.primer_nombre;
        draft.segundo_nombre = action.data.segundo_nombre;
        draft.primer_apellido = action.data.primer_apellido;
        draft.segundo_apellido = action.data.segundo_apellido;
        draft.numero_cedula = action.data.numero_cedula;
        draft.numero_telefono = action.data.numero_telefono;
        draft.genero = action.data.genero;
        draft.correo_electronico = action.data.correo_electronico;
        draft.ordenes = action.data.ordenes ? action.data.ordenes : [];
        draft.tareas = action.data.tareas;
        draft.success = '';
        break;
      case ACTION_CLIENT_ERROR:
      case ACTION_CLIENT_SAVED_ERROR:
        draft.loading = false;
        draft.error = action.error;
        draft.success = '';
        break;
      case ACTION_CLIENT_SAVED:
        draft.loading = false;
        draft.error = '';

        if (draft.id == '') {
          draft.success = 'Registro exitoso';
          draft.id = '';
          draft.primer_nombre = '';
          draft.segundo_nombre = '';
          draft.primer_apellido = '';
          draft.segundo_apellido = '';
          draft.numero_cedula = '';
          draft.numero_telefono = '';
          draft.genero = '';
          draft.correo_electronico = '';
          draft.ordenes = [];
          draft.tareas = [];
        } else {
          draft.success = 'Edici??n exitosa';
        }
        break;
      case ACTION_CLIENT_ADD_ORDEN:
        draft.ordenes.unshift({...action.orden, ...{resaltar: true}});
        break;
      case ACTION_CLIENT_REMOVE_ORDEN:
        let index_orden = draft.ordenes.findIndex(
          (o) => o.id == action.orden.id,
        );
        if (index_orden > -1) {
          if (action.orden.animar) {
            draft.ordenes[index_orden].animacion = 'out';
          } else {
            draft.ordenes.splice(index_orden, 1);
          }
        }
        break;
      case ACTION_CLIENT_SAVING_TASK:
        draft.loading = true;
        draft.error = '';
        draft.success = '';
        break;
      case ACTION_CLIENT_SAVED_TASK:
        draft.loading = false;
        draft.success = 'Tarea programada correctamente';
        draft.tareas.push(action.task);
        break;
      case ACTION_CLIENT_ERROR_TASK:
        draft.loading = false;
        draft.error = action.error;
        break;
      case ACTION_CLIENT_REMOVING_TASK:
        draft.loading = true;
        draft.error = '';
        draft.success = '';
        break;
      case ACTION_CLIENT_REMOVED_TASK:
        draft.loading = false;
        draft.error = '';
        draft.success = 'Tarea removida';
        let index = draft.tareas.findIndex((t) => t.id == action.id);
        if (index >= 0) {
          draft.tareas.splice(index, 1);
        }
        break;
      case ACTION_CLIENT_ERROR_REMOVING_TASK:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });
};
