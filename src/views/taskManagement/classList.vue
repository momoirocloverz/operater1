<template>
    <div class="example1Con" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.schedulingName" class="lockWidth" size="small" placeholder="排班名称"
                              clearable></el-input>
                    <el-input v-model="form.schedulingId" class="lockWidth" size="small" placeholder="排班id"
                              clearable></el-input>
                    <el-input v-model="form.creator" class="lockWidth" size="small" placeholder="创建者"
                              clearable></el-input>
                    <el-input v-model="form.taskName" class="lockWidth" size="small" placeholder="任务名称"
                              clearable></el-input>
                    <el-date-picker class="mr15" v-model="dateRange" type="daterange" align="right" unlink-panels
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    :picker-options="{}"
                                    @change="handleChangeDateRange"
                                    size="small"></el-date-picker>
                    <el-button type="info" size="small" icon="el-icon-search" @click="search()">搜 索</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.processStatus" placeholder="排班状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="schedulingId" label="排班id" width="100"></el-table-column>
                    <el-table-column prop="schedulingName" label="排班名称" width=""></el-table-column>
                    <el-table-column prop="creator" :formatter="$isContent" label="创建者"></el-table-column>
                    <el-table-column prop="taskName" label="所属任务"></el-table-column>
                    <el-table-column prop="processStatus" :formatter="statusFor" label="状态" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="schedulingDate" label="日期" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean(['629','630'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'629'" @click="handleEdit(scope.row,'1')">详情</el-button>
                            <el-button size="mini" type="text" v-Auth="'630'" @click="handleEdit(scope.row,'4')">查看三方记录</el-button>
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
    </div>
</template>
<script>
    export default {
        name: 'exa',
        data() {
            return {
                form: {
                    schedulingName:'',
                    schedulingId:'',
                    creator:'',
                    taskId:'',
                    taskName:'',
                    startDate:'',
                    endDate:'',
                    processStatus:'',
                },
                dateRange:'',
                options: [
                    {label: '不限', value: -1},
                    {label: '待执行', value: 1},
                    {label: '待结算', value: 2},
                    {label: '已完成', value: 3},
                    {label: '已结束', value: 4},
                ],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                tableData: [],
                loading: false,
            }
        },
        watch:{
            'form.processStatus': function(val,oldVal){
                this.search()
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleEdit(row, type) {
                const {href} = this.$router.resolve({
                    name: 'taskManagementClassDetail',
                    query: {
                        ...row,
                        type: type
                    }
                })
                window.open(href);
            },
            getList() {
                this.loading = true;
                let params = {
                    schedulingName:this.form.schedulingName,
                    schedulingId:this.form.schedulingId,
                    creator:this.form.creator,
                    taskId:this.form.taskId,
                    taskName:this.form.taskName,
                    startDate:this.form.startDate,
                    endDate:this.form.endDate,
                    processStatus:this.form.processStatus === -1? '' : this.form.processStatus,
                    pageNum: this.currentPage,
                    pageSize:this.pageSize,
                };
                this.ApiLists.schedulingList(params).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list ? res.data.list : []
                        this.total = res.data.total
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 300)
                })
            },
            search(){
                this.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            handleChangeDateRange(val){
                if(val){
                    this.form.startDate = val[0];
                    this.form.endDate = val[1];
                }else{
                    this.form.startDate = '';
                    this.form.endDate = '';
                }
                console.log(this.form.startDate,this.form.endDate)
            },
            statusFor(row,col,val){
                if(val === 1){
                    return '待执行'
                }else if(val === 2){
                    return '待结算'
                }else if(val === 3){
                    return '已完成'
                }else if(val === 4){
                    return '已结束'
                }else{
                    return '-'
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
    .example1Con {
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
    }
</style>