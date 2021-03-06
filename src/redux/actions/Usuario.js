import {
  ACTION_USUARIO_HABILITAR,
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
import {Alert} from 'react-native';
import {SERVER_ADDRESS} from '../../constants';
import {
  setSharedPreference,
  deleteSharedPreference,
  getSharedPreference,
} from 'utils/SharedPreference';

export const salir = () => {
  return (dispatch) => {
    deleteSharedPreference('auth-token');
    deleteSharedPreference('userId');
    dispatch({type: ACTION_USUARIO_SALIR});
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
      d.no_clientes = data_user.no_clientes;
      d.no_ventas = data_user.no_ventas;
      d.ganancias = data_user.ganancias;
      d.fecha_nacimiento = data_user.fecha_nacimiento;
    }
    let token = await getSharedPreference('auth-token');
    if (token) {
      d.token = token;
    }
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

          dispatch({
            type: ACTION_USUARIO_ACTUALIZAR_PROP,
            p: 'foto_perfil',
            v: body.foto_perfil,
          });

          dispatch({
            type: ACTION_USUARIO_FOTO_PERFIL_CAMBIADA,
            foto: SERVER_ADDRESS + body.foto_perfil,
          });
        } else {
          console.log('SERVER ERROR');
          dispatch({
            type: ACTION_USUARIO_ERROR_CAMBIANDO_FOTO_PERFIL,
            error: 'Se ha presentado un inconveniente al subir',
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
      //let data_user = await getSharedPreference('data-user');
      //data_user = JSON.parse(data_user);

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
            foto_subida =
              SERVER_ADDRESS + foto_subida.replace('/media', 'media');
            if (lado == 'frente') {
              //data_user.foto_documento_cara1 = foto_subida;
              dispatch({
                type: ACTION_USUARIO_ACTUALIZAR_PROP,
                p: 'foto_documento_cara1',
                v: foto_subida,
              });
            } else {
              //data_user.foto_documento_cara2 = foto_subida;
              dispatch({
                type: ACTION_USUARIO_ACTUALIZAR_PROP,
                p: 'foto_documento_cara2',
                v: foto_subida,
              });
            }
            //setSharedPreference('data-user', JSON.stringify(data_user));
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
    console.log('Action user change prop ', p, v);
    dispatch({type: ACTION_USUARIO_ACTUALIZAR_PROP, p, v});
  };
};

export const changeProps = (props) => {
  return (dispatch) => {
    Object.keys(props).forEach((p) => {
      const v = props[p];
      dispatch({type: ACTION_USUARIO_ACTUALIZAR_PROP, p, v});
    });
  };
};

export const actualizarDatos = () => {
  return async (dispatch, getState) => {
    try {
      let cambios = {
        num_documento_identidad: getState().Usuario.num_documento_identidad,
        email: getState().Usuario.email,
        numero_whatsapp: getState().Usuario.cel,
        fecha_nacimiento: getState().Usuario.fecha_nacimiento,
      };

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
          Alert.alert('Datos actualizados', '');
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

export const habilitar = (state) => {
  return async (dispatch, getState) => {
    console.log('CAMBIAR ESTADO HABILITADO ', state);
    let data_user = await getSharedPreference('data-user');
    data_user = JSON.parse(data_user);
    data_user = state;
    setSharedPreference('data-user', JSON.stringify(data_user));
    dispatch({type: ACTION_USUARIO_HABILITAR, state: state});
  };
};
