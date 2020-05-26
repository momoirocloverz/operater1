<template>
    <div class="confirmationForm pt20 pb30">
        <div class="f14 img-wrap" v-if="isShow">
            <p class="pl50">状态: {{$dictionary.confirmStatus[confirmStatus]}}</p>
            <img class="img-png" :src=url alt="">
        </div>
        <div class="f14" v-else>暂未生成第三方确认表</div>
    </div>
</template>
<script>
    export default {
        name: 'confirmationForm',
        data() {
            return {
                isShow:false,
                url:'',
                confirmStatus:0,
            }
        },
        watch:{
        },
        mounted() {
            this.getForm()
        },
        methods: {
            getForm(){
                this.ApiLists.schedulingConfirm({
                    schedulingId:this.$route.query.schedulingId
                }).then(res => {
                    //状态（1待发送、2待确认、3已确认） status
                    if(res.data && [2,3].includes(res.data.status)){
                        this.confirmStatus = res.data.status
                        this.isShow = true;
                        this.isShow = true;
                        this.url = res.data.confirmPngForm
                    }else{
                        this.isShow = false
                    }
                })
            },
        },
    }
</script>
<style lang="scss" scoped>
    .confirmationForm{
        .img-wrap{
            width:40%;
            margin: auto;
        }
        .img-png{
            display: block;
            width: 100%;
        }
    }
</style>