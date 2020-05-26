<template>
    <div class="infor-wrap" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.title" class="lockWidth" size="small" placeholder="资讯标题"
                              clearable></el-input>
                    <el-input v-model="form.source" class="lockWidth" size="small" placeholder="资讯来源"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search"  @click="searchData()">搜 索</el-button>
                </div>
            </div>
            <div class="topSec flex-box flex-align">
                <el-select size="small" class="lockWidth" v-model="form.status"
                           @change="changeInsuStatu"
                           placeholder="上架状态">
                    <el-option v-for="(item,index) in options2" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <el-button size="mini" type="primary" v-Auth="'647'" @click="addInfor(null,1)">添加资讯</el-button>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="createdAt" label="添加时间" width=""></el-table-column>
                    <el-table-column prop="title" label="资讯标题" width="420"></el-table-column>
                    <el-table-column prop="source" label="来源" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="weights" label="权重" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" :formatter="forStatus" label="上架状态" width="" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="操作" width="200" show-overflow-tooltip v-if="AuthBoolean(['648','649','650'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'650'" v-if="scope.row.status === 3" @click="handleToggle(scope.row,2)">下架</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 2" v-Auth="'648'" @click="handleDelete(scope.row)">删除</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 2"  v-Auth="'649'" @click="addInfor(scope.row,2)">编辑</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 2" v-Auth="'650'" @click="handleToggle(scope.row,3)">上架</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="total,prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>

        </div>
        <!--更新资讯-->
        <el-dialog :title="params.title" :visible.sync="dialogUpdateVisible" width="980px" center :before-close="cancel">
            <Editor class="mb20" :content="inforForm.content" ref="childEditor" @getEditor="editorContentFunc"></Editor>
            <el-form :model="inforForm"  :rules="rules" style="padding-right:20px" ref="inforForm">
                <el-form-item v-show="false" prop="content" label="资讯内容" label-width="100px">
                    <el-input type="text" size="small" class="el-input-width-big" placeholder="请输入内容" v-model="inforForm.content"></el-input>
                </el-form-item>
                <el-form-item prop="title" label="资讯标题" label-width="100px">
                    <el-input type="text" size="small" class="el-input-width-big" placeholder="请输入文章标题" v-model="inforForm.title"></el-input>
                </el-form-item>
                <el-form-item prop="source" label="资讯来源" label-width="100px">
                    <el-input type="text" size="small" maxlength="6" class="el-input-width-big" placeholder="请输入资讯来源" v-model="inforForm.source"></el-input>
                </el-form-item>
                <el-form-item prop="weights" label="权重" label-width="100px">
                    <el-input type="text" size="small" class="el-input-width-big" placeholder="请输入0-1000数字" v-model="inforForm.weights"></el-input>
                </el-form-item>
                <el-form-item prop="showPic" label="上传图片" label-width="100px">
                    <el-upload
                            class="avatar-uploader"
                            :class="{'show-uploader':inforForm.showPic}"
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
                        <img width="100%" :src="inforForm.showPic" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <el-dialog append-to-body :visible.sync="editorDialogVisible" width="375px">
                <div class="wang-editor" v-html="editorContent" style="height:500px;overflow-y: auto"></div>
            </el-dialog>
            <div slot="footer" class="dialog-footer pb20 flex-box flex-right align-item-center" style="">
                <div class="pr30" v-show="params.editType === 1"><el-checkbox v-model="inforForm.checked">直接上传</el-checkbox></div>
                <div class="pr20 ml20">
                    <el-button class="wh-1" @click="preEditor()">预 览</el-button>
                    <el-button class="wh-1" type="primary" @click="submitDanger()">{{params.btnText}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Editor from '../../../components/wangEditor'

    export default {
        name: 'detail',
        components:{ Editor },
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
            return {
                options2: [{name:'不限',value:-1},{name:'待上架',value:1},{name:'已下架',value:2},{name:'已上架',value:3}],
                form: {
                    title:'',
                    status: '',
                    source:'',
                },
                inforForm:{
                    title:'',
                    source:'',
                    weights:'',
                    status:1,
                    content:'',
                    showPic:'',
                    checked:false,
                },
                editorContent:'',
                bucketHost:'http://img.10000rc.com/',
                dialogUpdateVisible:false,
                dialogVisible:false,
                editorDialogVisible:false,
                currentPage: 1,
                tableData: [],
                pageTotal: 0,
                loading: false,
                rules:{
                    content:[{required: true, message: '资讯内容不能为空', trigger: 'blur' }],
                    title:[{required: true, message: '资讯标题不能为空', trigger: 'blur' },{required: true,min:5,max:30,message:'请输入5~30个中文字符以内',trigger: 'blur'}],
                    source:[{required: true, message: '资讯来源不能为空', trigger: 'blur' },{required: true,max:10,message:'请输入10个中文字符以内',trigger: 'blur'}],
                    weights:[{required: true, message: '权重不能为空', trigger: 'blur' },{validator: validateWeight, trigger: 'blur' }],
                    showPic:[{required: true, message: '上传图片不能为空', trigger: 'change' }],
                },
                params:{
                    btnText:'确认添加',
                },
                fileList: [],
                upload_form: {},
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
            handleToggle(row,status){
                this.ApiLists.toggleInformation({
                    id:row.id,
                    status:status,
                }).then(res => {
                    let {data, respCode} = res;
                    if (respCode === 0) {
                        this.getList()
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            handleDelete(row){
                this.$confirm(`确定删除资讯[${row.title}]?`, '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true
                }).then(() => {
                    this.ApiLists.delInformation({
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
            editorContentFunc(val){
                this.editorContent = val;
                this.inforForm.content = val;
            },
            addInfor(row,type){
                this.getToken()
                if(type === 1){
                    this.params = Object.assign({btnText:'确认添加',editType:1},row)
                }else if(type === 2){
                    this.params = Object.assign({btnText:'确认编辑',editType:2},row)
                    this.inforForm ={
                        title:row.title,
                        source:row.source,
                        status:row.status,
                        content:row.content,
                        weights:row.weights,
                        showPic:row.showPic || '',
                        checked:row.status == 3 ? true : false,
                    }
                    this.$nextTick(() => {
                        this.$refs.childEditor.setHtml(this.inforForm.content)
                        this.editorContent = this.inforForm.content;
                        this.fileList = row.showPic ? [{url:row.showPic}] : []
                    })
                }
                this.dialogUpdateVisible = true;
            },
            async preEditor(){
                if(this.editorContent){
                    this.editorDialogVisible = true;
                }
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
                this.inforForm.showPic = `${bucketHost}${key}`;
                console.log(this.inforForm.showPic)
            },
            handlePictureCardPreview(file){
                this.dialogVisible = true
            },
            handleRemove(file, fileList) {
                this.inforForm.showPic = "";
                this.getToken()
                this.$forceUpdate();
                this.$refs.inforForm.validateField('showPic');
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
                let content = this.inforForm.content.replace(/.webp/g,".jpg");
                let params = {
                    title:this.inforForm.title,
                    source:this.inforForm.source,
                    weights:this.inforForm.weights,
                    status:this.inforForm.checked ? 3 : 1,
                    content:content,
                    showPic:this.inforForm.showPic,
                }
                this.$refs.inforForm.validate((valid)=>{
                    if(valid){
                        if(this.params.editType === 1){
                            this.ApiLists.addInformation(params).then(res => {
                                if(res.respCode === 0){
                                    this.$message.success('添加成功!')
                                    this.getList()
                                    this.$nextTick(()=>{
                                        this.$refs['inforForm'].resetFields()
                                        this.cancel()
                                    })
                                }
                            })
                        }else if(this.params.editType === 2){
                            params['id'] = this.params.id;
                            this.ApiLists.modifyInformation(params).then(res => {
                                if(res.respCode === 0){
                                    this.$message.success('编辑成功!')
                                    this.getList()
                                    this.$nextTick(()=>{
                                        this.$refs['inforForm'].resetFields()
                                        this.cancel()
                                    })
                                }
                            })
                        }
                    }else{
                        return this.$message.error('处理结果不能为空!')
                    }
                })
            },
            cancel(){
                this.dialogUpdateVisible = false;
                this.fileList = [];
                this.editorContent = null;
                this.inforForm = {
                    title:'',
                    source:'',
                    weights:'',
                    status:1,
                    content:'',
                    showPic:'',
                    checked:false,
                }
                this.$refs.childEditor.setHtml(this.inforForm.content)
            },
            forStatus(row,col,val){
                //1.待上架2.已下架3.已上架）
                if(Number(val) === 1){
                    return '待上架'
                }else if(Number(val) === 2){
                    return '已下架'
                }else if(Number(val) === 3){
                    return '已上架'
                }else{
                    return '-'
                }
            },
            searchData(){
                this.currentPage = 1;
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
                    title: this.form.title,
                    source: this.form.source,
                    status:this.form.status === -1 ? "" : this.form.status,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                this.ApiLists.informationList(params).then(res => {
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
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss">
    .infor-wrap{
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
