/*import axios from 'axios';
import {SERVER_ADDRESS} from 'constants';
import {getSharedPreference} from 'utils/SharedPreference';

export const Axios = axios.create({
  baseURL: SERVER_ADDRESS,
});

const getToken = async () => {
  let token = await getSharedPreference('auth-token');

  return `Token ${token}`;
};

const API = axios.create({
  baseURL: SERVER_ADDRESS + 'api/',
});

API.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    config.headers.common = {
      ...config.headers.common,
      Authorization: token,
    };
    return config;
  },
  function (error) {
    // Do something with request error

    return Promise.reject(error);
  },
);

export default API;*/
