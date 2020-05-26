<template>
    <div class="cropInfoCon">
        <div class="limitWidth">
            <div class="topCon">
                <div class="leftPart">
                    <div class="upoadCon">
                        <span>logo上传：</span>
                        <el-upload class="upload-demo" v-if="AuthBoolean('610')" action="//upload.qiniu.com/" :on-remove="handleRemove1" :before-upload="beforeAvatarUpload1" :limit="1" :on-exceed="handleExceed1" :on-success="handleAvatarScucess1" :file-list="fileList1" :data="upload_form1">
                            <div class="imgBlock1" v-if="imageUrl1">
                                <img v-if="imageUrl1" :src="imageUrl1" class="avatar1">
                                <i class="el-icon-plus changeIndex"></i>
                            </div>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            
                            <div slot="tip" class="el-upload__tip">宽高比1:1，建议尺寸240*240px以上，<br/>支持格式：jpg、png，图片大小限2M以内</div>
                        </el-upload>
                        <div class="fakeFirst" v-else>
                            <div class="firstUntouch" :style="justCheck"></div>
                        </div>
                    </div>
                </div>
                <div class="rightPart">
                    <div class="upoadCon">
                        <span>背景图片上传：</span>
                        <el-upload v-if="AuthBoolean('610')" class="upload-demo" action="//upload.qiniu.com/" :on-remove="handleRemove2" :before-upload="beforeAvatarUpload2" :limit="1" :on-exceed="handleExceed2" :on-success="handleAvatarScucess2" :file-list="fileList2" :data="upload_form2">
                            <div class="imgBlock2" v-if="imageUrl2">
                                <img v-if="imageUrl2" :src="imageUrl2" class="avatar2">
                                <i class="el-icon-plus changeIndex"></i>
                            </div>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">此图片将显示在企业版-企业中心、个人版-个人中心、首页</div>
                            <div slot="tip" class="el-upload__tip">建议尺寸750*320px，<br/>支持格式：jpg、png，图片大小限2M以内</div>
                        </el-upload>
                        <div class="fakeSecond" v-else>
                            <div class="secondUntouch" :style="justCheck2"></div>
                            <div class="el-upload__tip">此图片将显示在企业版-企业中心、个人版-个人中心、首页</div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="bottomCon">
                <el-button size="small" type="primary" :disabled="!imageUrl2&&!imageUrl1" @click="saveHere" v-Auth="'610'">保存</el-button>
            </div>
        </div>
        <el-dialog title="剪切图片"  :visible.sync="cropVisible" width="1000px"
                   :close-on-click-modal="false" center :before-close="handleClose">
            <div>
                <div class="cropperCon">
                    <VueCropper v-if="cropVisible" :aspect-ratio="dynamicRatio" :viewMode="1" ref="cropper"  :src="imgSrc" @ready="ready" />
                </div>
                <div class="cropBtnCon">
                    <el-button size="small" type="primary"  @click="cropAction">裁切图片</el-button>
                </div>
                <div class="saveCropCon">
                    <el-button size="small" type="info" :disabled="!saveCropAble"  @click="saveCropToTarget">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'cropInfo',
        data() {
            return {
                dynamicRatio:1,
                cropVisible:false,
                bucketHost:'img.10000rc.com',
                upload_form1:{
                    key:'',
                    token:'',
                },
                fileList1:[],
                imageUrl1:'',
                upload_form2:{
                    key:'',
                    token:'',
                },
                fileList2:[],
                imageUrl2:'',
                imgSrc:'',
                cropImg:'',
                saveCropAble:false,
                clickSource:1,
                storePicData:{},
                justCheck:{},
                justCheck2:{},
            }
        },
        mounted(){
            this.getToken();
            this.analyseStorage();
            this.setUnableTouch();
        },
        methods: {
            setUnableTouch(){
                this.justCheck = {
                    backgroundImage: 'url('+this.imageUrl1+')',
                };
                this.justCheck2 = {
                    backgroundImage: 'url('+this.imageUrl2+')',
                };
            },
            handleClose(){
                if( !this.saveCropAble ){
                    if( this.clickSource == 1 ){
                        if( sessionStorage.getItem('tempPicsSucker') ){
                            this.storePicData = JSON.parse(sessionStorage.getItem('tempPicsSucker'));
                            this.imageUrl1 = this.storePicData.logo;
                        }
                    }
                    if( this.clickSource == 2 ){
                        if( sessionStorage.getItem('tempPicsSucker') ){
                            this.storePicData = JSON.parse(sessionStorage.getItem('tempPicsSucker'));
                            this.imageUrl2 = this.storePicData.logo;
                        }
                    }
                }
                this.cropVisible = false;
            },
            analyseStorage(){
                if( sessionStorage.getItem('tempPicsSucker') ){
                    this.storePicData = JSON.parse(sessionStorage.getItem('tempPicsSucker'));
                    this.imageUrl2 = this.storePicData.background;
                    this.imageUrl1 = this.storePicData.logo;
                }
            },
            ready(){},
            saveCropToTarget(){
                this.cropVisible = false;
            },
            cropAction(){
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
                this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
                    const formData = new FormData();
                    formData.append('file',blob);
                    formData.append('key',this.upload_form1.key);
                    formData.append('token',this.upload_form1.token);
                    this.ApiLists.uploadQiniu(formData).then(res=>{
                        let { status,data } = res;
                        if( status == 200 ){
                            this.saveCropAble = true;
                            if(this.clickSource == 2){
                                this.imageUrl2 = `http://${this.bucketHost}/${data.key}`;
                            }
                            if(this.clickSource == 1){
                                this.imageUrl1 = `http://${this.bucketHost}/${data.key}`;
                            }
                        }
                        this.getToken();
                    }).catch(err=>{
                        console.log('err',err);
                    })
                })
            },
            zoom(){
            },
            saveHere(){
                if( !this.imageUrl1 && !this.imageUrl2 ){
                }else{
                    let params = {
                        customerId:this.$route.query.id,
                        logo:this.imageUrl1,
                        background:this.imageUrl2,
                    }
                    this.ApiLists.setLogoAndBg(params).then(res=>{
                        let { data,respCode } = res;
                        if( respCode === 0 ){
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            let picData = {
                                background:this.imageUrl2,
                                logo:this.imageUrl1,
                            };
                            sessionStorage.setItem('tempPicsSucker',JSON.stringify(picData));
                            this.fileList1 = [];
                            this.fileList2 = [];
                        }
                    }).catch(err=>{
                        console.log('err',err);
                    })
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
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传logo只能是 JPG 或PNG格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传logo大小不能超过 2MB!');
                }
                return isLt2M && (isPNG || isJPG);
            },
            handleExceed1(){
                this.$message.warning(`请删除当前文件再重新上传！`);
            },
            handleAvatarScucess1(res,file){
                const key = res.key;
                this.imageUrl1 = `http://${this.bucketHost}/${key}`;
                this.cropVisible = true;
                this.saveCropAble = false;
                this.clickSource = 1;
                this.dynamicRatio = 1;
                this.getToken()
                this.$nextTick(()=>{
                    this.$refs.cropper.replace(this.imageUrl1);
                });
            },
            handleRemove2(){
                this.imageUrl2 = '';
                this.getToken();
                this.$forceUpdate();
            },
            beforeAvatarUpload2(file){
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传背景图片只能是 JPG 或PNG格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传背景图片大小不能超过 2MB!');
                }
                return isLt2M && (isPNG || isJPG);
            },
            handleExceed2(){
                this.$message.warning(`请删除当前文件再重新上传！`);
            },
            handleAvatarScucess2(res,file){
                const key = res.key;
                this.imageUrl2 = `http://${this.bucketHost}/${key}`;
                this.cropVisible = true;
                this.clickSource = 2;
                this.dynamicRatio = 75/32;
                this.saveCropAble = false;
                this.getToken()
                this.$nextTick(()=>{
                    this.$refs.cropper.replace(this.imageUrl2);
                });
            },
            getToken() {
                this.ApiLists.cowToken().then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.upload_form1 = {
                            key: data.fileName,
                            token: data.upToken,
                        };
                        this.upload_form2 = {
                            key: data.fileName,
                            token: data.upToken,
                        };
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
        },
    }
