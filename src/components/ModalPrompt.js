import React, {Component, memo} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Button,
  TouchableHighlight,
  View,
  Dimensions,
} from 'react-native';
import {Montserrat} from 'utils/fonts';
import WebView from 'react-native-webview';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Input from 'screens/SiginIn/components/Input';

const {width, heigth} = Dimensions.get('screen');

interface Props {
  mt?: number;
  error?: boolean;
  visible?: boolean;
  valid: boolean;
  actionDisabled: boolean;
  textMessage: string;
}

const ModalPrompt = memo((props: Props) => {
  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={props.visible}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.cardOverlay}>
          <Image
            style={styles.forgotImage}
            source={
              props.valid
                ? require('utils/images/check.gif')
                : require('screens/ForgotPass/ForgotPassImage.png')
            }></Image>
          <Text style={styles.desc}>
            {props.textMessage != null && props.textMessage != ''
              ? props.textMessage
              : 'Se ha enviado un código a \n su correo electrónico'}
          </Text>
          {props.error ? (
            <View>
              <View
                style={[
                  styles.container,
                  {
                    marginTop: props.mt,
                    borderColor: 'red',
                    textAlign: 'center',
                  },
                ]}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      fontFamily: 'Montserrat-Black',
                      fontSize: 18,
                      flex: 1,
                      textAlign: 'center',
                    },
                  ]}
                  placeholder="Ingresa el código"
                  placeholderTextColor={'#ABA4AC'}
                  secureTextEntry={false}
                  value={props.value}
                  onChangeText={props.onChangeText}
                  autoCapitalize={false}
                />
              </View>
              <Text style={[styles.textAlert]}>Este campo es requerido</Text>
            </View>
          ) : (
            <View
              style={[
                styles.container,
                {marginTop: props.mt, textAlign: 'center'},
              ]}>
              <TextInput
                style={{
                  fontFamily: 'Montserrat-Black',
                  fontSize: 18,
                  flex: 1,
                  textAlign: 'center',
                }}
                placeholder="Ingresa el código"
                placeholderTextColor={'#ABA4AC'}
                secureTextEntry={false}
                value={props.value}
                onChangeText={props.onChangeText}
                autoCapitalize={false}
              />
            </View>
          )}

          <View>
            <TouchableOpacity
              style={[
                styles.btnSignIn,
                props.actionDisabled ? styles.btnDisabled : null,
              ]}
              disabled={props.actionDisabled}
              onPress={props.onCodeValidation}>
              <Text style={styles.txtSignIn}>Validar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#FFFFFF88',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },
  cardOverlay: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: width - 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  desc: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 15,
  },
  forgotImage: {
    width: 160,
    height: 125,
    alignSelf: 'center',
  },
  container: {
    marginHorizontal: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE8EA',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnSignIn: {
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: 24,
    marginHorizontal: 40,
    marginTop: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: COLORS.SECONDARY_COLOR_MUTED,
    borderRadius: 24,
    marginHorizontal: 40,
    marginTop: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSignIn: {
    fontFamily: Montserrat,
    fontWeight: '600',
    color: '#FFF',
    fontSize: 17,
  },
  back: {
    marginLeft: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 32,
  },
  textAlert: {
    marginHorizontal: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
    color: 'red',
  },
});

export default ModalPrompt;