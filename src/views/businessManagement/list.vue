<template>
  <div class="businessListCon" v-loading="loading">
      <div class="topCon">
          <div class="topFirst" @keyup.enter="searchAction">
              <div>
              <el-input v-model.trim="input1" class="lockWidth" size="small" placeholder="请填写公司名称" clearable></el-input>
                <el-input v-model.trim="input2" class="lockWidth" size="small" placeholder="请填写商家ID" clearable></el-input>
                  <el-input v-model.trim="input3" class="lockWidth" size="small" placeholder="请填写联系人姓名" clearable></el-input>
                <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
                </div>
              <div>
                </div>
            </div>
            <div class="topSec" @keyup.enter="searchAction">
                <el-select size="small" class="lockWidth" v-model.trim="select1" placeholder="请选择商家类型" @change="searchAction">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                <el-select size="small" class="lockWidth" v-model.trim="select2" placeholder="请选择账号状态" @change="searchAction">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
            </div>
        </div>
      <div class="bottomCon">
          <div class="tableCon">
               <el-table :data="tableData"  max-height="550" stripe style="width: 100%" empty-text="暂无相关商家记录">
                <el-table-column prop="id" label="商家ID" width="80"></el-table-column>
                <el-table-column label="绑定手机号" width="130">
                    <template v-slot="scope">{{ scope.row.mobile || '无' }}</template>
                </el-table-column>
                <el-table-column prop="type" label="商家类型" width="120" :formatter="accountTypeFormatter" ></el-table-column>
                <el-table-column label="公司简称">
                    <template v-slot="scope">{{ scope.row.shortName || '无' }}</template>
                </el-table-column>
                <el-table-column label="公司全称" show-overflow-tooltip width="220">
                    <template v-slot="scope">{{ scope.row.name || '无' }}</template>
                </el-table-column>
                <el-table-column label="行业" show-overflow-tooltip>
                    <template v-slot="scope">{{ scope.row.industryName || '无' }}</template>
                </el-table-column>
                <el-table-column prop="realName"  label="联系人姓名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="idCard"  label="身份证号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" :formatter="accountStatusFormatter" label="账号状态" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" v-if="AuthBoolean('61')" >
                    <template v-slot="scope">
                        <el-button size="mini" v-Auth="'61'" type="text" @click="checkDetail(scope.row)" v-if="scope.row.status !=3">详情</el-button>                           
                    </template>
                </el-table-column>
              </el-table>
        </div>
          <div class="pagCon" v-if="total">
              <el-pagination  @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="20"  layout="total,prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>        
       <el-dialog title="添加企业商家" class="setCompanyScoped setMiddleDialog" :visible.sync="companyVisible" width="450px" :close-on-click-modal="false" center>
                  <div>
                      <el-form :model="companyForm" status-icon :rules="companyRules" ref="companyForm" class="demo-ruleForm">
                          <div class="companyFormCon">
                          <div class="dialogTitle">联系人信息</div>
                          <el-form-item prop="phone">
                              <el-input v-model.trim="companyForm.phone" size="small" placeholder="请输入手机号" autocomplete	="username" clearable></el-input>
                          </el-form-item>
                          <el-form-item prop="realName">
                              <el-input type="password" v-model.trim="companyForm.realName" size="small" placeholder="请输入真实姓名" clearable autocomplete	="username"></el-input>
                          </el-form-item>
                          <el-form-item prop="idNumber">
                              <el-input type="password" v-model.trim="companyForm.idNumber" size="small" placeholder="请输入身份证号" clearable autocomplete="off"></el-input>
                          </el-form-item>
                          <div class="dialogTitle">公司信息</div>
                          <el-form-item prop="fullName">
                              <el-input v-model.trim="companyForm.fullName" size="small" placeholder="请输入公司全称" clearable autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item prop="shortName">
                              <el-input v-model.trim="companyForm.shortName" size="small" placeholder="请输入公司简称（限制六个字）" clearable autocomplete="off" maxlength="6"></el-input>
                          </el-form-item>
                          <el-form-item prop="socialCreditCode">
                              <el-input v-model.trim="companyForm.socialCreditCode" size="small" placeholder="请输入统一社会信用代码" clearable></el-input>
                          </el-form-item>
                          <el-form-item prop="corporate">
                              <el-input v-model.trim="companyForm.corporate"  size="small" placeholder="请输入公司法人姓名" clearable></el-input>
                          </el-form-item>
                              <el-form-item prop="Industry">
                                  <el-select size="small" class="lockSelectItem" v-model.trim="companyForm.Industry" placeholder="请选择所在行业">
                                      <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                  </el-select>                                  
                                </el-form-item>
                             <el-form-item prop="trinity">
                                 <div class="flexCurrentItem">
                                     <el-select size="small" class="threeSections" v-model.trim="companyForm.provience" placeholder="所在省" @change="provienceChange">
                                      <el-option v-for="(item,index) in provinceList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal"></el-option>
                                  </el-select>  
                                     <el-select size="small" class="threeSections" v-model.trim="companyForm.city" placeholder="所在市" @change="cityChange">
                                      <el-option v-for="(item,index) in cityList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal"></el-option>
                                  </el-select>  
                                     <el-select size="small" class="threeSections" v-model.trim="companyForm.region" placeholder="所在县/区">
                                      <el-option v-for="(item,index) in regionList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal"></el-option>
                                    </el-select>  
                                 </div>                                 
                          </el-form-item> 
                            <el-form-item prop="address">
                              <el-input v-model.trim="companyForm.address" size="small" placeholder="请输入详细地址" clearable></el-input>
                          </el-form-item> 
                            <el-form-item prop="imgUpload">
                              <el-upload class="upload-demo" action="//upload.qiniu.com/" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="handleExceed" :on-success="handleAvatarScucess" :file-list="fileList" :data="upload_form">
                                  <el-button size="small" type="primary">上传营业执照</el-button>
                                  <div slot="tip" class="el-upload__tip">只支持jpg、png格式</div>
                                </el-upload>
                          </el-form-item>   
                          </div>
                          <div class="flexHere btnMargin">
                              <el-button type="primary" size="small" class="sameWidthBtn" @click="submitCompanyPass('companyForm')">确 定</el-button>
                              <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelCompanyPass('companyForm')">取 消</el-button>
                          </div>
                      </el-form>
                  </div>
              </el-dialog>
                <el-dialog title="添加个人商家" class="setRetailScoped setMiddleDialog" :visible.sync="retailVisible" width="450px" :close-on-click-modal="false" center>
                    <div>
                      <el-form :model="retailForm" status-icon :rules="retailRules" ref="retailForm" class="demo-ruleForm">
                          <el-form-item prop="phone">
                              <el-input v-model.trim="retailForm.phone" size="small" placeholder="请输入手机号" clearable></el-input>
                          </el-form-item>
                          <el-form-item prop="name" >
                              <el-input v-model.trim="retailForm.name" size="small" placeholder="请输入真实姓名" clearable></el-input>
                          </el-form-item>
                          <el-form-item prop="idNumber">
                              <el-input v-model.trim="retailForm.idNumber" size="small" placeholder="请输入身份证号" clearable></el-input>
                          </el-form-item>
                          <div class="flexHere">
                              <el-button type="primary" size="small" class="sameWidthBtn" @click="submitRetailPass('retailForm')">确 定</el-button>
                              <el-button type="info" size="small" class="sameWidthBtn"  @click="cancelRetailPass('retailForm')">取 消</el-button>
                          </div>
                        </el-form>
                    </div>
                </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'businesslist',
    data(){
        var validateTrinity = (rule, value, callback) => {
            let flag1 = this.companyForm.provience;
            let flag2 = this.companyForm.city;
            let flag3 = this.companyForm.region;            
            if(  !flag1 || !flag2 || !flag3  ){
                callback(new Error('请选择公司所在地!'));
            }else{
                callback();
            }  
        };
        var validateImg = (rule, value, callback) => {
            let flag1 = this.imgForUpload;   
            if(  !flag1  ){
                callback(new Error('请上传营业执照!'));
            }else{
                callback();
            }  
        };
        return {
            loading:true,
            imgForUpload:'',
            provinceList: [],
            cityList: [],
            regionList: [],
            fileList: [],
            upload_form: {},
            companyForm:{
                phone:'',
                realName:'',
                idNumber:'',
                socialCreditCode:'',
                fullName:'',
                shortName:'',
                corporate:'',
                Industry:'',
                address:'',
                provience:'',
                city:'',
                region:'',
            },
            companyRules:{
                phone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ],
                realName:[
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                ],
                idNumber:[
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                ],
                socialCreditCode:[
                    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
                ],
                fullName:[
                    { required: true, message: '请输入公司全称', trigger: 'blur' },
                ],
                shortName:[
                    { required: true, message: '请输入公司简称', trigger: 'blur' },
                ],
                corporate:[
                    { required: true, message: '请输入公司法人姓名', trigger: 'blur' },
                ],
                Industry:[
                    { required: true, message: '请选择所在行业', trigger: ['blur', 'change']},
                ],
                address:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
                trinity:[
                    { validator: validateTrinity, trigger: 'change' },
                ],
                imgUpload:[
                    { validator: validateImg, trigger: 'change' },
                ],
            },
            retailForm:{
                phone:'',
                name:'',
                idNumber:'',                
            },
            retailRules:{
                phone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ],
                name:[
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                ],
                idNumber:[
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                ]                
            },
            companyVisible:false,
            retailVisible:false,
            input1:'',
            input2:'',
            input3:'',
            select1:'',
            select2:'',
            value:'',
            options1:[
                { label:'不限',value:0 },
                { label:'个人商家',value:1 },
                { label:'企业商家',value:2 },
            ],
            options2:[
                { label:'不限',value:0 },
                { label:'可用',value:1 },
                { label:'冻结',value:2 },
                { label:'升级为企业',value:3 },
            ],
            options3:[
                { label:'你好',value:1 },
                { label:'第二条',value:2 },
            ],
            currentPage1:1,
            tableData:[],
            total:0,
        }
    },
    mounted(){
        let data = this.geneParams();
        this.getMasterList(data);
    },
    methods:{
        accountStatusFormatter(row, column){
            if(row.status){
                switch( row.status ) {
                    case 1:
                        return '可用';
                        break;
                    case 2:
                        return '冻结';
                        break; 
                    case 3:
                        return '升级为企业';
                        break;    
                }
            }else{
                return '无';
            }
        },
        accountTypeFormatter(row, column){
            if(row.type){
                switch( row.type ) {
                    case 1:
                        return '个人商家';
                        break;
                    case 2:
                        return '企业商家';
                        break;    
                }
            }else{
                return '无';
            }
        },
        getMasterList(data){
            this.ApiLists.businessCustomerList(data).then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    this.total = data.total;
                    this.tableData = data.list;
                }else{
                    this.total = 0;
                    this.tableData = [];
                }
            }).catch(err=>{
                console.log('err',err);
            }).finally(()=>{
                setTimeout(()=>{
                    this.loading = false;
                },500)
            })
        },
        nestAreaRequest(){
            this.getProvince();
            this.$nextTick(()=>{
                this.getCity();
                this.$nextTick(()=>{
                    this.getRegion();
                });
            });
        },
        provienceChange(){
            this.getCity();
            this.companyForm.city = '';
            this.companyForm.region = '';
        },
        cityChange(){
            this.getRegion();
            this.companyForm.region = '';
        },
        searchAction(){
            let data = this.geneParams();
            this.currentPage1 = 1;
            this.getMasterList(data);
        },
        geneParams(){
            let data = {};
            let arr = ['input1','input2','input3','select1','select2'];
            let inputParamsMap = {
                input1:'name',
                input2:'cusId',
                input3:'realName',
                select1:'type',
                select2:'status',
            };
            arr.forEach(ele=>{
                if( this[ele] ){
                    data[inputParamsMap[ele]] = this[ele];
                }
            });
            data.pageSize = 20;
            return data;
        },
        checkDetail(row){
            const { href } = this.$router.resolve({
                name: 'businessListDetail',
                query:{
                    id:row.id,
                    type:row.type,
                    name: row.type == 1 ? row.realName : row.name,
                    
                }
            })   
            sessionStorage.removeItem('cropSwitchItem');
            window.open( href );
        },
        handleCurrentChange(val){
            let data = this.geneParams();
            this.currentPage1 = val;
            data.pageNum = val;
            this.getMasterList(data);
        },
        popRetail(){
            this.retailVisible = true;
            this.$nextTick(()=>{
                this.$refs.retailForm.resetFields();
            });
        },
        popCompany(){
            this.nestAreaRequest();
            this.fileList = [];
            this.imgForUpload = '';
            this.companyVisible = true;
            this.getToken();
            this.$nextTick(()=>{
                this.$refs.companyForm.resetFields();
            });
        },
        retailRequestAction(){
            this.retailVisible = false;
        },
        submitRetailPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    this.retailRequestAction();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelRetailPass(formName){
            this.$refs[formName].resetFields();
            this.retailVisible = false;            
        },
        companyRequestAction(){
            this.companyVisible = false;
        },
        submitCompanyPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    this.companyRequestAction();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelCompanyPass(formName){
            this.$refs[formName].resetFields();
            this.companyVisible = false;
        },
        handleAvatarScucess(res, file) {
            const key = res.key;
            this.imgForUpload = `http://${this.bucketHost}/${key}`;
            this.$refs.companyForm.validateField('imgUpload');            
            this.getToken()
        },
        handleExceed(files, fileList) {
            this.$message.warning(`请删除当前文件再重新上传！`);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG) {
                this.$message.error('上传营业执照只能是 JPG 或PNG格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传营业执照大小不能超过 2MB!');
            }
            return isLt2M && (isPNG || isJPG);
        },
        handleRemove(file, fileList) {
            this.imgForUpload = '';
            this.$forceUpdate();
            this.$refs.companyForm.validateField('imgUpload');  
        },
        getToken() {
            this.ApiLists.cowToken().then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    this.upload_form = {
                        key: data.fileName,
                        token: data.upToken,
                    };
                }
            }).catch(err=>{
                console.log('err',err);
            })
      },
      getRegion() {
          let params = {
              code:'city',
              value:this.companyForm.city,
          };
          this.ApiLists.getDicList(params).then(res=>{
              let { data,respCode } = res;
              if( respCode === 0 ){
                  this.regionList = data;
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      getCity() {
          let params = {
              code:'city',
              value:this.companyForm.provience,
          };
          this.ApiLists.getDicList(params).then(res=>{
              let { data,respCode } = res;
              if( respCode === 0 ){
                  this.cityList = data;
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      getProvince() {
          let params = {
              code:'city',
              value:'0',
          };
          this.ApiLists.getDicList(params).then(res=>{
              let { data,respCode } = res;
              if( respCode === 0 ){
                  this.provinceList = data;
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
    },
}
</script>
<style lang="scss" scoped>
    .businessListCon {  
        .dialogTitle {
            margin-bottom: 10px;
        }
        .flexCurrentItem {
            display: flex;
            justify-content: space-between;
            .threeSections {
                width: 30%;
            }
        }
        .lockSelectItem {
            width: 100%;
        }
        .flexHere {
            display: flex;
            justify-content: center;
        }
        .btnMargin {
            margin-top: 10px;
        }
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
        .companyFormCon {
            overflow-y: scroll;
            overflow-x: hidden;
            height: 350px;
        }
        .bottomCon {
            margin-top: 20px;
            .pagCon {
                display: flex;
                justify-content: center;
                margin-top: 30px;
            }
        }        
    }    
</style>
<style lang="scss">
    .businessListCon {
        .setCompanyScoped .el-dialog{
            height: 500px;
        }
        .setRetailScoped .el-dialog{
            height: 330px;
        }
    }    
</style>