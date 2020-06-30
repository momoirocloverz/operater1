<template>
    <div class="task-list" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.taskName" class="lockWidth" size="small" placeholder="任务名称"
                              clearable></el-input>
                    <el-input v-model="form.creator" class="lockWidth" size="small" placeholder="创建者"
                              clearable></el-input>
                    <el-input v-model="form.executor" class="lockWidth" size="small" placeholder="执行人"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search" @click="search()">搜 索</el-button>
                </div>
                <!--<div>-->
                    <!--<el-button type="primary" size="small" icon="el-icon-plus">添 加</el-button>-->
                <!--</div>-->
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.taskType" @change="search" placeholder="任务类型">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.settleType" @change="search" placeholder="结算周期">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.status" @change="search" placeholder="任务状态">
                    <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="id" label="任务id" width="80"></el-table-column>
                    <el-table-column prop="taskName" label="任务名称" width=""></el-table-column>
                    <el-table-column prop="taskType" :formatter="forTaskType" label="任务类型"></el-table-column>
                    <el-table-column prop="creator" :formatter="$isContent" label="创建者"></el-table-column>
                    <el-table-column prop="recCustomerName" :formatter="$isContent" label="执行人" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="startTime" label="任务开始时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="endTime" :formatter="forEndTime" label="任务结束时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="settlementType" :formatter="$settleFor" label="结算周期" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="processStatus" :formatter="forProcessStatus" label="任务状态" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean(['626','627'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'626'" @click="handleEdit(scope.row,1)">详情</el-button>
                            <el-button size="mini" type="text" @click="handleEdit(scope.row,2)" v-Auth="'627'" >查看排班</el-button>
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
                    taskName:'',
                    settleType:'',
                    creator:'',
                    taskType:'',
                    executor:'',
                    status:'',
                },
                options: [
                    {label: '不限', value: -1},
                    {label: '自有任务', value: 1},
                    {label: '指派任务', value: 2},
                ],
                options2: [
                    {label: '不限', value: -1},
                    {label: '日结', value: 1},
                    {label: '月结', value: 2},
                    {label: '周结', value: 4},
                ],
                options3: [
                    {label: '不限', value: -1},
                    {label: '未开始', value: 1},
                    {label: '进行中', value: 2},
                    {label: '已结束', value: 3},
                    {label: '已关闭', value: 4},
                ],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                tableData: [],
                loading: false,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleEdit(row,type){
                const { href } = this.$router.resolve({
                    name: 'taskManagementClassTab',
                    query:{
                        ...row,
                        type:type,
                    }
                })
                window.open( href );
            },
            getList() {
                this.loading = true;
                let params = {
                    creator:this.form.creator,
                    taskName:this.form.taskName,
                    status:this.form.status === -1? '' : this.form.status,
                    settleType:this.form.settleType === -1? '' : this.form.settleType,
                    taskType:this.form.taskType === -1? '' : this.form.taskType,
                    executor:this.form.executor,
                    pageNum: this.currentPage,
                    pageSize:this.pageSize,
                };
                this.ApiLists.taskList(params).then(res => {
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
            forEndTime(row,col,val){
                if(val){
                    return val
                }else{
                    return '长期'
                }
            },
            forTaskType(row,col,val){
                if(val === 1){
                    return '自有任务'
                }else if(val === 2){
                    return '指派任务'
                }else{
                    return '-'
                }
            },
            forProcessStatus(row,col,val){
                // 未开始 进行中 已结束 已关闭  原状态
                if(val === 1){
                    return '待执行'
                }else if(val === 2){
                    return '待结算'
                }else if(val === 3){
                    return '已完成'
                }else if(val === 4){
                    return '已关闭'
                }else{
                    return '-'
                }
            },
            search(){
                this.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            }
        },
    }
</script>
<style lang="scss" scoped>
    .task-list {
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