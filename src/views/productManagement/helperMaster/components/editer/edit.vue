<template>
    <div class="editEditerCon">
        <div class="bgCon">
            <div class="blockCon">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
                    <el-form-item label="问题名称" prop="title">
                        <el-input v-model.trim="ruleForm.title" size="small" class="limitWidth" placeholder="请输入问题名称（15个字）" maxlength="15"></el-input>
                    </el-form-item>
                    <el-form-item label="问题分类" prop="type">
                        <el-select size="small" class="limitWidth"
                               v-model="ruleForm.type"
                               placeholder="请选择问题分类">
                        <el-option v-for="item in questionOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="目标用户" prop="target">
                      <el-radio-group v-model="ruleForm.target" >
                          <el-radio label="1">全部商家</el-radio>
                          <el-radio label="2">企业商家</el-radio>
                          <el-radio label="3">个人商家</el-radio>                      
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="权重" prop="weight">
                        <el-input v-model="ruleForm.weight"  placeholder="请输入0-1000" class="limitWidth" size="small" maxlength="4"></el-input>
                    </el-form-item>
                    <div class="editerCon">
                        <div ref="editEditor" style="text-align:left"></div>
                        <div class="operateArea">
                            <el-button size="mini" type="primary" @click="preview">预览</el-button> 
                            <el-button size="mini" type="primary" @click="confirmEdit('ruleForm')" :disabled="addAble">确认添加</el-button> 
                        </div>
                    </div>
                </el-form>
            </div>
        </div>          
        <el-dialog title="预览" class="setHereScoped setMiddleDialog" :visible.sync="previewVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <div class="contentHeight" v-html="editorContent"></div>
                <div>
                    <el-button type="primary" size="small" class="sameWidthBtn" @click="shutNow">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'editEditerCon',
        data() {
            var validateChinese =  (rule, value, callback) => {
                let reg = /^[\u4E00-\u9FA5]{1,15}$/;
                let res = reg.test(value);
                if(res){
                    callback();     
                }else{
                    callback('请输入15个字以内的中文字符');     
                }
            };
            var validateWeight = (rule, value, callback) => {
                if( Number.isInteger(+value) ){
                     if( (+value>1000)||(+value<0) ){
                        callback(new Error('权重值请输入0~1000数字'));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error('权重值请输入0~1000数字'));
                }
            };
            return {
                questionOptions:[],
                previewVisible:false,
                addAble:false,
                editorContent:'',
                rules:{
                    title:[
                        { required: true, message: '问题名称不能为空', trigger: 'blur' },
                        { validator: validateChinese, trigger: 'blur' }
                    ],
                    weight:[
                        { required: true, message: '权重不能为空', trigger: 'blur' },
                        { validator: validateWeight, trigger: 'blur' }
                    ],
                    type:[
                        { required: true, message: '问题分类不能为空', trigger: 'change' },
                    ],
                    target:[
                        { required: true, message: '目标用户不能为空', trigger: 'blur' },
                    ]
                },
                ruleForm:{
                    weight:'',
                    type:'',
                    target:'1',
                    title:'',
                    position:''
                },
                editer:null,
            }
        }, 
        mounted(){
            this.initEditer();
            this.getArr();
            this.initRouter();
        },
        methods: {
            getArr(){
                this.ApiLists.dropDownRange().then(res =>{  
                    let { data,respCode } = res;
                    if(respCode === 0){
                        let arrkey = Object.keys(data);
                        let arrvalue = Object.values(data);
                        let final = arrkey.map((ele,index)=>{
                            return {
                                value:ele,
                                label:arrvalue[index]
                            }
                        });
                        this.questionOptions = final;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            initRouter(){
                let query = this.$route.query;
                this.ruleForm.weight = query.weight;
                this.ruleForm.type = query.rangeId;
                this.ruleForm.target = query.cusType;
                this.ruleForm.title = query.title;
                this.ruleForm.id = query.id;
                this.ruleForm.position = query.position;
                this.editorContent = query.content;
                this.editer.txt.html(this.editorContent);
            },
            initEditer(){
                this.editer = new this.Wang(this.$refs.editEditor)
                this.editer.customConfig.zIndex = 2;
                this.editer.customConfig.uploadImgShowBase64 = true
                this.editer.customConfig.showLinkImg = false;
                this.editer.customConfig.onchange = (html) => {
                    this.editorContent = html
                }
                this.editer.create()
            },
            preview(){
                console.log( this.editorContent );         
                this.previewVisible = true;
            },
            confirmEdit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        if( !this.editorContent ){
                            this.$message({
                                message: '内容不能为空',
                                type: 'error'
                            });
                        }else{
                           this.requestAction();
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            requestAction(){
                this.editorContent = this.editorContent.replace(/.webp/g,".jpg");
                let data = {
                    id:this.ruleForm.id,
                    title:this.ruleForm.title,
                    rangeId:this.ruleForm.type,
                    cusType:this.ruleForm.target,
                    weight:+this.ruleForm.weight,
                    content:this.editorContent,
                    position:this.ruleForm.position,
                }             
                this.ApiLists.helpQuestionAddOrEdit(data).then(res =>{
                    let { data,respCode } = res;
                    this.addAble = true;
                    if(respCode === 0){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$router.push({
                            name: 'productHelper',
                            query:{
                                activeName:'2'
                            }
                        });
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.addAble = false;
                    },500);
                })
            },
            shutNow(){
                this.previewVisible = false;
            },
        },
    }
</script>
<style lang="scss" scoped>
    .editEditerCon {
        .blockCon {
            margin: 0 auto;
            width: 1000px;
            padding: 20px;
            box-sizing: border-box;            
        }
        .contentHeight {
            height: 360px;
            overflow-y: scroll;
        }
        .operateArea {
            display: flex;
            justify-content: flex-end;
            align-content: center;
            align-items: center;
            margin-top: 20px;
        }
        .bgCon {
            background-color: #fff;
        }
    }
</style>
<style lang="scss">
    .editEditerCon {
        .contentHeight {
            img {
                max-width: 400px;
            }
        } 
        .setHereScoped {
            .el-dialog {
                height: 500px;
            }
        }
        .limitWidth{
            width: 300px;
        }
    }    
</style>