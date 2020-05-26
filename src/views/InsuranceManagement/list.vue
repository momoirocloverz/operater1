<template>
  <div class="insurance-list">
      <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <template v-for="(item,index) in restTabArr">
                  <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
              </template>
          </el-tabs>
          <div class="tabContentCon">
              <Summary v-if="activeName == '1'"></Summary>
              <Detail v-if="activeName == '2'"></Detail>
          </div>
      </div>
  </div>
</template>
<script>
    import Summary from './components/summary'
    import Detail from './components/detail'
export default {
    name: 'insurance',
    components:{Summary,Detail},
    data(){
        return {
            activeName: '',
            restTabArr: [],
        }
    },
    mounted(){
        this.analyseAuth();
    },
    methods:{
        analyseAuth(){
            let empty = [];
            if( this.AuthBoolean('214') ){
                empty.push({
                    title: '投保汇总',
                    name: '1'
                })
            }
            if( this.AuthBoolean('215') ){
                empty.push({
                    title: '投保记录',
                    name: '2'
                })
            }
            this.restTabArr = empty;
            if( this.restTabArr.length ){
                this.activeName = this.restTabArr[0].name;
            }
        },
        handleClick(tab, event) {
//            console.log(tab, event);
        },
    },
}
</script>
<style lang="scss" scoped>
    .insurance-list{
        .nameColor {
            color: #303133;
            margin-bottom: 10px;
            font-size: 16px;
        }
    }    
</style>