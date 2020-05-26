<template>
    <div class="attribute-box">
        <div class="topCon pt10 pb10">
            <el-button size="middle" type="primary" class="lockWidth" @click="addInfor()"  v-Auth="'618'">添加属性名</el-button>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe empty-text="暂无相关信息" style="width: 100%">
                    <el-table-column prop="attributeName" label="属性名称" width="" align="center"></el-table-column>
                    <el-table-column prop="description" :formatter="descFor" label="描述" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" v-if="AuthBoolean('619')">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-if="scope.row.customerId !== -1" @click="handleEdit(scope.row)" v-Auth="'619'">编辑</el-button>
                            <!--<el-button size="mini" type="text" v-if="scope.row.customerId !== -1" @click="handleDelete(scope.row)">删除</el-button>-->
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
        <el-dialog title="" class="" :visible.sync="addRoleVisible" width="550px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="roleForm" :rules="roleRules" ref="roleForm" class="demo-ruleForm" label-width="100px">
                    <el-form-item label="属性名称" prop="attributeName">
                        <el-input v-model.trim="roleForm.attributeName" v-if="type == 1" maxlength="10" class="el-input-width-mid" size="small" placeholder="请输入属性名称"
                                  clearable></el-input>
                        <div v-else>{{roleForm.attributeName}}</div>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model.trim="roleForm.description" maxlength="20" class="el-input-width-mid" size="small" placeholder="请输入该属性名称的描述性文字"
                                  clearable></el-input><span class="co-999 pl10">选填</span>
                    </el-form-item>
                    <div class="flexHere tc">
                        <el-button type="primary" size="small" class="sameWidthBtn" @click="submitPass('roleForm')">保
                            存
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelPass('roleForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'attribute',
        props: {
            id: {
                default: 1
            }
        },
        data() {
            return {
                currentPage: 1,
                pageSize: 20,
                total: 0,
                tableData: [],
                addRoleVisible: false,
                roleForm: {
                    attributeName: '',
                    roleId: '',
                    description: '',
                },
                type: 1,
                roleRules: {
                    attributeName: [{
                        required: true, message: '您还未填写属性名', trigger: 'blur'
                    }]
                }
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.ApiLists.attributeList({
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    customerId: this.$route.query.id,
                }).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list || [];
                        this.total = res.data.total || 0
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            descFor(row,col,val){
                if(val){
                    return val
                }else{
                    return '-'
                }
            },
            handleEdit(row){
                this.addRoleVisible = true;
                this.type = 2;
                this.roleForm.attributeName = row.attributeName
                this.roleForm.description = row.description
                this.roleForm.roleId = row.id
            },
            handleDelete(row) {
                this.$confirm('确定要删除此该角色吗?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.ApiLists.deleteAttribute({
                        id: row.id
                    }).then(res => {
                        if (res.respCode === 0) {
                            this.getList()
                            this.$message.success('删除成功!');
                        }
                    }).catch(err => {

                    }).finally(() => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            submitPass(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ApiLists.addAttribute({
                            customerId: this.$route.query.id,
                            id:this.roleForm.roleId,
                            attributeName: this.roleForm.attributeName,
                            description: this.roleForm.description
                        }).then(res => {
                            if (res.respCode === 0) {
                                this.getList()
                                this.$message.success('设置成功!');
                                this.cancelPass(formName)
                            }
                        }).catch(err => {

                        }).finally(() => {

                        })
                    } else {
                        return false;
                    }
                });
            },
            cancelPass(formName) {
                this.$refs[formName].resetFields();
                this.addRoleVisible = false;
            },
            addInfor() {
                this.type = 1;
                this.roleForm = {
                    roleName: '',
                    roleId: '',
                    desc: '',
                }
                this.addRoleVisible = true;
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss">
    .attribute-box {
        .el-form-item__content{
            display: flex;
        }
        .topCon {
            .lockWidth {
                width: 120px;
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