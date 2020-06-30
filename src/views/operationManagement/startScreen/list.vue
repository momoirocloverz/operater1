
<template>
    <div class="startScreenCon" v-loading="loading" >
        <div class="topCon">
            <div class="topSec flex-box flex-align">
                <div>
                    <span  class="portText  mr20">端口</span>
                    <el-select size="small" class="lockWidth" v-model="port" @change="changeNow"  placeholder="端口">
                        <el-option v-for="(item,index) in options2" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-button size="mini" type="primary" v-Auth="'65401'" @click="addPop">添加广告</el-button>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="createdAt" min-width="90" label="添加时间"></el-table-column>
                    <el-table-column prop="company" label="广告图片" width="">
                        <template v-slot="scope">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    class="el-table-row-image"
                                    :src="scope.row.image"
                                    :preview-src-list="[scope.row.image]">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column :formatter="forJumpWay" label="跳转路径" show-overflow-tooltip></el-table-column>
                    <el-table-column label="上架端口" :formatter="forDevice" show-overflow-tooltip></el-table-column>
                    <el-table-column :formatter="forStatus" label="上架状态" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="140" show-overflow-tooltip v-if="AuthBoolean(['65402'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" @click="upperShelf(scope.row)" v-Auth="'65402'">{{ scope.row&&scope.row.status == 0 ? '上架' : '下架'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-show="pageTotal">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加广告页" class="setRoot1Scoped setMiddleDialog" :visible.sync="dialogUpdateVisible" width="450px" center :before-close="cancel">
            <el-form :model="inforForm" :rules="rules" style="padding-right:20px" ref="inforForm" label-width="100px">
                <div class="hiddenUgly">
                <el-form-item prop="imageUrl" label="广告图片" >
                    <el-upload class="avatar-uploader"  :class="{'show-uploader':inforForm.imageUrl}"
                            action="//upload.qiniu.com/"
                            :on-preview="handlePictureCardPreview"
                            :on-success="handleAvatarSuccess"
                            :on-remove="handleRemove"
                            :data="upload_form"
                               list-type="picture-card"
                            :file-list="fileList"
                            :limit="1" :on-exceed="handleExceed"
                            :before-upload="beforeAvatarUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="port" label="端口" >
                    <el-select v-model="inforForm.port" size="small" placeholder="请选择">
                        <el-option v-for="(item,index) in options1" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="jump" label="跳转方式">
                    <el-select v-model="inforForm.jump" size="small" placeholder="选择跳转方式">
                        <el-option label="静态页" :value="1"></el-option>
                        <el-option label="html5页面" :value="2"></el-option>
                        <el-option label="功能模块" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="url" label="跳转地址" v-if="inforForm.jump !== 1">
                    <el-input type="text" size="small" class="el-input-width" placeholder="请输入页面链接" v-model="inforForm.url"></el-input>
                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer pb20 flex-box flex-center align-item-center" style="">
                <div class="pr20 ml20">
                    <el-button class="wh-1" type="info" @click="cancel">取 消</el-button>
                    <el-button class="wh-1" type="primary" :disabled="subAble" @click="submitDanger">{{params.btnText}}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" class="setRoot3Scoped setMiddleDialog">
            <img width="50%":src="inforForm.imageUrl">
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'detail',
        data() {
            let validateUrl = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('跳转地址不能为空'));
                }
                setTimeout(() => {
                    if(this.inforForm.jump === 2){
                        if (value.indexOf('https://') != -1 || value.indexOf('http://') != -1){
                            callback();
                        } else {
                            callback(new Error('请在地址前加入http://或者https://'));
                        }
                    }
                    callback();
                },500);
            };
            return {
                subAble:false,
                options2: [
                    {name:'不限',value:''},
                    {name:'个人版APP',value:'2'},
                    {name:'企业版APP',value:'1'}
                ],
                options1: [
                    {name:'个人版APP',value:'2'},
                    {name:'企业版APP',value:'1'}
                ],
                port:'',
                inforForm:{
                    jump:'',
                    port:'',
                    url:'',
                    imageUrl:'',
                },
                bucketHost:'http://img.10000rc.com/',
                dialogUpdateVisible:false,
                dialogVisible:false,
                currentPage: 1,
                tableData: [],
                pageTotal: 0,
                loading: false,
                rules:{
                    port:[{required: true, message: '端口不能为空', trigger: 'change' }],
                    jump:[{required: true, message: '跳转方式不能为空', trigger: 'change' }],
                    url:[{required: true, message: '跳转地址不能为空', trigger: 'blur' },{validator: validateUrl, trigger: 'blur' }],
                    imageUrl:[{required: true, message: '广告图片不能为空', trigger: 'change' }],
                },
                params:{
                    title:'添加广告',
                    btnText:'确认添加',
                },
                actionText:'上架',
                fileList: [],
                upload_form: {},
                pageSize:20,
            }
        },
        mounted() {
            this.fetchList()
        },
        methods: {
            jump(url){
                if(url.indexOf('https://') > -1 || url.indexOf('http://') > -1){
                    window.open(url)
                }else{
                    window.open(`http://${url}`)
                }
            },
            upperShelf(row){
                this.ApiLists.toggleAdvertisementPage({
                    id:row.id
                }).then(res => {
                    let {data, respCode} = res;
                    if (respCode === 0) {
//                        this.port = '2';
                        this.currentPage = 1;
                        this.fetchList()
                    }
                }).catch(err => {
                    console.log('err', err);
                })
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
                this.inforForm.imageUrl = `${bucketHost}${key}`;
                this.$refs.inforForm.validateField('imageUrl');
            },
            handlePictureCardPreview(file){
                this.dialogVisible = true;
            },
            handleRemove(file, fileList) {
                this.inforForm.imageUrl = "";
                this.fileList = [];
                this.getToken()
                this.$forceUpdate();
                this.$refs.inforForm.validateField('imageUrl');
            },
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
            confirmAction(){
                let params = {
                    device:this.inforForm.port,
                    jumpWay:this.inforForm.jump,
                    jumpUrl:this.inforForm.jump == 1 ? "" : this.inforForm.url,
                    image:this.inforForm.imageUrl,
                };
                this.subAble = true;
                this.ApiLists.advertisementPageAdd(params).then(res => {
                    if(res.respCode === 0){
                        this.$message.success('新增成功!')
//                        this.port = '2';
                        this.currentPage = 1;
                        this.fetchList()
                        this.$nextTick(()=>{
                            this.cancel()
                        })
                    }
                }).catch(err=>{
                    console.log('err',err);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.subAble = false;
                    },500)
                })
            },
            submitDanger(){
                this.$refs.inforForm.validate((valid)=>{
                    if(valid){
                        this.confirmAction();
                    }else{
                        return false
                    }
                })
            },
            addPop(){
                this.getToken()
                this.dialogUpdateVisible = true;
                this.$nextTick(()=>{
                    this.$refs['inforForm'].resetFields();
                });
            },
            cancel(){
                this.dialogUpdateVisible = false;
                this.$refs['inforForm'].resetFields()
                this.fileList = [];
            },
            forStatus(row,col){
                if( row&&row.status ){
                    switch (row.status){
                        case 1:
                            return '已上架';
                            break;  
                    }
                }else{
                    if( String(row.status) ){
                        if( String(row.status) ){
                            return '已下架';
                        }else{
                            return '-'; 
                        }
                    }
                }
            },
            forDevice(row,col){
                if( row&&row.device ){
                    switch (row.device){
                        case 1:
                            return '企业版APP';
                            break;
                        case 2:
                            return '个人版APP';
                            break;  
                    }
                }else{
                    return '-';
                }
            },
            forJumpWay(row,col){
                if( row&&row.jumpWay ){
                    switch (row.jumpWay){
                        case 1:
                            return '静态页';
                            break;
                        case 2:
                            return 'html5页面';
                            break;  
                        case 3:
                            return '功能模块';
                            break;  
                    }
                }else{
                    return '-';
                }
            },
            changeNow(val){
                this.currentPage = 1;
                this.fetchList()
            },
            fetchList() {
                this.loading = true;
                let params = {
                    device:this.port,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                };
                this.ApiLists.fetchAdvertisementPage(params).then(res => {
                    if (res.respCode === 0) {
                        this.tableData = res.data.list ? res.data.list : []
                        this.pageTotal = res.data.total ? res.data.total : 0
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.loading = false;
                },300)
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.fetchList()
            },
        },
    }
</script>
<style lang="scss">
    .startScreenCon{
        .topCon {
            .lockWidth {
                width: 200px;
                margin-right: 10px;
            }
            .topSec {
                margin-top: 15px;
            }
            .portText {
                font-size: 14px;
                color: #909399;
            }
        }
        .setRoot3Scoped {
            img {
                margin: 0 auto;
                display: block;
            }
            .el-dialog {
                height: 600px;
            }
        }
        .setRoot1Scoped {
            .hiddenUgly {
                overflow: hidden;
                height: 420px;
            }
            .el-dialog {
                height: 600px;
            }
            .el-select {
                width: 100%;
            }
            .el-input {
                width: 100%;
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
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: block;
        }
        .show-uploader .el-upload{
            display: none;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 148px;
            height: 148px;
            line-height: 148px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>