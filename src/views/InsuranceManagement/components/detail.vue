<template>
    <div class="detail">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.talentName" class="lockWidth" size="small" placeholder="被保人"
                              clearable></el-input>
                    <el-input v-model="form.customerName" class="lockWidth" size="small" placeholder="投放方"
                              clearable></el-input>
                    <el-input v-model="form.mobile" class="lockWidth" size="small" placeholder="联系电话"
                              clearable></el-input>
                    <el-input v-model="form.policyNo" class="lockWidth" size="small" placeholder="保单号"
                              clearable></el-input>
                    <el-date-picker class="mr15" v-model="dateRange" type="daterange" align="right" unlink-panels
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    :picker-options="pickerOptions"
                                    @change="handleChangeDateRange"
                                    size="small"></el-date-picker>
                    <el-button type="info" size="small" icon="el-icon-search"  @click="searchData()">搜 索</el-button>
                </div>
                <div>
                    <el-button type="primary" size="small" v-Auth="'632'" @click="importInsu()">导 出</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.company"
                           @change="changeCompany"
                           placeholder="保险公司">
                    <el-option v-for="item in options" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.insuType"
                           @change="changeInsuType"
                           placeholder="保险名称">
                    <el-option v-for="item in options2" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.status"
                           @change="changeInsuStatu"
                           placeholder="保险状态">
                    <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="pt20 f14">
                合计:{{totalInfo.count || 0}}单,
                <!--失败{{totalInfo.fail || 0}}单,-->
                成本{{totalInfo.insuFee  | forNumber}}元,
                收费{{totalInfo.sellingPrice  | forNumber}}元,
                <!--利润{{totalInfo.profit  | forNumber}}元-->
            </div>
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="createdAt" label="投保时间" width="150"></el-table-column>
                    <el-table-column prop="talentName" label="被保人" width="100"></el-table-column>
                    <el-table-column prop="mobile" label="联系电话" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" label="投保方" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="insuName" label="保险名称" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="policyNo" label="保单号" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="保障时间" width="200" show-overflow-tooltip>
                        <template v-slot="scope">
                            <div>{{scope.row.insuStartAt.substring(0,16)}}至</div>
                            <div>{{scope.row.insuEndAt.substring(0,16)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="insuFee" label="成本" :formatter="forCost" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sellingPrice" label="收费" :formatter="forCost" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="successTime" label="成功时间" :formatter="isContent" width="160" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
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
        data() {
            return {
                options: ['保险公司'],
                options2: ['保险名称'],
                options3: [{label:'投保状态',value:'-1'},{label:'成功',value:1},{label:'失败',value:0}],
                form: {
                    talentName:'',
                    startDate: '',
                    endDate: '',
                    status: '',
                    customerName: '',
                    mobile: '',
                    policyNo: '',
                    talentId: '',
                    company:'',
                    insuType:'',
                },
                dateRange: '',
                pickerOptions: {
                },
                currentPage: 1,
                tableData: [],
                pageTotal: 0,
                totalInfo:{},
                loading: false,
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
            this.getCompany()
            this.getInsuType()
            this.getList()
            this.getTotal()
        },
        methods: {
            searchData(){
                // if(!this.form.startDate){
                //     return this.$message.error('开始时间不能为空!')
                // }
                this.currentPage = 1
                this.getList()
                this.getTotal()
            },
            forCost(cell,col,val){
                if(Number(val) >= 0){
                    return Number(val).toFixed(2)
                }else{
                    return '无'
                }
            },
            isContent(cell,col,val){
                if(val){
                    return val
                }else{
                    return '无'
                }
            },
            async getInsuType(){
                this.options2 = ['保险名称'];
                let data = await this.ApiLists.getInsuType({});
                data.data && data.data.length > 0 && data.data.forEach((item,index) =>{
                    this.options2.push(item)
                })
            },
            async getCompany(){
                this.options = ['保险公司'];
                let data = await this.ApiLists.getInsuCompany();
                data.data && data.data.length > 0 && data.data.forEach((item,index) =>{
                    this.options.push(item)
                })
            },
            async changeCompany(val){
                this.currentPage = 1;
                this.getList()
                this.getTotal()
            },
            changeInsuType(val){
                this.currentPage = 1;
                this.getList()
                this.getTotal()
            },
            changeInsuStatu(val){
                this.currentPage = 1;
                this.getList()
                this.getTotal()
            },
            getList() {
                this.loading = true;
                let params = {
                    // status: '',
                    talentName: this.form.talentName,
                    customerName:this.form.customerName,
                    mobile:this.form.mobile,
                    policyNo:this.form.policyNo,
                    status:this.form.status == -1 ? '' : this.form.status,
                    pageNum: this.currentPage,
                    pageSize: 20,
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                    company: this.form.company == '保险公司' ? '' : this.form.company,
                    insuType: this.form.insuType == '保险名称' ? '' : this.form.insuType,
                };
                this.ApiLists.getInsuDetail(params).then(res => {
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
            importInsu() {
                this.loading = true;
                let params = {
                    // status: '',
                    talentName: this.form.talentName,
                    customerName:this.form.customerName,
                    mobile:this.form.mobile,
                    policyNo:this.form.policyNo,
                    status:this.form.status == -1 ? '' : this.form.status,
                    pageNum: this.currentPage,
                    pageSize: 20,
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                    company: this.form.company == '保险公司' ? '' : this.form.company,
                    insuType: this.form.insuType == '保险名称' ? '' : this.form.insuType,
                };
                this.ApiLists.getInsuDetailExport(params).then(res=>{
                    if(res.respCode === 0){
                        if(res.data){
                            window.open(res.data)
                        }
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=> {
                    this.loading = false;
                })
            },
            getTotal(){
                let params = {
                    // status: '',
                    talentName: this.form.talentName,
                    customerName:this.form.customerName,
                    mobile:this.form.mobile,
                    policyNo:this.form.policyNo,
                    status:this.form.status == -1 ? '' : this.form.status,
                    pageNum: this.currentPage,
                    pageSize: 20,
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                    company: this.form.company == '保险公司' ? '' : this.form.company,
                    insuType: this.form.insuType == '保险名称' ? '' : this.form.insuType,
                };
                this.ApiLists.getInsuDetailSummary(params).then(res => {
                    if(res.respCode === 0){
                        this.totalInfo = res.data
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.loading = false;
                })
            },
            handleSizeChange(val) {
                this.currentPage = val
                this.getList()
                this.getTotal()
            },
            handleChangeDateRange(val) {
                this.form.startDate = val[0];
                this.form.endDate = val[1];
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