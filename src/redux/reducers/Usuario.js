import {
  ACTION_CAMBIAR_NOMBRE_USUARIO,
  ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,
  ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_INIT,
} from '../Constantes';
import produce from 'immer';

const initialState = {
  nombre: '',
  nivel: 'Agente corredor',
  estado: 'Activo',
  logeado: false,
  foto_perfil: '',
  token: '',
  entrenamiento_completado: false,
  accediendo: false,
  actualizando_foto: false,
  error: '',
};

export default Usuario = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CAMBIAR_NOMBRE_USUARIO:
        draft.nombre = action.nombre;
      default:
      case ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL:
        draft.actualizando_foto = true;
        draft.error = '';
        break;
      case ACTION_USUARIO_FOTO_PERFIL_CAMBIADA:
        draft.actualizando_foto = false;
        draft.foto_perfil = action.foto;
        break;
      case ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL:
        draft.actualizando_foto = false;
        draft.error = action.error;
        break;
      case ACTION_USUARIO_INIT:
        draft.foto_perfil = action.foto;
        draft.token = action.token;
        draft.logeado = true;
        break;
    }
  });
};
