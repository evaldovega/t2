import {
  ACTION_CLIENT_LOADING,
  ACTION_CLIENT_LOADED,
  ACTION_CLIENT_ERROR,
  ACTION_CLIENT_CHANGE_PROP,
  ACTION_CLIENT_SAVED_ERROR,
  ACTION_CLIENT_SAVEING,
  ACTION_CLIENT_SAVED,
} from '../Constantes';
import produce from 'immer';

const initial_state = {
  loading: false,
  id: '',
  primer_nombre: '',
  segundo_nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  numero_cedula: '',
  correo_electronico: '',
  numero_telefono: '',
  genero: '',
  error: '',
};

export default Client = (state = initial_state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CLIENT_LOADING:
      case ACTION_CLIENT_SAVEING:
        draft.loading = true;
        draft.error = '';
        break;
      case ACTION_CLIENT_CHANGE_PROP:
        console.log('Modificar ', action.prop, action.value);
        draft[action.prop] = action.value;
        break;
      case ACTION_CLIENT_LOADED:
        draft.loading = false;
        draft.id = action.data.id;
        draft.primer_nombre = action.data.primer_nombre;
        draft.segundo_nombre = action.data.segundo_nombre;
        draft.primer_apellido = action.data.primer_apellido;
        draft.segundo_apellido = action.data.segundo_apellido;
        draft.numero_cedula = action.data.numero_cedula;
        draft.numero_telefono = action.data.numero_telefono;
        draft.genero = action.data.genero;
        draft.correo_electronico = action.data.correo_electronico;
        break;
      case ACTION_CLIENT_ERROR:
      case ACTION_CLIENT_SAVED_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case ACTION_CLIENT_SAVED:
        draft.loading = false;
        draft.error = '';
        break;
    }
  });
};
