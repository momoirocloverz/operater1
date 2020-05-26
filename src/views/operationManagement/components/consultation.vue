<template>
    <div class="detail" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.company" class="lockWidth" size="small" placeholder="企业商家"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search"  @click="searchData()">搜 索</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.source"
                           @change="changeCompany"
                           placeholder="端口">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.status"
                           @change="changeInsuType"
                           placeholder="处理状态">
                    <el-option v-for="(item,index) in options2" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="createdAt" label="申请时间" width=""></el-table-column>
                    <el-table-column prop="source" label="端口" :formatter="sourceFor" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cusName" label="企业商家" width=""></el-table-column>
                    <el-table-column prop="contactName" label="联系人姓名" width=""></el-table-column>
                    <el-table-column prop="contactMobile" label="联系人电话" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="handleStatus" :formatter="forStatus" label="处理状态" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="handleMsg" label="处理结果" width="250" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="操作" width="140" show-overflow-tooltip v-if="AuthBoolean(['655','656'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'655'" v-if="scope.row.handleStatus === 1" @click="handleEdit(scope.row,0)">确认处理</el-button>
                            <el-button size="mini" type="text" v-Auth="'656'" v-if="scope.row.handleStatus === 2" @click="handleEdit(scope.row,1)">修改处理结果</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="20"
                        layout="total,prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>
        </div>
        <!--更新出险进度-->
        <el-dialog :title="params.title" :visible.sync="dialogUpdateVisible" width="680px" center :before-close="cancel">
            <el-form :model="form" :rules="dangerRulesUpdate" style="padding-right:20px" ref="dangerUpdateForm">
                <el-form-item prop="remark" label="" label-width="60px">
                    <div style="" v-if="params.type === 0">确认该咨询申请已沟通处理</div>
                    <div>处理结果</div>
                    <el-input type="textarea" :rows="8" maxlength="200" placeholder="请输入和此企业商家沟通的结果" v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer pb20" style="text-align: center">
                <el-button class="wh-1" type="primary" style="margin-left: 50px" @click="submitDanger()">{{params.btnText}}</el-button>
                <el-button class="wh-1" @click="cancel()">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'detail',
        data() {
            return {
                options: [{name:'不限',value:-1},{name:'企业版app',value:1},{name:'个人版app',value:2},{name:'官网pc',value:3}],
                options2: [{name:'不限',value:-1},{name:'待处理',value:1},{name:'已处理',value:2}],
                form: {
                    company:'',
                    status: '',
                    source:'',
                    description:'',
                    remark:'',
                },
                dateRange: '',
                pickerOptions: {
                },
                dialogUpdateVisible:false,
                dialogEditVisible:false,
                currentPage: 1,
                tableData: [],
                pageTotal: 0,
                totalInfo:{},
                loading: false,
                dangerRulesUpdate:{
                    remark:[
                        {
                            required: true,
                            message: "处理结果不能为空",
                            trigger: "blur"
                        },
                    ]
                },
                params:{}
            }
        },
        filters:{
            forNumber(val){
                if(Number(val) > 0){
                    return Number(val).toFixed(2)
                }else{
                    return 0
                }
            }
        },
        mounted() {
            this.getList()
            this.getIndutry()
        },
        methods: {
            handleEdit(row,type) {
                if(type === 0){
                    this.params = Object.assign({title:'确认处理',btnText:'确认提交',type},row)
                }else if(type){
                    this.params = Object.assign({title:'修改处理结果',btnText:'确认修改',type},row)
                    this.form.remark = row.handleMsg;
                }
                this.dialogUpdateVisible = true;
            },
            submitDanger(){
                this.$refs.dangerUpdateForm.validate((valid)=>{
                    if(valid){
                        this.ApiLists.handleConsultation({handleMsg:this.form.remark,id:this.params.id}).then(res => {
                            if(res.respCode === 0){
                                this.$message.success('处理成功!')
                                this.getList()
                                this.$nextTick(()=>{
                                    this.$refs['dangerUpdateForm'].resetFields()
                                    this.dialogUpdateVisible = false;
                                })
                            }
                        })
                    }else{
                        return this.$message.error('处理结果不能为空!')
                    }
                })
            },
            cancel(){
                this.dialogUpdateVisible = false;
                this.form.remark = '';
            },
            forStatus(row,col,val){
                // 1未处理、2已处理
                if(Number(val) === 1){
                    return '未处理'
                }else if(Number(val) === 2){
                    return '已处理'
                }
            },
            sourceFor(row,col,val){
                // 1未处理、2已处理
                if(Number(val) === 1){
                    return '企业版app'
                }else if(Number(val) === 2){
                    return '个人版app'
                }else if(Number(val) === 3){
                    return '官网pc'
                }else{
                    return '-'
                }
            },
            searchData(){
                // if(!this.form.startDate){
                //     return this.$message.error('开始时间不能为空!')
                // }
                this.currentPage = 1
                this.getList()
            },
            forCost(cell,col,val){
                if(Number(val) >= 0){
                    return Number(val).toFixed(2)
                }else{
                    return '无'
                }
            },
            async getIndutry(){
                this.options3 = ['不限'];
                let data = await this.ApiLists.getByCodeAndLevel({code:'industry',level:'',});
                data.data && data.data.length > 0 && data.data.forEach((item,index) =>{
                    this.options3.push(item.dicName)
                })
            },
            async changeCompany(val){
                this.currentPage = 1;
                this.getList()
            },
            changeInsuType(val){
                this.currentPage = 1;
                this.getList()
            },
            changeInsuStatu(val){
                this.currentPage = 1;
                this.getList()
            },
            getList() {
                this.loading = true;
                let params = {
                    cusName: this.form.company,
                    source: this.form.source === -1 ? '' : this.form.source,
                    handleStatus:this.form.status === -1 ? "" : this.form.status,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.ApiLists.consultationList(params).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list ? res.data.list : []
                        this.pageTotal = res.data.total ? res.data.total : 0
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.loading = false;
                },300)
            },
            handleSizeChange(val) {
                this.currentPage = val
                this.getList()
                this.getTotal()
            },
            handleChangeDateRange(val) {
                if(val){
                    this.form.startDate = val[0];
                    this.form.endDate = val[1];
                }else{
                    this.form.startDate = '';
                    this.form.endDate = '';
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
                this.getTotal()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .detail {
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;

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