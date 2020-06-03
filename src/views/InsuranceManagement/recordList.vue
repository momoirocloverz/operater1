<template>
    <div class="record-list">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="input1" class="lockWidth" size="small" placeholder="被保人" clearable></el-input>
                    <el-input v-model="input2" class="lockWidth" size="small" placeholder="投保方" clearable></el-input>
                    <el-input v-model="input2" class="lockWidth" size="small" placeholder="联系电话" clearable></el-input>
                    <el-input v-model="input2" class="lockWidth" size="small" placeholder="保单号" clearable></el-input>
                    <el-date-picker class="mr15" v-model="dateRange" type="daterange" align="right" unlink-panels
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                    @change="handleChangeDateRange"
                                    size="small"></el-date-picker>
                    <el-button type="info" size="small" icon="el-icon-search">搜 索</el-button>
                </div>
                <div>
                    <el-button @click="add" type="primary" size="small" icon="el-icon-plus">添 加</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="value" placeholder="保险名称">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="pt20 f14">合计: 28234单</div>
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="id" label="记录时间" width="80"></el-table-column>
                    <el-table-column prop="name" label="被保人" width="80"></el-table-column>
                    <el-table-column prop="address" label="联系电话"></el-table-column>
                    <el-table-column prop="address" label="投保方"></el-table-column>
                    <el-table-column prop="address" label="保险名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="保单号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="保障时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="出现记录" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" @click="handleEdit(scope)">更新进度</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage3"
                        :page-size="10"
                        layout="prev, pager, next, jumper"
                        :total="100">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加出险保单" class="" :visible.sync="dangerlVisible" width="650px" center :before-close="cancel">
            <div>
                <el-form :model="dangerForm" status-icon :rules="dangerRules" ref="dangerForm" label-width="90px" class="demo-ruleForm">
                    <el-form-item prop="mobile" label="保单号">
                        <el-input v-model="dangerForm.mobile" autocomplete="off" size="small" placeholder="请输入保单号"></el-input>
                    </el-form-item>
                    <div class="flexHere pt20">
                        <el-button type="primary" size="small" class="sameWidthBtn mr15" @click="goNext('')">下一步</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"  @click="cancel('')">取 消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <!--添加出险保单第二步-->
        <el-dialog title="添加出险保单" :visible.sync="dialogInsuVisible" width="1100px" :before-close="cancel" center>
            <el-form :model="dangerForm" :rules="dangerRulesAdd" ref="dangerRulesAdd" style="padding-right:20px">
                <el-form-item label="保单号:" label-width="120px">
                    <div style="">{{dangerForm.mobile}}</div>
                    <el-table class="table-outline" :data="formList"  style="margin:20px 0 0 0;">
                        <el-table-column prop="talentName" label="被保人" align="center" min-width="100">
                        </el-table-column>
                        <el-table-column prop="policyTime" label="保障时间" align="center" min-width="120">
                        </el-table-column>
                        <el-table-column prop="insuStartAt" label="投保时间" align="center" min-width="100">
                        </el-table-column>
                        <el-table-column prop="managerName" label="班务经理" align="center" min-width="100">
                        </el-table-column>
                        <el-table-column prop="schedulingName" label="排班" align="center" min-width="100">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item prop="desc" label="出险记录:" label-width="120px" style="padding-top:30px">
                    <div style="padding-top:10px"></div>
                    <el-input type="textarea" :rows="6" placeholder="记录出险情况" v-model="dangerForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button class="wh-1" @click="goPrev()">上一步</el-button>
                <el-button class="wh-1" type="primary" style="margin-left: 50px" @click="saveInsu()">保 存</el-button>
            </div>
        </el-dialog>
        <!--更新出险进度-->
        <el-dialog title="更新出险进度" :visible.sync="dialogUpdateVisible" width="680px" :before-close="cancel">
            <el-form :model="dangerForm" :rules="dangerRulesUpdate" style="padding-right:20px" ref="dangerUpdateForm">
                <el-form-item prop="descUpdate" label="出险记录:" label-width="120px" style="padding-top:30px">
                    <div style="padding-top:10px"></div>
                    <el-input type="textarea" :rows="8" placeholder="更新出险进度" v-model="dangerForm.descUpdate"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button class="wh-1" type="primary" style="margin-left: 50px" @click="submitDanger()">保 存</el-button>
                <el-button class="wh-1" @click="cancel()">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'recordList',
        data() {
            return {
                input1: '',
                input2: '',
                value: '',
                dangerlVisible:false,
                dialogInsuVisible:false,
                dialogUpdateVisible:false,
                dangerForm:{
                    number:'',
                    mobile:123131421542145,
                    desc:'',
                    descUpdate:''
                },
                formList:[],
                dateRange: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                options: [
                    {label: '你好', value: 1},
                    {label: '第二条', value: 2},
                ],
                dangerRules:{
                    mobile:[
                        {
                            required: true,
                            message: "保单号不能为空",
                            trigger: "blur"
                        },
                        {
                            min: 12,
                            max: 30,
                            message: "长度在 12 到 30 个字符",
                            trigger: "blur"
                        }
                    ]
                },
                dangerRulesAdd:{
                    desc:[
                        {
                            required: true,
                            message: "记录出险情况不能为空",
                            trigger: "blur"
                        },
                    ]
                },
                dangerRulesUpdate:{
                    descUpdate:[
                        {
                            required: true,
                            message: "更新出险情况不能为空",
                            trigger: "blur"
                        },
                    ]
                },
                currentPage3: 3,
                tableData: [],
            }
        },
        mounted() {

        },
        methods: {
            handleEdit() {
                this.dialogUpdateVisible = true;
            },
            handleChangeDateRange() {

            },
            submitDanger(){
                this.$refs.dangerUpdateForm.validate((valid)=>{
                    if(valid){
                        this.dialogUpdateVisible = false;
                        this.$nextTick(()=>{
                            this.$refs['dangerUpdateForm'].resetFields()
                        })
                    }else{
                        return this.$message.error('表单有误,请正确填写!')
                    }
                })
            },
            goPrev(){

            },
            cancel(){
                this.dangerlVisible = false;
                this.dialogUpdateVisible = false;
                this.dialogInsuVisible = false;
                this.dangerForm.mobile = '';
                this.dangerForm.desc = '';
                this.dangerForm.descUpdate = '';
            },
            add(){
                this.dangerlVisible = true;
            },
            goNext(){
                this.$refs.dangerForm.validate((valid)=>{
                    if(valid){
                        this.dialogInsuVisible = true;
                        this.dangerlVisible = false;
                    }else{
                        return this.$message.error('表单有误,请正确填写!')
                    }
                })
            },
            saveInsu(){
                this.$refs.dangerRulesAdd.validate((valid)=>{
                    if(valid){
                        this.dialogInsuVisible = false;
                        this.$nextTick(()=>{
                            this.$refs['dangerForm'].resetFields()
                        })
                    }else{
                        return this.$message.error('表单有误,请正确填写!')
                    }
                })
            },
            handleSizeChange() {

            },
            handleCurrentChange() {

            },
        },
    }
</script>
<style lang="scss" scoped>
    .record-list {
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