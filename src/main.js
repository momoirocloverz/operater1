import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/resetGlobalStyle.scss';
import dayjs from '@/utils/day.js';
import Wang from '@/utils/wang.js';
import Com from '@/utils/com.js';
import ApiLists from '@/apis/apiLists.js';
import CusTable from '@/components/cusTable.vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import Auth from '@/utils/auth.js';
import AuthBoolean from '@/utils/authBoolean.js';

Vue.use(AuthBoolean);
Vue.use(ApiLists);
Vue.use(dayjs);
Vue.use(Wang);
Vue.use(Com);
Vue.use(ElementUI);
Vue.component('VueCropper',VueCropper);
Vue.component('CusTable', CusTable);
Vue.directive('Auth',Auth);

if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
    } else if (process.env.VUE_APP_TITLE == 'test') {
    } else {
    }
} else {
}
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
