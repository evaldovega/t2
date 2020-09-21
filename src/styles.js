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
    paddingHorizontal: 24,
    height: 96,
    paddingTop: getStatusBarHeight(),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
  },
  title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 17,
    color: '#fff',
  },
  btnLeft: {
    zIndex: 1,
  },
  btnRight: {},
});

const styleButton = StyleSheet.create({
  wrapper: {
    marginHorizontal: 40,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY_COLOR,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFF',
  },
});

const styleInput = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 16,
    borderColor: '#EAE8EA',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    flex: 1,
    padding: 0,
    margin: 0,
  },
});
export {styleText, styelCard, styleHeader, styleButton, styleInput};
