<template>
  <div class="businessDetailCon" v-loading="loading">
    <div>
      <div class="nameColor">{{ name }}</div>
      <el-tabs v-model.trim="activeName" @tab-click="handleClick">
        <template v-for="(item, index) in restTabArr">
          <el-tab-pane
            :label="item.title"
            :key="index"
            :name="item.name"
          ></el-tab-pane>
        </template>
      </el-tabs>
      <div class="tabContentCon">
        <div v-if="activeName == 'first'">
          <div class="retailOnly" v-if="mainType == '1'">
            <div>
              <div class="itemTitle">账号信息</div>
              <div class="divideCon">
                <div class="divideItem">
                  <CusTable
                    :tableData="tableData1"
                    :key="1"
                    @bindEvent="Company"
                  ></CusTable>
                </div>
                <div class="divideItem">
                  <CusTable
                    :tableData="tableData2"
                    :key="2"
                    @bindEvent="freezePersonal"
                  ></CusTable>
                </div>
              </div>
            </div>
            <div>
              <div class="itemTitle">基本信息</div>
              <div class="divideCon">
                <div class="divideItem">
                  <CusTable :tableData="tableData3" :key="3"></CusTable>
                </div>
              </div>
            </div>
          </div>
          <div class="companyCon" v-else>
            <div>
              <div class="itemTitle">账号信息</div>
              <div class="divideCon">
                <div class="divideItem">
                  <CusTable :tableData="tableData4" :key="4"></CusTable>
                </div>
                <div class="divideItem">
                  <CusTable
                    :tableData="tableData5"
                    :key="5"
                    @bindEvent="freezeCompany"
                  ></CusTable>
                </div>
              </div>
            </div>
            <div>
              <div class="itemTitle">基本信息</div>
              <div class="divideCon">
                <div class="divideItem">
                  <CusTable
                    :tableData="tableData6"
                    :key="6"
                    @bindEvent="checkBusinessLicense"
                  ></CusTable>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeName =='second'">
          <Config v-if="mainType == '2'" />
          <Record :userId="data.id" v-if="mainType == '1'"></Record>
        </div>
          <Role :id="nextData.id" v-if="activeName =='third'"> </Role>
          <div v-if="activeName =='fourth'">
            <div>
              <div class="tableCon">
                <el-table
                  :data="tableData22"
                  border
                  style="width: 100%; margin-top: 20px"
                >
                  <el-table-column prop="id" label="用户ID"></el-table-column>
                  <el-table-column prop="id" label="姓名"></el-table-column>
                  <el-table-column prop="id" label="性别"></el-table-column>
                  <el-table-column prop="id" label="年龄"></el-table-column>
                  <el-table-column prop="id" label="手机号"></el-table-column>
                  <el-table-column prop="id" label="实名认证"></el-table-column>
                  <el-table-column prop="id" label="打卡照片"></el-table-column>
                  <el-table-column prop="id" label="账号状态"></el-table-column>
                  <el-table-column prop="id" label="操作">
                    <template v-slot="scope">
                      <el-button type="text" size="small">详 情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <SkillTag :id="nextData.id" v-if="activeName == 'fifth'"></SkillTag>
          <Attr :id="nextData.id" v-if="activeName == 'eight'"></Attr>
          <div v-if="activeName == 'sixth'">
            <CropInfo />
          </div>
          <div v-if="activeName == 'seventh'">
            <Account />
          </div>
          <div v-if="activeName == 'ninth' ">
              <Function/>
          </div>
          <div v-if="activeName=='tenth'">
                <Online/>
            </div>
      </div>
      <el-dialog
        title="提示"
        class="setFreezeScoped"
        :visible.sync="freezeVisible"
        :close-on-click-modal="false"
        width="450px"
        center
      >
        <div class="freezeConDialog">
          <div>确定{{ freezeDialogMap[freezeStatus] }}该商家？</div>
          <div class="flexHere">
            <el-button
              type="primary"
              size="small"
              class="sameWidthBtn"
              @click="confirmFreeze"
              :center="true"
              >确 定
            </el-button>
            <el-button
              type="info"
              size="small"
              class="sameWidthBtn"
              @click="cancelFreeze"
              >取 消
            </el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        title="填写企业信息"
        class="setCompanyScoped"
        :visible.sync="Upgradecompany"
        :close-on-click-modal="false"
        width="450px"
        v-if="this.mainType !== 1"
      >
        <div>
          <el-form
            :model="companyForm"
            status-icon
            ref="companyForm"
            class="demo-ruleForm"
            :rules="companyRules"
          >
            <div class="companyFormCon">
              <el-form-item prop="name">
                <el-input
                  v-model.trim="companyForm.name"
                  size="small"
                  placeholder="请输入公司全称"
                  clearable
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="shortName">
                <el-input
                  v-model.trim="companyForm.shortName"
                  size="small"
                  placeholder="请输入公司简称（限制六个字）"
                  clearable
                  autocomplete="off"
                  maxlength="6"
                ></el-input>
              </el-form-item>
              <el-form-item prop="creditCode">
                <el-input
                  v-model.trim="companyForm.creditCode"
                  size="small"
                  placeholder="请输入统一社会信用代码"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="legalPerson">
                <el-input
                  v-model.trim="companyForm.legalPerson"
                  size="small"
                  placeholder="请输入公司法人姓名"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="Industry">
                <el-select
                  size="small"
                  class="lockSelectItem"
                  placeholder="行业"
                  v-model.trim="companyForm.Industry"
                >
                  <el-option
                    v-for="item in primaryIndustry"
                    :key="item.dicVal"
                    :label="item.dicName"
                    :value="item.dicVal"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="trinity">
                <div class="flexCurrentItem">
                    <el-select size="small" class="threeSections" v-model.trim="companyForm.province" placeholder="所在省" @change="provienceChange">
                    <el-option v-for="item in provinceList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal"></el-option>
                </el-select>  
                    <el-select size="small" class="threeSections" v-model.trim="companyForm.city" placeholder="所在市" @change="cityChange">
                    <el-option v-for="item in cityList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal"></el-option>
                </el-select>  
                    <el-select size="small" class="threeSections" v-model.trim="companyForm.region" placeholder="所在县/区">
                    <el-option v-for="item in regionList" :key="item.dicVal" :label="item.dicName" :value="item.dicName"></el-option>
                  </el-select>  
                </div>                                 
              </el-form-item> 
              <el-form-item prop="address">
                <el-input
                  v-model.trim="companyForm.address"
                  size="small"
                  placeholder="请输入详细地址"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="businessLicense" label="营业执照" >
                <el-upload class="avatar-uploader"  :class="{'show-uploader':companyForm.businessLicense}"
                    action="//upload.qiniu.com/"
                    :on-preview="handlePictureCardPreview"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleRemove"
                    :data="upload_form"
                    :file-list="fileList"
                     :limit="1" 
                    :on-exceed="handleExceed"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="companyForm.businessLicense" :src="companyForm.businessLicense" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                </el-upload>
              </el-form-item>
            </div>
            <div class="flexHere btnMargin">
              <el-button
                type="primary"
                size="small"
                class="sameWidthBtn"
                @click="submitCompanyPass('companyForm')"
                >确 定</el-button
              >
              <el-button
                type="info"
                size="small"
                class="sameWidthBtn"
                @click="cancelCompanyPass('companyForm')"
                >取 消</el-button
              >
            </div>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible" class="setRoot3Scoped setMiddleDialog">
        <img width="50%" :src="companyForm.businessLicense">
      </el-dialog>
    </div>
  </div>
