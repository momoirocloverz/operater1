import dayjs from 'dayjs'
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, 'Dayjs' , { value: dayjs });
    }	
};