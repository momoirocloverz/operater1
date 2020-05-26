import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    key:'webOperater',
    storage: window.localStorage
})
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        menuActiveIndex:'0',
        yyWebInfo:{},
        breadcrumbList:[  { title:'首页' } ],
        authPageData:[],
        authBtnData:[],
    },
    getters: {
        getMenuActiveIndex: state => {
            return state.menuActiveIndex
        },
        getBreadcrumbList:state=>{
            return state.breadcrumbList
        },
        getInfo:state => {
            return state.yyWebInfo
        },
        getAuthPageData:state => {
            return state.authPageData
        },
        getAuthBtnData:state => {
            return state.authBtnData
        },
    },
    mutations: {
        //重置初始化属性，都在这里添加，然后调用
        reInitVuexData(state){
            state.menuActiveIndex = '0';
            state.yyWebInfo = {};
            state.breadcrumbList = [ { title:'首页' } ];
            state.authPageData = [];
            state.authBtnData = [];
        },
        changeMenuActiveIndex(state,payload){
            state.menuActiveIndex = payload;
        },   
        setBreadcrumbList(state,payload){
            state.breadcrumbList = payload;
        },
        setYyInfo(state,payload){
            state.yyWebInfo = payload;
        },
        setAuthPageData(state,payload){
            state.authPageData = payload;
        },
        setAuthBtnData(state,payload){
            state.authBtnData = payload;
        }
    },
    actions: {
    },
    modules: {
    },
    plugins: [vuexLocal.plugin],
})