</template>
<script>
    import Role from './components/role'
    import CropInfo from './sub/cropInfo.vue'
    import Config from './sub/config.vue'
    import Account from './sub/account.vue'
    import Attr from './components/attribute'
    import SkillTag from './components/skillTag'
    import Function from './sub/function.vue'
    import Record from './components/record';
    import Online from './components/online'

export default {
  name: 'businessDetail',
  components: { Role, Attr, CropInfo, Account, SkillTag, Config,Function,Online },
  data() {
    var validatePass = (rule, value, callback) => {
      if( !this.companyForm.province  ||  !this.companyForm.region || !this.companyForm.city){
        callback(new Error('省、市、区 请填写完整'));
      }else{
          callback();
      }
      
    }
    var validateImg = (rule, value, callback) => {
      let flag1 = this.companyForm.businessLicense
      if (!flag1) {
        callback(new Error('请上传营业执照!'))
      } else {
        callback()
      }
    }
    return {
      user: '',
      data: '', // router 参数
      freezeVisible: false,
      Upgradecompany: false, // 个人升级企业 弹出层控制
      loading: true,
      radio2: 3,
      radio3: 3,
      freezeStatus: '2',
      freezeDialogMap: {
        1: '冻结',
        2: '启用',
      },
      activeName: '',
      name: '',
      restTabArr: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      tableData6: [],
      tableData7: [],
      tableData22: [],
      mainId: '',
      mainType: '1',
      companyBusinessLicense: '',
      nextData: {},
      provinceList: [], //   省
      cityList: [], // 市
      regionList: [], // 区
      primaryIndustry : [], // 一级行业
      dialogVisible: false,
      // 表单数据
      companyForm: {
        userId: '',
        type: this.$route.query.type,
        mobile:'',
        realName:'',
        idCard:'',
        name: '',
        shortName: '',
        creditCode: '',
        legalPerson: '',
        Industry: '',
        province: '',
        city: '',
        region: '',
        address: '',
        businessLicense: '',
      },
      dialogImageUrl: '', // 图片展示地址
      // 图片上传
      bucketHost: 'http://img.10000rc.com/',
      fileList: [],
      upload_form: {},
      // 水印后缀
      watermark: '',
      // 校验信息
      companyRules: {
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        idNumber: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
        ],
        creditCode: [
          {
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur',
          },
        ],
        name: [
          { required: true, message: '请输入公司全称', trigger: 'blur' },
        ],
        shortName: [
          { required: true, message: '请输入公司简称', trigger: 'blur' },
        ],
        legalPerson: [
          { required: true, message: '请输入公司法人姓名', trigger: 'blur' },
        ],
        Industry: [
          {
            required: true,
            message: '请选择所在行业',
            trigger: ['blur', 'change'],
          },
        ],
        trinity: [
          { validator: validatePass, trigger: ['blur', 'change'],}
        ],
        businessLicense: [
          { required: true, message: '营业执照不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        imgUpload: [{ validator: validateImg, trigger: 'change' }],
      },
    }
  },
  created(){
    this.data = this.$route.query
  },
  mounted() {
    this.getwatermark() // 水印地址
    this.sonNode()  // 获取一级行业类目
    this.analyseQuery()
    this.requestInfo()
  },
  methods: {
    // 升级公司表单控制方法
    Company() {
      this.Upgradecompany = true
      this.fileList = [];
      this.imgForUpload = '';
      this.getProvince()
      this.getToken();
      this.$nextTick(()=>{
          this.$refs.companyForm.resetFields();
      });
    },
    // 触发
    provienceChange(){
      this.getCity();
      this.companyForm.city = '';
      this.companyForm.region = '';
    },
    // 触发
    cityChange(){
      this.getRegion();
      this.companyForm.region = '';
    },
    // 获取省
    async getProvince() {
        let params = {
            code:'city',
            value:'0',
        };
        await this.ApiLists.getDicList(params).then(res=>{
              let { data,respCode } = res;
              if( respCode === 0 ){
                  this.provinceList = data;
              }
          }).catch(err=>{
              console.log('err',err);
          })
    },
    // 获取城市
    async getCity() {
      let params = {
          code:'city',
          value:this.companyForm.province,
      };
      await this.ApiLists.getDicList(params).then(res=>{
          let { data,respCode } = res;
          if( respCode === 0 ){
              this.cityList = data;
          }
      }).catch(err=>{
          console.log('err',err);
      })
    },
    // 区域联动县
    async getRegion() {
      let params = {
          code:'city',
          value:this.companyForm.city,
      };
      await this.ApiLists.getDicList(params).then(res=>{
          let { data,respCode } = res;
          if( respCode === 0 ){
              this.regionList = data;
          }
      }).catch(err=>{
          console.log('err',err);
      })
    },
    // 水印接口
     getwatermark() {
       let params = {
         paramName: 'watermark_param',
       }
       this.ApiLists.waterMark(params)
         .then((res) => {
           this.watermark = res.data
         })
         .catch((err) => {
           console.log('err', err)
         })
     },
    // 获取token 信息
    getToken() {
      this.ApiLists.cowToken().then(res => {
          let {data, respCode} = res;
          if (respCode === 0) {
              this.upload_form = {
                  key: data.fileName,
                  token: data.upToken,
              };
          }
      }).catch(err => {
          console.log('err', err);
      })
    },
    // 行业
    sonNode(){
      let params = {
        pId:28231
      }    
      this.ApiLists.getSonNodeByParentId(params).then(res=>{
        this.primaryIndustry = res.data
      })
    },
    // 提交逻辑
    submitCompanyPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //  处理v-mould 绑定的id 转化为文字
          let provinceObj = this.provinceList.find(ele=>{
              return ele.dicVal == this.companyForm.province;
          });
          let cityObj = this.cityList.find(ele=>{
              return ele.dicVal == this.companyForm.city;
          });
          // let regionObj = this.cityList.find(ele=>{
          //     return ele.dicVal == this.companyForm.region;
          // });
          let data = {
            userId : this.user.userId,
            type : this.companyForm.type,
            mobile : this.user.mobile,
            realName : this.user.realName,
            idCard : this.user.idCard,
            name: this.companyForm.name,
            shortName: this.companyForm.shortName,
            creditCode: this.companyForm.creditCode,
            legalPerson: this.companyForm.legalPerson,
            Industry: this.companyForm.Industry,
            province : provinceObj.dicName,
            city : cityObj.dicName,
            region: this.companyForm.region,
            address: this.companyForm.address,
            businessLicense: this.companyForm.businessLicense,
            
          }
          this.ApiLists.personaLupgrade(data).then(res => {
            let { respCode } = res;
            if(respCode === 0){
              this.Upgradecompany = false
              this.$message({
                message: '升级成功',
                type: 'success'
              });
            }
          }).catch(err => {
              console.log('err', err);
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消逻辑
    cancelCompanyPass(formName) {
      this.$refs[formName].resetFields()
      this.Upgradecompany = false
    },
    // 图片上传相关
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
            this.$message.error('上传图片只能是 JPG 或PNG格式!');
        }
        if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M && (isPNG || isJPG);
    },
    //  查看上传图片详情
    handlePictureCardPreview(file){
        this.dialogVisible = true;
    },
    // 增加水印
    handleAvatarSuccess(res, file) {
      const key = res.key
      const bucketHost = this.bucketHost
      const watermark = this.watermark
      this.companyForm.businessLicense = `${bucketHost}${key}${watermark}`
      this.$refs.companyForm.validateField('businessLicense')
      this.getToken()
    },
    handleRemove(file, fileList) {
        this.companyForm.businessLicense = "";
        this.fileList = [];
        this.getToken()
        this.$forceUpdate();
        this.$refs.companyForm.validateField('businessLicense');
    },
    handleExceed(files, fileList) {
      this.$message.warning(`请删除当前文件再重新上传！`)
    },
    // 冻结弹窗
    freezePersonal() {
      this.freezeVisible = true
    },
    freezeCompany() {
      this.freezeVisible = true
    },
    confirmFreeze() {
      let params = {
        cusId: this.$route.query.id,
      }
      this.ApiLists.toggleFrozenCustomer(params)
        .then((res) => {
          let { data, respCode } = res
          if (respCode === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            this.freezeVisible = false
            this.requestInfo()
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    cancelFreeze() {
      this.freezeVisible = false
    },
    checkBusinessLicense() {
      window.open(this.companyBusinessLicense)
    },
    requestInfo() {
      let params = {
        id: this.mainId,
      }
      this.ApiLists.businessCustomerDetail(params)
        .then((res) => {
          this.user = res.data
          let { data, respCode } = res
          if (respCode === 0) {
            this.nextData = data
            switch (this.mainType) {
              case '1':
                this.tableData1 = [
                  { title: '账号ID', value: data.userId },
                  {
                    title: '账号类型',
                    value: '个人商家',
//                    btnShow: data.type == 1 ? true : false,
                      btnShow: this.AuthBoolean('62201'),
                    btnText: '升级为企业商家',
                    highLight: true,
                  },
                ]
                this.tableData2 = [
                  { title: '绑定手机号', value: data.mobile },
                  {
                    title: '账号状态',
                    value: data.status == '1' ? '正常' : '冻结',
                    btnShow: this.AuthBoolean('62'),
                    btnText: data.status == '1' ? '冻 结' : '启 用',
                    highLight: true,
                  },
                ]
                this.freezeStatus = data.status
                this.tableData3 = [
                  { title: '姓名', value: data.realName },
                  { title: '身份证号', value: data.idCard },
                ]
                break
              case '2':
                let picData = {
                  background: data.background || '',
                  logo: data.logo || '',
                }
                sessionStorage.setItem(
                  'tempPicsSucker',
                  JSON.stringify(picData)
                )
                this.freezeStatus = data.status
                this.companyBusinessLicense = data.businessLicense
                this.tableData4 = [
                  { title: '账号ID', value: data.userId },
                  { title: '账号类型', value: '企业商家' },
                ]
                this.tableData5 = [
                  { title: '绑定手机号', value: data.mobile },
                  {
                    title: '账号状态',
                    value: data.status == '1' ? '正常' : '冻结',
                    btnShow: this.AuthBoolean('63'),
                    btnText: data.status == '1' ? '冻 结' : '启 用',
                    highLight: true,
                  },
                ]
                this.tableData6 = [
                  { title: '公司简称', value: data.shortName },
                  { title: '公司全称', value: data.name },
                  { title: '统一社会信用代码', value: data.creditCode },
                  {
                    title: '公司所在地',
                    value: `${data.province ? data.province : ''}${
                      data.city ? data.city : ''
                    }${data.region ? data.region : ''}${
                      data.address ? data.address : ''
                    }`,
                  },
                ]
                if (this.AuthBoolean('64')) {
                  this.tableData6.push({
                    title: '营业执照',
                    btnShow: true,
                    btnText: '查 看',
                  })
                }
                this.tableData7 = [
                  { title: '联系人姓名', value: data.realName },
                  { title: '联系人身份证号', value: data.idCard },
                  { title: '法人姓名', value: data.legalPerson },
                  { title: '行业', value: data.industryName },
                ]
                if (this.AuthBoolean('64')) {
                  this.tableData7.push({})
                }
                break
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    analyseQuery() {
      let { id, type, name } = this.$route.query
      this.mainId = id
      this.name = name
      this.mainType = type
      switch (type) {
        case '1':
          let empty = []
          if (this.AuthBoolean('23')) {
            empty.push({
              title: '商家信息',
              name: 'first',
            })
          }
          if (this.AuthBoolean('23')) {
            empty.push({
              title: '操作记录',
              name: 'second',
            })
          }
          this.restTabArr = empty
          if (this.restTabArr.length) {
            this.activeName = this.restTabArr[0].name
          }
          break
        case '2':
          let empty2 = []
          if (this.AuthBoolean('31')) {
            empty2.push({
              title: '商家信息',
              name: 'first',
            })
          }
          console.log()
          if (this.AuthBoolean('32')) {
            empty2.push({
              title: '服务配置',
              name: 'second',
            })
          }
          if (this.AuthBoolean('35')) {
            empty2.push({
              title: '账号管理',
              name: 'seventh',
            })
          }
          if (this.AuthBoolean('36')) {
            empty2.push({
              title: '角色管理',
              name: 'third',
            })
          }
          if (this.AuthBoolean('34')) {
            empty2.push({
              title: '企业信息',
              name: 'sixth',
            })
          }
          if (this.AuthBoolean('37')) {
            empty2.push({
              title: '属性配置',
              name: 'eight',
            })
          }
          if (this.AuthBoolean('33')) {
            empty2.push({
              title: '技能标签',
              name: 'fifth',
            })
          }
            if( this.AuthBoolean('3701') ){
                empty2.push({
                    title: '功能配置',
                    name: 'ninth'
                })
            }
            if( this.AuthBoolean('38') ){
                empty2.push({
                    title: '线上发放配置',
                    name: 'tenth'
                })
            }
          this.restTabArr = empty2
          // this.restTabArr = [
          //     {title: '服务配置', name: 'second'},
          //     {title: '账号管理', name: 'seventh'},
          //     { title:'角色管理',name:'third' },
          //     {title: '企业信息', name: 'sixth'},
          //     { title:'属性配置',name:'eight' },
          //     { title:'用户角色管理',name:'third' },
          //     {title: '黑名单', name: 'fourth'},
          //     {title: '技能标签', name: 'fifth'}
          //   ];
          if (this.restTabArr.length) {
            this.activeName = sessionStorage.getItem('cropSwitchItem') || this.restTabArr[0].name
          }
          break
      }
    },
    handleClick(tab, event) {
      sessionStorage.setItem('cropSwitchItem', this.activeName)
      if (this.activeName == 'first') {
        this.analyseQuery()
        this.requestInfo()
      }
    },
  },
}
</script>
<style scoped lang="scss">
.businessDetailCon {
  background-color: #fff;
  padding: 30px;
  box-sizing: border-box;
  
  .pagCon {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .divideCon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .divideItem {
      width: 49%;
    }
  }
  .nameColor {
    color: #303133;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .itemTitle {
    color: #606266;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 10px;
    font-weight: 500;
  }
  .flexHere {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .freezeConDialog {
    text-align: center;
  }
}
// 弹出层个人升级为企业
.businessDetailCon {  
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
    .businessDetailCon {
     .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
</style>
