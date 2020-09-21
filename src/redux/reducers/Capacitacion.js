import {
  ACTION_CAPACITACION_CARGANDO,
  ACTION_CAPACITACION_CARGADA,
  ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
  ACTION_ACTIVIDAD_MARCANDO_LEIDA,
  ACTION_ACTIVIDAD_MARCAR_LEIDA,
  ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
  ACTION_CAPACITACION_ERROR,
  ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO,
  ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_OK,
  ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_ERROR,
  ACTION_ACTIVIDAD_MARCAR_ERROR_PREGUNTA,
  ACTION_ACTIVIDAD_INTENTO,
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
  error: '',
  cuestionario_aprobado: false,
};
export default Capacitacion = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CAPACITACION_CARGANDO:
        draft.cargando = true;
        draft.error = '';
        break;
      case ACTION_CAPACITACION_CARGADA:
        draft.id = action.id;
        draft.titulo = action.titulo;
        draft.descripcion = action.descripcion;
        draft.acerca_de = action.acerca_de;
        draft.video_introduccion = action.video_introduccion;
        draft.secciones = action.secciones;
        draft.cargando = false;
        draft.error = '';
        break;
      case ACTION_CAPACITACION_ERROR:
        draft.cargando = false;
        draft.error = action.error;
      case ACTION_CAPACITACION_OBTENER_ACTIVIDAD:
        draft.cargando = false;
        draft.actividad_seleccionada = state.secciones
          .find((s) => s.id == action.seccion_index)
          .actividades.find((a) => a.id == action.actividad_index);
        break;
      case ACTION_ACTIVIDAD_MARCANDO_LEIDA:
        draft.error = '';
        draft.cargando = true;
        break;
      case ACTION_ACTIVIDAD_MARCAR_LEIDA:
        draft.error = '';
        draft.cargando = false;
        draft.secciones
          .find((s) => s.id == action.seccion_index)
          .actividades.find((a) => a.id == action.actividad_index).visualizado =
          action.estado;
        draft.actividad_seleccionada.visualizado = action.estado;
        break;
      case ACTION_ACTIVIDAD_SELECCIONAR_OPCION:
        draft.error = '';
        draft.cargando = false;
        draft.secciones
          .find((s) => s.id == action.seccion_id)
          .actividades.find((a) => a.id == action.actividad_id)
          .preguntas.find((p) => p.id == action.index_pregunta).seleccionada =
          action.opcion;
        draft.actividad_seleccionada.preguntas.find(
          (p) => p.id == action.index_pregunta,
        ).seleccionada = action.opcion;
        break;
      case ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO:
        draft.cuestionario_aprobado = false;
        draft.cargando = true;
        draft.error = '';
        draft.actividad_seleccionada.preguntas.map((p) => (p.error = ''));
        break;
      case ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_OK:
        draft.cargando = false;
        draft.error = '';
        draft.actividad_seleccionada.intentos_user += 1;
        draft.actividad_seleccionada.aprobado = action.aprobado;
        draft.actividad_seleccionada.calificacion = action.calificacion;
        draft.secciones
          .find((s) => s.id == action.seccion_id)
          .actividades.find((a) => a.id == action.actividad_id).aprobado =
          action.aprobado;
        draft.cuestionario_aprobado = action.aprobado;
        break;
      case ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_ERROR:
        draft.cargando = false;
        draft.error = action.error;
        break;
      case ACTION_ACTIVIDAD_MARCAR_ERROR_PREGUNTA:
        draft.cargando = false;
        console.log('Marcar pregunta ', action.pregunta_id, ' como errada');
        draft.actividad_seleccionada.preguntas.find(
          (p) => p.id == action.pregunta_id,
        ).error = action.error;
        break;
      case ACTION_ACTIVIDAD_INTENTO:
        draft.actividad_seleccionada.intentos_user += 1;
        break;
    }
  });
};
