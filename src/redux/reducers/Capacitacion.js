import {
  ACTION_CAPACITACION_CARGANDO,
  ACTION_CAPACITACION_CARGADA,
  ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
  ACTION_ACTIVIDAD_MARCANDO_LEIDA,
  ACTION_ACTIVIDAD_MARCAR_LEIDA,
  ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
  ACTION_CAPACITACION_ERROR,
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
      case ACTION_CAPACITACION_ERROR:
        draft.cargando = false;
      case ACTION_CAPACITACION_OBTENER_ACTIVIDAD:
        draft.actividad_seleccionada = state.secciones
          .find((s) => s.id == action.seccion_index)
          .actividades.find((a) => a.id == action.actividad_index);
        break;
      case ACTION_ACTIVIDAD_MARCANDO_LEIDA:
        draft.cargando = true;
        break;
      case ACTION_ACTIVIDAD_MARCAR_LEIDA:
        draft.cargando = false;
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
        break;
    }
  });
};
