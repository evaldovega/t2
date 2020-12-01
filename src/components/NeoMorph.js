import React from 'react';
import {StyleSheet, View} from 'react-native';

export const NeoMorphCard = (props) => (
  <View style={styles.topShadow}>
    <View style={styles.bottomShadow}>
      <View style={[styles.inner, {...props.style}]}>{props.children}</View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  topShadow: {
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowOpacity: 1.0,
    shadowRadius: 6,
    shadowColor: '#ffff',
    backgroundColor: '#ffff',
    zIndex: 999,
    borderRadius: 21,
  },
  bottomShadow: {},
  inner: {
    padding: 16,
    marginLeft: 8,
    marginTop: 4,
    paddingTop: 8,
    borderRadius: 21,

    backgroundColor: '#ababab',

    justifyContent: 'center',
  },
});
