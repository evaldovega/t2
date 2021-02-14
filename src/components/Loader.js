import React, {Component} from 'react';
import {CURVA, TEXTO_TAM, COLORS, MARGIN_VERTICAL} from 'constants';
import {StyleSheet, View, Modal, ActivityIndicator, Text} from 'react-native';

const Loader = (props) => {
  const {loading, message} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} size="large" />
          <Text style={{fontFamily: 'Mont-Regular', fontSize: TEXTO_TAM * 0.5}}>
            {message || '...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.BLANCO,
    borderRadius: CURVA,
    padding: MARGIN_VERTICAL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
