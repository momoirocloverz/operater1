import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue';
import empty from '@/views/empty.vue';
import NotFoundComponent from '@/views/404.vue';
import stableHeader from '@/views/stableHeader.vue';
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: login
    },
    {
        path: '/main',
        component: function () {
            return import(/* webpackChunkName: "main" */ '../views/main.vue')
        },
        children: [
            {
                path: '',
                name: 'welcome',
                component: function () {
                    return import(/* webpackChunkName: "main" */ '../views/welcome.vue')
                },
                beforeEnter: (to, from, next) => {
                    store.commit('changeMenuActiveIndex', '0');
                    store.commit('setBreadcrumbList',[
                        { title:'首页' }
                    ]);
                    next();
                }
            },
            {
                path: 'dataList',
                name: 'dataList',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/dataList/list.vue')
                },
                beforeEnter: (to, from, next) => {
                    store.commit('changeMenuActiveIndex', '0-1');
                    store.commit('setBreadcrumbList',[
                        { title:'数据管理' },
                        { title:'基础数据' },
                    ]);
                    next();
                }
            }, {
                path: 'businessList',
                name: 'businessList',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/businessManagement/list.vue')
                },
                beforeEnter: (to, from, next) => {
                    store.commit('changeMenuActiveIndex', '1-1');
                    store.commit('setBreadcrumbList',[
                        { title:'商家管理' },
                        { title:'商家列表' },
                    ]);
                    next();
                }
            },
            {
                path: 'userList',
                name: 'userList',
                component: function () {
                    return import(/* webpackChunkName: "userList" */ '../views/userManagement/list.vue')
                },
                beforeEnter: (to, from, next) => {
                    store.commit('changeMenuActiveIndex', '2-1');
                    store.commit('setBreadcrumbList',[
                        { title:'用户管理' },
                        { title:'用户列表' },
                    ]);
                    next();
                }
            },
            {
                path: 'administrative',
                component: empty,
                children: [
                    {
                        path: '',
                        name: 'administrativeNormalList',
                        component: function () {
                            return import(/* webpackChunkName: "administrative" */ '../views/administrativeExpenses/normalList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '3-1');
                            store.commit('setBreadcrumbList',[
                                { title:'管理费账户管理' },
                                { title:'商家账户列表' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'wancaiList',
                        name: 'administrativewancaiList',
                        component: function () {
                            return import(/* webpackChunkName: "administrative" */ '../views/administrativeExpenses/wancaiList.vue')
                        },
                    },
                ]
            },
            {
                path: 'thirdAccount',
                name: 'thirdAccount',
                component: function () {
                    return import(/* webpackChunkName: "thirdAccount" */ '../views/thirdAccount/list.vue')
                },
            },
            {
                path: 'taskManagement',
                component: empty,
                children: [
                    {
                        path: '',
                        name: 'taskManaList',
                        component: function () {
                            return import(/* webpackChunkName: "taskManagement" */ '../views/taskManagement/taskList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '5-1');
                            store.commit('setBreadcrumbList',[
                                { title:'任务排班管理' },
                                { title:'任务列表' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'taskManaClasslist',
                        name: 'taskManaClasslist',
                        component: function () {
                            return import(/* webpackChunkName: "taskManagement" */ '../views/taskManagement/classList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '5-2');
                            store.commit('setBreadcrumbList',[
                                { title:'任务排班管理' },
                                { title:'排班列表' },
                            ]);
                            next();
                        }
                    },
                ]
            },
            {
                path: 'InsuranceMana',
                component: empty,
                children: [
                    {
                        path: '',
                        name: 'InsuranceList',
                        component: function () {
                            return import(/* webpackChunkName: "InsuranceMana" */ '../views/InsuranceManagement/list.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '6-1');
                            store.commit('setBreadcrumbList',[
                                { title:'保单管理' },
                                { title:'保险列表' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'recordList',
                        name: 'InsuranceRecordList',
                        component: function () {
                            return import(/* webpackChunkName: "InsuranceMana" */ '../views/InsuranceManagement/recordList.vue')
                        },
                    },
                ]
            },
            {
                path: 'productMana',
                component: empty,
                children: [
                    {
                        path: '',
                        name: 'paramsList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/paramList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '7-1');
                            store.commit('setBreadcrumbList',[
                                { title:'产品管理' },
                                { title:'系统参数设置' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'itemList',
                        name: 'itemList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/itemList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '7-2');
                            store.commit('setBreadcrumbList',[
                                { title:'产品管理' },
                                { title:'类目管理' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'versionList',
                        name: 'versionList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/versionList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '7-3');
                            store.commit('setBreadcrumbList',[
                                { title:'产品管理' },
                                { title:'版本管理' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'insurList',
                        name: 'InsurList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/insuranceList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '7-4');
                            store.commit('setBreadcrumbList',[
                                { title:'产品管理' },
                                { title:'保险管理' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'productHelper',
                        name: 'productHelper',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/helperMaster/list.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '7-5');
                            store.commit('setBreadcrumbList',[
                                { title:'产品管理' },
                                { title:'企业版帮助中心' },
                            ]);
                            next();
                        }
                    },
                ]
            },
            {
                path: 'systemMana',
                component: empty,
                children: [
                    {
                        path: '',
                        name: 'systemManaUserList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/systemManagement/userList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '8-1');
                            store.commit('setBreadcrumbList',[
                                { title:'系统管理' },
                                { title:'系统用户' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'operationList',
                        name: 'operationList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/systemManagement/operationList.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '8-3');
                            store.commit('setBreadcrumbList',[
                                { title:'系统管理' },
                                { title:'操作记录' },
                            ]);
                            next();
                        }
                    },
                ]
            },
            {
                path: 'operationMana',
                component: empty,
                children: [
                    {
                        path: 'list',
                        name: 'operationManaList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/operationManagement/list.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '9-1');
                            store.commit('setBreadcrumbList',[
                                { title:'运营管理' },
                                { title:'申请预约管理' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'informationList',
                        name: 'operationInformationList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/operationManagement/information/list.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '9-2');
                            store.commit('setBreadcrumbList',[
                                { title:'运营管理' },
                                { title:'企业版资讯管理' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'advertisementList',
                        name: 'operationManaAdvertisementList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/operationManagement/advertisement/list.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '9-3');
                            store.commit('setBreadcrumbList',[
                                { title:'运营管理' },
                                { title:'广告管理' },
                            ]);
                            next();
                        }
                    },
                    {
                        path: 'startScreenList',
                        name: 'operationManaStartScreenList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/operationManagement/startScreen/list.vue')
                        },
                        beforeEnter: (to, from, next) => {
                            store.commit('changeMenuActiveIndex', '9-4');
                            store.commit('setBreadcrumbList',[
                                { title:'运营管理' },
                                { title:'广告页管理' },
                            ]);
                            next();
                        }
                    },
                ]
            },
        ]
    },
    //详情页面剥离出来，避免错误嵌套
    {
        path: '/main/businessList/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'detail',
                name: 'businessListDetail',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/businessManagement/detail.vue')
                },
                meta:{
                    keepAlive:true
                },
            },
            {
                path: 'permissionConfiguration',
                name: 'permissionConfiguration',
                component: function () {
                    return import(/* webpackChunkName: "administrative" */ '../views/businessManagement/permissionConfiguration.vue')
                },
            },
        ]
    },
    {
        path: '/main/administrative/',
        component: function (){
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'detail',
                name: 'administrativeNormalDetail',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/administrativeExpenses/normalDetail.vue')
                },
            }
        ]
    },
    {
        path: '/main/taskManagement/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'detail',
                name: 'taskManagementClassTab',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/taskManagement/classTab.vue')
                },
            }
        ]
    },
    {
        path: '/main/userList/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'userDetail',
                name: 'userListClassTab',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/userManagement/userDetail.vue')
                },
            }
        ]
    },
    {
        path: '/main/taskManagement/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'classDetail',
                name: 'taskManagementClassDetail',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/taskManagement/classDetail.vue')
                },
            }
        ]
    },
    {
        path: '/main/systemMana/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'authConfig',
                name: 'systemManAuthConfig',
                component: function () {
                    return import(/* webpackChunkName: "systemMana" */ '../views/systemManagement/authConfig.vue')
                },
            }
        ]
    },
    {
        path: '/main/productMana/itemList/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'itemDetail',
                name: 'productManaItemDetail',
                component: function () {
                    return import(/* webpackChunkName: "productMana" */ '../views/productManagement/itemDetail.vue')
                },
            }
        ]
    },
    
    {
        path: '/main/productMana/productHelper/',
        component: function () {
            return import(/* webpackChunkName: "stableHeader" */ '../views/stableHeader.vue')
        },
        children: [
            {
                path: 'add',
                name: 'addQuestion',
                component: function () {
                    return import(/* webpackChunkName: "productMana" */ '../views/productManagement/helperMaster/components/editer/add.vue')
                },
            },
            {
                path: 'edit',
                name: 'editQuestion',
                component: function () {
                    return import(/* webpackChunkName: "productMana" */ '../views/productManagement/helperMaster/components/editer/edit.vue')
                },
            },
        ]
    },
    
    
    {
        path: '/blank',
        name: 'blank',
        component: empty,
    },
    {
        path: '*',
        component: NotFoundComponent
    }
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next)=>{
    let commonToken = localStorage.getItem('commonToken');
    if(commonToken){
        next()
    }else{
        if (to.name === 'login') { //这就是跳出循环的关键
            next()
        } else {
            router.push({
                path: '/'
            })
        }
    }
})
export default router
