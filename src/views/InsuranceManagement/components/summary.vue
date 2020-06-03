<template>
    <div class="summary-wrap" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div class="flex-box">
                    <el-form ref="form" :model="form" label-width="80px" label-position="left">
                        <el-form-item label="日期：">
                            <el-radio-group v-model="form.dateModel" >
                                <el-radio label="1">本月</el-radio>
                                <el-radio label="3">自定义</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div class="pl20" v-show="form.dateModel == '3'">
                        <el-date-picker class="mr15" v-model="dateRange" type="daterange" align="right" unlink-panels
                                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        @change="handleChangeDateRange"
                                        size="small"></el-date-picker>
                        <el-button type="info" size="small" icon="el-icon-search" @click="searchData()">搜 索</el-button>
                    </div>
                </div>
                <div>
                    <el-button :disabled="tableData.length == 0" type="primary" size="small" icon="" @click="importInsu" v-Auth="'631'">导 出</el-button>
                </div>
            </div>
            <div class="">
                <el-select size="small" class="lockWidth"
                           v-model="form.company"
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
            </div>
        </div>
        <div class="bottomCon">
            <div class="pt20 f14">
                合计: 购买成功{{totalInfo.success || 0}}单,
                失败{{totalInfo.fail || 0}}单,
                成本{{totalInfo.cost  | forNumber}}元,
                收费{{totalInfo.toll  | forNumber}}元,
                利润{{totalInfo.profit  | forNumber}}元
            </div>
            <div class="tableCon">
                <el-table emptyText="暂无相关信息" :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="createdAt" label="日期" align="center" width=""></el-table-column>
                    <el-table-column prop="success" label="购买成功数" align="center" width=""></el-table-column>
                    <el-table-column prop="fail" label="购买失败数" align="center"></el-table-column>
                    <el-table-column prop="cost" :formatter="forCost" align="center" label="成本(元)"></el-table-column>
                    <el-table-column prop="toll" :formatter="forCost"  align="center" label="收费(元)"></el-table-column>
                    <el-table-column prop="profit" :formatter="forCost" align="center" label="利润(元)" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="total, prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'summaryWrap',
        data() {
            return {
                dateRange: '',
                value:'',
                value1:'',
                form:{
                    startDate:'',
                    endDate:'',
                    dateModel: '1',
                    company:'',
                    insuType:'',
                },
                loading:false,
                pickerOptions: {
                },
                options:[],
                options2:[],
                currentPage:1,
                pageTotal:0,
                totalInfo:{},
                tableData: [],
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
        watch:{
            'form.dateModel':function (val,oldVal) {
                if(val == '1'){
                    this.form.startDate = this.Dayjs().startOf('month').format('YYYY-MM-DD');
                    this.form.endDate = this.Dayjs().format('YYYY-MM-DD');
                    this.getList()
                }else if(val == '3'){
                    this.form.startDate= ''
                    this.form.endDate= ''
                    this.dateRange = [];
                }
            }  
        },
        mounted(){
            this.form.startDate = this.Dayjs().startOf('month').format('YYYY-MM-DD');
            this.form.endDate = this.Dayjs().format('YYYY-MM-DD');
            this.getCompany()
            this.getInsuType()
            this.getList()
            this.getTotal()
        },
        methods: {
            forCost(cell,col,val){
                if(Number(val) >= 0){
                    return Number(val).toFixed(2)
                }else{
                    return '无'
                }
            },
            importInsu() {
                this.loading = true;
                let params = {
                    pageNum:this.currentPage,
                    pageSize:20,
                    startDate:this.form.startDate,
                    endDate:this.form.endDate,
                    company:this.form.company == '保险公司' ? '' : this.form.company,
                    insuType:this.form.insuType == '保险名称' ? '' : this.form.insuType,
                };
                this.ApiLists.getInsuListExport(params).then(res=>{
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
            async getCompany(){
                this.options = ['保险公司'];
                let data = await this.ApiLists.getInsuCompany();
                data.data && data.data.length > 0 && data.data.forEach((item,index) =>{
                    this.options.push(item)
                })
            },
            async getInsuType(){
                this.options2 = ['保险名称'];
                let data = await this.ApiLists.getInsuType({});
                data.data && data.data.length > 0 && data.data.forEach((item,index) =>{
                    this.options2.push(item)
                })
            },
            getList(){
                this.loading = true;
                let params = {
                    pageNum:this.currentPage,
                    pageSize:20,
                    startDate:this.form.startDate,
                    endDate:this.form.endDate,
                    company:this.form.company == '保险公司' ? '' : this.form.company,
                    insuType:this.form.insuType == '保险名称' ? '' : this.form.insuType,
                };
                this.ApiLists.getSelfInsuList(params).then(res =>{
                    if(res.respCode === 0){
                        this.tableData = res.data.list || []
                        this.pageTotal = res.data.total || 0
                    }
                }).catch(err => {
                  
                    console.log(err)
                }).finally(()=>{
                    this.loading = false;
                })
            },
            getTotal(){
                let params = {
                    pageNum:this.currentPage,
                    pageSize:20,
                    startDate:this.form.startDate,
                    endDate:this.form.endDate,
                    company:this.form.company == '保险公司' ? '' : this.form.company,
                    insuType:this.form.insuType == '保险名称' ? '' : this.form.insuType,
                }
                this.ApiLists.getInsuRecord(params).then(res => {
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
            searchData(){
                if(!this.form.startDate){
                    return this.$message.error('开始时间不能为空!')
                }
                this.currentPage = 1
                this.getList()
                this.getTotal()
            },
            handleChangeDateRange(val){
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
    .summary-wrap {
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