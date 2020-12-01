import React, {Component} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {Montserrat} from 'utils/fonts';
import WebView from 'react-native-webview';
import {COLORS} from 'constants';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

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
        props.onClose();
      }}>
      <View style={styles.modalBackground}>
        <TouchableOpacity
          onPress={() => {
            props.onClose();
            console.log('Cerrar modal');
          }}
          style={{
            zIndex: 9999,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 32,
            marginBottom: 32,
          }}>
          <EvilIcons
            color={COLORS.SECONDARY_COLOR_LIGHTER}
            size={32}
            name="close"
          />
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 14,
              color: COLORS.SECONDARY_COLOR_LIGHTER,
            }}>
            Cerrar
          </Text>
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
                            margin:0 auto;
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
        {props.footer ? (
          <View style={{padding: 16}}>{props.footer}</View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#FFFFFF',
    paddingTop: 64,
    flex: 1,
    flexDirection: 'column',
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
});

export default ModalWebView;
