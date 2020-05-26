<template>
  <div class="notFoundContainer">
      <h1>404</h1>
      <h2 @click="goBack">返回上一页</h2>
  </div>
</template>
<script>
export default {
    name: 'notFound', 
    methods:{
        goBack(){
            this.$router.go(-1);
        }
    },
}
</script>
<style scoped lang="scss">
    .notFoundContainer {
        text-align: center;
        padding-top: 200px;
    }
    h2 {
        cursor: pointer;
    }
</style>