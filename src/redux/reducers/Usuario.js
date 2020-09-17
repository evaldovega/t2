import {ACTION_CAMBIAR_NOMBRE_USUARIO} from '../Constantes';

const initialState = {
  nombre: '',
  nivel: 'Agente corredor',
  estado: 'Activo',
  logeado: false,
  entrenamiento_completado: false,
  accediendo: false,
};
export default Usuario = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CAMBIAR_NOMBRE_USUARIO:
      return {...state, nombre: action.nombre};
    default:
      return state;
  }
};
