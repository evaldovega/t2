import {
  ACTION_CAMBIAR_NOMBRE_USUARIO,
  ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,
  ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_INIT,
  ACTION_USUARIO_ACCEDER,
  ACTION_USUARIO_ACCESO_CORRECTO,
  ACTION_USUARIO_ERROR_ACCEDIENDO,
  ACTION_USUARIO_SALIR,
  ACTION_USUARIO_SUBIENDO_IDE,
  ACTION_USUARIO_IDE_SUBIDA,
  ACTION_USUARIO_ERROR_SUBIENDO_IDE,
  ACTION_ACTUALIZANDO_PERFIL,
  ACTION_PERFIL_ACTUALIZADO,
  ACTION_ERROR_ACTUALIZANDO_PERFIL,
  ACTION_USUARIO_ACTUALIZAR_PROP,
} from '../Constantes';
import produce from 'immer';

const initialState = {
  nombre: '',
  num_documento_identidad: '',
  habilitado: false,
  nivel: 'Agente corredor',
  estado: 'Activo',
  logeado: false,
  foto_perfil: '',
  token: '',
  entrenamiento_completado: false,
  accediendo: false,
  actualizando_foto: false,
  error: '',
  subiendo_ide: false,
  ide_foto_frente: '',
  ide_foto_respaldo: '',
  error_subiendo_ide: '',
  actualizando_perfil: false,
  error_actualizando_perfil: '',
};

export default Usuario = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_USUARIO_ACCEDER:
        draft.error = '';
        draft.logeado = false;
        draft.token = '';
        draft.accediendo = true;
        break;
      case ACTION_USUARIO_ACCESO_CORRECTO:
        draft.logeado = true;
        draft.token = action.token;
        draft.accediendo = false;
        break;
      case ACTION_USUARIO_ERROR_ACCEDIENDO:
        draft.error = action.error;
        draft.accediendo = false;
        break;
      case ACTION_USUARIO_SALIR:
        draft.token = '';
        draft.nombre = '';
        draft.logeado = false;
        draft.foto_perfil = '';
        break;
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
        draft.id = action.id;
        draft.nombre = action.nombre;
        draft.foto_perfil = action.foto;
        draft.email = action.email;
        draft.cel = action.cel;
        draft.token = action.token;
        draft.num_documento_identidad = action.num_documento_identidad;
        draft.ide_foto_respaldo = action.ide_foto_respaldo;
        draft.ide_foto_frente = action.ide_foto_frente;
        draft.habilitado = action.habilitado;
        if (action.token) {
          console.log('Esta logeado');
          draft.logeado = true;
        } else {
          draft.logeado = false;
        }
        break;
      case ACTION_USUARIO_SUBIENDO_IDE:
        draft.subiendo_ide = true;
        draft.error_subiendo_ide = '';
        if (action.lado == 'frente') {
          draft.ide_foto_frente = '';
        } else {
          draft.ide_foto_respaldo = '';
        }
        break;
      case ACTION_USUARIO_IDE_SUBIDA:
        draft.subiendo_ide = false;

        if (action.lado == 'frente') {
          draft.ide_foto_frente = action.ide;
        } else {
          draft.ide_foto_respaldo = action.ide;
        }
        break;
      case ACTION_USUARIO_ERROR_SUBIENDO_IDE:
        draft.subiendo_ide = false;
        draft.error_subiendo_ide = action.error;
        break;
      case ACTION_ACTUALIZANDO_PERFIL:
        draft.actualizando_perfil = true;
        draft.error_actualizando_perfil = '';
        break;
      case ACTION_PERFIL_ACTUALIZADO:
        draft.actualizando_perfil = false;
        break;
      case ACTION_ERROR_ACTUALIZANDO_PERFIL:
        draft.actualizando_perfil = false;
        draft.error_actualizando_perfil = action.error;
        break;
      case ACTION_USUARIO_ACTUALIZAR_PROP:
        draft[action.p] = action.v;
        break;
    }
  });
};
