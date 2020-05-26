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
                    <el-form-item prop="system" label="操作系统">
                        <el-select v-model="inforForm.system" size="small" placeholder="操作系统">
                            <el-option label="Ios" :value="1"></el-option>
                            <el-option label="Android" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="releaseUrl" label="上传安装包" v-if="inforForm.system == 2">
                        <el-upload class="avatar-uploader" action="//upload.qiniu.com/"
                                   :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess"
                                   :on-remove="handleRemove" :data="upload_form" :file-list="fileList" :limit="1"
                                   :on-exceed="handleExceed" :before-upload="beforeAvatarUpload">
                            <el-button size="small" type="primary">上传</el-button>
                        </el-upload>
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
            return {
                addAble: false,
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
                    software: '',
                    system: '',
                    type: '',
                    desc: '',
                    releaseUrl: '',
                },
                daterange: '',
                dialogUpdateVisible: false,
                appMap: {
                    2: '个人版',
                    1: '企业版'
                },
                forceMap: {
                    1: '强制更新',
                    2: '诱导更新'
                },
                systemMap: {
                    1: 'Ios',
                    2: 'Android'
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
                        {validator: validateApk, trigger: 'blur'},
                    ],
                },
                fileList: [],
                upload_form: {}
            }
        },
        mounted() {
            this.getToken();
            this.searchAction();
        },
        methods: {
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
                this.getToken();
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
                    version: this.inforForm.versionNo
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
            handleAvatarSuccess(res, file) {
                const key = res.key;
                const bucketHost = this.bucketHost;
                this.inforForm.releaseUrl = `http://${this.bucketHost}/${res.key}`;
            },
            handlePictureCardPreview(file) {
                console.log(file)
            },
            handleRemove(file, fileList) {
                this.inforForm.imageUrl = "";
                this.fileList = [];
                this.getToken()
                this.$forceUpdate();
                this.$refs.inforForm.validateField('imageUrl');
            },
            beforeAvatarUpload(file) {
                let isApk = file.type == 'application/vnd.android.package-archive';
                const isLessThan100M = file.size / 1024 / 1024 < 100;
                if (!isApk) {
                    this.$message.error('上传安装包只能是APK格式!');
                }
                if (!isLessThan100M) {
                    this.$message.error('上传安装包大小不能超过 100MB!');
                }
                return isLessThan100M && (isApk);
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
        .itemCon {
            height: 470px;
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
    }
</style>