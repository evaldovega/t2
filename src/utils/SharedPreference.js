import SInfo from 'react-native-sensitive-info';
const name = 'SERVI';
const key = 'g*0ptn)okz!Cx$^';

export const setSharedPreference = (name, value) => {
  return SInfo.setItem(name, value, {
    sharedPreferencesName: name,
    keychainService: key,
  });
};
export const getSharedPreference = (name, value) => {
  return SInfo.getItem(name, {
    sharedPreferencesName: name,
    keychainService: key,
  });
};
export const deleteSharedPreference = (name) => {
  return SInfo.deleteItem(name, {
    sharedPreferencesName: name,
    keychainService: key,
  });
};
