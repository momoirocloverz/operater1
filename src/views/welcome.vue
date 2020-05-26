<template>
    <div class="mainIndexCon">
        <img :src="imgsrc">
        <div class="textCon">            
            欢迎使用万才运营管理系统
        </div>
    </div>
</template>
<script>
export default {
    name: 'welcome',
    data(){
        return {
            imgsrc:require('@/assets/welcome.png'),
        }
    },
    mounted(){
        
    },
}
</script>
<style lang="scss" scoped>
    .mainIndexCon {
        height: 70vh;
        text-align: center;
        color: #606266;
        font-size: 14px;
        font-weight: 300;
        img {
            width: 260px;
            height: 200px;
            margin-top: 15vh;
            margin-bottom: 40px;
        }
        .textCon {
            line-height: 30px;
            margin-bottom: 30px;
        }
    }
</style>