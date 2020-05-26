<template>
  <div class="wancaiListCon">
      <div class="topHere">
          <div>浙江万才物流有限公司</div>
          <div class="flexHeaderItem">
              <div class="moneyNumber">40000</div>
              <el-button type="primary" size="small" icon="el-icon-money" @click="withDrawAction">提 现</el-button>
            </div>
        </div>
      <div>
          <div>交易明细</div>
          <el-divider class="resetDivideMargin"></el-divider>
          <div>
              <el-input v-model="input1" class="lockWidth" size="small" placeholder="请输入商家账户ID" clearable></el-input>
              <el-date-picker class="datePickerStyle" v-model="dateRange" type="daterange" align="right" unlink-panels  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" size="small" value-format="yyyy-MM-dd"></el-date-picker>
                <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
            </div>
          <div class="setMar">
              <el-select size="small" class="lockWidth" v-model="select1" placeholder="请选择业务类型">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
            </div>
          <div class="summaryText">
              <div>合计：支出-平台使用费2.00元，保险费20.00元，付款手续费10.00元；收入-充值30000元</div>
            </div>
          <div class="tableCon">
              <el-table :data="tableData"  height="530" stripe style="width: 100%;margin-top:20px">
                <el-table-column prop="id" label="日期" ></el-table-column>
                <el-table-column  prop="name"  label="业务类型" min-width="100"></el-table-column>
                <el-table-column prop="address" label="交易对象"></el-table-column>
                   <el-table-column  prop="address"  label="收入"></el-table-column>
                   <el-table-column prop="address" label="支出" show-overflow-tooltip></el-table-column>
                   <el-table-column prop="address"  label="期末余额" show-overflow-tooltip></el-table-column>
                   <el-table-column prop="address"  label="备注" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
          <div class="pagCon" v-if="total">
              <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10"  layout="total,prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
          <el-dialog title="申请提现" class="setRoot2Scoped setMiddleDialog" :visible.sync="withdrawalVisible" width="450px" :close-on-click-modal="false" center>
                  <div>
                      <el-form :model="withdrawForm" status-icon :rules="withdrawRules" ref="withdrawForm" label-width="120px" class="demo-ruleForm">
                          <el-form-item label="提现金额" prop="amount">
                              <div class="inputItemWithText">
                                  <el-input class="inputInnerSelf" v-model.trim="withdrawForm.amount" autocomplete="off" size="small" placeholder="请输入" clearable></el-input>
                                  <div>元</div>
                                </div>
                          </el-form-item>
                          <el-form-item label="支付密码" prop="password">
                              <el-input class="inputInnerSelf" v-model.trim="withdrawForm.password" autocomplete="off" size="small" show-password placeholder="请输入" clearable></el-input>                              
                          </el-form-item>
                          <el-form-item>
                              <div><span class="forgetTrigger" @click="popForget">忘记密码</span></div>                      
                          </el-form-item>
                          <el-form-item label="手机号码">
                              <div class="flexwithDrawItem">
                                  <div>13757194423</div>
                                  <el-button type="info" size="small" class="itemBtn" :disabled="withdrawDisabled"  @click="withdrawSendSms">获取短信验证码</el-button>
                                  <div v-if="withdrawCDShow">{{withdrawCountTime}}s</div>
                                </div>
                          </el-form-item>
                          <el-form-item  label="短信验证码" prop="sms">
                              <el-input class="inputInnerSelf" v-model.trim="withdrawForm.sms" autocomplete="off" size="small" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                          <div class="flexHere">
                              <el-button type="primary" size="small" class="sameWidthBtn" @click="submitPass('withdrawForm')">确 定</el-button>
                              <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelPass('withdrawForm')">取 消</el-button>
                          </div>
                      </el-form>
                  </div>
              </el-dialog>
            <el-dialog title="忘记支付密码" class="setRoot2Scoped setMiddleDialog" :visible.sync="forgetVisible" width="450px" :close-on-click-modal="false" center>
                  <div>
                      <el-form :model="forgetForm" status-icon :rules="forgetRules" ref="forgetForm" label-width="120px" class="demo-ruleForm">
                          <el-form-item label="手机号" prop="pass">
                              <div>13757194423</div>                              
                          </el-form-item>
                          <el-form-item>
                              <div class="flexForgetItem">
                                  <el-button type="info" size="small" class="itemBtn" :disabled="forgetDisabled" @click="forgetSendSms">获取短信验证码</el-button>
                                  <div v-if="forgetCDShow">{{forgetCountTime}}s</div>
                                </div>
                          </el-form-item>                          
                          <el-form-item label="短信验证码" prop="sms">
                              <el-input v-model.trim="forgetForm.sms" autocomplete="off" size="small" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                          <el-form-item label="新密码" prop="newPass">
                              <el-input type="password" v-model.trim="forgetForm.newPass" autocomplete="off" size="small" show-password placeholder="请输入" clearable></el-input>
                          </el-form-item>
                          <el-form-item label="重复新密码" prop="repeatPass">
                              <el-input type="password" v-model.trim="forgetForm.repeatPass" autocomplete="off" size="small" placeholder="请输入" clearable show-password ></el-input>
                          </el-form-item>
                          <div class="flexHere">
                              <el-button type="primary" size="small" class="sameWidthBtn" @click="submitForgetFormPass('forgetForm')">确 定</el-button>
                              <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelForgetFormPass('forgetForm')">取 消</el-button>
                          </div>
                      </el-form>
                  </div>
              </el-dialog>
        <el-dialog title="新建支付密码" class="setRoot2Scoped setMiddleDialog" :visible.sync="newVisible" width="450px" :close-on-click-modal="false" center>
                  <div>
                      <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px" class="demo-ruleForm">
                          <el-form-item label="手机号">
                              <div>13757194423</div> 
                          </el-form-item>
                          <el-form-item>
                              <div class="flexForgetItem">
                                  <el-button type="info" size="small" class="itemBtn" :disabled="newDisabled" @click="newSendSms">获取短信验证码</el-button>
                                  <div v-if="newCDShow">{{newCountTime}}s</div>
                                </div>
                          </el-form-item>  
                          <el-form-item label="短信验证码" prop="sms">
                              <el-input v-model.trim="newForm.sms" autocomplete="off" size="small" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                          <el-form-item label="支付密码" prop="pass">
                              <el-input type="password" v-model.trim="newForm.pass" autocomplete="off" size="small" show-password placeholder="请输入" clearable></el-input>
                          </el-form-item>
                          <el-form-item label="重复密码" prop="repeatPass">
                              <el-input type="password" v-model.trim="newForm.repeatPass" autocomplete="off" size="small" placeholder="请输入" clearable show-password></el-input>
                          </el-form-item>
                          <div class="flexHere">
                              <el-button type="primary" size="small" class="sameWidthBtn" @click="submitNewFormPass('newForm')">确 定</el-button>
                              <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelNewFormPass('newForm')">取 消</el-button>
                          </div>
                      </el-form>
            </div>
        </el-dialog>      
    </div>
