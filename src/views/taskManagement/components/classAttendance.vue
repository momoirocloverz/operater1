<template>
    <div class="class-attendance">
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="talentName" label="姓名" width=""></el-table-column>
                    <el-table-column prop="sex" :formatter="$sexFor" label="性别" width=""></el-table-column>
                    <el-table-column prop="industryName" label="工种"></el-table-column>
                    <el-table-column prop="workStartTime" :formatter="$isContent" label="开始打卡时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workEndTime" :formatter="$isContent" label="结束打卡时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workHours" :formatter="$isContent" label="工时" show-overflow-tooltip></el-table-column>
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
                    talentType:2,
                    settlementType: '',
                    industry: '',
                },
                currentPage: 1,
                pageSize: 20,
                total: 0,
                loading: false,
                tableData: [],
            }
        },
        watch:{
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true;
                this.ApiLists.pageList({
                    schedulingId: this.$route.query.schedulingId,
                    talentId: this.form.talentId,
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
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .class-attendance{
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