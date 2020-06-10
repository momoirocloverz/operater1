<template>
    <div class="businessDetailCon" v-loading="loading">
        <div>
            <div class="nameColor">{{name}}</div>
            <el-tabs v-model.trim="activeName" @tab-click="handleClick">
                <template v-for="(item,index) in restTabArr">
                    <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
                </template>
            </el-tabs>
            <div class="tabContentCon">
                <div v-if="activeName == 'first' ">
                    <div class="retailOnly" v-if="mainType == '1' ">
                        <div>
                            <div class="itemTitle">账号信息</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData1" :key="1"></CusTable>
                                </div>
                                <div class="divideItem">
                                    <CusTable :tableData="tableData2" :key="2"
                                              @bindEvent="freezePersonal"></CusTable>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="itemTitle">基本信息</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData3" :key="3"></CusTable>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="companyCon" v-else>
                        <div>
                            <div class="itemTitle">账号信息</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData4" :key="4"></CusTable>
                                </div>
                                <div class="divideItem">
                                    <CusTable :tableData="tableData5" :key="5"
                                              @bindEvent="freezeCompany"></CusTable>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="itemTitle">基本信息</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData6" :key="6" @bindEvent="checkBusinessLicense"></CusTable>
                                </div>
                                <div class="divideItem">
                                    <CusTable :tableData="tableData7" :key="7"></CusTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="activeName == 'second' ">
                    <Config/>
                </div>
                <Role :id="nextData.id" v-if="activeName == 'third' ">
                </Role>
                <div v-if="activeName == 'fourth' ">
                    <div>
                        <div class="tableCon">
                            <el-table :data="tableData22" border style="width: 100%; margin-top: 20px">
                                <el-table-column prop="id" label="用户ID"></el-table-column>
                                <el-table-column prop="id" label="姓名"></el-table-column>
                                <el-table-column prop="id" label="性别"></el-table-column>
                                <el-table-column prop="id" label="年龄"></el-table-column>
                                <el-table-column prop="id" label="手机号"></el-table-column>
                                <el-table-column prop="id" label="实名认证"></el-table-column>
                                <el-table-column prop="id" label="打卡照片"></el-table-column>
                                <el-table-column prop="id" label="账号状态"></el-table-column>
                                <el-table-column prop="id" label="操作">
                                    <template v-slot="scope">
                                        <el-button type="text" size="small">详 情</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <SkillTag :id="nextData.id" v-if="activeName == 'fifth' "></SkillTag>
                <Attr :id="nextData.id" v-if="activeName == 'eight'"></Attr>
                <div v-if="activeName == 'sixth' ">
                    <CropInfo/>
                </div>
                <div v-if="activeName == 'seventh' ">
                    <Account/>
                </div>
                <div v-if="activeName == 'ninth' ">
                    <Function/>
                </div>
                
                
            </div>
        </div>  
        <el-dialog title="提示" class="setFreezeScoped setMiddleDialog" :visible.sync="freezeVisible" width="450px" :close-on-click-modal="false" center>
            <div class="freezeConDialog">
                <div>确定{{freezeDialogMap[freezeStatus]}}该商家？</div>
                <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="confirmFreeze">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelFreeze">取 消
                        </el-button>
                    </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Role from './components/role'
    import CropInfo from './sub/cropInfo.vue'
    import Config from './sub/config.vue'
    import Account from './sub/account.vue'
    import Function from './sub/function.vue'
    import Attr from './components/attribute'
    import SkillTag from './components/skillTag'

    export default {
        name: 'businessDetail',
        components:{Role,Attr,CropInfo,Account,SkillTag,Config,Function},
        data() {
            return {
                freezeVisible:false,
                loading:true,
                radio2: 3,
                radio3: 3,
                freezeStatus: '2',
                freezeDialogMap:{
                    1:'冻结',
                    2:'启用'
                },
                activeName: '',
                name: '',
                restTabArr: [],
                tableData1: [],
                tableData2: [],
                tableData3: [],
                tableData4: [],
                tableData5: [],
                tableData6: [],
                tableData7: [],
                tableData22: [],
                mainId:'',
                mainType:'1',
                companyBusinessLicense:'',
                nextData:{},
            }
        },
        mounted(){
            this.analyseQuery();
            this.requestInfo();
        },
        methods: {
            freezePersonal(){
                this.freezeVisible = true;
            },
            freezeCompany(){
                this.freezeVisible = true;
            },
            confirmFreeze(){
                let params = {
                    cusId:this.$route.query.id
                };
                this.ApiLists.toggleFrozenCustomer(params).then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.freezeVisible = false;
                        this.requestInfo();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            cancelFreeze(){
                this.freezeVisible = false;
            },
            checkBusinessLicense(){
                window.open(this.companyBusinessLicense);
            },
            requestInfo(){
                let params = {
                    id:this.mainId
                };
                this.ApiLists.businessCustomerDetail(params).then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.nextData = data;
                        switch ( this.mainType ){
                            case '1':
                                this.tableData1 = [
                                    {title: '账号ID', value: data.userId},
                                    {title: '账号类型', value: '个人商家', highLight:true}
                                ];
                                this.tableData2 = [
                                    {title: '绑定手机号', value: data.mobile},                                    
                                    {
                                        title: '账号状态', 
                                        value: data.status == '1' ? '正常' : '冻结',
                                        btnShow: this.AuthBoolean('62'), 
                                        btnText: data.status == '1' ? '冻 结' : '启 用', 
                                        highLight: true
                                    }
                                ];
                                this.freezeStatus = data.status;
                                this.tableData3 = [
                                    {title: '姓名', value: data.realName},
                                    {title: '身份证号', value: data.idCard},
                                ];
                                break;
                            case '2':
                                let picData = {
                                    background:data.background || '',
                                    logo:data.logo|| '',
                                };
                                sessionStorage.setItem('tempPicsSucker',JSON.stringify(picData))
                                this.freezeStatus = data.status;
                                this.companyBusinessLicense = data.businessLicense;
                                this.tableData4 = [
                                    {title: '账号ID', value: data.userId},
                                    {title: '账号类型', value: '企业商家'},
                                ];
                                this.tableData5 = [
                                    {title: '绑定手机号', value: data.mobile},                                    
                                    {
                                        title: '账号状态', 
                                        value: data.status == '1' ? '正常' : '冻结', 
                                        btnShow: this.AuthBoolean('63'), 
                                        btnText: data.status == '1' ? '冻 结' : '启 用', 
                                        highLight: true
                                    }
                                ];
                                this.tableData6 = [
                                    {title: '公司简称', value: data.shortName},
                                    {title: '公司全称', value: data.name},
                                    {title: '统一社会信用代码', value: data.creditCode},
                                    {title: '公司所在地', value: `${data.province ? data.province :''}${data.city ? data.city : ''}${data.region ? data.region :''}${data.address ? data.address :''}`},
                                ];
                                if(this.AuthBoolean('64')){
                                    this.tableData6.push({
                                        title: '营业执照', 
                                        btnShow: true, 
                                        btnText: '查 看'
                                    })
                                }
                                this.tableData7 = [
                                    {title: '联系人姓名', value: data.realName},
                                    {title: '联系人身份证号', value: data.idCard},
                                    {title: '法人姓名', value: data.legalPerson},
                                    {title: '行业', value: data.industryName},
                                ];   
                                if(this.AuthBoolean('64')){
                                    this.tableData7.push({})
                                }
                                break;
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    this.loading = false;
                })                
            },
            analyseQuery(){
                let { id,type,name } = this.$route.query;
                this.mainId = id;
                this.name = name;
                this.mainType = type;
                switch (type) {
                    case '1':
                        let empty = [];
                        if( this.AuthBoolean('23') ){
                            empty.push({
                                title: '商家信息',
                                name: 'first'
                            })
                        }
                        this.restTabArr = empty;
                        if( this.restTabArr.length ){
                            this.activeName = this.restTabArr[0].name;
                        }
                        break;
                    case '2':
                        let empty2 = [];
                        if( this.AuthBoolean('31') ){
                            empty2.push({
                                title: '商家信息',
                                name: 'first'
                            })
                        }
                        if( this.AuthBoolean('32') ){
                            empty2.push({
                                title: '服务配置',
                                name: 'second'
                            })
                        }
                        if( this.AuthBoolean('35') ){
                            empty2.push({
                                title: '账号管理',
                                name: 'seventh'
                            })
                        }
                        if( this.AuthBoolean('36') ){
                            empty2.push({
                                title: '角色管理',
                                name: 'third'
                            })
                        }
                        if( this.AuthBoolean('34') ){
                            empty2.push({
                                title: '企业信息',
                                name: 'sixth'
                            })
                        }
                        if( this.AuthBoolean('37') ){
                            empty2.push({
                                title: '属性配置',
                                name: 'eight'
                            })
                        }
                        if( this.AuthBoolean('33') ){
                            empty2.push({
                                title: '技能标签',
                                name: 'fifth'
                            })
                        }
                        
                        if( this.AuthBoolean('33') ){
                            empty2.push({
                                title: '功能配置',
                                name: 'ninth'
                            })
                        }
                        
                        
                        this.restTabArr = empty2;
                 /*       this.restTabArr = [
                            {title: '服务配置', name: 'second'},
                            {title: '账号管理', name: 'seventh'},
                            { title:'角色管理',name:'third' },
                            {title: '企业信息', name: 'sixth'},
                            { title:'属性配置',name:'eight' },
//                            { title:'用户角色管理',name:'third' },
//                            {title: '黑名单', name: 'fourth'},
                            {title: '技能标签', name: 'fifth'}
                        ];*/
                        if( this.restTabArr.length ){
                            this.activeName = sessionStorage.getItem('cropSwitchItem')|| this.restTabArr[0].name ;
                        }
                        break;    
                }
            },
            handleClick(tab, event) {
                sessionStorage.setItem('cropSwitchItem',this.activeName);
                if( this.activeName == 'first' ){
                    this.analyseQuery();
                    this.requestInfo();
                }
            },  
        },
    }
</script>
<style scoped lang="scss">
    .businessDetailCon {
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;
        .pagCon {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        .divideCon {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .divideItem {
                width: 49%;
            }
        }
        .nameColor {
            color: #303133;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .itemTitle {
            color: #606266;
            font-size: 14px;
            margin-bottom: 10px;
            margin-top: 10px;
            font-weight: 500;
        }
        .flexHere {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        .freezeConDialog {
            text-align: center;
        }
    }
</style>
<style lang="scss">
    .businessDetailCon {
        .setFreezeScoped {
            .el-dialog {
                height: 180px;
            }
        }
    }
</style>