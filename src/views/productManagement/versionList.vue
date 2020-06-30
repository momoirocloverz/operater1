<template>
    <div class="versionListCon" v-loading="loading">
        <div class="topCon">
            <div class="topFirst" @keyup.enter="searchAction">
                <div>
                    <el-input v-model="form.versionNo" class="lockWidth" size="small" placeholder="版本号"
                              clearable></el-input>
                    <el-date-picker class="mr15" v-model="daterange" type="daterange" align="right" unlink-panels
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="searchAction"
                                    size="small"></el-date-picker>
                    <el-button type="info" size="small" icon="el-icon-search" @click="searchAction">搜 索</el-button>
                </div>
                <div>
                    <el-button type="primary" size="small" v-Auth="'635'" @click="handleRelease" icon="el-icon-plus">发布版本</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.type" placeholder="更新类型" @change="searchAction">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.system" placeholder="操作系统"
                           @change="searchAction">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" max-height="530" stripe style="width: 100%" emptyText="暂无相关信息">
                    <el-table-column prop="createdAt" label="日期"></el-table-column>
                    <el-table-column prop="appType" label="软件名称">
                        <template v-slot="scope">
                            {{ appMap[scope.row.appType] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="version" label="版本号"></el-table-column>
                    <el-table-column prop="forceUpdate" label="更新类型">
                        <template v-slot="scope">
                            {{ forceMap[scope.row.forceUpdate] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deviceType" label="操作系统" show-overflow-tooltip>
                        <template v-slot="scope">
                            {{ systemMap[scope.row.deviceType] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="appType" label="状态">
                        <template v-slot="scope">
                            {{ statusMap[scope.row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="appType" label="操作" min-width="100">
                        <template v-slot="scope">
                            <el-button type="text" size="small" @click="editHere(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="popConfirm(scope.row)" v-if="scope.row.status != '1'">{{ scope.row.status == 2 ? '开启' : '关闭' }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20"
                               layout="prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <el-dialog title="发布版本" :visible.sync="dialogUpdateVisible" width="500px" center
                   class="setRoot1Scoped setMiddleDialog" :close-on-click-modal="false">
            <el-form :model="inforForm" :rules="rules" ref="inforForm" label-width="100px">
                <div class="itemCon">
                    <el-form-item prop="software" label="选择软件">
                        <el-select v-model="inforForm.software" size="small" placeholder="请选择类型">
                            <el-option label="个人版" :value="2"></el-option>
                            <el-option label="企业版" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="versionNo" label="版本号">
                        <el-input type="text" size="small" maxlength="15" placeholder="版本号"
                                  v-model="inforForm.versionNo"></el-input>
                    </el-form-item>
                    <el-form-item prop="type" label="更新类型">
                        <el-select v-model="inforForm.type" size="small" placeholder="更新类型">
                            <el-option label="诱导更新" value="2"></el-option>
                            <el-option label="强制更新" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="subVersion" label="兼容版本号" v-show="inforForm.type == 2">
                        <el-input type="text" size="small" maxlength="15" placeholder="兼容版本号"
                                  v-model="inforForm.subVersion"></el-input>
                        <div>该兼容版本以前将默认强制更新</div>
                    </el-form-item>
                    <el-form-item prop="system" label="操作系统">
                        <el-select v-model="inforForm.system" size="small" placeholder="操作系统">
                            <el-option label="Ios" :value="1"></el-option>
                            <el-option label="Android" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="releaseUrl" label="上传安装包" v-if="inforForm.system == 2">
                            <div class="uploadCon">
                                <input type="file" ref="input1" accept="application/vnd.android.package-archive" @change="input1Change($event)">
                                <div class="appName" v-if="inforForm.releaseUrl">{{appName}}  <span class="delFileSpan" @click="delNewFile"><i class="el-icon-close"></i></span></div>
                                <el-button v-else size="small" type="primary">上传</el-button>
                            </div>
                    </el-form-item>
                    <el-form-item prop="desc" label="更新说明">
                        <el-input type="textarea" :rows="5" size="small" resize="none" placeholder="请输入本次更新说明"
                                  v-model="inforForm.desc"></el-input>
                    </el-form-item>
                </div>
                <div class="flexHere">
                    <el-button size="small" type="info" @click="cancel('inforForm')">取 消</el-button>
                    <el-button size="small" type="primary" :disabled="addAble" @click="submitForm('inforForm')">发布
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog title="修改版本" :visible.sync="dialogEditVisible" width="500px" center
                   class="setRoot2Scoped setMiddleDialog" :close-on-click-modal="false" >
            <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
                <div class="itemEditCon">
                    <el-form-item prop="software" label="选择软件">
                        <el-select v-model="editForm.software" size="small" placeholder="请选择类型" disabled>
                            <el-option label="个人版" :value="2"></el-option>
                            <el-option label="企业版" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="versionNo" label="版本号">
                        <el-input type="text" size="small" maxlength="15" placeholder="版本号"
                                  v-model="editForm.versionNo"></el-input>
                    </el-form-item>
                    <el-form-item prop="type" label="更新类型">
                        <el-select v-model="editForm.type" size="small" placeholder="更新类型">
                            <el-option label="诱导更新" value="2"></el-option>
                            <el-option label="强制更新" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="subVersion" label="兼容版本号" v-show="editForm.type == 2">
                        <el-input type="text" size="small" maxlength="15" placeholder="兼容版本号"
                                  v-model="editForm.subVersion"></el-input>
                        <div>该兼容版本以前将默认强制更新</div>
                    </el-form-item>
                    <el-form-item prop="system" label="操作系统">
                        <el-select v-model="editForm.system" size="small" placeholder="操作系统" disabled>
                            <el-option label="Ios" :value="1"></el-option>
                            <el-option label="Android" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="releaseUrl" label="上传安装包" v-if="editForm.system == 2">
                        <div class="uploadCon">
                                <input type="file" ref="input2" accept="application/vnd.android.package-archive" @change="input2Change($event)">
                                <div class="appName" v-if="editForm.releaseUrl">{{appName}}  <span class="delFileSpan" @click="del2NewFile"><i class="el-icon-close"></i></span></div>
                                <el-button v-else size="small" type="primary">上传</el-button>
                            </div>
                    </el-form-item>
                    <el-form-item prop="desc" label="更新说明">
                        <el-input type="textarea" :rows="5" size="small" resize="none" placeholder="请输入本次更新说明"
                                  v-model="editForm.desc"></el-input>
                    </el-form-item>
                </div>
                <div class="flexHere">
                    <el-button size="small" type="info" @click="cancelEdit('editForm')">取 消</el-button>
                    <el-button size="small" type="primary" :disabled="editAble" @click="submitEditForm('editForm')">确定
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'version',
        data() {
            var validateApk = (rule, value, callback) => {
                if (this.inforForm.releaseUrl) {
                    callback();
                } else {
                    callback('请上传发布包');
                }
            }
            var validateInforSub = (rule, value, callback) => {
                if (this.inforForm.type == 2) {
                    if( this.inforForm.subVersion){
                        callback();
                    }else{
                        callback('兼容版本号不能为空');
                    }
                } else {
                    callback();
                }
            }
            var validateEditApk = (rule, value, callback) => {
                if (this.editForm.releaseUrl) {
                    callback();
                } else {
                    callback('请上传发布包');
                }
            }
            var validateEditSub = (rule, value, callback) => {
                if (this.editForm.type == 2) {
                    if( this.editForm.subVersion){
                        callback();
                    }else{
                        callback('兼容版本号不能为空');
                    }
                } else {
                    callback();
                }
            }
            return {
                addAble: false,
                editAble: false,
                form: {
                    versionNo: '',
                    startDate: '',
                    endDate: '',
                    type: '',
                    system: '',
                },
                loading: true,
                currentPage: 1,
                total: 0,
                inforForm: {
                    versionNo: '',
                    subVersion:'',
                    software: '',
                    system: '',
                    type: '',
                    desc: '',
                    releaseUrl: '',
                },
                daterange: '',
                dialogEditVisible:false,
                dialogUpdateVisible: false,
                appMap: {
                    2: '个人版',
                    1: '企业版'
                },
                appName:'',
                forceMap: {
                    1: '强制更新',
                    2: '诱导更新'
                },
                systemMap: {
                    1: 'Ios',
                    2: 'Android'
                },
                statusMap: {
                    3: '已开启',
                    2: '已关闭',
                    1: '已过期',
                },
                options: [
                    {label: '不限', value: -1},
                    {label: '诱导更新', value: 2},
                    {label: '强制更新', value: 1}
                ],
                bucketHost: 'img.10000rc.com',
                options1: [
                    {label: '不限', value: -1},
                    {label: 'Ios', value: 1},
                    {label: 'Android', value: 2},
                ],
                tableData: [],
                rules: {
                    versionNo: [
                        {required: true, message: '版本号不能为空', trigger: 'blur'}
                    ],
                    subVersion: [
                        { validator: validateInforSub, trigger: 'blur'}
                    ],
                    software: [
                        {required: true, message: '请选择软件', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '请选择更新类型', trigger: 'change'}
                    ],
                    system: [
                        {required: true, message: '请选择操作系统', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: '更新说明不能为空', trigger: 'blur'}
                    ],
                    releaseUrl: [
                        {validator: validateApk, trigger: ['change','blur']},
                    ],
                },
                fileList: [],
                upload_form: {},
                editForm:{
                    versionNo: '',
                    subVersion:'',
                    software: '',
                    system: '',
                    type: '',
                    desc: '',
                    releaseUrl: '',
                },
                editRules:{
                    versionNo: [
                        {required: true, message: '版本号不能为空', trigger: 'blur'}
                    ],
                    subVersion: [
                         { validator: validateEditSub, trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择更新类型', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: '更新说明不能为空', trigger: 'blur'}
                    ],
                    releaseUrl: [
                        {validator: validateEditApk, trigger: ['change','blur']},
                    ],
                },
                editFileList: [],
                editUpload_form: {},
            }
        },
        mounted() {
            this.searchAction();
        },
        methods: {
            input2Change(event){
                var input = event.target;
                this.fileNameAction({
                    fileName:input.files[0].name
                });
                this.appName = input.files[0].name;
                setTimeout(()=>{
                    let formData = new FormData();
                    formData.append('file',input.files[0]);
                    formData.append('key',this.upload_form.key);
                    formData.append('token',this.upload_form.token);
                    this.ApiLists.standAloneUpload(formData).then(res=>{
                        let { data:layer1 } = res;
                        let { key } = layer1;
                        let hi = `http://${this.bucketHost}/${key}`;
                        this.editForm.releaseUrl = hi;
                        this.$refs.input2.value = '';
                        this.$forceUpdate();
                        this.$refs.editForm.validateField('imageUrl');
                    }).catch(err=>{
                        console.log('err',err);
                    })
                },1000)                
            },
            del2NewFile(){
                this.editForm.releaseUrl = '';
                this.$refs.editForm.validateField('imageUrl');
            },
            delNewFile(){
                this.inforForm.releaseUrl = '';
                this.$refs.inforForm.validateField('imageUrl');
            },
            input1Change(event){
                var input = event.target;                
                this.fileNameAction({
                    fileName:input.files[0].name
                });
                this.appName = input.files[0].name;
                 setTimeout(()=>{
                     let formData = new FormData();
                        formData.append('file',input.files[0]);
                        formData.append('key',this.upload_form.key);
                        formData.append('token',this.upload_form.token);
                        this.ApiLists.standAloneUpload(formData).then(res=>{
                            let { data:layer1 } = res;
                            let { key } = layer1;
                            let hi = `http://${this.bucketHost}/${key}`;
                            this.inforForm.releaseUrl = hi;
                            this.$refs.input1.value = '';
                            this.$forceUpdate();
                            this.$refs.inforForm.validateField('imageUrl');
                        }).catch(err=>{
                            console.log('err',err);
                        })
                 },1000)
            },
            popConfirm(row){
                let longText = '开启后,该端app的更新弹窗将恢复展示。';
                let shortText = '';
                if( row.status == 2 ){
                    longText = '开启后,该端app的更新弹窗将恢复展示。';
                    shortText = '开启更新提示';
                }else{
                    longText = '关闭后，该端app的更新弹窗将不会展示。';
                    shortText = '关闭更新提示';
                }                
                this.$confirm(longText, shortText, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass:'el-button--info',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:row.id,
                        status: row.status == 2 ? 3 : 2,
                    };
                    this.ApiLists.toggleAppVersion(params).then(res =>{
                        let { respCode } = res;
                        if(respCode === 0){
                            this.$message({
                                type: 'success',
                                message: '设置成功!'
                            });
                            this.searchAction();
                        }
                    }).catch(err=>{
                        console.log('err',err);
                    })                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            },
            cancelEdit(formName) {
                this.editFileList = [];
                this.$refs[formName].resetFields();
                this.dialogEditVisible = false;
            },
            submitEditForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.editAction();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editAction() {
                let data = {
                    id:  this.editForm.id,
                    forceUpdate: this.editForm.type,
                    detail: this.editForm.desc,
                    downloadUrl: this.editForm.releaseUrl,
                    version: this.editForm.versionNo,
                    subVersion:this.editForm.subVersion,
                };
                this.editAble = true;
                this.ApiLists.appVersionModify(data).then(res => {
                    let {respCode} = res;
                    if (respCode == 0) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.dialogEditVisible = false;
                        this.$refs.editForm.resetFields();
                        this.searchAction();
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        this.editAble = false;
                    }, 500);
                })
            },
            editHere(row){
                this.dialogEditVisible = true;
                this.$nextTick(()=>{
                    this.editFileList = [];
                    this.$refs['editForm'].resetFields();
                    this.editForm = {
                        id:row.id,
                        releaseUrl:row.downloadUrl,
                        versionNo: row.version,
                        software: +(row.appType),
                        system: +(row.deviceType),
                        type: String(row.forceUpdate),
                        desc: row.detail,
                        subVersion:row.subVersion,
                    };
                    if( row.downloadUrl ){
                        let track = row.downloadUrl.split('/');                    
                        this.appName = track[track.length-1] ;
                    }
                });
            },
            searchAction() {
                this.currentPage = 1;
                this.getList();
            },
            getList() {
                let data = {
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                let dateParams = ['start', 'end'];
                if (this.daterange) {
                    dateParams.forEach((ele, index) => {
                        data[ele] = this.daterange[index];
                    });
                }
                if (this.form.versionNo) {
                    data.version = this.form.versionNo
                }
                if (this.form.type && this.form.type != -1) {
                    data.forceUpdate = this.form.type
                }
                if (this.form.system && this.form.system != -1) {
                    data.deviceType = this.form.system
                }
                this.ApiLists.appVersionList(data).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list || [];
                        this.total = res.data.total || 0
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            handleRelease() {
                this.dialogUpdateVisible = true;
                this.$nextTick(()=>{
                    this.$refs['inforForm'].resetFields();
                })
            },
            cancel(formName) {
                this.fileList = [];
                this.$refs[formName].resetFields();
                this.dialogUpdateVisible = false;
            },
            addAction() {
                let data = {
                    appType: this.inforForm.software,
                    deviceType: this.inforForm.system,
                    forceUpdate: this.inforForm.type,
                    detail: this.inforForm.desc,
                    downloadUrl: this.inforForm.releaseUrl,
                    version: this.inforForm.versionNo,
                    subVersion:this.inforForm.subVersion
                };
                this.addAble = true;
                this.ApiLists.appVersionAdd(data).then(res => {
                    let {respCode} = res;
                    if (respCode == 0) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.dialogUpdateVisible = false;
                        this.$refs.inforForm.resetFields();
                        this.searchAction();
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        this.addAble = false;
                    }, 500);
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.addAction();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            fileNameAction(params){
                this.ApiLists.cowSpToken(params).then(res => {
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
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .versionListCon {
        .uploadCon {
            position: relative;
            input {
                position: absolute;
                width: 60px;
                height: 34px;
                left: 0;
                top: 0;
                opacity: 0;
            }
            .appName {
                &:hover .delFileSpan {
                    opacity: 1;
                    cursor: pointer;
                    width: 20px;
                    color: #FF2626;
                }
                .delFileSpan {
                    opacity: 0;
                    width: 0;
                }
            }
            
            
        }
        .itemCon {
            height: 470px;
            overflow-y: scroll;
            overflow-x: hidden;
            width: 100%;
        }
        .itemEditCon {
            height: 510px;
            overflow-y: scroll;
            overflow-x: hidden;
            width: 100%;
        }
        .releaseUrlText {
            font-size: 12px;
            overflow: hidden;
            height: 40px;
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
        .flexHere {
            display: flex;
            justify-content: center;
        }
        .bottomCon {
            .tableCon {
                margin-top: 20px;
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
    .versionListCon {
        .setRoot1Scoped {
            .el-select {
                width: 100%;
            }
            .el-dialog {
                height: 600px;
            }
        }
        .setRoot2Scoped {
            .el-select {
                width: 100%;
            }
            .el-dialog {
                height: 640px;
            }
        }
    }
</style>