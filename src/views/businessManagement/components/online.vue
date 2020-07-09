<template>
    <div class="lineConfig">
        <div class="lineItem">
            <div class="fw">账户1：招商银行-云直联账户</div>
            <p>B2C模式-通过招商银行企业商家自有账户发放收入</p>
            <div class="flex">
                <div class="fw">方式：招商云直付</div>
                <div>状态：未启用</div>
                <el-button disabled size="small">启用</el-button>
            </div>
        </div>
        <div class="lineItem">
            <div class="fw">账户2：网商银行-午辰科技</div>
            <div class="wcAccount flex">
                <div>B2B2C模式-通过网商银行薪税公司午辰科技账户发放收入</div>
                <div>
                    <span>{{accStatus==1?'未生成账户':'已生成账户'}}</span>
                    <el-button size="small" @click="createAcc" class="btn">{{accStatus==1?'创建账户':'查看账户'}}</el-button>
                </div>
            </div>
            <div class="flex">
                <div class="fw">方式：网商午辰科技</div>
                <div>状态：{{status==1?'未启用':'已启用'}}</div>
                <div>
                    <el-button size="small" class="btn" @click="outOper" v-if="status==2">停用</el-button>
                    <el-button size="small" class="btn" @click="enableOper">{{status==1?'启用':'设置'}}</el-button>
                </div>
            </div>
        </div>
        <!-- 创建账户的弹框 -->
        <el-dialog
            :visible.sync="showCreate"
            :close-on-click-modal="false"
            width="30%"
            center>
            <div style="margin-bottom:30px">确认“万才科技”生成“<strong>网商午辰科技</strong>”账户?</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showCreate = false">确 认</el-button>
                <el-button @click="showCreate = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 停用的弹框 -->
        <el-dialog
            :visible.sync="showOut"
            :close-on-click-modal="false"
            width="30%"
            center>
            <span>确认“企业简称”停用此发放通道</span>
            <div class="meths mb">
                <span>方式</span>
                <span style="font-weight:700">网商午辰科技</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showOut = false">确 认</el-button>
                <el-button @click="showOut = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 查看账户的弹框 -->
         <el-dialog
            :visible.sync="showViewAcc"
            :close-on-click-modal="false"
            width="40%"
            center>
            <span>查看账户</span>
            <div class="meths flexOne">
                <div>商家名称：</div>
                <div>杭州万才物流有限公司</div>
            </div>
            <div class="meths flexOne">
                <div>网商银行子账户：</div>
                <div>XXXXXXXXX</div>
            </div>
            <div class="meths flexOne">
                <div>网商银行会员id：</div>
                <div>XXXXXXX</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showViewAcc = false" style="color:#000">关 闭</el-button>
            </span>
        </el-dialog>


        <!-- 启用的弹框 -->
        <Enablebox :show.sync="showEnableBox" v-if="showEnableBox" @cancel="showEnableBox=false" :status="status"></Enablebox>
    </div>
</template>
<script>
import Enablebox from "./lineOper/enableBox"
export default {
    components:{Enablebox},
    data(){
        return{
            showCreate:false,
            showEnableBox:false,
            showOut:false,
            showViewAcc:false,
            status:2,
            accStatus:2
        }
    },
    methods:{
        createAcc(){
            if(this.accStatus == 1){
                this.showCreate = true
            }else{
                this.showViewAcc = true
            }
        },
        enableOper(){
            this.showEnableBox =true
        },
        outOper(){
            this.showOut = true
        }
    }
}
</script>
<style scoped lang="scss">
    .el-button{
        font-size:14px;
        // color:#000;
    }
    .dialog-footer>.el-button:nth-child(1){
        margin-right:20px;
    }
    .flex{
        display:flex;
        align-items: center;
        justify-content: space-between;
    }
    .flexOne{
        display:flex;
        align-items: center;
        &>div:nth-child(1){
            width:150px;
            text-align: right;
            margin-right:40px;
        }
    }
    .fw{
        font-weight:800
    }
    .lineConfig{
        font-size:14px;
        &>div:nth-child(2){
            margin-top:25px;
        }
        .lineItem{
            p{
                margin-top:20px;
                margin-bottom:15px;
            }
            &>div:nth-child(3){
                padding-left:20px;
                padding-right:100px;
                border:1px solid #ccc;
                height:100px;
                .el-button{
                    background: #ececec;
                    width:70px;
                    border:1px solid #ccc;
                }
            }
        }
    }
    .wcAccount{
        padding-right:100px;
        margin-top:15px;
        margin-bottom:10px;
        &>div:nth-child(2){
            .el-button{
                margin-left:30px;
            }
        }
    }
    /deep/.el-dialog__body{
        text-align:center;
        font-size:18px;
        color:#000;
        strong{
            font-size:20px;
            font-weight:800;
        }
    }
    .dialog-footer{
        .el-button:nth-child(1){
            color:#fff;
        }
    }
    .meths{
        font-size:14px;
        margin-top:30px;
        &>span:nth-child(1){
            margin-right:30px;
        }
    }
    .btn{
        background: #fff!important;
        color:#000;
    }
    .mb{
        margin-bottom:30px;
    }
</style>