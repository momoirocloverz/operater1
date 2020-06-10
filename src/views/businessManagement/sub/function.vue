<template>
    <div class="functionInnerCon">
        <div class="secondSelectCon">
                <div  class="radioTitle">打卡管理功能：</div>
                <el-switch v-model="switchValue" active-color="#FF2626" inactive-color="#DCDFE6" active-value="1" inactive-value="0" @change="hereSwitch" :disabled="!AuthBoolean('66')"></el-switch>
<!--                <div class="setleftMargin">{{ punchManageMap[punchManageSwitch] }}</div>-->
            </div>
        
    </div>
</template>
<script>
    export default {
        name: 'functionInner',
        data() {
            return {     
                switchValue: '1',    
            }
        },
        mounted(){     
        },
        methods: {
            hereSwitch(){
                
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
<style lang="scss">
    .functionInnerCon {
        .setAuthScoped  .el-dialog {
            height: 270px;
        }
    }
</style>