import E from 'wangeditor'
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, 'Wang' , { value: E });
    }
};