<template>
  <div class="insurance-list">
      <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <template v-for="(item,index) in restTabArr">
                  <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
              </template>
          </el-tabs>
          <div class="tabContentCon">
              <Detail v-if="activeName == '1'">
              </Detail>
              <Consultation v-if="activeName == '2'">
              </Consultation>
          </div>
      </div>
  </div>
</template>
<script>
    import Detail from './components/appointment'
    import Consultation from './components/consultation'
export default {
    name: 'insurance',
    components:{Detail,Consultation},
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
            if( this.AuthBoolean('319') ){
                empty.push({
                    title: '预约信息',
                    name: '1'
                })
            }
            if( this.AuthBoolean('318') ){
                empty.push({
                    title: '付费咨询申请',
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