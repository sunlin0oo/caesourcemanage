// 对于路径请求的封装==>以后改装成redux后的操作空间==>需要对于redux的操作进行使用
import axios from "axios";
import {store} from '../redux/store'
// 省略路径
axios.defaults.baseURL = 'http://localhost:8001';

// axios.defaults.headers

// axios.interceptors.request.use
// axios.interceptors.response.use

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 显示loding==>请求中
    store.dispatch({
      type:'change_loading',
      payload:true
    })
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // 请求成功==>隐藏loading
    store.dispatch({
      type:'change_loading',
      payload:false
    })
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 请求失败==>隐藏loading
    return Promise.reject(error);
  });