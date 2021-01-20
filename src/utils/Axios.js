import axios from 'axios';
import {SERVER_ADDRESS} from 'constants';
import {getSharedPreference} from 'utils/SharedPreference';

export const Axios = axios.create({
  baseURL: SERVER_ADDRESS,
});

const getToken = async () => {
  let token = await getSharedPreference('auth-token');
  return `Bearer ${token}`;
};

const API = axios.create({
  baseURL: SERVER_ADDRESS + 'api/',
});

API.interceptors.request.use(
  function (config) {
    config.headers.common = {
      ...config.headers.common,
      Authorization: getToken(),
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default API;
