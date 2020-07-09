import instance from './axios';
import axios from 'axios';
import qs from 'qs';
import { Loading } from 'element-ui';
let commonToken = localStorage.getItem('commonToken');
let baseURL = 'http://test.api.10000rc.com';
if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'test') {
        baseURL = 'http://test.api.10000rc.com';
    } else {
        baseURL = 'http://www.10000rc.com';
    }
}
const _apiLists = {
    login:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/login/pwd',
            params
        })
    },
    // 获取用户信息
    getBaseInfo:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/user/baseInfo',
            data,
        })
    },
    // 获取用户信息
    getApointment:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/appointment/page',
            data,
        })
    },
    skipIntecepeDelRole: (params) => {
        return axios({
            headers: {
                'Content-Type': 'application/json',
                'os': 'web',
                'version': '1.0',
                'apptype': 'web',
                'equipment': 'web',
                'equipmentVersion': 'web',
                'equipmentType': 'web',
                'userType': '1',
                Authorization:`Bearer ${commonToken}`
              },
            method: 'delete',
            url: `${baseURL}/user-center/role/del`,
            params,
        })
    },
    cowToken:()=>{
        return instance({
            method: 'get',
            url: '/orgrimar/qiniu/token',
        })
    },
    cowSpToken:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/qiniu/token2',
            params
        })
    },
    standAloneUpload(data){
        let loadingInstance = Loading.service({
            lock: true,
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.9)'
        });
        return axios({
            method: 'post',
            url: 'http://upload.qiniu.com/',
            data,
            onUploadProgress: function (progressEvent) {
                if( progressEvent.loaded >= progressEvent.total ){
                    loadingInstance.close();
                }else{
                    setTimeout(()=>{
                        loadingInstance.close();
                    },180000)
                }
            }
        })
    },
    businessCustomerList:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/customer/list',
            data
        })
    },
    businessCustomerDetail:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/customer/detail',
            params
        })
    }, 
    toggleFrozenCustomer:(params)=>{
        return instance({
            method: 'put',
            url: '/user-center/customer/toggleFrozen',
            params,
        })
    },
    businessCustomerFeeLists:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/customerFeeSetting/list',
            params
        })
    }, 
    businessCustomerSetting:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/customer/setting',
            data
        })
    },     
    businessCustomerSettingSave:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/customerFeeSetting/save',
            data
        })
    }, 
    businessCusystemFee:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/customerFeeSetting/save/systemFee',
            data
        })
    }, 
    feeSettingDetail:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/customerFeeSetting/detail',
            params
        })
    }, 
    advertisementPageAdd:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/advertisementPage/add',
            data
        })
    }, 
    fetchAdvertisementPage:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/advertisementPage/list',
            params
        })
    }, 
    waterMark:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/sysparam/n/value',
            params
        })
    }, 
    toggleAppVersion:(params)=>{
        return instance({
            method: 'put',
            url: '/orgrimar/appVersion/toggle',
            params
        })
    },    
    appVersionModify:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/appVersion/modify',
            data
        })
    }, 
    toggleEmptyPdfExportSwitch:(params)=>{
        return instance({
            method: 'put',
            url: '/user-center/customer/emptyPdfExportSwitch/toggle',
            params
        })
    },  
    toggleAdvertisementPage:(params)=>{
        return instance({
            method: 'put',
            url: '/orgrimar/advertisementPage/toggle',
            params
        })
    },     
    setPunchType:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/customer/setPunchType',
            params
        })
    }, 
    getCusAccountList:(data)=>{
        return instance({
            method: 'post',
            url: '/trade/cusAccount/list',
            data
        })
    }, 
    getCusAccountDetail:(params)=>{
        return instance({
            method: 'get',
            url: '/trade/cusAccount/detail',
            params
        })
    }, 
    getCusAccRecordList:(data)=>{
        //管理费交易记录明细列表
        return instance({
            method: 'post',
            url: '/trade/cusAccountRecord/list',
            data
        })
    }, 
    getCusAcListTotal:(data)=>{
        //管理费交易记录明细列表-合计数据
        return instance({
            method: 'post',
            url: '/trade/cusAccountRecord/list/total',
            data
        })
    }, 
    cusAccRecharge:(data)=>{
        return instance({
            method: 'post',
            url: '/trade/cusAccount/recharge',
            data
        })
    }, 
    helpQuestionList:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/help/question/list',
            data
        })
    }, 
    setHotQuestion:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/help/question/setHot',
            params
        })
    },
    deleteHelpQuestion:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/help/question/delete',
            params
        })
    },
    deleteHelpRange:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/help/range/delete',
            params
        })
    },
    
    normalSetPassword:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/user/normalSetPassword',
            params
        })
    },
    
    setLogoAndBg:(params)=>{
        return instance({
            method: 'get',
            url: '/user-center/customer/setLogoAndBg',
            params
        })
    },
    helpQuestionAddOrEdit:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/help/question/addOrEdit',
            data
        })
    },
    helpRangeAddOrEdit:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/help/range/addOrEdit',
            data
        })
    },
    centerUserPageList:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/user/pageList',
            data
        })
    },
    centerDelUser:(params)=>{
        return instance({
            method: 'delete',
            url: '/user-center/user/delUser',
            params
        })
    },  
    dictionaryCategory:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/dictionary/category',
            params,
        })
    },
    getSonNodeByParentId:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/dictionary/getSonNodeByParentId',
            params,
        })
    },
    setDictionarySort:(params)=>{
        return instance({
            method: 'put',
            url: '/orgrimar/dictionary/sort',
            params,
        })
    },
    addCusRoleUser:(data)=>{
        return instance({
            method: 'post',
            url: '/user-center/user/addCusRoleUser',
            data
        })
    }, 
    uploadQiniu:(data)=>{
        return axios({
            method: 'post',
            url: 'http://upload.qiniu.com/',
            data
        })
    },
    helpRangeList:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/help/range/list',
            params
        })
    }, 
    sysparamList:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/sysparam/n/list',
            params
        })
    }, 
    appVersionAdd:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/appVersion/add',
            data
        })
    }, 
    appVersionList:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/appVersion/list',
            data
        })
    }, 
    punchTimeManageToggle:(params)=>{
        return instance({
            method: 'put',
            url: '/user-center/customer/punchTimeManage/toggle',
            params
        })
    }, 
    sysparamUpdate:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/sysparam/update',
            data
        })
    }, 
    dropDownRange:()=>{
        return instance({
            method: 'get',
            url: '/orgrimar/help/getRange'            
        })
    }, 
    getFinancialPhone:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/sysparam/n/value',
            params
        })
    }, 
    getSmsCode:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/sms/getCode',
            params
        })
    }, 
    updateCusRoleUser: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/user/updateCusRoleUser',
            data,
        })
    },
    cusAccSetPassword: (data) => {
        return instance({
            method: 'post',
            url: '/trade/cusAccount/setPassword/platform',
            data
        })
    }, 
    getDicList:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/dictionary/getSonNodeByCodeAndValue',
            params,
        })
    },
    // 添加保险
    addOrEditInsu:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/insu/addOrEditInsu',
            data,
        })
    },
    // 获取保单总数统计
    getInsuRecord:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/talent/insu/summary',
            data,
        })
    },
    // 获取投保记录
    getInsuDetail:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/talent/insu/insuDetail',
            data,
        })
    },
    // 获取投保记录总数统计
    getInsuDetailSummary:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/talent/insu/detailSummary',
            data,
        })
    },
    // 投保记录导出
    getInsuDetailExport:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/talent/insu/insuDetail/export',
            data,
        })
    },
    // 零工我的保单
    getSelfInsuList:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/talent/insu/insuList',
            data,
        })
    },
    getInsuListExport:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/talent/insu/insuList/export',
            data,
        })
    },
    // 获取保险列表
    getInsuList:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/insu/list',
            params,
        })
    },
    // 获取保险公司
    getInsuCompany:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/insu/company',
            params,
        })
    },
    // 行业
    getByCodeAndLevel:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/dictionary/getByCodeAndLevel',
            params,
        })
    },
    // 获取保险公司的险种
    getInsuType:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/insu/type',
            params,
        })
    },
    // 启用/下架 保险
    enableInsu:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/insu/enableInsu',
            params,
        })
    },
    // 预约信息备注
    setRemark:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/appointment/remark',
            params,
        })
    },
    // 修改信息备注
    editRemark:(params)=>{
        return instance({
            method: 'get',
            url: '/orgrimar/appointment/deal',
            params,
        })
    },
    // 添加广告
    addAdvertisement:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/advertisement/add',
            data,
        })
    },
    // 编辑广告
    modifyAdvertisement:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/advertisement/modify',
            data,
        })
    },
    // 广告列表
    advertisementList: (data) => {
        return instance({
            method: 'post',
            url: '/orgrimar/advertisement/list',
            data,
        })
    },
    // 广告删除
    delAdvertisement: (params) => {
        return instance({
            method: 'delete',
            url: '/orgrimar/advertisement/del',
            params,
        })
    },
    // 广告上下架
    upperAdvertisement: (params) => {
        return instance({
            method: 'put',
            url: '/orgrimar/advertisement/toggle',
            params,
        })
    },
    // 处理付费咨询记录
    handleConsultation:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/userConsultation/handle',
            data,
        })
    },
    // 付费咨询信息分页列表
    consultationList:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/userConsultation/list',
            data,
        })
    },
    //资讯列表
    informationList:(data)=>{
        return instance({
            method: 'post',
            url: '/orgrimar/information/list',
            data,
        })
    },
    // 资讯删除
    delInformation: (params) => {
        return instance({
            method: 'delete',
            url: '/orgrimar/information/del',
            params,
        })
    },
    // 资讯上下架
    toggleInformation: (params) => {
        return instance({
            method: 'put',
            url: '/orgrimar/information/toggle',
            params,
        })
    },
    // 添加资讯
    addInformation: (data) => {
        return instance({
            method: 'post',
            url: '/orgrimar/information/add',
            data,
        })
    },
    // 编辑资讯
    modifyInformation: (data) => {
        return instance({
            method: 'post',
            url: '/orgrimar/information/modify',
            data,
        })
    },

    //添加角色
    addRole: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/role/add',
            data,
        })
    },
    //删除角色
    delRole: (params) => {
        return instance({
            method: 'delete',
            url: '/user-center/role/del',
            params,
        })
    },
    //角色详情
   roleDetail: (params) => {
        return instance({
            method: 'get',
            url: '/user-center/role/detail',
            params,
        })
    },
    //修改角色
    modifyRename: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/role/rename',
            data,
        })
    },

    //角色列表
    roleList: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/role/list',
            data,
        })
    },
    //角色分配权限
    roleAssignPermission: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/role/assignPermission',
            data,
        })
    },
    //为用户分配角色
    roleAssignRole: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/role/assignRole',
            data,
        })
    },    
    fetchUserPermCodeList: (params) => {
        //获取当前用户的权限代码集合
        return instance({
            method: 'get',
            url: '/user-center/permission/userPermCodeList',
            params,
        })
    },
    //角色树
    permissionTree: (params) => {
        return instance({
            method: 'get',
            url: '/user-center/permission/tree',
            params,
        })
    },
    //添加万才商家属性
    addAttribute: (params) => {
        return instance({
            method: 'get',
            url: '/orgrimar/attribute/addOrEdit',
            params,
        })
    },
    //添加用户
    addPlatformUser: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/user/addPlatformUser',
            data,
        })
    },
    //添加用户
    updatePlatformUser: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/user/updatePlatformUser',
            data,
        })
    },
    //删除万才商家属性
    deleteAttribute: (params) => {
        return instance({
            method: 'get',
            url: '/orgrimar/attribute/delete',
            params,
        })
    },
    //万才商家属性列表
    attributeList: (params) => {
        return instance({
            method: 'get',
            url: '/orgrimar/attribute/list',
            params,
        })
    },
    //标签列表
    customerIndustry: (params) => {
        return instance({
            method: 'get',
            url: '/orgrimar/customer/industry/customerIndustry',
            params,
        })
    },
    //商家管理 标签列表 隐藏切换
    displayStatus: (data) => {
        return instance({
            method: 'post',
            url: '/orgrimar/customer/industry/displayStatus',
            data,
        })
    },
    //数据管理 基础数据
    dataManageBaseData: (params) => {
        return instance({
            method: 'get',
            url: '/data-center/dataManage/baseData',
            params,
        })
    },
    //数据管理 数据报表
    dataManageChartData: (params) => {
        return instance({
            method: 'get',
            url: '/data-center/dataManage/chartData',
            params,
        })
    },
    updateBestFrame: (params) => {
        return instance({
            method: 'get',
            url: '/user-center/talent/updateBestFrame',
            params,
        })
    },
    //用户管理
    listTalent: (data) => {
        return instance({
            method: 'post',
            url: '/user-center/talent/listTalent',
            data,
        })
    },
    //操作记录
    listLog: (params) => {
        return instance({
            method: 'get',
            url: '/orgrimar/log/listLog',
            params,
        })
    },
    //解冻冻结账号
    frozen: (params) => {
        return instance({
            method: 'get',
            url: '/user-center/user/frozen',
            params,
        })
    },
    //重置密码
    resetPwd: (params) => {
        return instance({
            method: 'get',
            url: '/user-center/user/resetPwd',
            params,
        })
    },
    //任务列表
    taskList: (params) => {
        return instance({
            method: 'get',
            url: '/biz-center/task/listOptTask',
            params,
        })
    },
    taskDetail: (params) => {
        return instance({
            method: 'get',
            url: '/biz-center/task/detail',
            params,
        })
    },
    //排班列表
    schedulingList: (data) => {
        return instance({
            method: 'post',
            url: '/biz-center/scheduling/p/list',
            data,
        })
    },
    //排班人员列表
    pageList: (data) => {
        return instance({
            method: 'post',
            url: '/biz-center/schedulingEmployee/pageList',
            data,
        })
    },
    //排班总计
    getBySchedulingId: (params) => {
        return instance({
            method: 'get',
            url: '/data-center/schedulingRecord/getBySchedulingId',
            params,
        })
    },
    //设置
    latestPrice: (params) => {
        return instance({
            method: 'get',
            url: '/biz-center/schedulingSetting/latestPrice',
            params,
        })
    },
    //获取排班三方确认信息
    schedulingConfirm: (params) => {
        return instance({
            method: 'get',
            url: '/biz-center/schedulingConfirm/detail',
            params,
        })
    },
    // 工种列表
    industryList: (params) => {
        return instance({
            method: 'get',
            url: '/biz-center/schedulingSetting/enableIndustryList',
            params,
        })
    },
    //用户快速修改密码
    fastSetPassword: (params) => {
        return instance({
            method: 'get',
            url: '/user-center/user/fastSetPassword',
            params,
        })
    },
    //删除用户
    delUser: (params) => {
        return instance({
            method: 'delete',
            url: '/user-center/user/delUser',
            params,
        })
    },

    //银行卡列表
    getByUserId: (params) => {
        return instance({
            method: 'get',
            url: '/trade/accountBank/getByUserId',
            params,
        })
    },

    //清除解绑记录
    clearRecord: (params) => {
        return instance({
            method: 'get',
            url: '/trade/accountBank/clearRecord',
            params,
        })
    },
    //  个人商家升级为企业商家
    personaLupgrade: (data) => {
      return instance({
        method : 'post',
        url: '/user-center/customer/upgradeEnterprise',
        data,
      }) 
    }
};
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, 'ApiLists' , { value: _apiLists });
    }	
};