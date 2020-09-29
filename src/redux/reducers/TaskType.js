import {
  ACTION_TIPO_TAREA_CARGANDO,
  ACTION_TIPO_TAREA_CARGADAS,
  ACTION_TIPO_TAREA_ERROR,
} from '../Constantes';
import produce from 'immer';

const initialState = {
  cargando: false,
  listado: [],
};
export default TaskType = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_TIPO_TAREA_CARGANDO:
        draft.cargando = true;
        draft.listado = [];
        break;
      case ACTION_TIPO_TAREA_CARGADAS:
        draft.cargando = false;
        draft.listado = action.listado;
        break;
      case ACTION_TIPO_TAREA_ERROR:
        draft.cargando = false;
        break;
    }
  });
};
