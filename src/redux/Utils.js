import SInfo from 'react-native-sensitive-info';

const Token = async () => {
  return await SInfo.getItem('auth-token', {
    sharedPreferencesName: 'ServiSharedPreferences',
    keychainService: 'ServiKeyChain',
  });
};

export {Token};
