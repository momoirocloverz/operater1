<template>
    <div class="role-box" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon pt10 pb10">
            <el-button size="middle" type="primary" class="lockWidth" @click="addInfor()" v-Auth="'616'">添加</el-button>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="id" label="ID" width="" align="center"></el-table-column>
                    <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" v-if="AuthBoolean(['614','615','617'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'617'" @click="handleSetting(scope.row)">权限配置</el-button>
                            <el-button size="mini" type="text" @click="handleEdit(scope.row)" v-Auth="'614'">修改</el-button>
                            <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-Auth="'615'">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!--添加角色-->
        <el-dialog title="" class="" :visible.sync="addRoleVisible" width="450px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="roleForm" :rules="roleRules" ref="roleForm" class="demo-ruleForm" label-width="100px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model.trim="roleForm.roleName" maxlength="20" size="small" placeholder="请输入角色名称" clearable></el-input>
                    </el-form-item>
                    <div class="flexHere tc">
                        <el-button type="primary" size="small" class="sameWidthBtn" @click="submitPass('roleForm')">保 存</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelPass('roleForm')">取 消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'role',
        props:{
          id:{
              default:1
          }
        },
        data() {
            return {
                currentPage: 1,
                pageSize:20,
                total:0,
                tableData: [],
                addRoleVisible:false,
                roleForm:{
                    roleName:'',
                    roleId:'',
                },
                type:1,
                roleRules:{
                    roleName:[{
                       required: true, message: '请输入角色名称', trigger: 'blur'
                    }]
                },
                loading:false,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleEdit(row){
                this.addRoleVisible = true;
                this.type = 2;
                this.roleForm.roleName = row.roleName
                this.roleForm.roleId = row.id
            },
            getList(){
                this.loading = true
                this.ApiLists.roleList({
                    pageNum:this.currentPage,
                    pageSize:this.pageSize,
                    customerId:this.$route.query.id,
                }).then(res => {
                    if(res.respCode === 0){
                        this.tableData = res.data.list || [];
                        this.total = res.data.total || 0
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            handleDelete(row){
                this.$confirm('确定要删除此该角色吗?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true
                }).then(() => {
                    this.ApiLists.delRole({
                        id:row.id
                    }).then(res => {
                        if(res.respCode === 0){
                            this.getList()
                            this.$message.success('删除成功!');
                        }
                    }).catch(err => {

                    }).finally(()=>{

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleSetting(row){
                this.$router.push({
                    path:'/main/businessList/permissionConfiguration',
                    query:row,
                })
            },
            submitPass(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.type === 2){
                            this.ApiLists.modifyRename({
                                roleId:this.roleForm.roleId,
                                roleName:this.roleForm.roleName
                            }).then(res => {
                                if(res.respCode === 0){
                                    this.getList()
                                    this.$message.success('修改成功!');
                                    this.cancelPass(formName)
                                }
                            }).catch(err => {

                            }).finally(()=>{

                            })
                        }else{
                            this.ApiLists.addRole({
                                customerId:this.$route.query.id,
                                roleName:this.roleForm.roleName
                            }).then(res => {
                                if(res.respCode === 0){
                                    this.getList()
                                    this.$message.success('添加成功!');
                                    this.cancelPass(formName)
                                }
                            }).catch(err => {

                            }).finally(()=>{

                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            cancelPass(formName){
                this.$refs[formName].resetFields();
                this.addRoleVisible = false;
            },
            addInfor(){
                this.addRoleVisible = true;
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .role-box {
        .topCon {
            .lockWidth {
                width:120px;
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
    }
</style>