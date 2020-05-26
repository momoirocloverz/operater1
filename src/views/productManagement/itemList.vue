<template>
  <div class="itemListCon">
      <div class="topCon">
          <div>
              <el-select size="small" class="lockWidth" v-model="layerValue" placeholder="请选择层级" @change="fetchList">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            </div>
          <div></div>
        </div>
      <div class="bottomCon">
          <div class="tableCon">
               <el-table :data="tableData"  max-height="530" stripe style="width: 100%" emptyText="暂无相关信息">
                   <el-table-column  prop="dicName"  label="类目类型" min-width="80"></el-table-column>
                   <el-table-column label="层级">
                       <template v-slot="scope">
                           {{ layerMap[scope.row.level] }}
                        </template>
                    </el-table-column>
                   <el-table-column  prop="note"  label="说明"></el-table-column>
                   <el-table-column label="操作" v-if="AuthBoolean('313')">
                       <template v-slot="scope">
                           <el-button size="mini" type="text" v-Auth="'313'"  @click="handleEdit(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
              </el-table>
        </div>
        </div>   
    </div>
</template>
<script>
export default {
    name: 'itemList',
    data(){
        return {
            layerValue:'',
            layerMap:{
                1:'一级',
                2:'二级'
            },
            options1:[
                { label:'不限',value:0 },
                { label:'一级',value:1 },
                { label:'二级',value:2 },
            ],
            tableData:[],
        }
    },
    mounted(){
        this.fetchList();
    },
    methods:{
        fetchList(){
            let params = {
                level:this.layerValue,
            };
            if( !this.layerValue ){
                delete params.level
            }
            this.ApiLists.dictionaryCategory(params).then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    this.tableData = data||[];
                }
            }).catch(err=>{
                console.log('err',err);
            })
        },
        handleEdit(row){
            const { href } = this.$router.resolve({
                name: 'productManaItemDetail',
                query:{
                    id:row.id,
                    level:row.level,
                    name:row.dicName,
                }
            })    
            window.open( href );
        },
    },
}
</script>
<style lang="scss" scoped>
    .itemListCon {    
        .topCon {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            .lockWidth {
                width: 200px;
                margin-right: 10px;
            }  
        }
        .bottomCon {
            .tableCon {
                margin-top: 20px;
            }
        }   
    }    
</style>