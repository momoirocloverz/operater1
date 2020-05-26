<template>
    <div class="accountManageCon" v-loading="loading">
        <div class="topCon">
            <div class="firstLine" @keyup.enter="searchAction">
                <el-input v-model.trim="input1" class="lockWidth mr20" size="small" placeholder="真实姓名"
                              clearable maxlength='20'></el-input>
                <el-input v-model.trim="input3" class="lockWidth mr20" size="small" placeholder="手机号码"
                              clearable maxlength='11'></el-input>
                <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
            </div>
            <div class="secondLine">
                <el-select size="small" class="lockWidth" v-model="role" @change="searchAction" placeholder="角色">
                        <el-option v-for="item in rolesOptions1" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                <el-button type="primary" size="small" @click="addAction" v-Auth="'613'">添 加</el-button>
            </div>
        </div>
        <div class="tableCon">
             <el-table emptyText="暂无相关信息" :data="tableData" max-height="530" stripe style="width: 100%;margin-top:20px;">
                 <el-table-column prop="userId" label="账户ID"></el-table-column>
                 <el-table-column prop="realName" label="真实姓名"></el-table-column>
                 <el-table-column prop="mobile" label="手机号码"></el-table-column>
                 <el-table-column prop="roleNames" label="角色"></el-table-column>
                 <el-table-column label="操作" v-if="AuthBoolean(['611','612'])">
                     <template v-slot="scope">
                         <el-button type="text" size="small" @click="editAction(scope.row)" v-Auth="'611'">修改角色</el-button>
                         <el-button type="text" size="small" @click="deleteAction(scope.row)" v-Auth="'612'">删除</el-button>
                    </template>
                </el-table-column>                 
            </el-table>
        </div>
        <div class="pagCon" v-if="total">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="total, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        <el-dialog title="添加" class="setRoot1Scoped setMiddleDialog" :visible.sync="addVisible" width="450px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="addForm" status-icon :rules="addRules" ref="addForm"
                         label-width="120px" class="demo-ruleForm " >
                    <el-form-item label="真实姓名：" prop="name">
                        <el-input v-model.trim="addForm.name"  size="small" placeholder="真实姓名"
                              clearable maxlength='20'></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input v-model.trim="addForm.mobile"  size="small" placeholder="手机号码"
                              clearable maxlength='11'></el-input>
                    </el-form-item>
                    <el-form-item label="角色：" prop="role">
                            <el-select size="small" class="setWidth" v-model="addForm.role" placeholder="角色">
                                <el-option v-for="item in rolesOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitAddPass('addForm')" :disabled="addAble">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelAddPass('addForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="修改角色" class="setRoot2Scoped setMiddleDialog" :visible.sync="editVisible" width="450px"  :close-on-click-modal="false" center>
            <el-form :model="editForm" status-icon :rules="editRules" ref="editForm"
                         label-width="120px" class="demo-ruleForm " >
                
                <el-form-item label="真实姓名：" >
                    <div>{{editForm.name}}</div>
                </el-form-item>
                
                <el-form-item label="手机号码：" prop="mobile">
                    <el-input v-model.trim="editForm.mobile"  size="small" placeholder="手机号码"
                              clearable maxlength='11'></el-input>
                </el-form-item>
                
                <el-form-item label="角色：" prop="role">
                    <el-select size="small" class="setWidth" v-model="editForm.role" placeholder="角色">
                        <el-option v-for="item in rolesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" :disabled="editAble" class="sameWidthBtn"
                                   @click="submitEditPass('editForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelEditPass('editForm')">取 消
                        </el-button>
                    </div>
                </el-form>
        </el-dialog>
        <el-dialog title="删除" class="setRoot3Scoped setMiddleDialog" :visible.sync="deleteVisible" width="450px"  :close-on-click-modal="false" center>
            <div>
                <div class="askText">确定要删除该账号吗？</div>  
                <div class="flexHere">
                    <el-button type="primary" size="small" class="sameWidthBtn" :disabled="deleteAble"  @click="submitDelete">确 定
                    </el-button>
                    <el-button type="info" size="small" class="sameWidthBtn"   @click="cancelDelete">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'accountManage',
        data() {
            var validateMobile = (rule, value, callback) => {
                let phoneReg = /^[1][0-9]{10}$/;
                if( phoneReg.test(value) ){
                    callback();
                }else{
                    callback('请输入正确的手机号'); 
                }                
            }
            return {
                addAble:false,
                editAble:false,
                deleteAble:false,
                loading:true,
                deleteVisible:false,
                editVisible:false,
                addVisible:false,
                input1:'',    
                input3:'',  
                role:'',
                total:0,
                rolesOptions:[],
                rolesOptions1:[],
                currentPage:1,
                tableData:[],
                addForm:{
                    name:'',
                    mobile:'',
                    role:'',
                },
                addRules:{
                    name:[
                        { required: true, message: '真实姓名不能为空', trigger: 'blur' },
                    ],
                    mobile:[
                        { required: true, message: '手机号码不能为空', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' },
                    ],
                    role:[
                        { required: true, message: '角色不能为空', trigger: 'change' },
                    ],
                },
                editForm:{
                    role:'',
                    name:'',
                    mobile:'',
                },
                editRules:{
                    role:[
                        { required: true, message: '角色不能为空', trigger: 'change' },
                    ],
                    mobile:[
                        { required: true, message: '手机号码不能为空', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' },
                    ],
                },
                rowBridge:{},
            }
        },
        mounted(){
            this.getRoleLists();
            this.getAccountLists();
        },
        methods: {
            getAccountLists(){
                let data = {
                    pageNum:this.currentPage,
                    pageSize:20,
                    userType:2,
                    customerId:this.$route.query.id,
                    realName:this.input1,
                    mobile:this.input3,
                    roleId:this.role, 
                };                
                if( this.role == 'nothing' ){
                    delete data.roleId
                }
                this.ApiLists.centerUserPageList(data).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.tableData = data.list||[];
                        this.total = data.total;
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    this.loading = false;
                })
            },
            getRoleLists(){
                let data = {
                    customerId:this.$route.query.id,
                    pageNum:1,
                    pageSize:10000,
                };
                this.ApiLists.roleList(data).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        let trans = data&&data.list || [];
                        let final = trans.map(ele=>{
                            return {
                                label:ele.roleName,
                                value:ele.id
                            };
                        })
                        this.rolesOptions = final;
                        this.rolesOptions1 = [ { label:'不限',value:'nothing' },...this.rolesOptions ];
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            submitEditPass(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');                        
                        let data ={
                            userId:this.rowBridge.userId,
                            customerId:this.$route.query.id,
                            roleId:this.editForm.role,
                            mobile:this.editForm.mobile,
                        }; 
                        this.editAble = true;
                        this.ApiLists.updateCusRoleUser(data).then(res=>{
                            let { respCode,data } = res;
                            if( respCode == 0 ){
                                this.$message({
                                    message: '设置成功',
                                    type: 'success'
                                });
                                this.editVisible = false;
                                this.currentPage = 1;
                                this.getAccountLists();
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.editAble = false;
                            },500);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelEditPass(formName){
                this.editVisible = false;
                this.$refs[formName].resetFields();
            },
            submitDelete(){
                let data = {
                    userId:this.rowBridge.userId
                }; 
                this.deleteAble = true;
                this.ApiLists.centerDelUser(data).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.currentPage = 1;
                        this.getAccountLists();
                        this.deleteVisible = false;
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.deleteAble = false;
                    },500);
                })
            },
            cancelDelete(){
                this.deleteVisible = false;
            },
            submitAddPass(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        let data = {
                            customerId:this.$route.query.id,
                            roleId:this.addForm.role,
                            realName:this.addForm.name,
                            mobile:this.addForm.mobile,
                        }; 
                        this.addAble = true;
                        this.ApiLists.addCusRoleUser(data).then(res=>{
                            let { respCode,data } = res;
                            if( respCode == 0 ){
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.currentPage = 1;
                                this.getAccountLists();
                                this.addVisible = false;
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.addAble = false;
                            },500);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelAddPass(formName){
                this.$refs[formName].resetFields();
                this.addVisible = false;
            },
            addAction(){
                this.addVisible = true;
            },
            editAction(row){
                this.rowBridge = row;
                this.editForm.role = +this.rowBridge.roleIds;
                this.editForm.name = this.rowBridge.realName;
                this.editForm.mobile = this.rowBridge.mobile;
                this.editVisible = true;
                this.$nextTick(()=>{
                    this.$refs['editForm'].resetFields();
                });
            },
            deleteAction(row){
                this.deleteVisible = true;
                this.rowBridge = row;
            },
            searchAction(){
                this.currentPage = 1;
                this.getAccountLists();
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.getAccountLists();
            },
        },
    }
</script>
<style scoped lang="scss">
    .accountManageCon {
        padding-bottom: 30px;
        box-sizing: border-box;
        .topCon {
        }
        .lockWidth {
            width: 200px;
        }
        .askText {
            margin-bottom: 40px;
            text-align: center;
        }
        .setWidth {
            width: 280px;
        }
        .pagCon {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        .firstLine {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            margin-bottom: 20px;
        }
        .secondLine {
            display: flex;
            justify-content:space-between;
            align-content: center;
            align-items: center;
        }
        .flexHere {
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
        }
    }
</style>
<style lang="scss">
    .accountManageCon {
        .setRoot1Scoped .el-dialog {
            height: 330px;
        }
        .setRoot2Scoped .el-dialog {
            height: 320px;
        }
        .setRoot3Scoped .el-dialog {
            height: 210px;
        }
    }
</style>