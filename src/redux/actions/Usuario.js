import {
  ACTION_CAMBIAR_NOMBRE_USUARIO,
  ACTION_USUARIO_ACCEDER,
  ACTION_USUARIO_ACCESO_CORRECTO,
  ACTION_USUARIO_ERROR_ACCEDIENDO,
  ACTION_USUARIO_SALIR,
  ACTION_USUARIO_INIT,
  ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,
  ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
  ACTION_USUARIO_SUBIENDO_IDE,
  ACTION_USUARIO_IDE_SUBIDA,
  ACTION_USUARIO_ERROR_SUBIENDO_IDE,
  ACTION_ACTUALIZANDO_PERFIL,
  ACTION_PERFIL_ACTUALIZADO,
  ACTION_ERROR_ACTUALIZANDO_PERFIL,
  ACTION_USUARIO_ACTUALIZAR_PROP,
} from '../Constantes';
import {SERVER_ADDRESS} from '../../constants';
import {
  setSharedPreference,
  deleteSharedPreference,
  getSharedPreference,
} from 'utils/SharedPreference';
import {navigationRef} from 'utils/navigation';

export const acceder = (data) => {
  return async (dispatch) => {
    console.log('Accediendo...');
    try {
      dispatch({type: ACTION_USUARIO_ACCEDER});
      fetch(SERVER_ADDRESS + 'api/login/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then(async (r) => {
          console.log(r);
          if (r.token) {
            console.log('********************LOGIN*******************');
            console.log(JSON.stringify(r.data));
            await setSharedPreference('auth-token', r.token);
            await setSharedPreference('data-user', JSON.stringify(r.data));
            dispatch({type: ACTION_USUARIO_ACCESO_CORRECTO, token: r.token});
            navigationRef?.current?.navigate('Master');
          } else if (r.non_field_errors) {
            dispatch({
              type: ACTION_USUARIO_ERROR_ACCEDIENDO,
              error: r.non_field_errors[0],
            });
          } else {
            dispatch({
              type: ACTION_USUARIO_ERROR_ACCEDIENDO,
              error: 'Error desconocido',
            });
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: ACTION_USUARIO_ERROR_ACCEDIENDO,
            error: 'Error desconocido',
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const salir = () => {
  return (dispatch) => {
    deleteSharedPreference('auth-token');
    deleteSharedPreference('data-user');
    dispatch({type: ACTION_USUARIO_SALIR});
    navigationRef?.current?.navigate('Onboarding');
  };
};

export const CambiarNombre = (nombre) => {
  console.log('Cambiar nombre ', nombre);
  return (dispatch) => {
    dispatch({type: ACTION_CAMBIAR_NOMBRE_USUARIO, nombre});
  };
};

export const initUsuario = () => {
  return async (dispatch) => {
    let d = {type: ACTION_USUARIO_INIT};
    let data_user = await getSharedPreference('data-user');
    if (data_user) {
      data_user = JSON.parse(data_user);
      console.log('Data user ', data_user);
      d.id = data_user.user.id;
      d.num_documento_identidad = data_user.num_documento_identidad;
      d.foto = SERVER_ADDRESS + data_user.foto_perfil;
      d.nombre = data_user.user.first_name + ' ' + data_user.user.last_name;
      d.email = data_user.user.email;
      d.cel = data_user.numero_whatsapp;
      d.ide_foto_frente = SERVER_ADDRESS + data_user.foto_documento_cara1;
      d.ide_foto_respaldo = SERVER_ADDRESS + data_user.foto_documento_cara2;
      d.habilitado = data_user.habilitado;
    }
    let token = await getSharedPreference('auth-token');
    if (token) {
      d.token = token;
    }
    console.log('******************INIT****************');
    console.log(d);
    console.log(data_user);
    dispatch(d);
  };
};

export const cambiarFotoPerfil = (data) => {
  return async (dispatch, getState) => {
    console.log('Cambiar foto perfil ', data);
    dispatch({type: ACTION_USUARIO_CAMBIANDO_FOTO_PERFIL});
    const RNFS = require('react-native-fs');
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
        Authorization: 'Token ' + getState().Usuario.token,
      },
      begin: uploadBegin,
      progress: uploadProgress,
    })
      .promise.then(async (response) => {
        if (response.statusCode == 200) {
          console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
          console.log(response.body);
          const body = JSON.parse(response.body);

          let data_user = await getSharedPreference('data-user');
          data_user = JSON.parse(data_user);
          data_user.foto_perfil = body.foto_perfil;
          setSharedPreference('data-user', JSON.stringify(data_user));

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
  };
};

export const subirFotoIde = (image, lado) => {
  return async (dispatch, getState) => {
    try {
      let data_user = await getSharedPreference('data-user');
      data_user = JSON.parse(data_user);

      dispatch({type: ACTION_USUARIO_SUBIENDO_IDE, lado: lado});
      const RNFS = require('react-native-fs');
      let path = image.path.replace('file://', '');
      const name =
        lado == 'frente' ? 'foto_documento_cara1' : 'foto_documento_cara2';
      var files = [
        {
          name: name,
          filename: new Date().getTime() + '.' + image.mime.split('/')[1],
          filepath: path,
          filetype: image.mime,
        },
      ];

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
          Authorization: 'Token ' + getState().Usuario.token,
        },
        begin: uploadBegin,
        progress: uploadProgress,
      })
        .promise.then((response) => {
          if (response.statusCode == 200) {
            console.log('FILES UPLOADED!');
            console.log(response.body);
            const body = JSON.parse(response.body);
            let foto_subida =
              lado == 'frente'
                ? body.foto_documento_cara1
                : body.foto_documento_cara2;
            foto_subida = SERVER_ADDRESS + foto_subida;
            if (lado == 'frente') {
              data_user.foto_documento_cara1 = foto_subida;
            } else {
              data_user.foto_documento_cara2 = foto_subida;
            }
            setSharedPreference('data-user', JSON.stringify(data_user));
            dispatch({
              type: ACTION_USUARIO_IDE_SUBIDA,
              ide: foto_subida,
              lado: lado,
            });
          } else {
            dispatch({
              type: ACTION_USUARIO_ERROR_SUBIENDO_IDE,
              error: 'Server Error',
            });
          }
        })
        .catch((err) => {
          if (err.description === 'cancelled') {
          }
          console.log(err);
          dispatch({
            type: ACTION_USUARIO_ERROR_SUBIENDO_IDE,
            error: err.toString(),
          });
        });
    } catch (error) {
      dispatch({
        type: ACTION_USUARIO_ERROR_SUBIENDO_IDE,
        error: error.toString(),
      });
    }
  };
};

export const cambiarProp = (p, v) => {
  return (dispatch) => {
    dispatch({type: ACTION_USUARIO_ACTUALIZAR_PROP, p, v});
  };
};

export const actualizarDatos = () => {
  return async (dispatch, getState) => {
    try {
      let cambios = {
        num_documento_identidad: getState().Usuario.num_documento_identidad,
        email: getState().Usuario.email,
        numero_whatsapp: getState().Usuario.cel,
      };
      console.log(cambios);
      dispatch({type: ACTION_ACTUALIZANDO_PERFIL});
      fetch(SERVER_ADDRESS + 'api/usuarios/editar/', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'Token ' + getState().Usuario.token,
        },
        body: JSON.stringify(cambios),
      })
        .then((r) => r.json())
        .then(async (data) => {
          console.log(data);
          let data_user = await getSharedPreference('data-user');
          data_user = JSON.parse(data_user);
          data_user = {...cambios};
          console.log(data_user);
          setSharedPreference('data-user', JSON.stringify(data_user));
          dispatch({type: ACTION_PERFIL_ACTUALIZADO});
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: ACTION_ERROR_ACTUALIZANDO_PERFIL,
            error: error.toString(),
          });
        });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ACTION_ERROR_ACTUALIZANDO_PERFIL,
        error: error.toString(),
      });
    }
  };
};
