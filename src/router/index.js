import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue';
import empty from '@/views/empty.vue';
import NotFoundComponent from '@/views/404.vue';
import stableHeader from '@/views/stableHeader.vue';

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
            },
            {
                path: 'dataList',
                name: 'dataList',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/dataList/list.vue')
                },
            }, {
                path: 'businessList',
                name: 'businessList',
                component: function () {
                    return import(/* webpackChunkName: "businessList" */ '../views/businessManagement/list.vue')
                },
            },
            {
                path: 'userList',
                name: 'userList',
                component: function () {
                    return import(/* webpackChunkName: "userList" */ '../views/userManagement/list.vue')
                },
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
                    },
                    {
                        path: 'taskManaClasslist',
                        name: 'taskManaClasslist',
                        component: function () {
                            return import(/* webpackChunkName: "taskManagement" */ '../views/taskManagement/classList.vue')
                        },
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
                    },
                    {
                        path: 'itemList',
                        name: 'itemList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/itemList.vue')
                        },
                    },
                    {
                        path: 'versionList',
                        name: 'versionList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/versionList.vue')
                        },
                    },
                    {
                        path: 'insurList',
                        name: 'InsurList',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/insuranceList.vue')
                        },
                    },
                    {
                        path: 'productHelper',
                        name: 'productHelper',
                        component: function () {
                            return import(/* webpackChunkName: "productMana" */ '../views/productManagement/helperMaster/list.vue')
                        },
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
                    },
                    {
                        path: 'operationList',
                        name: 'operationList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/systemManagement/operationList.vue')
                        },
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
                    },
                    {
                        path: 'informationList',
                        name: 'operationInformationList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/operationManagement/information/list.vue')
                        },
                    },
                    {
                        path: 'advertisementList',
                        name: 'operationManaAdvertisementList',
                        component: function () {
                            return import(/* webpackChunkName: "systemMana" */ '../views/operationManagement/advertisement/list.vue')
                        },
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
