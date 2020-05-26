<template>
    <div class="insuranceListCon" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="">
                <el-select size="small" class="lockWidth" v-model="company"
                           @change="changeCompany"
                           placeholder="保险公司">
                    <el-option v-for="item in options" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button type="primary" size="small" @click="addInsuraItem" v-Auth="'636'" >新增保险</el-button>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table emptyText="暂无相关信息" :data="tableData"  height="530" stripe style="width: 100%" >
                    <el-table-column prop="id" label="保险ID" align="center" ></el-table-column>
                    <el-table-column prop="insuName" label="保险名称" align="center" ></el-table-column>
                    <el-table-column prop="company" label="保险公司" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="insuPeriod" label="有效时间" :formatter="statusDate" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instruction" label="保额说明" align="center" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="insuFee"  label="成本(元/笔)" show-overflow-tooltip align="center" ></el-table-column>
                    <el-table-column prop="createdAt" label="创建时间" min-width="120" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="保险细则" show-overflow-tooltip align="center" v-if="AuthBoolean('637')">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" @click="handleView(scope.row)">查看细则</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" align="center"  :formatter="statusInsu" label="状态" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" align="center" v-if="AuthBoolean(['638','639'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-if="scope.row.status == 1" @click="handleEdit(scope.row)" v-Auth="'638'">编辑</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status == 1" @click="handleDelete(scope.row)" v-Auth="'639'">下架</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status == 2" @click="handleOpen(scope.row)" v-Auth="'639'">启用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="currentPage" :page-size="20" layout="prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="insuTitle" class="setRoot1Scoped setMiddleDialog" :visible.sync="newVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px"
                         class="demo-ruleForm">
                    <div class="lockHeight" style="overflow-y:auto; height:450px">
                        <el-form-item v-if="newForm.id" label="保险id">
                            <div class="flexForgetItem">
                                {{newForm.id}}
                            </div>
                        </el-form-item>
                        <el-form-item label="保险名称" prop="itemName">
                            <div class="flexForgetItem">
                                <el-input class="shorterItem" maxlength="10" v-model="newForm.itemName"
                                          size="small"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="保险公司" prop="companyName">
                            <div class="flexForgetItem">
                                <el-input class="shorterItem" maxlength="10" v-model="newForm.companyName"
                                          size="small"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="有效时间" prop="companyName">
                            <el-select size="small" class="lockWidth" v-model="newForm.time" placeholder="请选择">
                                <el-option v-for="item in timeOptions" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                            天
                        </el-form-item>
                        <el-form-item label="成本" prop="cost">
                            <div class="flexForgetItem">
                                <el-input class="shorterItem" v-model="newForm.cost" size="small"></el-input>
                                <div>元/笔</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="保额说明" prop="description">
                            <el-input type="textarea" :rows="4" :resize="'none'" maxlength="100"
                                      v-model="newForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="保险明细" prop="picture" required>
                            <el-upload class="upload-demo" action="//upload.qiniu.com/" :on-remove="handleRemove"
                                       :on-preview="handlePreview"
                                       :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="handleExceed"
                                       :on-success="handleAvatarScucess" :file-list="fileList" :data="upload_form">
                                <el-button size="small" type="primary">上传</el-button>
                                <span slot="tip" class="pl10">只支持pdf格式</span>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <el-dialog
                            width="45%"
                            title=""
                            :visible.sync="innerVisible"
                            append-to-body>
                        <div class="" style="height:600px;overflow-y: auto">
                            <embed :src="newForm.picture" type="application/pdf" width="100%" height="100%" internalinstanceid="81" />
                        </div>
                    </el-dialog>
                    <div class="flexHere pt30 pb20">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitNewFormPass('newForm')">创 建
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelNewFormPass('newForm')">取
                            消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>

        <el-dialog
                width="650px"
                :title="newForm.name"
                :visible.sync="viewVisible"
                append-to-body>
            <div class="" style="height:600px;overflow-y: auto">
                <embed :src="newForm.picture" type="application/pdf" width="100%" height="100%" internalinstanceid="81" />
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'insuranList',
        data() {
            let validateImg = (rule, value, callback) => {
                let flag1 = this.newForm.picture;
                if (!flag1) {
                    callback(new Error('请上传保险明细!'));
                } else {
                    callback();
                }
            };
            let checkData = (rule, value, callback) => {
                if (value) {
                    if (!/^[\u4e00-\u9fa5]+$/g.test(value)) {
                        callback(new Error('请输入中文!'));
                    } else {
                        callback();
                    }
                }
                callback();
            }
            let checkNum = (rule, value, callback) => {
                if (value) {
                    if (!/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/.test(value)) {
                        callback(new Error('大于等于0,可小数点后2位!'));
                    } else {
                        callback();
                    }
                }
                callback();
            }
            return {
                total:0,
                timeOptions: [1],
                options: [],
                currentPage:1,
                bucketHost:'http://img.10000rc.com/',
                loading:false,
                tableData: [],
                newVisible: false,
                viewVisible:false,
                innerVisible:false,
                newForm: {
                    id:'',
                    itemName: '',
                    companyName: '',
                    cost: '',
                    time:'',
                    description: '',
                    picture: '',
                    name:'',
                    status:'',
                    uid:'',
                },
                insuTitle:'新增保险',
                company:'',
                newRules: {
                    itemName: [
                        {required: true, message: '请输入保险名称', trigger: 'blur'},
                        { validator: checkData, trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, message: '请输入保险公司', trigger: 'blur'},
                        { validator: checkData, trigger: 'blur'}
                    ],
                    cost: [
                        {required: true, message: '请输入成本', trigger: 'blur'},
                        { validator: checkNum, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入保额说明', trigger: 'blur'},
                        { validator: checkData, trigger: 'blur'}
                    ],
                    picture: [
                        {validator: validateImg, trigger: 'change'},
                    ],
                },
                fileList: [],
                upload_form: {},
            }
        },
        mounted(){
            this.getCompany();
            this.getList()
        },
        methods: {
            statusInsu(cell,row,val){
                if(val== '1'){
                    return `启用中`
                }else if(val == '2'){
                    return `已下架`
                }
            },
            statusDate(cell,row,val){
                if(val >= 0){
                    return `${val}天`
                }else{
                    return '无'
                }
            },
            handleView(row){
                this.newForm.picture = row.rules;
                this.viewVisible = true;
            },
            async getCompany(){
                let data = await this.ApiLists.getInsuCompany();
                this.options = data.data && data.data.length > 0 ? data.data : [];
                this.options.unshift('保险公司');
            },
             changeCompany(val){
                if(val){
                    if(val == '保险公司'){
                        this.company = '';
                    }
                    this.currentPage = 1;
                    this.getList()
                }
            },
            getList(){
                this.loading = true;
                let params = {
                    pageNum:this.currentPage,
                    pageSize:20,
                    company:this.company,
                };
                this.ApiLists.getInsuList(params).then(res =>{
                    if(res.respCode === 0){
                        this.tableData = res.data.list ?  res.data.list : []
                        this.total = res.data.total
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    this.loading = false;
                })
            },
            handleEdit(row){
                this.insuTitle = '编辑保险'
                this.newVisible = true;
                this.fileList = [{url:row.rules,name:row.rulesName}];
                console.log(this.fileList)
                this.newForm = {
                    id:row.id,
                    itemName:row.insuName,
                    companyName:row.company,
                    cost: row.insuFee,
                    time:row.insuPeriod,
                    description:row.instruction,
                    picture:row.rules,
                    status:row.status,
                    name:row.rulesName,
                };
                this.getToken()
            },
            handleDelete(row){
                let text = '下架后,商家设置系统使用费时将无法选择该保险',
                    tip =  `确认下架 ${row.company} - ${row.insuName}?`;
                this.$confirm(text,tip, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true
                }).then(async () => {
                    let data = await this.ApiLists.enableInsu({insuId:row.id,status:2});
                    console.log(data)
                    if(data.respCode === 0){
                        this.$message({
                            type: 'success',
                            message: '下架成功!'
                        });
                        this.getList();
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下架'
                    });
                });
            },
            handleOpen(row){
                let text = '启用后,商家设置系统使用费时可选择保险,启用前请先确认该保险是否真实可购买',
                    tip = `确认启用 ${row.company} - ${row.insuName}?`;
                this.$confirm(text,tip, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true
                }).then(async () => {
                    let data = await this.ApiLists.enableInsu({insuId:row.id,status:1});
                    console.log(data)
                    if(data.respCode === 0){
                        this.$message({
                            type: 'success',
                            message: '启用成功!'
                        });
                        this.getList();
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消启用'
                    });
                });
            },
            handleSizeChange() {
            },
            handleCurrentChange() {
            },
            addInsuraItem() {
                this.insuTitle = '新增保险'
                this.fileList = [];
                this.newVisible = true;
                this.newForm.time = '';
                this.newForm.id = '';
                this.$nextTick(() => {
                    this.$refs.newForm.resetFields();
                });
                this.getToken()
            },
            submitNewFormPass(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let params = {
                            id:this.newForm.id,
                            insuName:this.newForm.itemName,
                            company:this.newForm.companyName,
                            insuPeriod:this.newForm.time,
                            instruction:this.newForm.description,
                            insuFee:this.newForm.cost,
                            rules:this.newForm.picture,
                            rulesName:this.newForm.name,
                            status:this.newForm.newForm
                        }
                        let data = await this.ApiLists.addOrEditInsu(params)
                        console.log(data)
                        if(data.respCode === 0){
                            this.getCompany()
                            this.getList()
                            this.$message.success('操作成功!');
                            this.newVisible = false;
                        }
                    } else {
                        console.log('error submit!!');
                        return this.$message.error('表单填写不正确,请按要求填写');
                    }
                });
            },
            cancelNewFormPass(formName) {
                this.$refs[formName].resetFields();
                this.newVisible = false;
                this.fileList = [];
            },
            async handleAvatarScucess(res, file) {
                const key = res.key;
                const bucketHost = this.bucketHost;
                this.newForm.picture = `${bucketHost}${key}`;
                this.newForm.name = file.name;
                this.newForm.uid = file.uid;
                await this.getToken()
                console.log(this.newForm.picture);
                this.$refs.newForm.validateField('picture');

            },
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
            handleExceed(files, fileList) {
                this.$message.warning(`请删除当前文件再重新上传！`);
            },
            beforeAvatarUpload(file) {
                console.log(file)
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isPdf = file.type === 'application/pdf';
                const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG && !isPNG) {
                //     this.$message.error('上传保险明细只能是 JPG 或PNG格式!');
                // }
                if(!isPdf){
                    this.$message.error('上传保险明细只能是pdf格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传保险明细大小不能超过 2MB!');
                }
                return isLt2M && isPdf;
            },
            handleRemove(file, fileList) {
                this.newForm.picture = "";
                this.$forceUpdate();
                this.getToken()
                this.$refs.newForm.validateField('picture');
            },
            handlePreview(file, fileList) {
                console.log('1');
                this.innerVisible = true;
                this.$forceUpdate();
            },
        },
    }
</script>
<style lang="scss" scoped>
    .insuranceListCon {
        .topCon {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .lockWidth {
                width: 200px;
                margin-right: 10px;
            }
        }

        .flexHere {
            display: flex;
            justify-content: center;
        }

        .flexForgetItem {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;

            .itemBtn {
                margin-right: 20px;
            }

            .shorterItem {
                width: 230px;
                margin-right: 10px;
            }
        }

        .lockHeight {
            height: 450px;
        }

        .bottomCon {
            .tableCon {
            }

            .pagCon {
                display: flex;
                justify-content: center;
                margin-top: 30px;
            }
        }
    }
</style>
<style lang="scss">
    .insuranceListCon {
        .setRoot1Scoped .el-dialog {
            height:620px;
        }
    }
</style>
