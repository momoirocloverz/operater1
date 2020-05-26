<template>
  <div class="helperMasterCon">
      <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <template v-for="(item,index) in restTabArr">
                  <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
              </template>
          </el-tabs>
          <div class="tabContentCon">
              <Category v-if="activeName == '1'" />
              <Question v-if="activeName == '2'" />
          </div>
      </div>
  </div>
</template>
<script>
    import Category from './components/category'
    import Question from './components/question'
export default {
    name: 'insurance',
    components:{Category,Question},
    data(){
        return {
            activeName: '',
            restTabArr: [],
        }
    },
    mounted(){
        this.getQuery();
        this.analyseAuth();
    },
    methods:{
        getQuery(){
            if( this.$route.query.activeName&&this.$route.query.activeName == '2' ){
                this.activeName = '2';
            }
        },
        analyseAuth(){
            let empty = [];
            if( this.AuthBoolean('316') ){
                empty.push({
                    title: '全部分类',
                    name: '1'
                })
            }
            if( this.AuthBoolean('317') ){
                empty.push({
                    title: '全部问题',
                    name: '2'
                })
            }
            this.restTabArr = empty;
            if( this.restTabArr.length ){
                this.activeName = this.restTabArr[0].name;
            }
        },
        handleClick(tab, event) {
            this.$router.replace({
                name: 'productHelper'
            }).catch(err=>{});
        },
    },
}
</script>
<style lang="scss" scoped>
    .helperMasterCon{}    
</style>