import {StyleSheet} from 'react-native';
import {COLORS, MARGIN_VERTICAL} from 'constants';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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
    elevation: 0,
  },
  btnRight: {elevation: 0},
});

const styleButton = StyleSheet.create({
  wrapper: {
    flex: 1,
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
    padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 16,
    borderColor: '#EAE8EA',
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: 'Mont-Bold',
    color: COLORS.NEGRO_N1,
    fontSize: 14,
    flex: 1,
    padding: 0,
    marginTop: MARGIN_VERTICAL,
  },
  input: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  error: {
    fontSize: 12,
    color: '#CD6155',
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
const checkbox = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
export {styleText, styelCard, styleHeader, styleButton, styleInput, checkbox};
