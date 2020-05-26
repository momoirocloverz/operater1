<template>
    <div class="userListCon" v-loading="loading">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.loginName" class="lockWidth" size="small" placeholder="请填写账号"
                              clearable></el-input>
                    <el-input v-model="form.realName" class="lockWidth" size="small" placeholder="请输入真实姓名"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
                </div>
                <div>
                    <el-button type="primary" size="small" v-Auth="'661'" @click="authConfig">角色权限配置</el-button>
                    <el-button type="primary" size="small" v-Auth="'662'" @click="addUser">新增系统用户</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.roleId" placeholder="请选择角色"
                           @change="searchAction">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.status" placeholder="请选择状态"
                           @change="searchAction">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" max-height="530" stripe style="width: 100%" emptyText="暂无相关信息">
                    <el-table-column prop="userId" label="账号ID" width="100"></el-table-column>
                    <el-table-column prop="loginName" label="账号"></el-table-column>
                    <el-table-column prop="realName" label="真实姓名"></el-table-column>
                    <el-table-column prop="roleNames" :formatter="$isContent" label="角色"></el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean(['663','664','665','666'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'663'" @click="assign(scope.row)">角色分配</el-button>
                            <el-button size="mini" type="text" v-Auth="'664'"  @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button size="mini" type="text" v-Auth="'665'"  @click="editPassword(scope.row)">修改密码</el-button>
                            <el-button size="mini" type="text" v-Auth="'666'"  @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="新增系统用户" class="setRoot2Scoped setMiddleDialog" :visible.sync="newVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="花名" prop="flower">
                        <el-input v-model="newForm.flower" maxlength="10" autocomplete="off" size="small"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="newForm.name" maxlength="10" autocomplete="off" size="small"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="newForm.pass" maxlength="18" minlength="6" autocomplete="off"
                                  size="small" show-password clearable></el-input>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitNewFormPass('newForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelNewFormPass('newForm')">取
                            消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="修改密码" class="setRoot4Scoped setMiddleDialog" :visible.sync="editPassVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="editPassForm" status-icon :rules="editPassRules" ref="editPassForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="账号">
                        <div>{{params.loginName}}</div>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="editPassForm.pass" autocomplete="off" size="small"
                                  show-password clearable></el-input>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitEditPass('editPassForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelEditPass('editPassForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="角色分配" class="setRoot3Scoped setMiddleDialog" :visible.sync="roleAssignVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="roleAssignForm" status-icon :rules="roleAssignRules" ref="roleAssignForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号">
                        <div>{{params.loginName}}</div>
                    </el-form-item>
                    <el-form-item label="角色" prop="roleId">
                        <el-select size="small" class="lockWidth" v-model="roleAssignForm.roleId" placeholder="请选择角色">
                            <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitRoleAssign('roleAssignForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelRoleAssign('roleAssignForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="编辑系统用户" class="setRoot1Scoped setMiddleDialog" :visible.sync="sysUserVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="sysUserForm" status-icon :rules="sysUserRules" ref="sysUserForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="账号ID">
                        <div>{{params.userId}}</div>
                    </el-form-item>
                    <el-form-item label="花名" prop="flower">
                        <el-input type="text" v-model="sysUserForm.flower" maxlength="10" autocomplete="off"
                                  size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input type="text" v-model="sysUserForm.name" maxlength="10" autocomplete="off"
                                  size="small"></el-input>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitSysUserForm('sysUserForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelSysUserForm('sysUserForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'userlist',
        data() {
            return {
                loading:false,
                form: {
                    userType: 1,
                    loginName: '',
                    realName: '',
                    mobile: '',
                    status: '',
                    roleId: '',
                },
                options1: [],
                options: [],
                options2: [
                    {label: '不限', value: -1},
                    {label: '正常', value: 1},
                    {label: '冻结', value: 2},
                ],
                currentPage: 1,
                total: 0,
                tableData: [],
                newVisible: false,
                newForm: {
                    flower: '',
                    name: '',
                    pass: '',
                },
                newRules: {
                    flower: [
                        {required: true, message: '请输入花名', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'},
                    ],
                    pass: [
                        {required: true, message: '请输入6-18位密码', min: 6, max: 18, trigger: 'blur'},
                    ]
                },
                editPassVisible: false,
                editPassRules: {
                    pass: [
                        {required: true, message: '请输入6-18位密码', min: 6, max: 18, trigger: 'blur'},
                    ],
                },
                editPassForm: {
                    pass: '',
                },
                roleAssignVisible: false,
                roleAssignForm: {
                    roleId: '',
                },
                roleAssignRules: {
                    roleId: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                },
                sysUserVisible: false,
                sysUserForm: {
                    flower: '',
                    name: '',
                },
                sysUserRules: {
                    flower: [
                        {required: true, message: '请输入花名', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'},
                    ],
                },
                params: {},
                timeOutId:null
            }
        },
        mounted() {
            this.getRole()
            this.getList();
        },
        methods: {
            getRole() {
                this.options1 = [{label: '不限', value: -1}]
                this.ApiLists.roleList({
                    pageNum: this.currentPage,
                    pageSize: 0,
                    customerId: -1,
                }).then(res => {
                    const {data, respCode} = res
                    if (respCode === 0) {
                        if (data.list && data.list.length > 0) {
                            this.options = data.list
                            for (let item of data.list) {
                                this.options1.push({
                                    label: item.roleName,
                                    value: item.id,
                                })
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getList() {
                this.loading = true;
                let data = {
                    pageNum: this.currentPage,
                    pageSize: 20,
                    userType: 1,
                    customerId: '',
                    realName: this.form.realName,
                    loginName: this.form.loginName,
                    status: this.form.status === -1 ? "" : this.form.status,
                    roleId: this.form.roleId === -1 ? "" : this.form.roleId,
                };
                this.ApiLists.centerUserPageList(data).then(res => {
                    let {respCode, data} = res;
                    if (respCode == 0) {
                        this.tableData = data.list || [];
                        this.total = data.total;
                    }
                }).catch(err => {
                    console.log('err', err);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            searchAction() {
                this.currentPage = 1;
                this.getList()
            },
            handleEdit(row) {
                this.params = {...row}
                this.sysUserForm = {
                    flower: this.params.loginName,
                    name: this.params.realName,
                }
                this.sysUserVisible = true;
                this.$nextTick(() => {
                    this.$refs.sysUserForm.resetFields();
                });
            },
            assign(row) {
                this.params = {...row}
                this.roleAssignVisible = true;
                this.$nextTick(() => {
                    this.$refs.roleAssignForm.resetFields();
                });
            },
            editPassword(row) {
                this.params = {...row}
                this.editPassVisible = true;
                this.$nextTick(() => {
                    this.$refs.editPassForm.resetFields();
                });
            },
            handleDelete(row) {
                this.params = {...row}
                this.$confirm('确定要删除该用户吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.ApiLists.delUser({
                        userId: this.params.userId
                    }).then(res => {
                        const {data, respCode} = res;
                        if (respCode === 0) {
                            this.searchAction();
                            this.$message.success('删除成功!')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList()
            },
            authConfig() {
                const {href} = this.$router.resolve({
                    name: 'systemManAuthConfig'
                })
                window.open(href);
            },
            addUser() {
                this.newVisible = true;
                this.$nextTick(() => {
                    this.$refs.newForm.resetFields();
                });
            },
            addAction() {
                this.newVisible = false;
            },
            submitNewFormPass(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ApiLists.addPlatformUser({
                            realNameAlias: this.newForm.flower,
                            realName: this.newForm.name,
                            password: this.newForm.pass,
                        }).then(res => {
                            const {data, respCode} = res
                            if (respCode === 0) {
                                this.$message.success('操作成功')
                                this.searchAction()
                                this.cancelNewFormPass(formName);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelNewFormPass(formName) {
                this.$refs[formName].resetFields();
                this.newVisible = false;
            },
            changePasswordAction() {
                this.editPassVisible = false;
            },
            submitEditPass(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ApiLists.fastSetPassword({
                            userId: this.params.userId,
                            password: this.editPassForm.pass
                        }).then(res => {
                            const {data, respCode} = res
                            if (respCode === 0) {
                                this.$message.success('操作成功')
                                this.searchAction()
                                this.changePasswordAction(formName);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelEditPass(formName) {
                this.$refs[formName].resetFields();
                this.editPassVisible = false;
            },
            submitRoleAssign(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            userId: this.params.userId,
                            roleIdList: [this.roleAssignForm.roleId],
                        };
                        this.ApiLists.roleAssignRole(data).then(res => {
                            let {respCode, data} = res;
                            if (respCode == 0) {
                                this.$message({
                                    message: '设置成功',
                                    type: 'success'
                                });
                                this.searchAction()
                                this.cancelRoleAssign(formName)
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            cancelRoleAssign(formName) {
                this.$refs[formName].resetFields();
                this.roleAssignVisible = false;
            },
            submitSysUserForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ApiLists.updatePlatformUser({
                            realNameAlias: this.sysUserForm.flower,
                            realName: this.sysUserForm.name,
                            userId: this.params.userId,
                        }).then(res => {
                            const {data, respCode} = res
                            if (respCode === 0) {
                                this.$message.success('操作成功')
                                this.searchAction()
                                this.cancelSysUserForm(formName);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelSysUserForm(formName) {
                this.$refs[formName].resetFields();
                this.sysUserVisible = false;
            },
        }
        ,
    }
</script>
<style lang="scss" scoped>
    .userListCon {
        .topCon {
            .lockWidth {
                width: 200px;
                margin-right: 10px;
            }

            .topFirst {
                display: flex;
                justify-content: space-between;
                align-content: center;
                align-items: center;
            }

            .topSec {
                margin-top: 15px;
            }
        }

        .bottomCon {
            .tableCon {
                margin-top: 10px;
            }

            .pagCon {
                display: flex;
                justify-content: center;
                margin-top: 30px;
            }
        }

        .flexHere {
            display: flex;
            justify-content: center;
        }
    }
</style>
<style lang="scss">
    .userListCon {
        .setRoot2Scoped .el-dialog {
            height: 320px;
        }

        .setRoot1Scoped .el-dialog {
            height: 320px;
        }

        .setRoot3Scoped .el-dialog {
            height: 260px;
        }

        .setRoot4Scoped .el-dialog {
            height: 260px;
        }
    }
</style>