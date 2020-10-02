import produce from 'immer';
import {
  ACTION_CAPACITACIONES_CARGANDO,
  ACTION_CAPACITACIONES_CARGADAS,
  ACTION_CAPACITACIONES_ERROR,
  ACTION_CAPACITACION_INC_PROGRESO,
} from '../Constantes';
const initialState = {
  cargando: false,
  listado: [],
  error: '',
};

export default Capacitaciones = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CAPACITACIONES_CARGANDO:
        draft.cargando = true;
        draft.listado = [];
        draft.error = '';
        break;
      case ACTION_CAPACITACIONES_CARGADAS:
        draft.cargando = false;
        draft.listado = action.listado;
        break;
      case ACTION_CAPACITACIONES_ERROR:
        draft.cargando = false;
        draft.error = action.error;
        break;
      case ACTION_CAPACITACION_INC_PROGRESO:
        try {
          draft.listado.find((l) => l.id == action.capacitacion_id).progreso =
            action.progreso;
        } catch (error) {
          console.log('Error al cambiar progreso ', actio.capacitacion_id);
          console.log(draft.listado);
        }
        break;
    }
  });
};
