<template>
    <div class="detail">
        <div class="flex-box flex-align">
            <div class="divideItem">
                <div class="itemTitle">账号信息</div>
                <div class="divideCon">
                    <div class="">
                        <CusTable :tableData="tableData1" @bindEvent="freezePersonal" :key="1"></CusTable>
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
    </div>
</template>
<script>
    export default {
        name: 'detail',
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
            }
        },
        filters:{

        },
        mounted() {
            this.getInfo()
        },
        methods: {
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
    .detail {
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
    }
</style>