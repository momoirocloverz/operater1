<template>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" @close="$emit('update:show', false)" :show="show" width="700px">
        <div class="title">{{status==1?'确认“万才物流”启用此支付方式':'万才物流-设置'}}</div>
        <el-form :model="form" :rules="rules">
            <el-form-item label="方式" :label-width="formLabelWidth" :label-position="labelPosition">
                <span>网商午辰科技</span>
            </el-form-item>
            <el-form-item label="午辰网商主账号" :label-width="formLabelWidth">
                <span>XXXXXXX</span>
            </el-form-item>
            <el-form-item label="商家网商银行子账户" :label-width="formLabelWidth">
                <span>XXXXXXX</span>
            </el-form-item>
            <el-form-item label="商家网商银行会员id" :label-width="formLabelWidth">
                <span>XXXXXXX</span>
            </el-form-item>
            <el-form-item label="平台信息费 费率" :label-width="formLabelWidth">
                <div class="flex">
                    <el-input v-model="form.ptInfo" placeholder="请输入0~99，保留小数点后1位" size="small"></el-input>
                    <span class="ml">%</span>
                </div>
                <p>从该企业商家的该薪税账户扣除</p>
            </el-form-item>
            <el-form-item label="信息服务费 费率" :label-width="formLabelWidth">
                <div class="flex">
                    <el-input v-model="form.info" placeholder="请输入0~99，保留小数点后1位" size="small"></el-input>
                    <span class="ml">%</span>
                </div>
                <p>从该企业商家的管理费账户扣除</p>
            </el-form-item>
            <div class="tip">费率=0，则不收取该费用且不产生相应交易记录</div>
            <el-form-item label="月支付上限" :label-width="formLabelWidth">
                <el-radio-group v-model="form.resource">
                    <div class="mb">
                        <el-radio label="不限"></el-radio>
                    </div>
                    <div>
                        <el-radio>
                            <el-input v-model="form.info" placeholder="保留小数点后2位" size="small"></el-input>
                            <span class="ml">元/月/人</span>
                        </el-radio>
                    </div>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$emit('cancel')">确 认</el-button>
            <el-button @click="$emit('cancel')">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props:{
            show: {
                type: Boolean,
                default: false
            },
            title:{
                type:String
            },
            status:{
                type:Number
            }
        },
        data(){
            var checkInfoCost = (rule, value, callback) => {
                console.log(typeof value)
                if (!value) {
                    return callback(new Error('费率不能为空'));
                }
                setTimeout(() => {
                    if (!(typeof value === 'number' && !isNaN(value))) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value > 99 || value < 0) {
                            callback(new Error('请输入正确的数值'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            return{
                visible: this.show,
                form: {
                    ptInfo: '',
                    info:'',
                    resource:''
                },
                formLabelWidth: '200px',
                labelPosition:'right',
                rules:{
                    ptInfo: [{ validator: checkInfoCost, trigger: 'blur' }]
                }
            }
        },
        watch: {
            show () {
                this.visible = this.show;
            }
        },
        methods:{
    
        }
    }
</script>
<style scoped lang="scss">
    .el-button:nth-child(1){
        margin-right:20px;
    }
    .flex{
        display: flex;
    }
    /deep/.el-form-item__content{
        text-align: left;
        margin-left:240px!important;
    }
    .el-form-item{
        margin-bottom:10px;
    }
    .el-input{
        width:230px;
    }
    .ml{
        margin-left:30px;
    }
    .tip{
        margin-top:10px;
        margin-bottom:20px;
        font-size:14px;
    }
    .mb{
        margin-bottom:10px;
    }
    .dialog-footer{
        text-align: center;
    }
    .title{
        text-align: center;
        font-size:20px;
        margin-bottom:20px;
    }
</style>