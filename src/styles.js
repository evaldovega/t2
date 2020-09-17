import {StyleSheet} from 'react-native';
import {COLORS} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

const styelCard = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#6D5F6F',
  },
});

const styleText = StyleSheet.create({
  h1: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#1A051D',
    textTransform: 'uppercase',
    marginTop: 28,
  },
  h2: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 28,
    marginBottom: 0.67,
    textTransform: 'uppercase',
  },
  h3: {
    fontFamily: 'Montserrat-Regular',
    flex: 1,
    fontSize: 12,
    marginTop: 20,
  },
  small: {
    fontFamily: 'Lato-Regular',
    fontSize: 12,
    color: '#6D5F6F',
  },
});

const styleHeader = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 17,
    color: '#fff',
  },
  btnLeft: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    zIndex: 1,
  },
  btnRight: {
    position: 'absolute',
    bottom: 20,
    right: 16,
  },
});

export {styleText, styelCard, styleHeader};
