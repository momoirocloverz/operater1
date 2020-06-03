<template>
    <div class="normalDetailCon">
        <div class="topHere">
            <div class="topLine1">{{ currentName }}</div>
            <div class="topLine2">
                <div class="setBorder">
                    <div class="btnConFlex">
                        <div class="commonText">账户余额</div>
                        <el-button class="chargeBtn" type="primary" size="small" icon="el-icon-money" @click="popCharge"  v-Auth="'624'">充 值</el-button>
                    </div>
                    <div>{{totalBalance}}元</div>
                </div>                
                <div class="middleMargin">
                    <div class="commonText extraCommon">可用余额</div>
                    <div>{{availableBalance}}元</div>
                </div>                
                <div class="middleMargin">
                    <div class="commonText extraCommon">冻结金额</div>
                    <div>{{freezingAmount}}元</div>
                </div>
            </div>
        </div>
        <div>
            <div class="titleHere">交易明细</div>
            <el-divider class="resetDivideMargin"></el-divider>
            <div class="flexCus">
                <div>
                    <el-select size="small" class="lockWidth" v-model.trim="select1" placeholder="请选择业务类型" @change="searchAction">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
<!--                    <el-input v-model.trim="input1" class="lockWidth" size="small" placeholder="请输入交易对象" clearable></el-input>-->
                    <el-date-picker class="datePickerStyle" v-model.trim="dateRange" type="daterange" align="right" unlink-panels
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    :picker-options="pickerOptions" size="small" value-format="yyyy-MM-dd" @change="searchAction"></el-date-picker>
                    <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
                </div>
            </div>
            <div class="summaryText">
                <div>合计：支出-平台信息费{{sum1}}元，系统使用费{{sum2}}元，付款手续费{{sum3}}元；收入-充值{{sum4}}元</div>
            </div>
            <div class="tableCon">
                <el-table :data="tableData" max-height="530" stripe style="width: 100%;margin-top:20px"  empty-text="暂无相关交易明细" v-loading="loading">
                    <el-table-column prop="createdAt" label="日期"></el-table-column>
                    <el-table-column label="业务类型" min-width="100">
                        <template v-slot="scope">
                            {{ typeMap[scope.row.category] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="收入" :formatter="formatterIncome"></el-table-column>
                    <el-table-column label="支出" :formatter="formatterOut" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="afterBalance" label="期末余额" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="note"  :formatter="formatterNoteInfo" label="备注" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination @current-change="handleCurrentChange"
                               :current-page.sync="currentPage1" :page-size="20" layout="total,prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="管理费钱包充值" class="setRootScoped setMiddleDialog" :visible.sync="chargeVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="chargeForm" status-icon :rules="chargeRules" ref="chargeForm"
                         label-width="120px" class="demo-ruleForm">
                    <el-form-item label="充值商家">
                        <div>{{currentName}}</div>
                    </el-form-item>
                    <el-form-item label="充值金额" prop="amount">
                        <div class="inputItemWithText">
                            <el-input class="inputInnerSelf" maxlength="7" v-model.trim="chargeForm.amount" size="small"
                                      placeholder="请输入" clearable></el-input>
                            <div>元</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="支付密码" prop="password">
                        <div class="inputInnerFlex">
                            <el-input class="inputInnerSelf" maxlength="6" v-model.trim="chargeForm.password" size="small"
                                      placeholder="请输入" clearable show-password></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div><span class="forgetTrigger" @click="popReset" v-Auth="'625'">重置支付密码</span></div>
                    </el-form-item>                    
                    <el-form-item label="手机号码">
                        <div class="flexwithDrawItem">
                            <div>{{financialPhone}}</div>
                            <el-button type="info" size="small" class="itemBtn" :disabled="chargeDisabled"  @click="chargeSendSms">获取短信验证码</el-button>
                            <div v-if="chargeCDShow">{{chargeCountTime}}s</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="短信验证码" prop="sms">
                        <div class="inputInnerFlex">
                            <el-input class="inputInnerSelf" maxlength="6" v-model.trim="chargeForm.sms" size="small"
                                      placeholder="请输入" clearable></el-input>
                        </div>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitChargePass('chargeForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelChargePass('chargeForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="重置支付密码" class="setRoot2Scoped setMiddleDialog" :visible.sync="resetVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="resetForm" status-icon :rules="resetRules" ref="resetForm"
                         label-width="120px" class="demo-ruleForm">
                    <el-form-item label="验证手机号">
                        <div class="flexwithDrawItem">
                            <div>{{financialPhone}}</div>
                            <el-button type="info" size="small" class="itemBtn" :disabled="resetDisabled"  @click="resetSendSms">获取短信验证码</el-button>
                            <div v-if="resetCDShow">{{resetCountTime}}s</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="短信验证码" prop="sms">
                        <div class="inputInnerFlex">
                            <el-input class="inputInnerSelf" maxlength="6" v-model.trim="resetForm.sms" size="small"
                                      placeholder="请输入" clearable></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="支付密码" prop="pass">
                        <div class="inputInnerFlex">
                            <el-input class="inputInnerSelf" maxlength="6" v-model.trim="resetForm.pass" size="small"
                                      placeholder="请输入" clearable show-password></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="重复支付密码" prop="repeatPass">
                        <div class="inputInnerFlex">
                            <el-input class="inputInnerSelf" maxlength="6" v-model.trim="resetForm.repeatPass" size="small"
                                      placeholder="请输入" clearable show-password></el-input>
                        </div>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitResetPass('resetForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelResetPass('resetForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'normalDetail',
        data() {
            var validateChargeAmount = (rule, value, callback) => {
                if( isNaN( +value ) ){
                    callback(new Error('请输入正确的充值金额'));
                }else{                    
                    if( Number.isInteger(+value)&&(+value != 0) ){
                        this.chargeForm.amount = +value;
                        callback();
                    }else{
                        callback(new Error('请输入大于0的整数'));
                    }
                }
            };            
            var validateChargePass = (rule, value, callback) => {
                let reg = /[^0-9a-zA-Z]/gi;
                let length = value.length;
                let illegal = reg.test(value);
                if( (length != 6) ){
                    callback(new Error('请输入6位密码'));
                }else{
                    if( illegal ){
                        callback(new Error('请输入6位密码'));
                    }else{
                        callback();
                    }
                }
            };
            var validateRepeatPass = (rule, value, callback) => {
                if( value == this.resetForm.pass ){
                    callback();
                }else{
                    callback(new Error('重复密码与密码不一致'));
                }
            };
            var validateChargeSms = (rule, value, callback) => {
                let reg = /[^0-9]/gi;
                let length = value.length;
                let illegal = reg.test(value);
                if( length != 6 ){
                    callback(new Error('请输入6位短信验证码'));
                }else{
                    if( illegal ){
                        callback(new Error('请输入6位短信验证码'));
                    }else{
                        callback();
                    }
                }
            };
            return {    
                resetRules:{
                    sms:[
                        { required: true, message: '短信验证码不能为空', trigger: 'blur' },
                        { validator: validateChargeSms, trigger: 'blur' },
                    ],
                    pass:[
                        { required: true, message: '支付密码不能为空', trigger: 'blur' },
                        { validator: validateChargePass, trigger: 'blur' },
                    ],
                    repeatPass:[
                        { required: true, message: '重复支付密码不能为空', trigger: 'blur' },
                        { validator: validateRepeatPass, trigger: 'blur' },
                    ],
                },
                resetForm:{
                    sms:'',
                    pass:'',
                    repeatPass:'',
                },
                sum1:0,
                sum2:0,
                sum3:0,
                sum4:0,
                resetDisabled:false,
                resetCDShow:false,
                resetCountTime:60,
                resetVisible:false,
                chargeDisabled:false,
                chargeCDShow:false,
                chargeCountTime:60,
                chargeVisible:false,
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
                dateRange: '',
                input1: '',
                select1: '',
                options1: [
                    {label: '不限', value: 0},
                    {label: '付款手续费', value: 2},
                    {label: '系统使用费', value: 1},                    
                    {label: '平台信息费', value: 3},
                    {label: '充值', value: 4},
                ],
                typeMap:{
                    2:'付款手续费',
                    1:'系统使用费',
                    3:'平台信息费',
                    4:'充值',
                },
                tableData: [],
                currentPage1: 1,
                total: 0,
                chargeRules:{
                    amount:[
                        { required: true, message: '支付金额不能为空', trigger: 'blur' },
                        { validator: validateChargeAmount, trigger: 'blur' },
                    ],
                    password:[
                        { required: true, message: '支付密码不能为空', trigger: 'blur' },
                        { validator: validateChargePass, trigger: 'blur' },
                    ],
                    sms:[
                        { required: true, message: '短信验证码不能为空', trigger: 'blur' },
                        { validator: validateChargeSms, trigger: 'blur' },
                    ],
                },
                chargeForm:{
                    amount:'',
                    password:'',
                    sms:'',
                },
                cusId:'',
                currentName:'',
                financialPhone:'',
                availableBalance:0,
                freezingAmount:0,
                totalBalance:0,
                loading:true,
            }
        },
        mounted() {
            this.analyseQuery();
            let data = this.geneParams();
            data.pageNum = 1;
            data.pageSize = 20;
            this.getRecordList(data);
            this.getFinancialPhone();
        },
        methods: {
            formatterNoteInfo(row,column){
                if( row.category ){
                    if(  row.category == 4  ){
                        return row.note;
                    }else{
                       return row.note + this.Dayjs(row.feeDate).format('-MM-DD');
                    }
                }else{
                    return '-';
                }
            },
            formatterIncome(row,column){
                switch( row.inOutType ){
                    case 1:
                        return '-';
                        break;
                    case 2:
                        return row.amount;
                        break;    
                    default:
                        return '-';
                        break;    
                }
            },
            formatterOut(row,column){
                switch( row.inOutType ){
                    case 1:
                        return row.amount;
                        break;
                    case 2:
                        return '-';
                        break;    
                    default:
                        return '-';
                        break;
                }
            },
            getFinancialPhone(){
                let params = {
                    paramName:'wancai_finance_staff_mobile'
                };
                this.ApiLists.getFinancialPhone(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.financialPhone = data;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            getRecordList(data){
                this.ApiLists.getCusAccRecordList(data).then(res=>{
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
                    this.loading = false;
                })
                this.ApiLists.getCusAcListTotal(data).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){                        
                        this.sum1 = data&&data[3] || 0;
                        this.sum2 = data&&data[1] || 0;
                        this.sum3 = data&&data[2] || 0;
                        this.sum4 = data&&data[4] || 0;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            analyseQuery(){
                let { cusId } = this.$route.query;
                this.cusId = cusId;
                let params = {
                    cusId
                };
                this.ApiLists.getCusAccountDetail(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.currentName = data.fullName;
                        this.availableBalance = data.availableBalance;
                        this.freezingAmount = data.freezingAmount;
                        this.totalBalance = data.totalBalance;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            submitResetPass(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        let data = {
//                            cusId:this.cusId,
                            password:this.resetForm.pass,
                            confirmPassword:this.resetForm.repeatPass,
                            code:this.resetForm.sms,
                        };
                        this.ApiLists.cusAccSetPassword(data).then(res=>{
                            let { respCode,data } = res;
                            if( respCode == 0 ){
                                this.$message({
                                    message: '重置密码成功',
                                    type: 'success'
                                });
                                this.resetVisible = false;
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        })                        
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelResetPass(formName){
                this.$refs[formName].resetFields();
                this.resetVisible = false;
            },
            chargeSendSms(){
                this.chargeCDShow = true;
                this.chargeDisabled = true;
                this.chargeCountTime = 60;    
                let params = {
                    mobile:this.financialPhone,
                };
                this.ApiLists.getSmsCode(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.$message({
                            message: '短信验证码发送成功',
                            type: 'success'
                        });
                        window.timer4 = setInterval(()=>{
                            this.chargeCountTime--;
                            if( this.chargeCountTime == 0 ){
                                this.chargeCDShow = false;
                                this.chargeDisabled = false;
                                clearInterval( window.timer4 );
                            }
                        },1000);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            handleCurrentChange(val) {
                let data = this.geneParams();
                this.currentPage1 = val;
                data.pageNum = val;
                data.pageSize = 20;
                this.getRecordList(data);
            },
            popCharge(){   
                clearInterval( window.timer4 );            
                this.chargeCountTime = 60; 
                this.chargeCDShow = false;
                this.chargeDisabled = false;                   
                this.chargeVisible = true;
                this.$nextTick(()=>{
                    this.$refs.chargeForm.resetFields();
                })  
            },
            submitChargePass(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        let data = {
                            cusId:this.cusId,
                            amount:this.chargeForm.amount,
                            password:this.chargeForm.password,
                            code:this.chargeForm.sms,
                        };
                        this.ApiLists.cusAccRecharge(data).then(res=>{
                            let { respCode,data } = res;
                            if( respCode == 0 ){
                                this.$message({
                                    message: '充值成功',
                                    type: 'success'
                                });
                                this.chargeVisible = false;
                                this.analyseQuery();
                                let data = this.geneParams();
                                this.currentPage1 = 1;
                                data.pageNum = 1;
                                data.pageSize = 20;
                                this.getRecordList(data);
                                this.getFinancialPhone();
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelChargePass(formName){
                this.$refs[formName].resetFields();
                this.chargeVisible = false;
            },
            resetSendSms(){
                this.resetCDShow = true;                
                this.resetDisabled = true;
                this.resetCountTime = 60;       
                
                let params = {
                    mobile:this.financialPhone,
                };
                this.ApiLists.getSmsCode(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.$message({
                            message: '短信验证码发送成功',
                            type: 'success'
                        });
                        window.timer5 = setInterval(()=>{
                            this.resetCountTime--;
                            if( this.resetCountTime == 0 ){
                                this.resetCDShow = false;
                                this.resetDisabled = false;
                                clearInterval( window.timer5 );
                            }
                        },1000);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            popReset(){
                clearInterval( window.timer5 );    
                this.resetDisabled = false;
                this.resetCDShow = false;
                this.resetCountTime = 60;                
                this.resetVisible = true;
                this.$nextTick(()=>{
                    this.$refs.resetForm.resetFields();
                })  
            },
            geneParams(){
                let data = {};
                let arr = ['select1'];
                let inputParamsMap = {
//                    input1:'params1',
                    select1:'category',
                };
                arr.forEach(ele=>{
                    if( this[ele] ){
                        data[inputParamsMap[ele]] = this[ele];
                    }
                });
                let dateParams = [ 'start','end' ];
                if( this.dateRange ){
                    dateParams.forEach((ele,index)=>{
                        data[ele] = this.dateRange[index];
                    });
                }     
                data.cusId = this.cusId;
                return data;
            },
            searchAction(){
                this.currentPage1 = 1;
                let data = this.geneParams();
                data.pageNum = 1;
                data.pageSize = 20;
                this.getRecordList(data);
            },
        }
    }
</script>
<style scoped lang="scss">
    .normalDetailCon {
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;
        .chargeBtn {
            margin-left: 20px;
        }
        .flexCus {
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;
            margin-top: 15px;
            margin-bottom: 20px;
        }
        .forgetTrigger {
            cursor: pointer;
            color: #5C7099;
        }
        .flexwithDrawItem {
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;  
            .itemBtn {
                margin-left: 20px;
                margin-right: 20px;
            }
        }
        .inputItemWithText {
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;            
        }
        .inputInnerSelf {
            width: 250px;
            margin-right: 10px;
        }   
        .flexHere {
            display: flex;
            justify-content: center;
        }
        .commonText {
            font-size: 14px;
            height: 34px;
            line-height: 34px;
        }
        .extraCommon {
            margin-bottom: 10px;
        }
        .setBorder {
            border-right: 2px solid #EBEEF5;
            padding-right: 30px;
        }
        .btnConFlex {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            margin-bottom: 10px;
        }
        .middleMargin {
            margin-right: 40px;
            margin-left: 40px;
        }
        .lockWidth {
            width: 200px;
            margin-right: 10px;
        }
        .datePickerStyle {
            margin-right: 10px;
        }
        .tableCon {
            margin-top: 10px;
        }
        .pagCon {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        .resetDivideMargin {
            margin-top: 10px;
        }
        .titleHere {
            color: #606266;
            font-size: 16px;
            margin-top: 10px;
            font-weight: 500;
        }
        .summaryText {
            color: #606266;
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 10px;
        }
        .topHere {
            color: #606266;
            font-size: 16px;
            margin-bottom: 30px;
            .topLine1 {
            }
            .topLine2 {
                display: flex;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                margin-top: 40px;
                margin-bottom: 20px;
                .subLine2 {
                    margin-left: 20px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .normalDetailCon {
        .setRootScoped .el-dialog {
            height: 510px;
        }
        .setRoot2Scoped .el-dialog {
            height: 400px;
        }
    }
</style>