import {
  ACTION_CAPACITACION_CARGANDO,
  ACTION_CAPACITACION_CARGADA,
  ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
  ACTION_ACTIVIDAD_MARCAR_LEIDA,
  ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
} from '../Constantes';

import produce from 'immer';

const initialState = {
  cargando: false,
  id: '',
  titulo: '',
  descripcion: '',
  acerca_de: '',
  video_introduccion: '',
  secciones: [],
  actividad_seleccionada: {},
};
export default Capacitacion = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CAPACITACION_CARGANDO:
        draft.cargando = true;
        break;
      case ACTION_CAPACITACION_CARGADA:
        draft.id = action.id;
        draft.titulo = action.titulo;
        draft.descripcion = action.descripcion;
        draft.acerca_de = action.acerca_de;
        draft.video_introduccion = action.video_introduccion;
        draft.secciones = action.secciones;
        draft.cargando = false;
        break;
      case ACTION_CAPACITACION_OBTENER_ACTIVIDAD:
        draft.actividad_seleccionada = state.secciones
          .find((s) => s.id == action.seccion_index)
          .actividades.find((a) => a.id == action.actividad_index);
        break;
      case ACTION_ACTIVIDAD_MARCAR_LEIDA:
        draft.secciones
          .find((s) => s.id == action.seccion_index)
          .actividades.find((a) => a.id == action.actividad_index).visualizado =
          action.estado;
        draft.actividad_seleccionada.visualizado = action.estado;
        break;
      case ACTION_ACTIVIDAD_SELECCIONAR_OPCION:
        draft.secciones
          .find((s) => s.id == action.seccion_id)
          .actividades.find((a) => a.id == action.actividad_id)
          .preguntas.find((p) => p.id == action.index_pregunta).seleccionada =
          action.opcion;
        draft.actividad_seleccionada.preguntas.find(
          (p) => p.id == action.index_pregunta,
        ).seleccionada = action.opcion;
        //draft.secciones.find(s=>s.id==action.seccion_id).preguntas.find(a=>a.id==action.index_pregunta).seleccionada=action.opcion
        break;
    }
  });
};
/*
export default Capacitacion = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CAPACITACION_CARGANDO:
      return {...state, cargando: true};
    case ACTION_CAPACITACION_CARGADA:
      console.log('Video ', action.video_introduccion);
      return {
        ...state,
        id: action.id,
        titulo: action.titulo,
        descripcion: action.descripcion,
        acerca_de: action.acerca_de,
        video_introduccion: action.video_introduccion,
        secciones: action.secciones,
        cargando: false,
      };
    case ACTION_CAPACITACION_OBTENER_ACTIVIDAD:
        console.log('Seccion ',action.seccion_index)
        console.log('Actividad ',action.actividad_index)
      
      let actividad =state.secciones.find(s=>s.id==action.seccion_index).actividades.find(a=>a.id==action.actividad_index)

      if (actividad) {
          console.log("Encontrada ",actividad.titulo)
           // actividad.visualizado = !actividad.visualizado? false : actividad.visualizado;
            state.actividad_seleccionada = actividad;
      } else {
        console.log('actividad no encontrada');
      }

      return {...state,actividad_seleccionada:{...state.actividad_seleccionada}};
    case ACTION_ACTIVIDAD_MARCAR_LEIDA:
      return produce(state, (draft) => {

        console.log('Marcar leida ', action.estado,' ',action);
        draft.secciones.find(s=>s.id==action.seccion_index).actividades.find(a=>a.id==action.actividad_index).visualizado = action.estado;
        draft.actividad_seleccionada.visualizado = action.estado;
      });
    case ACTION_ACTIVIDAD_SELECCIONAR_OPCION:
      return produce(state, (draft) => {
        draft.actividad_seleccionada.preguntas[
          action.index_pregunta
        ].seleccionada = action.opcion;
      });
    default:
      return state;
  }
};
*/
