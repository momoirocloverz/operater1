<template>
    <div class="adminNormalCon" v-loading="loading">
        <div class="topCon">
            <div class="topFirst" @keyup.enter="searchAction">
                <div>
                    <el-input v-model.trim="input1" class="lockWidth" size="small" placeholder="请填写商家名称"
                              clearable></el-input>
<!--
                    <el-input v-model.trim="input2" class="lockWidth" size="small" placeholder="请输入网商子账户"
                              clearable></el-input>
-->
                    <el-input v-model.trim="input3" class="lockWidth" size="small" placeholder="请输入商家账户ID"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
                </div>
                <div>
                </div>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" max-height="550" stripe style="width: 100%" empty-text="暂无相关商家记录" >
                    <el-table-column prop="id" label="账户ID" width="100"></el-table-column>
                    <el-table-column prop="shortName" label="商家简称" width="200"></el-table-column>
                    <el-table-column prop="fullName" label="商家全称" show-overflow-tooltip></el-table-column>
<!--                    <el-table-column prop="address" label="万才科技网商子账户"></el-table-column>-->
                    <el-table-column prop="totalBalance" label="钱包余额" show-overflow-tooltip></el-table-column>
<!--
                    <el-table-column prop="address" label="网商余额" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="待扣金额" show-overflow-tooltip></el-table-column>
-->
                    <el-table-column prop="totalInCurrentMonth" label="本月充值" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="totalOutCurrentMonth" label="本月支出" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean('623')">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" @click="handleEdit(scope.row)" v-Auth="'623'">查看交易明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination @current-change="handleCurrentChange"  :current-page.sync="currentPage3"  :page-size="20" layout="total,prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'normalList',
        data() {
            return {
                input1: '',
                input2: '',
                input3: '',
                currentPage3: 1,
                tableData: [],
                total:0,
                loading:true,
            }
        },
        mounted() {
            this.searchAction();
        },
        methods: {
            requestList(data){
                this.ApiLists.getCusAccountList(data).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        if( data&&data.list ){
                            this.tableData = data.list;
                            this.total = data.total;
                        }else{
                            this.tableData = [];
                            this.total = 0;
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            searchAction(){
                let data = this.geneParams();
                this.currentPage3 = 1;
                data.pageNum = 1;
                data.pageSize = 20;
                this.requestList(data);
            },
            geneParams(){
                let data = {};
                let arr = ['input1','input3'];
                let inputParamsMap = {
                    input1:'shortName',
//                    input2:'params2',
                    input3:'cusId',
                };
                arr.forEach(ele=>{
                    if( this[ele] ){
                        data[inputParamsMap[ele]] = this[ele];
                    }
                });
                return data;
            },
            handleEdit(row) {
                const { href } = this.$router.resolve({
                    name: 'administrativeNormalDetail',
                    query:{
                        cusId:row.customerId
                    }
                })
                window.open(href);
            },
            handleCurrentChange(val) {
                let data = this.geneParams();
                this.currentPage3 = val;
                data.pageNum = val;
                data.pageSize = 20;
                this.requestList(data);
            },
        },
    }
</script>
<style lang="scss" scoped>
    .adminNormalCon {
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