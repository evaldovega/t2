import {
  ACTION_INICIAR_SESION,
  ACTION_CAMBIAR_NOMBRE_USUARIO,
  ACTION_CAPACITACIONES_CARGANDO,
  ACTION_CAPACITACIONES_CARGADAS,
  ACTION_CAPACITACIONES_ERROR,
  ACTION_CAPACITACION_CARGANDO,
  ACTION_CAPACITACION_CARGADA,
  ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
  ACTION_ACTIVIDAD_MARCAR_LEIDA,
  ACTION_ACTIVIDAD_MARCANDO_LEIDA,
  ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
  ACTION_CAPACITACION_ERROR,
} from '../Constantes';

import {Token} from '../Utils';

import {SERVER_ADDRESS} from '../../constants';

export const usuarioCambiarNombre = (nombre) => {
  console.log('Cambiar nombre ', nombre);
  return (dispatch) => {
    dispatch({type: ACTION_CAMBIAR_NOMBRE_USUARIO, nombre});
  };
};

export const capacitacionesCargar = () => {
  return async (dispatch) => {
    dispatch({type: ACTION_CAPACITACIONES_CARGANDO});
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/capacitaciones/', {
      headers: {
        Authorization: 'Token ' + token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        dispatch({type: ACTION_CAPACITACIONES_CARGADAS, listado: data});
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CAPACITACIONES_ERROR});
      });
  };
};

export const capacitacionDetalleCargar = (id) => {
  return async (dispatch) => {
    dispatch({type: ACTION_CAPACITACION_CARGANDO});
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/capacitaciones/' + id + '/', {
      headers: {Authorization: 'token ' + token},
    })
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
  return async (dispatch) => {
    dispatch({type: ACTION_ACTIVIDAD_MARCANDO_LEIDA});
    let token = await Token();
    console.log('Marcar visualizada token ', token);
    fetch(
      SERVER_ADDRESS + 'api/actividades/' + actividad_index + '/visualizar/',
      {
        method: 'GET',
        headers: {
          Authorization: 'token ' + token,
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        dispatch({
          type: ACTION_ACTIVIDAD_MARCAR_LEIDA,
          seccion_index,
          actividad_index,
          estado,
        });
      })
      .catch((error) => {
        console.log('Error marcando visualizada');
        console.log(error);
        dispatch({type: ACTION_CAPACITACION_ERROR});
      });
  };
};

export const actividadSeleccionarOpcion = (
  seccion_id,
  actividad_id,
  index_pregunta,
  opcion,
) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
      seccion_id: seccion_id,
      actividad_id: actividad_id,
      index_pregunta: index_pregunta,
      opcion: opcion,
    });
  };
};
