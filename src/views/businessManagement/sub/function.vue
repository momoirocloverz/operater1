<template>
    <div class="functionInnerCon">
        <div class="secondSelectCon">
            <div  class="radioTitle">导出空白签到表：</div>
            <el-switch v-model="switchValue" active-color="#FF2626" inactive-color="#DCDFE6" active-value="1" inactive-value="0" @change="hereSwitch" :disabled="!AuthBoolean('61901')"></el-switch>
            <div class="setleftMargin">{{ statusMap[switchValue] }}</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'functionInner',
        data() {
            return {     
                switchValue: '1',    
                statusMap:{
                    
                },
            }
        },
        mounted(){     
            this.fetchStatus();
        },
        methods: {
            fetchStatus(){
                let params = {
                    id: this.$route.query.id,
                }
                this.ApiLists.businessCustomerDetail(params).then((res) => {
                    let { data, respCode } = res
                    if (respCode === 0) {
                        this.switchValue = String(data.emptyPdfExportSwitch);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            hereSwitch(){
                let params = {
                    customerId:this.$route.query.id,
                };
                this.ApiLists.toggleEmptyPdfExportSwitch(params).then(res => {
                    let { respCode} = res;
                    if (respCode === 0) {
                       this.$message({
                           message: '设置成功',
                           type: 'success'
                       });
                        this.fetchStatus();
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
        },
    }
</script>
<style scoped lang="scss">
    .functionInnerCon {
        .secondSelectCon {
            margin-top: 20px;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            .setleftMargin {
                margin-left: 10px;
            }
        }
    }
</style>