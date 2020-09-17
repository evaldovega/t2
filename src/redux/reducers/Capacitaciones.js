import {
  ACTION_CAPACITACIONES_CARGANDO,
  ACTION_CAPACITACIONES_CARGADAS,
} from '../Constantes';
const initialState = {
  cargando: false,
  listado: [],
};

export default Capacitaciones = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CAPACITACIONES_CARGANDO:
      return {...state, cargando: true};
    case ACTION_CAPACITACIONES_CARGADAS:
      return {...state, listado: action.listado, cargando: false};

    default:
      return state;
  }
};
