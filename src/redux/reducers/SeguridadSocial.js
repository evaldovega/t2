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
import produce from 'immer';
const estado_inicial = {
  subiendo: false,
  error_subiendo: '',
  error_cargando: '',
  cargando: false,
  archivos: [],
};
export default SeguridadSocial = (state = estado_inicial, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_SUBIENDO_SC:
        draft.subiendo = true;
        draft.error_subiendo = '';
        break;
      case ACTION_ERROR_SUBIENDO_SC:
        draft.subiendo = false;
        draft.error_subiendo = action.error;
        break;
      case ACTION_SC_SUBIDA:
        draft.archivos.push(action.archivo);
        draft.subiendo = false;
        break;
      case ACTION_CARGANDO_SC:
        draft.cargando = true;
        draft.error_cargando = '';
        break;
      case ACTION_SC_CARGADAS:
        draft.cargando = false;
        draft.archivos = action.archivos;
        break;
      case ACTION_ERROR_CARGANDO_SC:
        draft.cargando = false;
        draft.error_cargando = action.error;
        break;
      case ACTION_BORRANDO_SC:
        try {
          draft.archivos.find((a) => a.id == action.id).borrando = true;
        } catch (error) {}
        break;
      case ACTION_ERROR_BORRANDO_SC:
        try {
          draft.archivos.find((a) => a.id == action.id).borrando = false;
        } catch (error) {}
        break;
      case ACTION_SC_BORRADA:
        try {
          let index = draft.archivos.findIndex((a) => a.id == action.id);
          if (index >= 0) {
            draft.archivos.splice(index, 1);
          }
        } catch (error) {}
        break;
    }
  });
};
