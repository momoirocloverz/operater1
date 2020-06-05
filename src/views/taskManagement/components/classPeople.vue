<template>
    <div class="class-people" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.talentName" class="lockWidth" size="small" placeholder="人员姓名"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search" @click="search()">搜 索</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.settlementType" placeholder="结算周期"
                           @change="search">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.industry" placeholder="排班工种" @change="search">
                    <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="pt20 f14">
                合计: 工时{{info.attendanceHours}}; 工量 {{$pieceSizeFor(null,null,info.actuallyPieceSize)}}
            </div>
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="talentName" label="姓名" width=""></el-table-column>
                    <el-table-column prop="sex" :formatter="$sexFor" label="性别" width=""></el-table-column>
                    <el-table-column prop="age" label="年龄"></el-table-column>
                    <el-table-column prop="industryName" label="排班工种"></el-table-column>
                    <el-table-column prop="settlementType" :formatter="$settleFor" label="结算周期"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workStartTime" :formatter="$isContent" label="开始打卡时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workEndTime" :formatter="$isContent" label="结束打卡时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workHours" :formatter="$isContent" label="工时" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="pieceSize" :formatter="$pieceSizeFor" label="工量" show-overflow-tooltip></el-table-column>
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
                    schedulingName: '',
                    schedulingId: '',
                    talentId: '',
                    talentType:1,
                    settlementType: '',
                    industry: '',
                },
                options: [
                    {label: '不限', value: -1},
                    {label: '日结', value: 1},
                    {label: '月结', value: 2},
                    {label: '周结', value: 4},
                ],
                options3: [
                    {label: '不限', value: -1}
                ],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                tableData: [],
                loading: false,
                info:{
                    attendanceHours:0,
                    actuallyPieceSize:0,
                }
            }
        },
        watch: {},
        mounted() {
            this.getIndutry();
            this.getList();
            this.getTotal()
        },
        methods: {
            async getIndutry() {
                this.options3 = [{label: '不限', value: -1}]
                const {respCode, data} = await this.ApiLists.industryList({
                    taskInfoId: this.$route.query.taskId,
                    schedulingId: this.$route.query.schedulingId
                });
                if (respCode === 0 && data.length > 0) {
                    for (let item of data) {
                        this.options3.push({
                            label:item.industryName,
                            value:item.industry
                        })
                    }
                }
            },
            getList() {
                this.loading = true;
                this.ApiLists.pageList({
                    schedulingId: this.$route.query.schedulingId,
                    talentName: this.form.talentName === -1 ? '' : this.form.talentName,
                    talentType: this.form.talentType,
                    settlementType: this.form.settlementType === -1 ? '' : this.form.settlementType,
                    industry: this.form.industry === -1 ? '' : this.form.industry,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                }).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list ? res.data.list : []
                        this.total = res.data.total
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 300)
                })
            },
            getTotal(){
                this.ApiLists.getBySchedulingId({
                    schedulingId: this.$route.query.schedulingId,
                }).then(res => {
                    if (res.respCode === 0) {
                        if(res.data){
                            this.info = res.data
                        }
                    }
                })
            },
            search() {
                this.currentPage = 1;
                this.getList();
                this.getTotal();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
        },
    }
</script>
<style lang="scss" scoped>
    .class-people {
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