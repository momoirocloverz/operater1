<template>
    <div class="categoryProductCon" v-loading="loading">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-button type="primary" size="small" @click="popAdd" v-Auth="'640'">新增分类</el-button>
                </div>
            </div>
        </div>
        <div class="bottomCon">          
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%;margin-top:20px" empty-text="暂无相关信息">
                    <el-table-column prop="id" label="分类ID"></el-table-column>
                    <el-table-column prop="rangeName" label="问题分类名称"></el-table-column>
                    <el-table-column prop="cusType" label="目标用户" show-overflow-tooltip>
                        <template v-slot="scope">{{ targetMap[scope.row.cusType] }}</template>
                    </el-table-column>
                    <el-table-column prop="count" label="问题数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="weight" label="权重" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="200" v-if="AuthBoolean(['641','642'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" @click="popEdit(scope.row)" v-Auth="'641'">编辑</el-button>
                            <el-button size="mini" type="text" @click="popDelete(scope.row)" v-Auth="'642'">删除</el-button> 
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="total,prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="新增分类" class="setHereScoped setMiddleDialog" :visible.sync="addVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="addForm" status-icon :rules="addRules" ref="addForm" label-width="80px"
                         class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model.trim="addForm.name" size="small" placeholder="请输入问题分类名称" maxlength="8"></el-input>
                    </el-form-item>
                    <el-form-item label="权重" prop="weight">
                        <el-input v-model.trim="addForm.weight" size="small" placeholder="请输入0-1000数字，权重越大排行越前" maxlength="4"></el-input>
                    </el-form-item>
                    <el-form-item label="目标用户" prop="target">
                        <el-radio-group v-model="addForm.target">
                            <el-radio :label="1">全部商家</el-radio>
                            <el-radio :label="2">企业商家</el-radio>
                            <el-radio :label="3">个人商家</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn" @click="submitAdd('addForm')" :disabled="addAble">确认新增</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelAdd('addForm')">取  消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="编辑分类" class="setHereScoped setMiddleDialog" :visible.sync="editVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="80px"
                         class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model.trim="editForm.name" size="small" placeholder="请输入问题分类名称"></el-input>
                    </el-form-item>
                    <el-form-item label="权重" prop="weight">
                        <el-input v-model.trim="editForm.weight" size="small" placeholder="请输入0-1000数字，权重越大排行越前"></el-input>
                    </el-form-item>
                    <el-form-item label="目标用户" prop="target">
                        <el-radio-group v-model="editForm.target">
                            <el-radio :label="1">全部商家</el-radio>
                            <el-radio :label="2">企业商家</el-radio>
                            <el-radio :label="3">个人商家</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn" @click="submitEdit('editForm')" :disabled="editAble">确 定</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelEdit('editForm')">取  消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'detail',
        data() {
            var validateWeight = (rule, value, callback) => {
                if( Number.isInteger(+value) ){
                     if( (+value>1000)||(+value<0) ){
                        callback(new Error('权重值请输入0~1000数字'));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error('权重值请输入0~1000数字'));
                }
            };
            return {
                targetMap:{
                    1:'全部商家',
                    2:'企业商家',
                    3:'个人商家',
                },
                currentPage: 1,
                tableData: [],
                addVisible:false,
                total: 0,
                loading: false,
                addRules:{
                    name:[
                        { required: true, message: '分类名称不能为空', trigger: 'blur' },
                    ],
                    weight:[
                        { required: true, message: '权重不能为空', trigger: 'blur' },
                        { validator: validateWeight, trigger: 'blur' }
                    ],
                    target:[
                        { required: true, message: '目标用户不能为空', trigger: 'blur' },
                    ],
                },
                addForm:{                    
                    name:'',
                    weight:'',
                    target:1,
                },
                editVisible:false,
                editRules:{
                    name:[
                        { required: true, message: '分类名称不能为空', trigger: 'blur' },
                    ],
                    weight:[
                        { required: true, message: '权重不能为空', trigger: 'blur' },
                        { validator: validateWeight, trigger: 'blur' }
                    ],
                    target:[
                        { required: true, message: '目标用户不能为空', trigger: 'change' },
                    ],
                },
                editForm:{
                    name:'',
                    weight:'',
                    target:1,
                },
                rowBridge:{},
                addAble:false,
                editAble:false,
            }
        },
        mounted() {
           this.getList();
        },
        methods: {   
            submitEdit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.editAction();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editAction(){
                let data = {
                    id:this.rowBridge.id,
                    rangeName:this.editForm.name,
                    cusType:this.editForm.target,
                    weight:+this.editForm.weight,
                };
                this.editAble = true;
                this.ApiLists.helpRangeAddOrEdit(data).then(res=>{
                    let { respCode,data } = res;
                    if (respCode == 0) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.currentPage = 1;
                        this.getList();
                        this.editVisible = false;
                        this.editForm.name = '';
                        this.editForm.weight = '';
                        this.editForm.target = 1;                        
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.editAble = false;
                    },500);
                })
            },
            popDelete(row){
                this.rowBridge = row;
                this.$confirm('此操作将删除该条目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass:'el-button--info',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:this.rowBridge.id
                    };
                    this.ApiLists.deleteHelpRange(params).then(res=>{
                        let { respCode,data } = res;
                        if (respCode == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.currentPage = 1;
                            this.getList();
                        }
                    }).catch(err=>{
                        console.log('err',err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            popEdit(row){
                this.rowBridge = row;
                this.editVisible = true;
                this.editForm.name = this.rowBridge.rangeName;
                this.editForm.weight = this.rowBridge.weight;
                this.editForm.target = +(this.rowBridge.cusType) != 0 ? +(this.rowBridge.cusType) : 1;  
            },
            cancelEdit(formName){
                this.$refs[formName].resetFields();
                this.editVisible = false;
            },
            popAdd(){
                this.addVisible = true;
            },
            submitAdd(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.addAction();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            addAction(){
                let data = {
                    rangeName:this.addForm.name,
                    cusType:this.addForm.target,
                    weight:+this.addForm.weight,
                };
                this.addAble = true;
                this.ApiLists.helpRangeAddOrEdit(data).then(res=>{
                    let { respCode,data } = res;
                    if (respCode == 0) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.currentPage = 1;
                        this.getList();
                        this.addVisible = false;
                        this.addForm.name = '';
                        this.addForm.weight = '';
                        this.addForm.target = 1;
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.addAble = false;
                    },500);
                })
            },
            cancelAdd(formName){
                this.$refs[formName].resetFields();
                this.addVisible = false;
            },
            getList() {
                this.loading = true;
                let params = {
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.ApiLists.helpRangeList(params).then(res => {
                    let { respCode,data } = res;
                    if (respCode == 0) {
                        if( data && data.list ){
                            this.tableData = data.list
                        }else{
                            this.tableData = [];
                        }
                        this.total = data.total;
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .categoryProductCon {
        .flexHere {
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
        }
        .topCon {
            .lockWidth {
                width: 200px;
                margin-right: 10px;
            }
            .topFirst {
                display: flex;
                justify-content:flex-end;
                align-content: center;
                align-items: center;
            }
        }
        .bottomCon {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .tableCon {
            }
            .pagCon {
                display: flex;
                justify-content: center;
                margin-top: 30px;
            }
        }
    }
</style>
<style lang="scss">
    .categoryProductCon {
        .setHereScoped {
            .el-dialog {
                height: 330px;
            }
        }
    }    
</style>