import  "babel-polyfill"      // 兼容IE
import '../assets/mixin.less'
import Vue from 'vue'
import Router from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import '../assets/element-variables.scss'  // Element 主体定制
import Vuex from 'vuex'
import App from './App'
import qs from 'qs'
import axios from 'axios'
import Moment from 'moment'
import validation from '../components/validation'
import mock from './stub'

Vue.use(ElementUI);
Vue.use(Router);
Vue.use(Vuex);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;  // 用于将 json格式 转换为 表单格式
Vue.prototype.$moment = Moment;
Vue.prototype.$validation = validation;
let apiPrefix = {
    "LOCAL": "http://60.205.228.150:8686/scm-app-service"
};
Vue.prototype.$basePath = location.hostname == "127.0.0.1" ? apiPrefix.LOCAL : "/scm-app-service";
Vue.prototype.$copyFields = function (fields, source, target) {
    source = source || {};
    target = target || {};
    for(let field of fields){
        target[field] = source[field] || '';
    }
    return target;
};

const store = new Vuex.Store({
    state: {
        myDetail: {},
        rights: []
    },
    mutations: {
        change (state) {}
    }
});
// 本地才加载桩数据
if (location.hostname == 'localhost') {
    mock();
}
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',         // 用template填充el
    components: {App}        // 列举 component，用于 template
});