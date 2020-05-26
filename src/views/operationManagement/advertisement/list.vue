<template>
    <div class="adver-wrap" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.title" class="lockWidth" size="small" placeholder="广告名称"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search"  @click="searchData()">搜 索</el-button>
                </div>
            </div>
            <div class="topSec flex-box flex-align">
                <div>
                    <el-select size="small" class="lockWidth" v-model="form.status"
                               @change="changeInsuStatu"
                               placeholder="上架状态">
                        <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" class="lockWidth" v-model="form.user"
                               @change="changeInsuStatu"
                               placeholder="显示用户">
                        <el-option v-for="(item,index) in options1" :key="index" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" class="lockWidth" v-model="form.port"
                               @change="changeInsuStatu"
                               placeholder="上架端口">
                        <el-option v-for="(item,index) in options2" :key="index" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" class="lockWidth" v-model="form.position"
                               @change="changeInsuStatu"
                               placeholder="广告位置">
                        <el-option v-for="(item,index) in options3" :key="index" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button size="mini" type="primary" v-Auth="'651'" @click="addInfor(null,1)">添加广告</el-button>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="createdAt" min-width="90" label="添加时间" width=""></el-table-column>
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
                    <el-table-column prop="name" label="广告名称" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="device" label="上架端口" :formatter="forDevice" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="location" label="广告位置" width="" :formatter="forLocation"></el-table-column>
                    <el-table-column prop="displayObj" label="显示对象" width="" :formatter="forDisplayObj"></el-table-column>
                    <el-table-column prop="jumpWay" label="跳转方式" width="" :formatter="forJumpWay"></el-table-column>
                    <el-table-column prop="" label="跳转地址" width="200">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-if="scope.row.jumpUrl" @click="jump(scope.row.jumpUrl)">{{scope.row.jumpUrl}}</el-button>
                            <span v-else>-</span>
                            <!--<a :href="`http://${scope.row.jumpUrl}`" target="_blank"></a>-->
                        </template>
                    </el-table-column>
                    <el-table-column prop="weights" label="权重" width=""></el-table-column>
                    <el-table-column prop="status" :formatter="forStatus" label="上架状态" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="操作" width="140" show-overflow-tooltip v-if="AuthBoolean(['652','653','654'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-if="scope.row.status === 1" @click="upperShelf(scope.row,0)" v-Auth="'654'">下架</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status === 0" @click="deleteItem(scope.row)" v-Auth="'652'">删除</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status === 0" @click="addInfor(scope.row,2)" v-Auth="'653'">编辑</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status === 0" @click="upperShelf(scope.row)" v-Auth="'654'">上架</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>

        </div>
        <!--广告-->
        <el-dialog :title="params.title" :visible.sync="dialogUpdateVisible" width="680px" center :before-close="cancel">
            <el-form :model="inforForm"  :rules="rules" style="padding-right:20px" ref="inforForm">
                <el-form-item prop="name" label="广告名称" label-width="200px">
                    <el-input type="text" size="small" maxlength="15" class="el-input-width" placeholder="请输入广告名称" v-model="inforForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="port" label="上架端口" label-width="200px">
                    <el-select v-model="inforForm.port" size="small" placeholder="请选择">
                        <!--<el-option label="不限" value="-1"></el-option>-->
                        <el-option label="企业版app-ios" :value="1"></el-option>
                        <el-option label="企业版app-安卓" :value="2"></el-option>
                        <!--<el-option label="个人版app-ios" :value="3"></el-option>-->
                        <!--<el-option label="个人版app-安卓" :value="4"></el-option>-->
                        <!--<el-option label="企业版pc" :value="5"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item prop="user" label="显示对象" label-width="200px">
                    <el-radio-group v-model="inforForm.user">
                        <el-radio :label="1">全部商家</el-radio>
                        <el-radio :label="2">企业商家</el-radio>
                        <el-radio :label="3">个人商家</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="position" label="广告位置" label-width="200px">
                    <el-select v-model="inforForm.position" size="small" placeholder="选择广告位置">
                        <el-option label="banner" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="jump" label="跳转方式" label-width="200px">
                    <el-select v-model="inforForm.jump" size="small" placeholder="选择跳转方式">
                        <el-option label="静态" :value="1"></el-option>
                        <el-option label="html页面" :value="2"></el-option>
                        <el-option label="app内页" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="url" label="跳转地址" label-width="200px" v-if="inforForm.jump !== 1">
                    <el-input type="text" size="small" class="el-input-width" placeholder="请输入页面链接" v-model="inforForm.url"></el-input>
                </el-form-item>
                <el-form-item prop="weight" label="权重" label-width="200px">
                    <el-input type="text" size="small" class="el-input-width" placeholder="请输入0-1000数字" v-model="inforForm.weight"></el-input>
                </el-form-item>
                <el-form-item prop="imageUrl" label="广告图片" label-width="200px">
                    <el-upload
                            class="avatar-uploader"
                            :class="{'show-uploader':inforForm.imageUrl}"
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
                    <el-dialog append-to-body :visible.sync="dialogVisible">
                        <img width="100%" :src="inforForm.imageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer pb20 flex-box flex-center align-item-center" style="">
                <div class="pr20 ml20">
                    <el-button class="wh-1" @click="cancel()">取 消</el-button>
                    <el-button class="wh-1" type="primary" @click="submitDanger()">{{params.btnText}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'detail',
        data() {
            let validateWeight = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('权重不能为空'));
                }
                setTimeout(() => {
                    if (Number.isInteger(Number(value))) {
                        if (value >= 0 && value <= 1000) {
                            callback();
                        } else {
                            callback(new Error('请输入0-1000整数'));
                        }
                    } else {
                        callback(new Error('请输入0-1000整数'));
                    }
                },500);
            };
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
            let validateTitle = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('广告名称不能为空'));
                }
                setTimeout(() => {
                    let reg = /^[\u4E00-\u9FA5]{1,15}$/;
                    let res = reg.test(value);
                    if(res){
                        callback();
                    }else{
                        callback('请输入15个字以内的中文字符');
                    }
                },500);
            };
            return {
                options: [{name:'不限',value:-1},{name:'未上架',value:0},{name:'已上架',value:1}],
                options1: [{name:'不限',value:-1},{name:'全部商家',value:1},{name:'企业商家',value:2},{name:'个人商家',value:3}],
                options3: [{name:'不限',value:-1},{name:'banner',value:1}],
                // ,{name:'个人版app-ios',value:'3'},{name:'个人版app-安卓',value:'4'},{name:'企业版pc',value:'5'}
                options2: [{name:'不限',value:-1},{name:'企业版app-ios',value:'1'},{name:'企业版app-安卓',value:'2'}],
                form: {
                    title:'',
                    startDate: '',
                    endDate: '',
                    status: '',
                    source:'',
                    position:'',
                    user:'',
                    port:''
                },
                inforForm:{
                    position:'',
                    name:'',
                    user:'',
                    jump:'',
                    port:'',
                    weight:'',
                    url:'',
                    imageUrl:'',
                },
                editorContent:'',
                bucketHost:'http://img.10000rc.com/',
                checked:false,
                dialogUpdateVisible:false,
                dialogVisible:false,
                currentPage: 1,
                tableData: [],
                pageTotal: 0,
                totalInfo:{},
                loading: false,
                rules:{
                    name:[{required: true, message: '广告名称不能为空', trigger: 'blur' },{validator: validateTitle, trigger: 'blur' }],
                    port:[{required: true, message: '上架端口不能为空', trigger: 'change' }],
                    user:[{required: true, message: '显示对象不能为空', trigger: 'change' }],
                    position:[{required: true, message: '广告位置不能为空', trigger: 'change' }],
                    jump:[{required: true, message: '跳转方式不能为空', trigger: 'change' }],
                    url:[{required: true, message: '跳转地址不能为空', trigger: 'blur' },{validator: validateUrl, trigger: 'blur' }],
                    weight:[{required: true, message: '权重不能为空', trigger: 'blur' },{validator: validateWeight, trigger: 'blur' }],
                    imageUrl:[{required: true, message: '广告图片不能为空', trigger: 'change' }],
                },
                params:{
                    title:'添加广告',
                    btnText:'确认添加',
                },
                fileList: [],
                upload_form: {},
                pageSize:20
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
        mounted() {
            this.getList()
        },
        methods: {
            deleteItem(row){
                this.$confirm(`确定删除广告[${row.name}]?`, '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true
                }).then(() => {
                    this.ApiLists.delAdvertisement({
                        id:row.id
                    }).then(res => {
                        let {data, respCode} = res;
                        if (respCode === 0) {
                            this.getList()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }).catch(err => {
                        console.log('err', err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            jump(url){
                if(url.indexOf('https://') > -1 || url.indexOf('http://') > -1){
                    window.open(url)
                }else{
                    window.open(`http://${url}`)
                }
            },
            upperShelf(row){
                this.ApiLists.upperAdvertisement({
                    id:row.id
                }).then(res => {
                    let {data, respCode} = res;
                    if (respCode === 0) {
                        this.getList()
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
            },
            handlePictureCardPreview(file){
                this.dialogVisible = true
            },
            handleRemove(file, fileList) {
                this.inforForm.imageUrl = "";
                // this.fileList = [];
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
            submitDanger(){
                let params = {
                    name:this.inforForm.name,
                    device:this.inforForm.port,
                    displayObj:this.inforForm.user,
                    location:this.inforForm.position,
                    jumpWay:this.inforForm.jump,
                    jumpUrl:this.inforForm.jump == 1 ? "" : this.inforForm.url,
                    weights:this.inforForm.weight,
                    image:this.inforForm.imageUrl,
                };
                this.$refs.inforForm.validate((valid)=>{
                    if(valid){
                        if(this.params.type === 1){
                            this.ApiLists.addAdvertisement(params).then(res => {
                                if(res.respCode === 0){
                                    this.$message.success('新增成功!')
                                    this.getList()
                                    this.$nextTick(()=>{
                                        this.cancel()
                                    })
                                }
                            })
                        }else if(this.params.type === 2){
                            params['id'] = this.params.id;
                            this.ApiLists.modifyAdvertisement(params).then(res => {
                                if(res.respCode === 0){
                                    this.$message.success('编辑成功!')
                                    this.getList()
                                    this.$nextTick(()=>{
                                        this.cancel()
                                    })
                                }
                            })
                        }
                    }else{
                        return false
                        // return this.$message.error('处理结果不能为空!')
                    }
                })
            },
            addInfor(row,type){
                this.getToken()
                if(type === 1){
                    this.params = Object.assign({title:'添加广告',btnText:'确认添加',type},row)
                }else if(type === 2){
                    this.params = Object.assign({title:'编辑广告',btnText:'确认修改',type},row)
                    this.inforForm ={
                        position:row.location,
                        name:row.name,
                        user:row.displayObj,
                        jump:row.jumpWay,
                        port:row.device,
                        weight:row.weights,
                        url:row.jumpUrl,
                        imageUrl:row.image,
                    }
                    this.fileList = [{url:row.image}]
                }
                this.dialogUpdateVisible = true;
            },
            cancel(){
                this.dialogUpdateVisible = false;
                this.$refs['inforForm'].resetFields()
                this.fileList = [];
                this.inforForm = {
                    position:'',
                    name:'',
                    user:'',
                    jump:'',
                    port:'',
                    weight:'',
                    url:'',
                    imageUrl:'',
                }
            },
            forStatus(row,col,val){
                if(Number(val) === 0){
                    return '未上架'
                }else if(Number(val) === 1){
                    return '已上架'
                }
            },
            forDevice(row,col,val){
                if(Number(val) === 1){
                    return '企业版app-ios'
                }else if(Number(val) === 2){
                    return '企业版app-安卓'
                }else if(Number(val) === 3){
                    return '个人版app-ios'
                }else if(Number(val) === 4){
                    return '个人版app-安卓'
                }else if(Number(val) === 5){
                    return '企业版pc'
                }else{
                    return ''
                }
            },
            forDisplayObj(row,col,val){
                if(Number(val) === 1){
                    return '全部商家2'
                }else if(Number(val) === 2){
                    return '企业商家3'
                }else if(Number(val) === 3){
                    return '个人商家'
                }else{
                    return ''
                }
            },forLocation(row,col,val){
                if(Number(val) === 1){
                    return 'banner'
                }else{
                    return ''
                }
            },
            forJumpWay(row,col,val){
                if(Number(val) === 1){
                    return '静态'
                }else if(Number(val) === 2){
                    return 'html页面'
                }else if(Number(val) === 3){
                    return 'app内页'
                }else{
                    return ''
                }
            },
            searchData(){
                this.currentPage = 1
                this.getList()
            },
            forCost(cell,col,val){
                if(Number(val) >= 0){
                    return Number(val).toFixed(2)
                }else{
                    return '无'
                }
            },
            changeInsuStatu(val){
                this.currentPage = 1;
                this.getList()
            },
            getList() {
                this.loading = true;
                let params = {
                    apiType:1,
                    displayObj: this.form.user === -1? '' : this.form.user,
                    device:this.form.port === -1? '' : this.form.port,
                    location:this.form.position === -1? '' : this.form.position,
                    name:this.form.title,
                    status:this.form.status === -1 ? "" : this.form.status,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                };
                this.ApiLists.advertisementList(params).then(res => {
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
            handleSizeChange(val) {
                this.currentPage = val
                this.getList()
                this.getTotal()
            },
            handleChangeDateRange(val) {
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
<style lang="scss">
    .adver-wrap{
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
