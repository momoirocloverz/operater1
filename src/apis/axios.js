import axios from 'axios';
import {
  Message,
  MessageBox
} from 'element-ui'
require('es6-promise').polyfill();

let baseURL = 'http://test.api.10000rc.com';
// let baseURL = 'http://www.10000rc.com/2.0';

if (process.env.NODE_ENV == 'production') {
  if (process.env.VUE_APP_TITLE == 'test') {
    baseURL = 'http://test.api.10000rc.com';
  } else {
    baseURL = 'http://www.10000rc.com';
  }
}

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'os': 'web',
    'version': '1.0',
    'apptype': 'web',
    'equipment': 'web',
    'equipmentVersion': 'web',
    'equipmentType': 'web',
    'userType': '1',
  },
});
instance.interceptors.request.use(function (config) {
  //    console.log(config)
  let commonToken = localStorage.getItem('commonToken');
  if (commonToken) {
    config.headers['Authorization'] = `Bearer ${commonToken}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  //    console.log(response)
  if (response.headers.status == 1) {
    localStorage.setItem("commonToken", response.headers.authorization);
  }
  if (response.data.respCode !== 0) {
    if (response.data.errorCode === 1403) {
      return MessageBox.alert(response.data.errorMsg, '', {
        confirmButtonText: '确定',
        callback: action => {
        }
      });
    } else {
      return Message.error(response.data.errorMsg)
    }
  }
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default instance;