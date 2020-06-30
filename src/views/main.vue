<template>
  <div class="rootContainer">    
      <div class="flexContainer">
          <div class="leftPart">
              <div class="logoContainer">
                  <img :src="logoImg">
                  <div class="titleText">运营管理系统</div>
                </div>
              <div class="menuCon"> 
                  <el-menu :default-active="getMenuActiveIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" unique-opened>
                    <template v-for="(item,index) in currentMenu"> 
                          <template v-if="item.children && item.children.length">
                              <el-submenu :index="item.index">
                                <template slot="title">
                                  <span>{{item.title}}</span>
                                </template>
                                <template v-for="(subItem,subIndex) in item.children">
                                    <el-menu-item :index="subItem.index" @click="switchToSubMenu(item,subItem)">{{subItem.title}}</el-menu-item>
                                </template>
                              </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item :index="item.index">
                                    <span slot="title">{{item.title}}</span>
                                  </el-menu-item>
                            </template>
                        </template>     
                    </el-menu>
                </div>
            </div>
          <div class="rightPart">
                <div class="rightTopPart">
                    <div class="breadCon">
                        <el-breadcrumb separator="/">
                            <template v-for="(item,index) in getBreadcrumbList">
                                <el-breadcrumb-item>{{item.title}}</el-breadcrumb-item>
                            </template>
                        </el-breadcrumb>
                    </div>
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link cursorSet">
                        {{currentAccount}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">修改密码</el-dropdown-item>
                        <el-dropdown-item command="b">退出登录</el-dropdown-item>                  
                      </el-dropdown-menu>
                    </el-dropdown>
                </div>
              <div class="rightBottomPart">
                  <div class="setWhiteBg">
                      <router-view></router-view>
                  </div>
              </div>
            </div>
        </div>
        <el-dialog title="修改密码" class="setRootScoped setMiddleDialog" :visible.sync="passwordVisible" width="450px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="账号">
                        <div>{{ currentAccount }}</div>
                    </el-form-item>
                    <el-form-item label="原密码" prop="originalPass">
                        <el-input  type="password" v-model.trim="passwordForm.originalPass" size="small" show-password placeholder="原密码" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newpass">
                        <el-input type="password" v-model.trim="passwordForm.newpass" size="small" show-password placeholder="新密码" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码" prop="repeatPass">
                        <el-input type="password" v-model.trim="passwordForm.repeatPass" size="small" show-password placeholder="重复新密码" maxlength="20"></el-input>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn" @click="submitPass('passwordForm')">确 定</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelPass('passwordForm')">取 消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex'
export default {
    name: 'root',
    data(){
        var validateRepeat = (rule, value, callback) => {
            if (value !== this.passwordForm.newpass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            logoImg:require('@/assets/logo.png'),
            currentAccount:'司马师',
            passwordVisible:false,
            passwordForm:{
                originalPass:'',
                newpass:'',
                repeatPass:'',
            },
            passwordRules:{
                originalPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                ],
                newpass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
                repeatPass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: validateRepeat, trigger: 'blur' }
                ],
            },
            currentMenu:[],
            menuList:[
                {
                    title:'数据管理',
                    index:'0',
                    auth:'11',
                    children:[
                        {
                            title:'基础数据',
                            path:'/main/dataList',
                            index:'0-1',
                            auth:'21',
                        },
                    ],
                },
                {
                    title:'商家管理',
                    index:'1',
                    auth:'12',
                    children:[
                        {
                            title:'商家列表',
                            path:'/main/businessList',
                            index:'1-1',
                            auth:'22',
                        },
                    ],
                },
                {
                    title:'用户管理',
                    index:'2',
                    auth:'13',
                    children:[
                        {
                            title:'用户列表',
                            path:'/main/userList',
                            index:'2-1',
                            auth:'25',
                        },
                    ],
                },
                {
                    title:'管理费账户管理',
                    index:'3',
                    auth:'14',
                    children:[
                        {
                            title:'商家账户列表',
                            path:'/main/administrative',
                            index:'3-1',
                            auth:'28',
                        },
                      /*  {
                            title:'万才科技账户列表',
                            path:'/main/administrative/wancaiList',
                            index:'3-2',
                        },*/
                    ],
                },
     /*           {
                    title:'第三方账户管理',
                    index:'4',
                    children:[
                        {
                            title:'薪企云服账户管理',
                            path:'/main/thirdAccount',
                            index:'4-1',
                        },
                    ],
                },  */
                {
                    title:'任务排班管理',
                    index:'5',
                    auth:'15',
                    children:[
                        {
                            title:'任务列表',
                            path:'/main/taskManagement',
                            index:'5-1',
                            auth:'210',
                        },
                        {
                            title:'排班列表',
                            path:'/main/taskManagement/taskManaClasslist',
                            index:'5-2',
                            auth:'213',
                        },
                    ],
                },
                {
                    title:'保单管理',
                    index:'6',
                    auth:'16',
                    children:[
                        {
                            title:'保险列表',
                            path:'/main/InsuranceMana',
                            index:'6-1',
                            auth:'214',
                        },
                        // {
                        //     title:'出险记录',
                        //     path:'/main/InsuranceMana/recordList',
                        //     index:'6-2',
                        // },
                    ],
                },
                {
                    title:'产品管理',
                    index:'7',
                    auth:'17',
                    children:[                        
                        {
                            title:'系统参数设置',
                            path:'/main/productMana',
                            index:'7-1',
                            auth:'216',
                        },
                        {
                            title:'类目管理',
                            path:'/main/productMana/itemList',
                            index:'7-2',
                            auth:'217',
                        },
                        {
                            title:'版本管理',
                            path:'/main/productMana/versionList',
                            index:'7-3',
                            auth:'218',
                        },
                        {
                            title:'保险管理',
                            path:'/main/productMana/insurList',
                            index:'7-4',
                            auth:'219',
                        },
                        {
                            title:'企业版帮助中心',
                            path:'/main/productMana/productHelper',
                            index:'7-5',
                            auth:'220',
                        },
                    ],
                },
                {
                    title:'系统管理',
                    index:'8',
                    auth:'19',
                    children:[
                        {
                            title:'系统用户',
                            path:'/main/systemMana',
                            index:'8-1',
                            auth:'224',
                        },
                        {
                            title:'角色权限配置',
                            path:'/main/systemMana/authConfig',
                            index:'8-2',
                            ignoreData:true,
                            auth:'225',
                        },
                     {
                            title:'操作记录',
                            path:'/main/systemMana/operationList',
                            index:'8-3',
                            auth:'226',
                        },
                    ],
                },
                {
                    title:'运营管理',
                    index:'9',
                    auth:'18',
                    children:[
                        {
                            title:'申请预约管理',
                            path:'/main/operationMana/list',
                            index:'9-1',
                            auth:'223',
                        },
                        {
                            title:'企业版资讯管理',
                            path:'/main/operationMana/informationList',
                            index:'9-2',
                            auth:'221',
                        },
                        {
                            title:'广告管理',
                            path:'/main/operationMana/advertisementList',
                            index:'9-3',
                            auth:'222',
                        },
                        {
                            title:'广告页管理',
                            path:'/main/operationMana/startScreenList',
                            index:'9-4',
                            auth:'22201',
                        },
                    ],
                },
            ],
        }
    },
    computed: {
        ...mapGetters([
            'getMenuActiveIndex',
            'getBreadcrumbList',
            'getInfo',
            'getAuthPageData'
        ])
    },
    watch:{
        "$route":function(nval,val){
            if( nval.path == '/main' ){
                this.$store.commit('setBreadcrumbList',[
                    { title:'首页' }
                ]);
                this.$store.commit('changeMenuActiveIndex', '0')
            }
        }
    },
    mounted(){
        this.setTitleInfo();
        this.reGenerateNavMenu();
    },
    methods: {
        setTitleInfo(){
            this.currentAccount = this.getInfo.realName;
        },
        reGenerateNavMenu(){
            let deepClone1 = Object.assign([],this.menuList);
            deepClone1.forEach((ele,index)=>{
                if(this.getAuthPageData.includes(ele.auth) ){
                    if( ele.children && ele.children.length ){
                        ele.children.forEach( (subEle,subIndex)=>{
                            if(this.getAuthPageData.includes(subEle.auth) ){
                            }else{
                                delete ele.children[subIndex]
                            }
                        } )   
                        ele.children = ele.children.filter(ele=>{
                            return ele;
                        })
                    }                    
                }else{
                    delete deepClone1[index]
                }
            });
            this.$nextTick(()=>{
                deepClone1 = deepClone1.filter(ele=>{
                    return ele;
                })
                this.currentMenu = deepClone1;
            });
        },
        handleCommand(command) {
            switch ( command ){
                case 'a':
                    this.passwordVisible = true;
                    this.$nextTick(()=>{
                        this.$refs.passwordForm.resetFields();
                    });
                    break;
                case 'b':
                    localStorage.removeItem('commonToken');
                    this.$store.commit('reInitVuexData');
                    this.$router.push('/');
                    break;    
            }
        },        
        switchToSubMenu(item,subItem){
            if( subItem.ignoreData ){
                const { href } = this.$router.resolve({
                    path: subItem.path
                })   
                window.open( href );
            }else{
                this.$store.commit('setBreadcrumbList',[
                    { title:item.title },
                    { title:subItem.title },
                ]);
                this.$store.commit('changeMenuActiveIndex', subItem.index)
                this.$router.push({
                    path:subItem.path
                }).catch(err=>{
                    console.log('err',err);
                }); 
            }
        },
        changePasswordAction(){
            let params = {
                oldPassword:this.passwordForm.originalPass,
                newPassword:this.passwordForm.newpass,
            };
            this.ApiLists.normalSetPassword(params).then(res =>{
                    let { respCode } = res;
                    if(respCode === 0){
                        this.$message({
                            message: '密码修改成功',
                            type: 'success'
                        });
                         this.passwordVisible = false;
                    }
            }).catch(err=>{
                console.log('err',err);
            })
        },
        submitPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    this.changePasswordAction();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelPass(formName){
            this.$refs[formName].resetFields();
            this.passwordVisible = false;
        },
      handleOpen(key, keyPath) {
//          console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
//          console.log(key, keyPath);
      }
    }
}
</script>
<style lang="scss" scoped>
    .rootContainer {    
        .logoContainer {
            display: flex;
            justify-content:flex-start;
            img {
                margin-top: 10px;
                width: 40px;
                height: 40px;
                margin-left: 20px;
                margin-right: 10px;
            }
        }
        .flexHere {
            display: flex;
            justify-content: center;
        }
        .cursorSet {
            cursor: pointer;
            &:hover {
                color: #303133;
            }
        }
        .flexContainer {
            height: 100vh;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-content: center;
            .leftPart {               
                width: 200px;
                overflow-y: scroll;
                overflow-x: hidden;
                .menuCon {
                    width: 200px;
                }
                .titleText {
                    height: 60px;
                    line-height: 60px;
                    color: #303133;
                    text-align: center;
                    font-size: 16px;
                }
            }
            .rightPart {
                width: calc( 100% - 200px );
                background-color: #F0F2F5;
                overflow-y: scroll;
                .rightTopPart {
                    height: 60px;
                    background-color: #fff;
                    box-sizing: border-box;
                    padding-left: 30px;
                    padding-right: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    align-items: center;
                }
                .rightBottomPart {
                    height: calc( 100vh - 60px );
                    overflow-y: scroll;
                    overflow-x: hidden;
                    padding: 30px;
                    box-sizing: border-box;
                    .setWhiteBg {
                        background-color: #fff;
                        height: 100%;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        padding: 30px;
                        box-sizing: border-box;
                    }
                }
            }
        }        
    }    
</style>
<style lang="scss">
    .rootContainer {          
        .el-menu-vertical-demo {
            border-right: 0;
        }
        .menuCon {
            li[role="menuitem"] {
                color: #909399; 
            }
            .el-submenu__title {
                color: #909399;
                position: relative;
                height: 50px;
                line-height: 50px;
                &:hover {
                    background-color: transparent;
                    color: #303133;
                }
            }
            .el-menu-item {
                position: relative;
                height: 40px;
                line-height: 40px;
                &:hover {
                    background-color: transparent;
                    color: #303133;
                }
            }
            .is-opened .el-submenu__title{
                color: #303133;
            }
            .is-active {
                &.el-submenu__title {
                    background-color: transparent;
                    color: #FF2626 !important;
                     &:before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 10px;
                        width: 3px;
                        height: 20px;
                        background-color: #FF2626;
                    }
                }
                &.el-menu-item {
                    background-color: transparent;
                    color: #FF2626 !important;
                    &:before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 10px;
                        width: 3px;
                        height: 20px;
                        background-color: #FF2626;
                    }
                }
            }            
        }
        .setRootScoped .el-dialog {
            height: 400px;
        }
    }    
</style>