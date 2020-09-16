import React, {Component} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Button,
  TouchableHighlight,
  View,
  Dimensions,
} from 'react-native';
import {Montserrat} from 'utils/fonts';
import WebView from 'react-native-webview';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from 'constants';
import SvgBack from 'svgs/profile/SvgBack';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

const {width, heigth} = Dimensions.get('screen');
const ModalWebView = (props) => {
  const {html, visible, cancelButtonText, onClose, ...attributes} = props;
  return (
    <Modal
      transparent={false}
      animationType={'slide'}
      visible={visible}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => {
            props.onClose();
          }}>
          <View>
            <SvgBack />
          </View>
          <Text style={{color: COLORS.PRIMARY_COLOR}}>Volver</Text>
        </TouchableOpacity>
        <WebView
          originWhitelist={['*']}
          source={{
            html: `<html>
                <head>
                    <meta name="viewport" content="width=device-width,user-scale=no">
                    <style>
                        body {
                            padding:12px 32px 32px;
                        }
                    </style>
                </head>
                <body>
                    ${html}
                </body>
                </html>`,
          }}
          style={{width: width, flex: 1}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#FFFFFF',
    paddingTop: 64,
    flex: 1,
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
    flex: 1,
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
});

export default ModalWebView;
