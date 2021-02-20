import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Loader from 'components/Loader';
import {styleInput} from 'styles';
import {loadClient, changeProp, save} from '../../../redux/actions/Clients';
import ColorfullContainer from 'components/ColorfullContainer';
import Navbar from 'components/Navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from 'components/Button';
import InputText from 'components/InputText';
import Select from 'components/Select';
import Validator, {Execute} from 'components/Validator';
import {CURVA, MARGIN_HORIZONTAL, MARGIN_VERTICAL, COLORS} from 'constants';
import {useImmer} from 'use-immer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
});

const ClientSave = (props) => {
  const Validations = {};
  const [telefono, setTelefono] = useState('');
  const [telefonos, setTelefonos] = useImmer([]);
  const [autosave, setAutosave] = useState(false);

  const {item} = props.route.params;

  useEffect(() => {
    if (item) {
      if (item.id) {
        props.changeProp('id', item.id);
      }
      props.changeProp('genero', item.genero);
      props.changeProp('numero_cedula', item.numero_cedula);
      props.changeProp('primer_nombre', item.primer_nombre);
      props.changeProp('segundo_nombre', item.segundo_nombre);
      props.changeProp('primer_apellido', item.primer_apellido);
      props.changeProp('segundo_apellido', item.segundo_apellido);
      props.changeProp('correo_electronico', item.email);
      if (item.numero_telefono) {
        setTelefonos((draft) => {
          draft = item.numero_telefono.split(',');
          return draft;
        });
      }
    } else {
      props.changeProp('numero_cedula', '');
      props.changeProp('genero', '');
      props.changeProp('primer_nombre', '');
      props.changeProp('segundo_nombre', '');
      props.changeProp('primer_apellido', '');
      props.changeProp('segundo_apellido', '');
      props.changeProp('correo_electronico', '');
    }
  }, []);

  useEffect(() => {
    props.changeProp('numero_telefono', telefonos.join(','));
  }, [telefonos]);

  useEffect(() => {
    if (autosave) {
      console.log('auto save');
      setAutosave(false);
      guardar();
    }
  }, [props.numero_telefono, autosave]);

  const guardar = () => {
    setTimeout(() => {
      Execute(Validations)
        .then(() => {
          props.save(props, () => {
            props.navigation.pop();
          });
        })
        .catch((error) => {
          console.log(error);
          if (telefono.length) {
            agregarTelefono();
            setAutosave(true);
          }
        });
    }, 100);
  };

  const removerTelefono = (idx) => {
    setTelefonos((draft) => {
      draft.splice(idx, 1);
      return draft;
    });
  };

  const agregarTelefono = () => {
    if (telefono.length > 0) {
      setTelefonos((draft) => {
        draft.push(telefono);
        return draft;
      });
      setTelefono('');
    }
  };

  return (
    <ColorfullContainer style={styles.container}>
      <Loader loading={props.loading} />
      <Navbar {...props} transparent title="Guardar cliente" back />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: MARGIN_HORIZONTAL,
            marginVertical: MARGIN_VERTICAL,
            backgroundColor: 'rgba(255,255,255,.5)',
            borderRadius: CURVA,
            padding: MARGIN_HORIZONTAL,
          }}>
          <Text style={styleInput.label}>Primer nombre *:</Text>
          <Validator
            ref={(r) => (Validations['pn'] = r)}
            value={props.primer_nombre}
            required>
            <InputText
              marginTop={1}
              value={props.primer_nombre}
              onChangeText={(i) => props.changeProp('primer_nombre', i)}
              input={{
                keyboardType:
                  Platform.OS === 'ios'
                    ? 'ascii-capable'
                    : 'textPersonName|textCapWords',
              }}
            />
          </Validator>

          <Text style={styleInput.label}>Segundo nombre:</Text>
          <InputText
            marginTop={1}
            value={props.segundo_nombre}
            onChangeText={(i) => props.changeProp('segundo_nombre', i)}
            input={{
              keyboardType:
                Platform.OS === 'ios'
                  ? 'ascii-capable'
                  : 'textPersonName|textCapWords',
            }}
          />

          <Validator
            ref={(r) => (Validations['pa'] = r)}
            value={props.primer_apellido}
            required>
            <Text style={styleInput.label}>Primer apellido *:</Text>
            <InputText
              marginTop={1}
              value={props.primer_apellido}
              onChangeText={(i) => props.changeProp('primer_apellido', i)}
              input={{
                keyboardType:
                  Platform.OS === 'ios'
                    ? 'ascii-capable'
                    : 'textPersonName|textCapWords',
              }}
            />
          </Validator>

          <Text style={styleInput.label}>Segundo apellido:</Text>
          <InputText
            marginTop={1}
            value={props.segundo_apellido}
            onChangeText={(i) => props.changeProp('segundo_apellido', i)}
            input={{
              keyboardType:
                Platform.OS === 'ios'
                  ? 'ascii-capable'
                  : 'textPersonName|textCapWords',
            }}
          />

          <Validator
            ref={(r) => (Validations['nd'] = r)}
            value={props.numero_cedula}
            required>
            <Text style={styleInput.label}>Número de documento *:</Text>
            <InputText
              marginTop={1}
              value={props.numero_cedula}
              onChangeText={(i) => props.changeProp('numero_cedula', i)}
              input={{keyboardType: 'number-pad'}}
            />
          </Validator>

          <Text style={styleInput.label}>Género:</Text>
          <Select
            value={props.genero}
            onSelect={(item) => props.changeProp('genero', item.key)}
            options={[
              {
                key: 'masculino',
                label: 'Masculino',
              },
              {
                key: 'femenino',
                label: 'Femenino',
              },
              {
                key: 'otro',
                label: 'Otro',
              },
            ]}
          />

          <Validator
            ref={(r) => (Validations['tel'] = r)}
            value={props.numero_telefono}
            required>
            <Text style={styleInput.label}>Número de teléfono *:</Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <InputText
                marginTop={0}
                style={{flex: 1, marginRight: 6}}
                value={telefono}
                onChangeText={(i) => setTelefono(i)}
                input={{keyboardType: 'number-pad'}}
              />
              <Button title="+" onPress={() => agregarTelefono()} />
            </View>
            <View style={{marginVertical: MARGIN_VERTICAL}}>
              {telefonos.map((tel, i) => {
                if (tel.length > 0) {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{marginVertical: 6}}
                      onPress={() => removerTelefono(i)}>
                      <Text
                        style={{
                          backgroundColor: '#ababab',
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          borderRadius: CURVA,
                        }}>
                        <FontAwesome size={16} name="times" color={'#FFFFFF'} />{' '}
                        {tel}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </Validator>

          <Text style={styleInput.label}>Email:</Text>
          <InputText
            marginTop={1}
            value={props.correo_electronico}
            onChangeText={(i) => props.changeProp('correo_electronico', i)}
            input={{keyboardType: 'email-address'}}
          />

          <Button marginTop={2} onPress={() => guardar()} title="Guardar" />
        </View>
      </ScrollView>
    </ColorfullContainer>
  );
};

const mapToState = (state) => {
  return {
    id: state.Client.id,
    primer_nombre: state.Client.primer_nombre,
    segundo_nombre: state.Client.segundo_nombre,
    primer_apellido: state.Client.primer_apellido,
    segundo_apellido: state.Client.segundo_apellido,
    correo_electronico: state.Client.correo_electronico,
    numero_telefono: state.Client.numero_telefono,
    numero_cedula: state.Client.numero_cedula,
    genero: state.Client.genero,
    loading: state.Client.loading,
    error: state.Client.error,
    success: state.Client.success,
    loading_client: state.Client.loading_client,
  };
};

const mapToActions = (dispatch) => {
  return {
    load: (id) => {
      dispatch(loadClient(id));
    },
    changeProp: (prop, value) => {
      dispatch(changeProp(prop, value));
    },
    save: (props, callback) => {
      dispatch(save(props, callback));
    },
  };
};

export default connect(mapToState, mapToActions)(ClientSave);
