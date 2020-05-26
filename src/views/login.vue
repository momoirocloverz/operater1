<template>
    <div class="login" @keyup.enter="enterReaction">
        <div class="setCenter">
            <div class="title">运营管理系统</div>
            <el-form ref="loginForm" :model="loginForm" class="parentPosition" :rules="rules">
                <el-form-item prop="account">
                    <el-input v-model="loginForm.account" placeholder="请输入手机号/花名" prefix-icon="el-icon-user" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="setPosition">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" type="password" maxlength="20"></el-input>
                </el-form-item>
                <el-button type="primary" size="small" class="setWidth" @click="go('loginForm')" :disabled="loginAble">登录</el-button>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'login',
        data(){
            return {
                loginAble:false,
                loginForm:{
                    account:'',
                    password:'',
                },
                rules: {
                    account: [
                        { required: true, message: '请输入手机号/花名', trigger: 'blur' },
//                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
//                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted(){
            this.clearStateAction();
        },
        methods:{
            clearStateAction(){
                localStorage.removeItem('commonToken');
                this.$store.commit('reInitVuexData');
            },
            async getUseInfo(){
                await this.ApiLists.getBaseInfo().then(res=>{
                    if(res.respCode === 0){
                        this.$store.commit('setYyInfo',res.data)
                    }
                })
            },
                fetchOwnPermission(){
                let data = {
                    userId:this.$store.getters.getInfo.userId,
                };
                this.ApiLists.fetchUserPermCodeList(data).then(res => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        let processer = data || [];
                        let empty = [];
                        let newArr = processer.filter(ele=>{
                            if( !ele.startsWith('1') ){
                                empty.push(ele);
                            }
                            return ele.startsWith('1')||ele.startsWith('2')||ele.startsWith('3');
                        })
                        this.$store.commit('setAuthPageData',newArr);
                        this.$store.commit('setAuthBtnData',empty);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },   
            go(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loginAble = true;
                        let data = {
                            loginName:`${this.loginForm.account}`,
                            pwd:this.loginForm.password,
                        };
                        this.ApiLists.login(data).then(async res=>{
                            let { respCode,data,errorMsg } = res;
                            if( respCode === 0 ){
                                await this.getUseInfo()
                                this.fetchOwnPermission();
                                setTimeout(()=>{
                                    this.$router.push({
                                        path:'/main'
                                    });
                                },400)
                            }
                        }).catch(err=>{
                            console.log(err);
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.loginAble = false;
                            },500);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            enterReaction(){
                this.go('loginForm');
            },
        },
    }
</script>
<style lang="scss" scoped>
    .login {
        background-origin: border-box;
        background-repeat:no-repeat;
        background-position: 50%;
        background-image: url(../assets/loginBg.jpg);
        background-size:cover;
        height: 100vh;
        min-height: 500px;
    }
    .setCenter {
        box-shadow:0px 4px 8px -1px rgba(0,0,0,0.1);
        border-radius:10px;
        height: 328px;
        width: 320px;
        background-color: #fff;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        padding: 40px;
        box-sizing: border-box;
        bottom: 0;
        .title {
            color: #303133;
            font-size: 20px;
            font-weight: 500;
            line-height: 28px;
            height: 28px;
            text-align: center;
            margin-bottom: 40px;
        }
        .setWidth {
            width: 240px !important;
            position: absolute;
            bottom: 0;
        }
        .setPosition {
            top: 60px;
            width: 240px !important;
            position: absolute;
        }
        .parentPosition {
            height: 180px;
            position: relative;
        }
    }
</style>
<style lang="scss">
    .login {
        .el-input__inner {
            border-width: 0;
            border-radius: 0;
            box-sizing: border-box;
        }
        .el-input__prefix {
            left: 0px;
        }
        .el-input__icon {
            text-align: left;
            color: #606266;
        }
        .el-input--prefix .el-input__inner  {
            padding-left: 20px;
        }
        .el-input__inner {
            &:focus {
                border-bottom-color: #303133;
                border-bottom-width: 1px;
            }
        }
        .el-form-item.is-error .el-input__inner {
            border-bottom-width: 1px;
        }
    }
</style>