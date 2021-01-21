import {getSharedPreference} from 'utils/SharedPreference';
import {SERVER_ADDRESS} from 'constants';

export const fetchConfig = async () => {
  let token = await getSharedPreference('auth-token');
  return {
    url: `${SERVER_ADDRESS}api/`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Token ' + token,
    },
  };
};
