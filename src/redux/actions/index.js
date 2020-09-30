import {
  ACTION_INICIAR_SESION,
  ACTION_USUARIO_INIT,
  ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,
  ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
  ACTION_CAMBIAR_NOMBRE_USUARIO,
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
} from '../Constantes';
import SInfo from 'react-native-sensitive-info';
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
  return async (dispatch) => {
    dispatch({type: ACTION_ACTIVIDAD_ENVIAR_CUESTIONARIO});
    let token = await Token();
    fetch(SERVER_ADDRESS + 'api/actividades/' + actividad_id + '/guardar/', {
      method: 'POST',
      headers: {
        Authorization: 'token ' + token,
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

export const initUsuario = () => {
  return async (dispatch) => {
    let d = {type: ACTION_USUARIO_INIT};
    let foto_perfil = await SInfo.getItem('foto-perfil', {
      sharedPreferencesName: 'ServiSharedPreferences',
      keychainService: 'ServiKeyChain',
    });

    if (foto_perfil) {
      d.foto = foto_perfil;
    }
    let token = await SInfo.getItem('auth-token', {
      sharedPreferencesName: 'ServiSharedPreferences',
      keychainService: 'ServiKeyChain',
    });
    console.log(token);
    if (token) {
      d.token = token;
    }
    console.log(d);
    dispatch(d);
  };
};
export const cambiarFotoPerfil = (data) => {
  return async (dispatch, getState) => {
    console.log('Cambiar foto perfil ', data);
    dispatch({type: ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL});
    const RNFS = require('react-native-fs');
    //TemporaryDirectoryPath
    const token = await Token();
    let path = data.path.replace('file://', '');
    console.log(path);
    var files = [
      {
        name: 'foto_perfil',
        filename: new Date().getTime() + '.' + data.mime.split('/')[1],
        filepath: path,
        filetype: data.mime,
      },
    ];
    console.log(files[0].filename);

    var uploadBegin = (response) => {
      var jobId = response.jobId;
      console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    var uploadProgress = (response) => {
      var percentage = Math.floor(
        (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
      );
      console.log('UPLOAD IS ' + percentage + '% DONE!');
    };

    RNFS.uploadFiles({
      toUrl: SERVER_ADDRESS + 'api/usuarios/editar/',
      files: files,
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Token ' + token,
      },
      begin: uploadBegin,
      progress: uploadProgress,
    })
      .promise.then((response) => {
        if (response.statusCode == 200) {
          console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
          console.log(response.body);
          const body = JSON.parse(response.body);
          SInfo.setItem('foto-perfil', SERVER_ADDRESS + body.foto_perfil, {
            sharedPreferencesName: 'ServiSharedPreferences',
            keychainService: 'ServiKeyChain',
          });
          dispatch({
            type: ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,
            foto: SERVER_ADDRESS + body.foto_perfil,
          });
        } else {
          console.log('SERVER ERROR');
          dispatch({
            type: ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
            error: 'Server Error',
          });
        }
      })
      .catch((err) => {
        if (err.description === 'cancelled') {
          // cancelled by user
        }
        console.log(err);
        dispatch({
          type: ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
          error: err.toString(),
        });
      });
    /*
    fetch(SERVER_ADDRESS+'api/usuarios/editar/',{
      method:'PUT',
      body:data,
      headers: {
        Authorization: 'Token ' + token,
      },
    })
    .then(r=>r.json())
    .then((r)=>{
      console.log("Foto cambiada")
      console.log(r)
      dispatch({type:ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,foto:r.foto_perfil})
    }).catch((error)=>{
      console.log(error)
      dispatch({type:ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL})
    })*/
  };
};