</script>
<style scoped lang="scss">
    .cropInfoCon {
        padding-top: 30px;
        padding-bottom: 30px;
        box-sizing: border-box;
        .cropperCon {
            width: 700px;
            margin: 0 auto;
        }
        .changeIndex {
            opacity: 0;
            width: 192px;
            height: 192px;
            font-size: 55px;
            line-height: 192px;
            position: absolute;
            left: 0;
            top: 0;
        }
        .imgBlock1:hover {
            .changeIndex {
                opacity: 1;
                z-index: 3;
            }
        }
        .imgBlock2:hover {
            .changeIndex {
                opacity: 1;
                z-index: 3;
            }
        }
        .cropBtnCon {
            text-align: center;
            margin-bottom: 20px;
            margin-top: 20px;
        }
        .fakeFirst {
            width: 230px;
            height: 238px;
            text-align: center;
        }
        .firstUntouch {
            width: 192px;
            height: 192px;
            background-position: center;
            background-size: contain;
            border-radius: 5px;
            margin: 0 auto;
            margin-bottom: 5px;
        }
        .fakeSecond {
            width: 320px;
            height: 238px;
            text-align: center;
        }
        .secondUntouch {
            width: 192px;
            height: 192px;
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            border-radius: 5px;
            margin: 0 auto;
            margin-bottom: 5px;
        }
        .saveCropCon {
            text-align: center;
        }
        .limitWidth {
            min-width: 1000px;
            .topCon {                
                display: flex;
                justify-content: flex-start;
            }
            .bottomCon {
                margin-top: 50px;
                display: flex;
                justify-content: center;
            }
            .leftPart {
                width: 50%;
                span {
                    font-size: 14px;
                    font-weight: 400;
                }
                .upoadCon {
                    display: flex;
                    justify-content: center;
                }
            }
            .rightPart {
                width: 50%;
                span {
                    font-size: 14px;
                    font-weight: 400;
                }
                .upoadCon {
                    display: flex;
                    justify-content: center;
                }
            }
        }
        
    }
</style>
<style lang="scss">
    .cropInfoCon {
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
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 192px;
            height: 192px;
            line-height: 192px;
            text-align: center;
        }
        .imgBlock2 {
            width: 192px;
            height: 192px;
            padding-top: 55px;
            box-sizing: border-box;
        }
        .avatar2 {
            width: 192px;
            height: 82px;
            display: block;
        }
        .imgBlock1 {
            width: 192px;
            height: 192px;
            position: relative;
        }
        .avatar1 {
            width: 192px;
            height: 192px;
            display: block;
        }
        .el-upload__tip {
            text-align: left;
        }
    }
</style>