</template>
<script>
export default {
    name: 'wancailist',
    data(){
        return {
            withdrawCDShow:false,
            withdrawDisabled:false,
            forgetCDShow:false,
            forgetDisabled:false,
            newCDShow:false,
            newDisabled:false,
            withdrawCountTime:60,
            forgetCountTime:60,
            newCountTime:60,
            input1:'',
            select1:'',
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
            dateRange:'',
            options1:[
                { label:'你好',value:1 },
                { label:'第二条',value:2 },
            ],
            currentPage1:1,
            tableData:[{id:1}],
            total:10,
            withdrawalVisible:false,
            withdrawForm:{
                amount:'',
                password:'',
                sms:'',
            },
            withdrawRules:{
                amount:[
                    { required: true, message: '请输入提现金额', trigger: 'blur' },
                ],
                password:[
                    { required: true, message: '请输入支付密码', trigger: 'blur' },
                ],
                sms:[
                    { required: true, message: '请输入短信验证码', trigger: 'blur' },
                ],
            },     
            forgetVisible:false,
            forgetForm:{
                sms:'',
                newPass:'',
                repeatPass:'',
            },  
            forgetRules:{
                sms:[
                    { required: true, message: '请输入短信验证码', trigger: 'blur' },
                ],
                newPass:[
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
                repeatPass:[
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                ],
            },
            newVisible:false,
            newRules:{
                sms:[
                    { required: true, message: '请输入短信验证码', trigger: 'blur' },
                ],
                pass:[
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
                repeatPass:[
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                ],
            },
            newForm:{
                sms:'',
                pass:'',
                repeatPass:'',
            },    
        }
    },
    mounted(){
        
    },
    methods:{
        newSendSms(){
            this.newCDShow = true;
            this.newDisabled = true;
            this.newCountTime = 60;            
            window.timer3 = setInterval(()=>{
                this.newCountTime--;
                if( this.newCountTime == 0 ){
                    this.newCDShow = false;
                    this.newDisabled = false;
                    clearInterval( window.timer3 );
                }
            },1000);
        },
        forgetSendSms(){
            this.forgetCDShow = true;
            this.forgetDisabled = true;
            this.forgetCountTime = 60;            
            window.timer2 = setInterval(()=>{
                this.forgetCountTime--;
                if( this.forgetCountTime == 0 ){
                    this.forgetCDShow = false;
                    this.forgetDisabled = false;
                    clearInterval( window.timer2 );
                }
            },1000);
        },
        withdrawSendSms(){
            this.withdrawCDShow = true;
            this.withdrawDisabled = true;
            this.withdrawCountTime = 60;            
            window.timer1 = setInterval(()=>{
                this.withdrawCountTime--;
                if( this.withdrawCountTime == 0 ){
                    this.withdrawCDShow = false;
                    this.withdrawDisabled = false;
                    clearInterval( window.timer1 );
                }
            },1000);
        },
        searchAction(){
            let data = {};
            let arr = ['input1','select1'];
            let inputParamsMap = {
                input1:'params1',
                select1:'params2',
            };
            arr.forEach(ele=>{
                if( this[ele] ){
                    data[inputParamsMap[ele]] = this[ele];
                }
            });
            let dateParams = [ 'dataParams1','dataParams2' ];
            if( this.dateRange ){
                dateParams.forEach((ele,index)=>{
                    data[ele] = this.dateRange[index];
                });
            }                
            console.log( data );  
        },
        handleSizeChange(){
        },
        handleCurrentChange(){
        },
        submitPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    this.withDrawRequest();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelPass(formName){
            this.$refs[formName].resetFields();
            this.withdrawalVisible = false;
        },
        withDrawRequest(){
            this.withdrawalVisible = false;
        },
        needSetPassword(){
            this.newVisible = true;
            
            clearInterval( window.timer3 );            
            this.newCountTime = 60; 
            this.newCDShow = false;
            this.newDisabled = false;            
        },
        withDrawAction(){
//            this.needSetPassword();
            
            this.withdrawalVisible = true;
            
            clearInterval( window.timer1 );
            this.withdrawCountTime = 60; 
            this.withdrawCDShow = false;
            this.withdrawDisabled = false;
        },
        forgetRequest(){
            this.forgetVisible = false;
        },
        submitForgetFormPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    this.forgetRequest();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelForgetFormPass(formName){
            this.$refs[formName].resetFields();
            this.forgetVisible = false;
        },
        submitNewFormPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    this.newRequest();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        newRequest(){
            this.newVisible = false;
        },
        cancelNewFormPass(formName){
            this.$refs[formName].resetFields();
            this.newVisible = false;
        },
        popForget(){
            this.forgetVisible = true;
            
            clearInterval( window.timer2 );
            this.forgetCountTime = 60; 
            this.forgetCDShow = false;
            this.forgetDisabled = false;
        },
    },
}
</script>
<style lang="scss" scoped>
    .wancaiListCon { 
        .forgetTrigger {
            cursor: pointer;
            color: #5C7099;
        }
        .resetDivideMargin {
            margin-top: 10px;
        }
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
        .datePickerStyle {
            margin-right: 10px;
        }
        .tableCon {
            margin-top: 10px;
        }
        .setMar {
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .pagCon {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        .topHere {
            color: #606266;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .summaryText {
            color: #606266;
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 10px;
        }
        .flexHeaderItem {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            margin-top: 20px;
        }
        .moneyNumber {
            margin-right: 20px;
        }
        .flexHere {
            display: flex;
            justify-content: center;
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
        .flexForgetItem {
            height: 40px;
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;  
            .itemBtn {
                margin-right: 20px;
            }
        }
    }    
</style>
<style lang="scss">
    .wancaiListCon {
        .setRoot2Scoped .el-dialog {
            height: 450px;
        }
    }    
</style>