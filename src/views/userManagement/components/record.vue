<template>
    <div class="detail">
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="createdAt" label="时间" width=""></el-table-column>
                    <el-table-column prop="content" label="操作内容"  show-overflow-tooltip width=""></el-table-column>
                    <el-table-column prop="id" label="ID" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="optName" label="操作人" width=""></el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'detail',
        props:{
            userId: {
                default:'',
            }
        },
        data() {
            return {
                currentPage: 1,
                pageSize: 20,
                tableData: [],
                pageTotal: 0,
            }
        },
        filters:{
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true;
                let params = {
                    userId: this.userId,
                    type:1,
                    pageNum:this.currentPage,
                    pageSize:this.pageSize,
                };
                this.ApiLists.listLog(params).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list ? res.data.list : []
                        this.pageTotal = res.data.size ? res.data.size : 0
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.loading = false;
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