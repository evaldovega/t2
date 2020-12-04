import {
  ACTION_CAPACITACIONES_CARGANDO,
  ACTION_CAPACITACIONES_CARGADAS,
  ACTION_CAPACITACIONES_ERROR,
  ACTION_CAPACITACION_INC_PROGRESO,
  ACTION_CAPACITACION_CARGANDO,
  ACTION_CAPACITACION_CARGADA,
  ACTION_CAPACITACION_OBTENER_ACTIVIDAD,
  ACTION_ACTIVIDAD_MARCAR_LEIDA,
  ACTION_ACTIVIDAD_MARCANDO_LEIDA,
  ACTION_ACTIVIDAD_SELECCIONAR_OPCION,
  ACTION_CAPACITACION_ERROR,
  ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO,
  ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_ERROR,
  ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_OK,
  ACTION_ACTIVIDAD_MARCAR_ERROR_PREGUNTA,
  ACTION_ACTIVIDAD_INTENTO,
  ACTION_USUARIO_HABILITAR,
} from '../Constantes';
import SInfo from 'react-native-sensitive-info';
import {Token} from '../Utils';

import {SERVER_ADDRESS} from '../../constants';

export const capacitacionesCargar = () => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CAPACITACIONES_CARGANDO});
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/capacitaciones/', {
      headers: {
        Authorization: 'Token ' + getState().Usuario.token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data.detail && data.detail != '') {
          dispatch({type: ACTION_CAPACITACIONES_ERROR, error: data.detail});
        } else {
          dispatch({type: ACTION_CAPACITACIONES_CARGADAS, listado: data});
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({type: ACTION_CAPACITACIONES_ERROR, error: error.toString()});
      });
  };
};

export const capacitacionDetalleCargar = (id) => {
  return async (dispatch, getState) => {
    dispatch({type: ACTION_CAPACITACION_CARGANDO});

    fetch(SERVER_ADDRESS + 'api/capacitaciones/' + id + '/', {
      headers: {Authorization: 'token ' + getState().Usuario.token},
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
  console.log('Marcar leida ', actividad_index);
  return async (dispatch, getState) => {
    dispatch({type: ACTION_ACTIVIDAD_MARCANDO_LEIDA});

    fetch(
      SERVER_ADDRESS + 'api/actividades/' + actividad_index + '/visualizar/',
      {
        method: 'GET',
        headers: {
          Authorization: 'token ' + getState().Usuario.token,
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
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
    dispatch({
      type: ACTION_ACTIVIDAD_MARCAR_ERROR_PREGUNTA,
      pregunta_id: index_pregunta,
      error: '',
    });
  };
};

export const actividadEnviarCuestionario = (
  capacitacion_id,
  seccion_id,
  actividad_id,
  data,
) => {
  console.log('Capacitacion id ', capacitacion_id);
  return async (dispatch, getState) => {
    dispatch({type: ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO});

    fetch(SERVER_ADDRESS + 'api/actividades/' + actividad_id + '/guardar/', {
      method: 'POST',
      headers: {
        Authorization: 'token ' + getState().Usuario.token,
        Accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('Resultados cuestionario');
        console.log(r);
        if (r.errores && r.errores.length > 0) {
          dispatch({type: ACTION_ACTIVIDAD_INTENTO});
          console.log('Marcar errores');
          r.errores.forEach((r) => {
            dispatch({
              type: ACTION_ACTIVIDAD_MARCAR_ERROR_PREGUNTA,
              pregunta_id: r,
              error: 'Respuesta incorrecta',
            });
          });
        } else if (r.status && r.status == 'no_intentos') {
          dispatch({
            type: ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_ERROR,
            error: 'No cuentas con mas intentos',
            aprobado: r.aprobado,
          });
        } else if (r.status && r.status == 'saved') {
          console.log('CAPACITACION ', capacitacion_id);
          console.log('SECCION ', seccion_id);
          console.log('ACTIVIDAD ', actividad_id);
          console.log('APROBADO ', r.aprobado);
          console.log('PROGRESO ', r.progreso);

          dispatch({
            type: ACTION_CAPACITACION_INC_PROGRESO,
            capacitacion_id: capacitacion_id,
            progreso: parseFloat(r.progreso) / 100,
          });

          dispatch({
            type: ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_OK,
            capacitacion_id: capacitacion_id,
            seccion_id: seccion_id,
            actividad_id: actividad_id,
            calificacion: r.calificacion,
            aprobado: r.aprobado,
            habilitado: r.habilitado,
          });
        }
      })
      .catch((error) => {
        console.log('Error enviando cuestonario');
        console.log(error.toString());
        dispatch({
          type: ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO_ERROR,
          error: error.toString(),
        });
      });
  };
};

export const preguntaMarcarError = (pregunta_id, error) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_ACTIVIDAD_MARCAR_ERROR_PREGUNTA,
      pregunta_id: pregunta_id,
      error: error,
    });
  };
};
