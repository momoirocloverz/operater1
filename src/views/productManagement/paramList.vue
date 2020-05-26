<template>
    <div class="param-list">
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" max-height="530" stripe style="width: 100%" emptyText="暂无相关信息">
                    <el-table-column prop="paramName" label="参数"></el-table-column>
                    <el-table-column prop="description" label="说明"></el-table-column>
                    <el-table-column prop="paramValue" label="参数值"></el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean('633')">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'633'" @click="handleEdit(scope.row)">设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="设置系统参数" class="setRoot1Scoped setMiddleDialog" :visible.sync="dialogParamVisible" width="500px" center >
            <div>
                <el-form :model="paramForm" :rules="paramRule" status-icon ref="paramForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="参数">
                        <span>{{paramForm.param}}</span>
                    </el-form-item>
                    <el-form-item label="参数说明">
                        <span>{{paramForm.explain}}</span>
                    </el-form-item>
                    <el-form-item prop="value" label="参数值">
                        <el-input v-model.trim="paramForm.value" autocomplete="off" size="small" placeholder="请输入" maxlength="50"></el-input>
                    </el-form-item>
                    <div class="flexHere pt20">
                        <el-button type="primary" size="small" class="sameWidthBtn mr15" @click="save('paramForm')" :disabled="editAble">确 认</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"  @click="cancel('paramForm')">取 消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'paramList',
        data() {
            return {
                dialogParamVisible:false,
                currentPage:1,
                pageSize:20,
                total:0,
                paramRule:{
                    value:[
                        {
                            required: true,
                            message: "参数值不能为空",
                            trigger: "blur"
                        },
                    ]
                },
                tableData: [],
                paramForm:{
                    param:'face_in',
                    explain:'人脸次数上限',
                    value:'',
                },
                rowBridge:{},
                editAble:false,
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            handleEdit(row) {
                this.dialogParamVisible = true;
                this.rowBridge = row;
                this.paramForm = {
                    param:this.rowBridge.paramName,
                    explain:this.rowBridge.description,
                    value:this.rowBridge.paramValue,
                };
            },
            cancel(formName){
                this.dialogParamVisible = false;
                this.$refs[formName].resetFields();
            },
            getList(){
                let params = {
                    pageNum:this.currentPage,
                    pageSize:this.pageSize,
                };
                this.ApiLists.sysparamList(params).then(res => {
                    let { respCode,data } = res;
                    if(respCode === 0){
                        this.tableData = data.list || [];
                        this.total = data.total || 0
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            setAction(){
                let data = {
                    id:this.rowBridge.id,
                    paramValue:this.paramForm.value,
                    description:this.rowBridge.description,
                };
                this.editAble = true;
                this.ApiLists.sysparamUpdate(data).then(res => {
                    let { respCode,data } = res;
                    if(respCode === 0){
                        this.dialogParamVisible = false;
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.currentPage = 1;
                        this.getList();
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.editAble = false;
                    },500);
                })
            },
            save(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.setAction();
                    }
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
    .param-list {
        .bottomCon {
            .tableCon {
                margin-top: 20px;
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
    .param-list {
        .setRoot1Scoped {
            .el-dialog {
                height: 350px;
            }
        }
    }
</style>