<template>
    <div class="configInnerCon">
        <div class="setMargin2">
            <div class="itemTitle">功能权限</div>
            <div class="flexMultipleSelect">
                <div class=" setMargina">
                    <span class="radioTitle">三方结算功能：</span>
                    <span>{{thirdConfirmText}}</span>
                </div>
                <div class=" setMargina" v-show="thirdConfirmText == '启用' ">
                    <span class="radioTitle">特殊考勤功能：</span>
                    <span>{{emptyTalentText}}</span>
                </div>
                <el-button type="primary" size="small" v-Auth="'65'" @click="popEditAuth">编辑</el-button>
            </div>
            <div class="secondSelectCon">
                <div  class="radioTitle">打卡管理功能：</div>
                <el-switch v-model="punchManageSwitch" active-color="#FF2626" inactive-color="#DCDFE6" active-value="1" inactive-value="0" @change="punchSwitch" :disabled="!AuthBoolean('66')"></el-switch>
                <div class="setleftMargin">{{ punchManageMap[punchManageSwitch] }}</div>
            </div>
        </div>
        <div>
            <div class="itemTitle">管理费账户</div>
            <div class="">
                <el-table :data="tableData21" border style="width: 100%; margin-top: 20px">
                    <el-table-column prop="des" label="费用类型（对外显示名）"></el-table-column>
                    <el-table-column prop="description" label="费用说明"></el-table-column>
                    <el-table-column prop="feeEmp" label="是否向零工扣费">
                        <template v-slot="scope">{{ scope.row.feeEmp == 1 ? '是' :'否' }}</template>
                    </el-table-column>
                    <el-table-column prop="feeAmount" label="金额">
                        <template v-slot="scope">
                            <div v-if="scope.row.index == 1">
                                {{ scope.row.feeAmount ? scope.row.feeAmount +'元/笔' :'无'   }}
                            </div>
                            <div v-if="scope.row.index == 2">
                                <div v-if="scope.row.forDisplay && scope.row.forDisplay.length"> 
                                    <template v-for="(subItem,subIndex) in scope.row.forDisplay" >
                                        <div>
                                            <span class="mr20">{{ subItem && subItem.attributeName}}</span>
                                            <span>{{subItem && subItem.amount}}元/天</span>
                                        </div>
                                    </template>
                                </div>
                                <div v-else>无</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="feeStatus" label="状态">
                        <template v-slot="scope">{{ scope.row.feeStatus == 1 ? '启用' : '不启用' }}</template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean(['67','68'])">
                        <template v-slot="scope">
                            <div v-if="scope.row.index == 1">
                                <el-button type="text" size="small" @click="setPop(scope.row)" v-Auth="'67'">设 置</el-button>
                            </div>
                            <div v-if="scope.row.index == 2">
                                <el-button type="text" size="small" @click="setPop(scope.row)" v-Auth="'68'">设 置</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="功能权限 设置" class="setAuthScoped setMiddleDialog" :visible.sync="authVisible" width="450px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="authForm" status-icon ref="authForm"
                         label-width="120px" class="demo-ruleForm " >
                    <div class="setAuthInnerHeight">
                    <el-form-item label="三方结算功能" >
                        <el-radio-group v-model.trim="authForm.radio2" >
                            <el-radio :label="3">启用</el-radio>
                            <el-radio :label="6">不启用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                        <el-form-item label="特殊考勤功能" v-show="authForm.radio2 == 3">
                        <el-radio-group v-model.trim="authForm.radio1">
                            <el-radio :label="3">启用</el-radio>
                            <el-radio :label="6">不启用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                        </div>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitAuthPass('authForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelAuthPass('authForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="付款手续费 设置" class="setRootScoped setMiddleDialog" :visible.sync="commissionVisible" width="450px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="commissionForm" status-icon :rules="commissionRules" ref="commissionForm"
                         label-width="120px" class="demo-ruleForm " >
                    <div class="setInnerHeight">
                    <el-form-item label="功能是否启用">
                        <el-radio-group v-model.trim="commissionForm.radio1">
                            <el-radio :label="3">启用</el-radio>
                            <el-radio :label="6">不启用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否向员工收费" v-show="commissionForm.radio1 == 3">
                        <el-radio-group v-model.trim="commissionForm.radio2" >
                            <el-radio :label="3">是</el-radio>
                            <el-radio :label="6">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="收费单价" prop="price" v-show="commissionForm.radio1 == 3">
                        <div class="inputInnerFlex">
                            <el-input class="inputInnerSelf" maxlength="10" v-model.trim="commissionForm.price" size="small"
                                      placeholder="请输入" clearable ></el-input>
                            <div>元/次</div>
                        </div>
                        <div>零工每天首次打卡收费</div>
                    </el-form-item>
                        </div>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitCommissionPass('commissionForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelCommissionPass('commissionForm')">取 消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="系统使用费 设置" class="setRootSpScoped setMiddleDialog" :visible.sync="insuranceVisible" width="1000px" :close-on-click-modal="false" center>
            <div>
                <el-form :model="insuranceForm" status-icon :rules="insuranceRules" ref="insuranceForm"
                         label-width="120px" class="demo-ruleForm">
                    <div class="innerDialogCon">
                        <el-form-item label="功能是否启用">
                            <el-radio-group v-model.trim="insuranceForm.radio1">
                                <el-radio :label="3">启用</el-radio>
                                <el-radio :label="6">不启用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="是否向员工收费" v-show="insuranceForm.radio1 == 3">
                            <el-radio-group v-model.trim="insuranceForm.radio2">
                                <el-radio :label="3">是</el-radio>
                                <el-radio :label="6">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="设置系统使用费" class="boldItem" v-show="insuranceForm.radio1 == 3"></el-form-item>
                        <el-form-item label="平台使用费" prop="price" v-show="insuranceForm.radio1 == 3">
                            <div class="inputInnerFlex">
                                <el-input class="inputInnerSelf" v-model.trim="insuranceForm.price" size="small"  placeholder="请输入" maxlength="10" clearable @change="priceChange"></el-input>
                                <div>元/天</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="设置保险" class="boldItem" v-show="insuranceForm.radio1 == 3"></el-form-item>
                        
                        <template v-for="(item,index) in dynamicAmoArray" >
                            <div v-show="insuranceForm.radio1 == 3">
                                <el-form-item :label="item.name">
                                    <el-radio-group v-model.trim="item.able" @change="ableChange(index,item.able)">
                                        <el-radio :label="3">需要</el-radio>
                                        <el-radio :label="6">不需要</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="选择保险套餐" class="boldItem" :prop="'check' + index + 'Table'" v-show="item.able == 3">
                                    <div>共{{insuranceTotal}}个，已选{{item.multipleSelection.length}}个</div>
                                    <el-table :data="item.tableDataDialog" max-height="350" border style="width: 100%; margin-top: 20px" @selection-change="(val)=>handleSelectionChange(val,index)"  :ref="'multiple'+index+'Table'" :key="'special' + index">
                                        <el-table-column prop="id" label="保险ID" show-overflow-tooltip width="100"></el-table-column>
                                        <el-table-column prop="insuName" label="保险名称" show-overflow-tooltip width="100"></el-table-column>
                                        <el-table-column label="有效时间" show-overflow-tooltip width="80">
                                            <template slot-scope="scope">1天</template>
                                        </el-table-column>
                                        <el-table-column prop="company" label="保险公司" show-overflow-tooltip width="100"></el-table-column>
                                        <el-table-column prop="instruction" label="保额" show-overflow-tooltip width="100"></el-table-column>
                                        <el-table-column prop="insuFee" label="成本(元/笔)" show-overflow-tooltip width="100"></el-table-column>
                                        <el-table-column type="selection" label="选择" width="50"></el-table-column>
                                        <el-table-column label="单价(元/天)">
                                            <template v-slot="scope">
                                                <el-input-number size="small" v-model="scope.row.amount" @change="(value)=>tableItemChange(value,index)" :precision="2" controls-position="right"  :min="0" :max="9999999999"/>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="pagCon" v-if="showInsurancePag">
                                        <el-pagination  @current-change="(val)=>handleInsCurrentChange(val,index)" :current-page.sync="item.currentPage" :page-size="50" layout="prev, pager, next, jumper" :total="insuranceTotal">
                                        </el-pagination>
                                    </div>
                                </el-form-item>                                
                            </div>
                        </template>
                        <el-form-item v-show="insuranceForm.radio1 == 3">
                            <div class="flexThreeItem">
                                <template v-for="(item,index) in dynamicAmoArray">
                                    <div class="thirdFlex">
                                        <div>{{item.name}}系统使用费：</div>
                                        <div>{{item.dynamicAmount}}元/天</div>
                                    </div>
                                </template>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitInsuranceFormPass('insuranceForm')">确 定</el-button>
                        <el-button type="info" size="small" class="sameWidthBtn"
                                   @click="cancelInsuranceFormPass('insuranceForm')">取 消</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>



        <el-dialog title="打卡管理功能设置确认" class="setSwitchScoped setMiddleDialog" :visible.sync="switchVisible" width="450px" :close-on-click-modal="false" center  :before-close="handleClose">
            <div>
                <div>
                    确认{{ punchManageMap[punchManageSwitch] }}企业客户"{{companyName}}"的打卡管理功能？
                </div>
                <div>
                    该商家下所有状态为"待执行、已关闭"的排班将{{ punchManageMap[punchManageSwitch] }}打卡管理功能。
                </div>
                
                <div class="flexHere">
                    <el-button type="primary" size="small" class="sameWidthBtn" @click="submitPunch">确 定</el-button>
                    <el-button type="info" size="small" class="sameWidthBtn" @click="cancelPunch">取 消</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        name: 'configInner',
        data() {
            var validatePlatPrice = (rule, value, callback) => {
                if( this.insuranceForm.radio1 == 3 ){
                    if( value ){
                        if( isNaN( +value ) ){
                            callback(new Error('请输入正确的金额数值'));
                        }else{
                            if( String(value).indexOf('.') > -1 ){
                                let geneArr = String(value).split('.');
                                let floatLength = geneArr[1].length;
                                if(floatLength){                             
                                    if( floatLength >= 2 ){
                                        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                                        this.insuranceForm.price = Math.abs(fix);
                                    }else{
                                        this.insuranceForm.price = Math.abs(+value);
                                    }
                                }else{
                                    this.insuranceForm.price = Math.abs(+value);
                                }
                            }else{
                                this.insuranceForm.price = Math.abs(+value);
                            }
                            callback();
                        }
                    }else{
                        callback(new Error('平台使用费不能为空'));
                    }                    
                }else{
                    callback();
                }
            };
            var validateTable = (rule, value, callback) => {
                let index = +rule.field.slice(5,-5);
                if( this.dynamicAmoArray[index].able == 6 ){
                    callback();
                }
                if( this.dynamicAmoArray[index].able == 3 ){
                    if( isNaN(this.dynamicAmoArray[index].dynamicAmount) ){
                        callback(new Error('填写单价需大于0'));
                    }else{
                        if( this.dynamicAmoArray[index].multipleSelection.length ){
                            if( isNaN(this.dynamicAmoArray[index].dynamicAmount) ){
                                callback(new Error('填写单价需大于0'));
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('您还未进行选择'));
                        }
                    }
                }
            };
            var validateComPrice = (rule, value, callback) => {
                if( this.commissionForm.radio1 == 3 ){
                    if( value ){
                        if( isNaN( +value ) ){
                            callback(new Error('请输入正确的单价'));
                        }else{
                            if( String(value).indexOf('.') > -1 ){
                                let geneArr = String(value).split('.');
                                let floatLength = geneArr[1].length;
                                if(floatLength){                             
                                    if( floatLength >= 2 ){
                                        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                                        this.commissionForm.price = Math.abs(fix);
                                    }else{
                                        this.commissionForm.price = Math.abs(+value);
                                    }
                                }else{
                                    this.commissionForm.price = Math.abs(+value);
                                }
                            }else{
                                this.commissionForm.price = Math.abs(+value);
                            }    
                            callback();
                        }
                    }else{
                        callback(new Error('收费单价不能为空'));
                    }
                }else{
                    callback();
                }
            };
            return {                
                tableData21: [
                    {des: '付款手续费', index: 1,description:'每次付款 每个用户每笔费用付款',  },
                    {des: '系统使用费', index: 2,description:'每人每次开工打卡扣除系统使用费，当天排班扣1天系统使用费，跨天排班扣2天使用费，同一用户同一商家下同一天不重复扣费'  },  
                ],
                emptyTalentText:'不启用',
                thirdConfirmText:'不启用',
                authVisible:false,
                authForm:{
                    radio1: 6,
                    radio2: 6, 
                },
                commissionVisible: false,
                commissionForm: {
                    radio1: 3,
                    radio2: 3,
                    price:'',
                },
                commissionRules: {
                    price:[                       
                        { validator: validateComPrice, trigger: 'blur' },
                    ],
                },
                insuranceVisible: false,  
                insuranceForm: {
                    radio1: 3,
                    radio2: 3, 
                    price:'',
                    regular:6,
                    labor:6,
                    temporary:6,
                },
                insuranceRules: {
                    price:[
                        { validator: validatePlatPrice, trigger: 'blur' },
                    ],
                    check0Table:[
                        { validator: validateTable, trigger: 'blur' },
                    ]
                },
                currentPage:1,
                insuranceTotal:0,
                multipleSelection:[],
                tableDataDialog:[],
                dynamicAmoArray:[
                    { 
                        dynamicAmount:0,
                        name:'正式工',
                        attributeId:1,
                        able:6,
                        multipleSelection:[],
                        tableDataDialog:[],
                        currentPage:1,
                    },
                    { 
                        dynamicAmount:0,
                        name:'雷电',
                        attributeId:4,
                        able:6,
                        multipleSelection:[],
                        tableDataDialog:[],
                        currentPage:1,
                    },
                ],
                dynamicAmount:0,
                showInsurancePag:false,
                show2InsurancePag:false,
                radio1: 3,
                attributeList:[],
                trackIndex:0,
                bridgeFinal:{},
                companyName:'',
                tempStatus:'0',
                switchVisible:false,
                punchManageSwitch:'0',
                punchManageMap:{
                    0:'停用',
                    1:'启用',
                },
            }
        },
        mounted(){
            this.checkOwnAttribute();
            this.fetchParent();            
        },
        methods: {
            handleClose(done){
                this.punchManageSwitch = this.tempStatus;
                done();
            },
            submitPunch(){     
                let params = {
                    customerId:this.$route.query.id,
                };   
                 this.ApiLists.punchTimeManageToggle(params).then(res=>{
                    let { respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.switchVisible = false;
                        this.checkOwnAttribute();
                        this.fetchParent();   
                    }else{
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            cancelPunch(){
                this.punchManageSwitch = this.tempStatus;
                this.switchVisible = false;
            },
            punchSwitch(val){
                this.switchVisible = true;
                switch(val){
                    case '0':
                        this.tempStatus = '1';
                        break;
                    case '1':
                        this.tempStatus = '0';
                        break;    
                }
            },
            checkOwnAttribute(){
                let params = {
                    customerId:this.$route.query.id,
                    pageNum:1,
                    pageSize:1000,
                };
                this.ApiLists.attributeList(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode == 0 ){
                        this.attributeList = data.list||[];
                        let map1 = this.attributeList.map(ele=>{
                            return {
                                dynamicAmount:0,
                                name:ele.attributeName,
                                attributeId:ele.id,
                                tableDataDialog:[],
                                multipleSelection:[],
                                able:6,
                                currentPage:1,
                            }
                        })
                        this.dynamicAmoArray = map1;
                        let sourceValidate = Object.assign({},this.insuranceRules.check0Table[0]);
                        this.dynamicAmoArray.forEach((ele,index)=>{
                            this.insuranceRules['check'+index+'Table'] = [sourceValidate];
                        });
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            handleInsCurrentChange(val,index){
                let params = {
                    status:1,
                    pageNum:val,
                    pageSize:50
                };       
                this.ApiLists.getInsuList(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode === 0 ){
                        if( data&&data.list ){
                            data.list.forEach(ele=>{
                                ele.amount = 0;  
                            });
                            let deep1 = JSON.parse( JSON.stringify(data.list) );
                            this.dynamicAmoArray[index].tableDataDialog = JSON.parse( JSON.stringify(data.list) );
                            this.insuranceTotal = data.total;
                            if( data.total > 50){
                                this.showInsurancePag = true;
                            }else{
                                this.showInsurancePag = false;
                            }
                            this.$nextTick(()=>{
                                if( Object.keys(this.bridgeFinal) && Object.keys(this.bridgeFinal).length ){
                                    Object.keys(this.bridgeFinal).forEach(ele=>{
                                        let track = this.dynamicAmoArray.find(subEle=>{
                                            return subEle.attributeId == ele;
                                        })
                                        let trackIndex = this.dynamicAmoArray.findIndex(subEle=>{
                                            return subEle.attributeId == ele;
                                        })
                                        this.dynamicAmoArray[trackIndex].tableDataDialog.forEach((third,thirdIndex)=>{
                                            let findddd = this.bridgeFinal[ele].findIndex(four=>{
                                                return four.insuId == third.id ;
                                            })
                                            if(findddd > -1){
                                                let nextObj = this.dynamicAmoArray[trackIndex].tableDataDialog[thirdIndex];
                                                this.$refs['multiple'+trackIndex+'Table'][0].toggleRowSelection( nextObj );
                                                this.dynamicAmoArray[trackIndex].tableDataDialog[thirdIndex].amount = this.bridgeFinal[ele][findddd].amount;
                                            }
                                        })
                                    });
                                }
                            });                              
                        }else{
                            this.dynamicAmoArray[index].tableDataDialog = [];
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            fetchParent(){
                let params = {
                    id:this.$route.query.id
                };
                this.ApiLists.businessCustomerDetail(params).then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        let parentData = data;
                        this.companyName = parentData.name;   
                        this.punchManageSwitch = String(parentData.punchTimeManageSwitch);
                        if( parentData.emptyTalentSwitch == 0 ){
                            this.authForm.radio1 = 6;
                            this.emptyTalentText = '不启用';
                        }else{
                            this.authForm.radio1 = 3;
                            this.emptyTalentText = '启用';
                        }    
                        if( parentData.thirdConfirmSwitch == 0 ){
                            this.authForm.radio2 = 6;
                            this.thirdConfirmText = '不启用';
                        }else{
                            this.authForm.radio2 = 3;
                            this.thirdConfirmText = '启用';
                        }
                        this.getConfigInfo();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            submitInsuranceFormPass(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.insuranceAction();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            insuranceAction(){                
                let noArrSelection = [];
                this.dynamicAmoArray.forEach((ele,index)=>{
                    if( ele.able == 3 ){
                        this.dynamicAmoArray[index].multipleSelection.forEach(subEle=>{
                            noArrSelection.push({
                                cusId:this.$route.query.id,
                                feeType:1,
                                insuId:subEle.id,
                                amount:subEle.amount,
                                attributeId:ele.attributeId,
                                attributeName:ele.name,
                            });
                        });
                    }
                    if( ele.able == 6 ){
                    }
                });
                noArrSelection = noArrSelection.concat({
                    cusId:this.$route.query.id,
                    feeType:2,
                    insuId:0,
                    amount:this.insuranceForm.price
                });
//                console.log( noArrSelection );
                let temp = this.dynamicAmoArray.map(ele=>{
                    return +ele.dynamicAmount
                });
                let calc = temp.reduce((accumulator,currentValue)=>{
                    return accumulator + currentValue;
                },0);           
                let fix = (Math.round(+calc + 'e' + 2) / Math.pow(10, 2)).toFixed(2);  
                
                this.ApiLists.businessCusystemFee(noArrSelection).then(res=>{
                    let { respCode } = res;
                    if( respCode == 0 ){
                        let data = {
                            id:this.rowBridge.id,
                            feeAmount: fix,
                            feeStatus:this.insuranceForm.radio1 == 3 ? 1 : 0,
                            feeEmp:this.insuranceForm.radio1 == 6 ? this.rowBridge.feeEmp : this.insuranceForm.radio2%2,
                        };
                        this.ApiLists.businessCustomerSettingSave(data).then(res=>{
                            let { respCode } = res;
                            if( respCode === 0 ){
                                this.$message({
                                    message: '设置成功',
                                    type: 'success'
                                });
                                this.insuranceVisible = false;
                                this.getConfigInfo();
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        }) 
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            cancelInsuranceFormPass(formName) {
                this.$refs[formName].resetFields();
                this.insuranceVisible = false;
            },
            cancelCommissionPass(formName) {
                this.$refs[formName].resetFields();
                this.commissionVisible = false;
            },
            submitCommissionPass(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.commissionAction();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },    
            commissionAction(){
                let data = {
                    id:this.rowBridge.id,
                    feeAmount: this.commissionForm.radio1 == 6 ? this.rowBridge.feeAmount : this.commissionForm.price,
                    feeStatus:this.commissionForm.radio1 == 3 ? 1 : 0,
                    feeEmp:this.commissionForm.radio1 == 6 ? this.rowBridge.feeEmp : this.commissionForm.radio2%2,
                };
                this.ApiLists.businessCustomerSettingSave(data).then(res=>{
                    let { respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.commissionVisible = false;
                        this.getConfigInfo();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            submitAuthPass(formName){
                let data = {
                    cusId:this.$route.query.id,
                    emptyTalentSwitch: this.authForm.radio2 == 6 ? 0 :this.authForm.radio1%2,
                    thirdConfirmSwitch:this.authForm.radio2 == 6 ? 0 : 1,
                };                
                this.ApiLists.businessCustomerSetting(data).then(res=>{
                    let { respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.authVisible = false;
                        this.checkOwnAttribute();
                        this.fetchParent(); 
                    }else{
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            cancelAuthPass(formName){
                this.authVisible = false;
            },
            setPop(scope) {
                switch (scope.index) {
                    case 2:
                        this.insuranceVisible = true;
                        this.$nextTick(()=>{
                            this.$refs.insuranceForm.resetFields();
                            this.insuranceForm.radio1 = scope.feeStatus ? 3 : 6;
                            this.insuranceForm.radio2 = scope.feeEmp ? 3 : 6; 
                            if( scope.systemFeeDetailVOList&&scope.systemFeeDetailVOList.length ){
                                let platItem = scope.systemFeeDetailVOList.find(ele=>{
                                    return ele.feeType == 2;
                                })
                                if( platItem ){
                                    this.insuranceForm.price = platItem.amount;  
                                }else{
                                    this.insuranceForm.price = 1;
                                }   
                                let listTrack = scope.systemFeeDetailVOList.filter(ele=>{
                                    return ele.insuId != 0;
                                })   
                                this.bridgeFinal = {};
                                if( listTrack&&listTrack.length ){
                                    this.bridgeFinal =  listTrack.reduce((acc,cur)=>{
                                        var key = cur['attributeId'];
                                        if (!acc[key]) {
                                            acc[key] = [];
                                        }
                                        acc[key].push(cur);
                                        return acc;
                                    },{})    
                                    this.dynamicAmoArray.forEach((ele,index)=>{
                                        this.reCalc(index);
                                    })
                                }else{  
                                    this.dynamicAmoArray.forEach((ele,index)=>{
                                        ele.able = 6;
                                        ele.dynamicAmount = this.insuranceForm.price;
                                        this.reCalc(index);
                                    })
                                }
                            }else{
                            }     
                        })  
                        let params = {
                            status:1,
                            pageNum:this.dynamicAmoArray.length && this.dynamicAmoArray[0].currentPage || 1,
                            pageSize:50,
                        };       
                        this.ApiLists.getInsuList(params).then(res=>{
                            let { respCode,data } = res;
                            if( respCode === 0 ){
                                if( data&&data.list ){
                                    data.list.forEach(ele=>{
                                        ele.amount = 0;  
                                    });
                                    let deep1 = JSON.parse( JSON.stringify(data.list) );
                                    this.dynamicAmoArray.forEach((ele,index)=>{
                                        ele.tableDataDialog =  JSON.parse( JSON.stringify(data.list) );
                                    }) 
                                    this.insuranceTotal = data.total;
                                    if( data.total > 50){
                                        this.showInsurancePag = true;
                                    }else{
                                        this.showInsurancePag = false;
                                    }
                                    this.$nextTick(()=>{
                                        if( Object.keys(this.bridgeFinal) && Object.keys(this.bridgeFinal).length ){
                                            Object.keys(this.bridgeFinal).forEach(ele=>{
                                                let track = this.dynamicAmoArray.find(subEle=>{
                                                    return subEle.attributeId == ele;
                                                })
                                                let trackIndex = this.dynamicAmoArray.findIndex(subEle=>{
                                                    return subEle.attributeId == ele;
                                                })
                                                this.dynamicAmoArray[trackIndex].able = 3;
                                                this.dynamicAmoArray[trackIndex].tableDataDialog.forEach((third,thirdIndex)=>{
                                                   let findddd = this.bridgeFinal[ele].findIndex(four=>{
                                                        return four.insuId == third.id ;
                                                    })
                                                    if(findddd > -1){
                                                        let nextObj = this.dynamicAmoArray[trackIndex].tableDataDialog[thirdIndex];
                                                        this.$refs['multiple'+trackIndex+'Table'][0].toggleRowSelection( nextObj );
                                                        this.dynamicAmoArray[trackIndex].tableDataDialog[thirdIndex].amount = this.bridgeFinal[ele][findddd].amount;
                                                    }
                                                })
                                            });
                                        }
                                    });                                    
                                }else{
                                    this.tableDataDialog = [];
                                    this.insuranceTotal = 0;
                                    this.showInsurancePag = false;
                                }
                            }else{
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        })
                        this.rowBridge = scope;
                        break;
                    case 1:                        
                        this.commissionVisible = true;  
                        this.$nextTick(()=>{
                            this.$refs.commissionForm.resetFields();
                            this.commissionForm.radio1 = scope.feeStatus ? 3 : 6;
                            this.commissionForm.radio2 = scope.feeEmp ? 3 : 6;
                            this.commissionForm.price = scope.feeAmount;
                        })   
                        this.rowBridge = scope;
                        break;
                }
            },
            handleSelectionChange(val,index){
                this.dynamicAmoArray[index].multipleSelection = val;
                this.reCalc(index);
            },
            priceChange(){
                this.dynamicAmoArray.forEach((ele,index)=>{
                    this.reCalc(index);
                })
            },
            tableItemChange(value,index){
                this.$forceUpdate();
                this.reCalc(index);
            },
            ableChange(index,able){
                if( able == 6 ){
                    this.dynamicAmoArray[index].multipleSelection = [];
                    this.$refs[ 'multiple'+index+'Table' ][0].clearSelection();
                }
                this.$forceUpdate();
                this.reCalc(index);
            },
            reCalc(index){
                this.$nextTick(()=>{
                    let temp = this.dynamicAmoArray[index].multipleSelection.map(ele=>{
                        return ele.amount
                    });
                    let calc = temp.reduce((accumulator,currentValue)=>{
                        return accumulator + +(currentValue);
                    },0)    
                    let fix = (Math.round(+calc + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    if( isNaN( +this.insuranceForm.price ) ){
                        this.dynamicAmoArray[index].dynamicAmount = fix;
                    }else{
                        let bridge = +this.insuranceForm.price + +fix;
                        this.dynamicAmoArray[index].dynamicAmount = (Math.round(+bridge + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
                    }
                });
            },
            popEditAuth(){
                this.authVisible = true;
            },
            getConfigInfo(){
                let params = {
                    cusId:this.$route.query.id
                };
                this.ApiLists.businessCustomerFeeLists(params).then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        let item1 = data.find(ele=>{
                            return ele.feeType == 1;
                        });
                        let item2 = data.find(ele=>{
                            return ele.feeType == 2;
                        });
                        this.tableData21 = [
                            {
                                des: '付款手续费', 
                                index: 1,description:'每次付款 每个用户每笔费用付款',
                                feeAmount: item1&&item1.feeAmount,
                                feeStatus: item1&&item1.feeStatus ? item1.feeStatus : 0,
                                feeEmp: item1&&item1.feeEmp ? item1.feeEmp : 0,
                                id:item1&&item1.id ? item1.id : '',
                            },
                            {
                                des: '系统使用费', 
                                index: 2,description:'每人每次开工打卡扣除系统使用费，当天排班扣1天系统使用费，跨天排班扣2天使用费，同一用户同一商家下同一天不重复扣费',
                                feeAmount: item2&&item2.feeAmount ? item2.feeAmount:'',
                                feeStatus: item2&&item2.feeStatus ? item2.feeStatus:0,
                                feeEmp: item2&&item2.feeEmp ? item2.feeEmp : 0,
                                id:item2&&item2.id ? item2.id : '',
                                systemFeeDetailVOList:item2&&item2.systemFeeDetailVOList ? item2.systemFeeDetailVOList : [],
                                forDisplay:[],
                            },
                        ]; 
                        let trackItem = this.tableData21.find(ele=>{
                            return ele.index == 2
                        })                         
                        let trackItem2 = trackItem.systemFeeDetailVOList.find(ele=>{
                            return ele.feeType == 2
                        })
                        let listTrack = trackItem.systemFeeDetailVOList.filter(ele=>{
                            return ele.insuId != 0;
                        })  
                        let flag1 = listTrack.reduce((acc,cur)=>{
                            var key = cur['attributeId'];
                            if (!acc[key]) {
                                acc[key] = [];
                            }
                            acc[key].push(cur);
                            return acc;
                        },{})  
                        let bridge = 0;
                        let blockArr1 = [];
                        if( Object.keys(flag1) && Object.keys(flag1).length ){
                            Object.keys(flag1).forEach(ele=>{
                                let calc = flag1[ele].reduce((accumulator,currentValue)=>{
                                    return accumulator + +(currentValue.amount);
                                },0)  
                                let fix = (Math.round(+calc + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                                bridge = +fix;    
                                blockArr1.push({
                                    amount:+fix,
                                    attributeId:ele,
                                    attributeName:flag1[ele].length ? flag1[ele][0].attributeName : '',
                                });
                            })
                        }
                        let blockArr2 = [];
                        this.dynamicAmoArray.map((ele)=>{
                            let track = blockArr1.find(subEle=>{
                                return subEle.attributeId == ele.attributeId
                            })
                            if( track ){
                                blockArr2.push(track);
                            }else{
                                blockArr2.push({
                                    amount:+trackItem2.amount,
                                    attributeName:ele.name
                                });
                            }
                        })
                        blockArr2.forEach(ele=>{
                            if( ele.attributeId ){
                                ele.amount = +(Math.round(+ele.amount + trackItem2.amount + 'e' + 2) / Math.pow(10, 2)).toFixed(2) 
                            }
                        })
                        trackItem.forDisplay = blockArr2;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
        },
    }
</script>
<style scoped lang="scss">
    .configInnerCon {
        .flexThreeItem {
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;
            flex-wrap: wrap;
            .thirdFlex {
                display: flex;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
                margin-right: 40px;
            }
        }
        .setMargin2 {
            margin-bottom: 40px;
        }
        .boldItem {
            font-weight: 500;
        }
        .itemTitle {
            color: #606266;
            font-size: 14px;
            margin-bottom: 10px;
            margin-top: 10px;
            font-weight: 500;
        }
        .secondSelectCon {
            margin-top: 20px;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            .setleftMargin {
                margin-left: 10px;
            }
        }
        .flexMultipleSelect {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            .setMargina {
                margin-right: 100px;
            }
        }
        .radioTitle {
            color: #606266;
            font-size: 14px;
        }
        .inputInnerSelf {
            width: 200px;
            margin-right: 10px;
        }
        .setAuthInnerHeight {
            height: 120px;
        }
        .inputInnerFlex {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
        }
        .dialogItemFlex {
            display: flex;
            justify-content: flex-start;
        }
        .innerDialogCon {
            height: 400px;
            margin-bottom: 10px;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        .flexHere {
            display: flex;
            justify-content: center;
        }
        .setInnerHeight {
            height: 230px;
        }
    }
</style>
<style lang="scss">
    .configInnerCon {
        .setAuthScoped  .el-dialog {
            height: 270px;
        }
        .setRootScoped .el-dialog {
            height: 370px;
        }
        .setRootSpScoped .el-dialog {
            height: 550px;
        }
        .setSwitchScoped .el-dialog{
            height: 220px;
        }
    }
</style>