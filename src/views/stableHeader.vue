<template>
    <div class="rootCopyContainer">
        <div class="flexContainer">
            <div class="topCon">
                <div class="leftTopCon">
                    <img :src="logoImg">
                    <div class="titleText">运营管理系统</div>
                </div>
                <div class="rightTopPart">
                    <div class="breadCon"></div>
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
            </div>
            <div class="bottomCon">
                <router-view></router-view>
            </div>
        </div>
        <el-dialog title="修改密码" class="setRootScoped setMiddleDialog" :visible.sync="passwordVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="120px"
                         class="demo-ruleForm">
                    <el-form-item label="账号">
                        <div>{{ currentAccount }}</div>
                    </el-form-item>
                    <el-form-item label="原密码" prop="originalPass">
                        <el-input v-model.trim="passwordForm.originalPass" size="small" show-password placeholder="原密码" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newpass">
                        <el-input type="password" v-model.trim="passwordForm.newpass" size="small"
                                  show-password placeholder="新密码" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码" prop="repeatPass">
                        <el-input type="password" v-model.trim="passwordForm.repeatPass" size="small"
                                  show-password placeholder="重复新密码" maxlength="20"></el-input>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn" @click="submitPass('passwordForm')">
                            确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelPass('passwordForm')">取
                            消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'commonHeader',
        data() {
            var validateRepeat = (rule, value, callback) => {
                if (value !== this.passwordForm.newpass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
             };
            return {
                logoImg:require('@/assets/logo.png'),
                passwordVisible: false,
                passwordForm: {
                    originalPass:'',
                    newpass:'',
                    repeatPass:'',
                },
                passwordRules: {
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
                currentAccount:'司马师',
            }
        },
        mounted() {
            this.currentAccount = this.$store.getters.getInfo.realName;
        },
        methods: {
            handleCommand(command) {
                switch (command) {
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
        }
    }
</script>
<style lang="scss" scoped>
    .rootCopyContainer {
        width: 100%;

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

            .topCon {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-content: center;

                .titleText {
                    height: 60px;
                    line-height: 60px;
                    color: #303133;
                    text-align: center;
                    font-size: 16px;
                }

                .leftTopCon {
                    width: 200px;
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

                .rightTopPart {
                    width: calc(100% - 200px);
                    height: 60px;
                    box-sizing: border-box;
                    padding-left: 30px;
                    padding-right: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    align-items: center;
                }
            }

            .bottomCon {
                overflow-y: scroll;
                overflow-x: hidden;
                padding: 30px;
                box-sizing: border-box;
                background-color: #F0F2F5;
                height: calc(100vh - 60px);
            }
        }
    }
</style>
<style lang="scss">
    .rootCopyContainer {
        .setRootScoped .el-dialog {
            height: 400px;
        }
    }
</style>