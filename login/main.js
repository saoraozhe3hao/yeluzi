import  "babel-polyfill"
import '../assets/mixin.less'
import Vue from 'vue'
import ElementUI from 'element-ui'
import '../assets/element-variables.scss'
import App from './App'
import qs from 'qs'
import axios from 'axios'
import Moment from 'moment'
import validation from '../components/validation'
import mock from './stub'

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;  // 用于将 json格式 转换为 表单格式
Vue.prototype.$moment = Moment;
Vue.prototype.$validation = validation;
Vue.prototype.$basePath = location.hostname == "127.0.0.1" ? 'http://127.0.0.1:8081' : "";
// 本地才加载桩数据
if(location.hostname == 'localhost'){
    mock();
}
new Vue({
  el: '#app',
  template: '<App/>',         // 用template填充el
  components: { App }        // 列举 component，用于 template
});