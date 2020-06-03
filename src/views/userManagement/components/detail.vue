<template>
    <div class="detailUserList">
        <div class="flex-box flex-align">
            <div class="divideItem">
                <div class="itemTitle">账号信息</div>
                <div class="divideCon">
                    <div class="">
                        <CusTable :tableData="tableData1" @bindEvent="freezePersonal" :key="1"></CusTable>
                    </div>
                </div>
                <div class="picControl">
                    <div class="itemTitle">打卡照片</div>
                    <div class="imgArea">
                        <div>
                            <img :src="info.bestFrame">
                        </div>
                        <div class="btnCon"><el-button type="primary" size="small" v-Auth="'6211'" @click="popEdit">替换</el-button></div>
                    </div>
                </div>
            </div>
            <div class="divideItem">
                <div class="itemTitle">基本信息</div>
                <div class="divideCon">
                    <div class="">
                        <CusTable :tableData="tableData2" @bindEvent="resetPwdFunc" :key="3"></CusTable>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="上传打卡照片" class="setRoot1Scoped setMiddleDialog" :visible.sync="upVisible" width="450px" :close-on-click-modal="false" center>
            <div>
                <el-upload class="upload-demo"  action="//upload.qiniu.com/" :on-remove="handleRemove1" :before-upload="beforeAvatarUpload1" :limit="1" :on-exceed="handleExceed1" :on-success="handleAvatarScucess1" :file-list="fileList1" :data="upload_form1">
                            <div class="imgBlock1" v-if="imageUrl1">
                                <img v-if="imageUrl1" :src="imageUrl1" class="avatar1">
                            </div>                            
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">图片大小限制200K以内</div>
                        </el-upload>
                <div class="flexHere">
                    <el-button type="primary" size="small" @click="uploadAction">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'detailUserList',
        props:{
            userId:{
                default:1
            }
        },
        data() {
            return {
                tableData1: [],
                tableData2: [],
                info:{},
                request:false,
                upVisible:false,
                upload_form1:{},
                imageUrl1:'',
                fileList1:[],
                bucketHost:'img.10000rc.com',
            }
        },
        mounted() {
            this.getInfo()
            this.getToken();
        },
        methods: {
            uploadAction(){
                if( this.imageUrl1 ){
                    this.updateBestFrameAction();
                }else{
                    this.$message.error('图片不能为空!');
                }
            },
            handleRemove1(){
                this.imageUrl1 = '';
                this.getToken();
                this.$forceUpdate();
            },
            beforeAvatarUpload1(file){
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isGif = file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 200 < 1;
                if (!isJPG && !isPNG && !isGif) {
                    this.$message.error('上传只能是图片格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 200K!');
                }
                return isLt2M && (isPNG || isJPG || isGif);
            },
            handleExceed1(){
                this.$message.warning(`请删除当前文件再重新上传！`);
            },
            getToken() {
                this.ApiLists.cowToken().then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.upload_form1 = {
                            key: data.fileName,
                            token: data.upToken,
                        };
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            handleAvatarScucess1(res,file){
                const key = res.key;
                this.imageUrl1 = `http://${this.bucketHost}/${key}`;
                this.getToken()
            },
            popEdit(){
                this.upVisible = true;
                this.imageUrl1 = this.info.bestFrame;
                this.fileList1 = [];
            },
            statusFor(val){
                //1：可用2：冻结
                if(Number(val) === 1){
                    return '正常'
                }else if(Number(val) === 2){
                    return '冻结'
                }
                return '-'
            },
            status(val){
                //1：可用2：冻结
                if(Number(val) === 1){
                    return '冻结'
                }else if(Number(val) === 2){
                    return '解冻'
                }
                return '-'
            },
            updateBestFrameAction(){
                let params = {
                    talentId:this.info.talentId,
                    bestFrame:this.imageUrl1,
                };
                this.ApiLists.updateBestFrame(params).then(res=>{
                    let { respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            type: 'success',
                            message: '设置成功'
                        });
                        this.upVisible = false;
                        this.getInfo()
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            freezePersonal(){
                if(this.info.status == 1){
                    this.$confirm('确定要冻结该账户吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass:'el-button--info',
                        closeOnClickModal:false,
                        type: 'warning'
                    }).then(() => {
                        this.freezeAccount(2)
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消冻结'
                        });
                    });
                }else {
                    this.freezeAccount(1)
                }
            },
            resetPwdFunc(){
                if(this.info.status === 2){
                    return this.$message.error('您的账号已冻结，如有问题，请联系客服咨询!')
                }
                if(this.request){return}
                this.request = true
                this.$confirm('确定要重置该用户密码吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass:'el-button--info',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(() => {
                    this.ApiLists.resetPwd({
                        userId:this.info.userId
                    }).then(res => {
                        if(res.respCode === 0){
                            this.$message({
                                type: 'success',
                                message: '重置密码成功，密码为初始密码!'
                            });
                        }
                    }).finally(() =>{
                        setTimeout(() => {
                            this.request = false
                        },500)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });
            },
            freezeAccount(val){
                let params = {
                    userId:this.info.userId,
                    status:val//1：解冻 2：冻结(Integer)
                }
                this.ApiLists.frozen(params).then(res => {
                    if(res.respCode === 0){
                        this.getInfo()
                        if(val == 2){
                            this.$message({
                                type: 'success',
                                message: '冻结成功!'
                            });
                        }else{
                            this.$message({
                                type: 'success',
                                message: '该账户已解冻!'
                            });
                        }
                    }
                }).catch(err =>{

                }).finally(() => {

                })
            },
            getInfo(){
                this.ApiLists.listTalent({
                    userId:this.userId,
                    pageNum:this.currentPage,
                    pageSize:0,
                }).then(res => {
                    if(res.respCode === 0){
                        this.info = res.data.list[0];
                        this.imageUrl1 = this.info.bestFrame;
                        this.tableData1 = [
                            {title: '账号', value: this.info.userId},
                            {title: '账号类型', value:this.statusFor(this.info.status),btnText:this.status(this.info.status), highLight:false,
                             btnShow:this.AuthBoolean('621')
                            }];
                        this.tableData2 = [
                            {
                                title: '姓名', value: this.info.realNameAlias,
                                btnShow:this.AuthBoolean('622'),
                                btnText:'重置密码'
                            },
                            {title: '身份证号', value:  this.info.idCard, highLight:true}]
                    }
                }).catch(err => {

                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            }
        },
    }
</script>
<style lang="scss" scoped>
    .detailUserList {
        .itemTitle {
            color: #606266;
            font-size: 14px;
            margin-bottom: 10px;
            margin-top: 10px;
            font-weight: 500;
        }
        .divideItem {
            width: 49%;
        }
        .flexHere {
            text-align: center;
            margin-top: 10px;
        } 
        .picControl {
            margin-top: 20px;
            .imgArea {
                width: 500px;
            }
            .btnCon {
                text-align: center;
                margin-top: 20px;
            }
            img {
                width: 500px;
            }
        }
    }
</style>
<style lang="scss">
    .detailUserList {
        .setRoot1Scoped .el-dialog {
            height: 390px;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 192px;
            height: 192px;
            line-height: 192px;
            text-align: center;
        }
        .avatar1 {
            width: 192px;
            height: 192px;
            display: block;
        }
        .el-upload {
             border: 1px dashed #d9d9d9;
             border-radius: 6px;
             cursor: pointer;
             position: relative;
             overflow: hidden;
        }
        .el-upload:hover {
            border-color: #409EFF;
        }
        .upload-demo {
            text-align: center;
        }
    }
</style>