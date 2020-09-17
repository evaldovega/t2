import {
  ACTION_INICIAR_SESION,
  ACTION_CAMBIAR_NOMBRE_USUARIO,
  ACTION_CAPACITACIONES_CARGANDO,
  ACTION_CAPACITACIONES_CARGADAS,
  ACTION_CAPACITACION_CARGANDO,
  ACTION_CAPACITACION_CARGADA,
  ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
  ACTION_ACTIVIDAD_MARCAR_LEIDA,
  ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
} from '../Constantes';

import {SERVER_ADDRESS} from '../../constants';

export const usuarioCambiarNombre = (nombre) => {
  console.log('Cambiar nombre ', nombre);
  return (dispatch) => {
    dispatch({type: ACTION_CAMBIAR_NOMBRE_USUARIO, nombre});
  };
};

export const capacitacionesCargar = () => {
  return (dispatch) => {
    dispatch({type: ACTION_CAPACITACIONES_CARGANDO});
    fetch(SERVER_ADDRESS + 'api/capacitaciones/')
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        dispatch({type: ACTION_CAPACITACIONES_CARGADAS, listado: data});
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const capacitacionDetalleCargar = (id) => {
  return (dispatch) => {
    dispatch({type: ACTION_CAPACITACION_CARGANDO});
    fetch(SERVER_ADDRESS + 'api/capacitaciones/' + id + '/')
      .then((r) => r.json())
      .then((data) => {
        if (data.video_introduccion) {
          let video_id = data.video_introduccion.split('v=')[1];
          console.log(video_id);
          data.video_introduccion = video_id;
        }
        return data;
      })
      .then((data) =>
        dispatch({
          type: ACTION_CAPACITACION_CARGADA,
          titulo: data.titulo,
          descripcion: data.descripcion,
          acerca_de: data.acerca_de,
          video_introduccion: data.video_introduccion,
          secciones: data.secciones,
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  };
};

export const capacitacionDetalleObtenerActividad = (
  seccion_index,
  actividad_index,
) => {
  console.log('Seccion ', seccion_index);
  return (dispatch) => {
    dispatch({
      type: ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
      seccion_index,
      actividad_index,
    });
  };
};
export const actividadMarcarLeida = (
  seccion_index,
  actividad_index,
  estado,
) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_ACTIVIDAD_MARCAR_LEIDA,
      seccion_index,
      actividad_index,
      estado,
    });
  };
};

export const actividadSeleccionarOpcion = (index_pregunta, opcion) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
      index_pregunta: index_pregunta,
      opcion: opcion,
    });
  };
};
