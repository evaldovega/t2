import {
  ACTION_PRODUCTOS_CARGANDO,
  ACTION_PRODUCTOS_CARGADOS,
  ACTION_PRODUCTOS_ERROR,
} from '../Constantes';
import produce from 'immer';

const initialState = {
  cargando: false,
  listado: [],
};
export default PRODUCTOS = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_PRODUCTOS_CARGANDO:
        draft.cargando = true;
        draft.listado = [];
        break;
      case ACTION_PRODUCTOS_CARGADOS:
        draft.cargando = false;
        draft.listado = action.listado;
        break;
      case ACTION_PRODUCTOS_ERROR:
        draft.cargando = false;
        break;
    }
  });
};
