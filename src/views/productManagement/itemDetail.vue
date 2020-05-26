<template>
  <div class="itemDetailCon" v-loading="loading">
      <div class="topCon">
          <div>{{itemName}}</div>
        </div>
      <div class="bottomCon">
          <div class="tableCon">
              <div v-if="class1Show">
                  <el-table :data="tableData1" key="1" stripe style="width: 100%">
                        <el-table-column prop="dicName" label="类目详情" show-overflow-tooltip></el-table-column>
                      <el-table-column  prop="note"  label="类型" show-overflow-tooltip></el-table-column>
                        <el-table-column  label="排序" show-overflow-tooltip>
                            <template v-slot="scope">
                                <div v-if="AuthBoolean('634')">
                                    <el-input-number v-model="scope.row.orderBy" controls-position="right"  :min="1" :max="1000" @change="Number1Change(scope.row)"/>
                                </div>
                                <div v-else>
                                    <div>{{scope.row.orderBy}}</div>
                                </div>  
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-else>
                    <el-table :data="tableData2" key="2" stripe style="width: 100%">
                        <el-table-column  label="一级分类" show-overflow-tooltip>
                            <template v-slot="scope">
                                <div v-show="scope.row.isParent" class="boldItem">{{ scope.row.dicName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="二级分类" show-overflow-tooltip>
                            <template v-slot="scope">
                                <div v-show="!scope.row.isParent">{{ scope.row.dicName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序" show-overflow-tooltip>
                            <template v-slot="scope">
                                <div v-if="AuthBoolean('634')">
                                    <el-input-number v-model="scope.row.orderBy" controls-position="right"  :min="1" :max="1000" @change="Number2Change(scope.row)" />
                                </div>
                                <div v-else>
                                    <div>{{scope.row.orderBy}}</div>
                                </div>                                
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'itemDetail',
    data(){
        return {
            itemName:'行业',
            tableData1:[],
            tableData2:[], 
            class1Show:false,
            globalStack:[],
            loading:true,
        }
    },
    mounted(){
        this.analyseQuery();
    },
    methods:{
        Number2Change(val){
            let params = {
                id:val.id,
                order:val.orderBy,
            }            
            this.ApiLists.setDictionarySort(params).then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.analyseQuery();
                }
            }).catch(err=>{
                console.log( 'err',err );
            })
        },
        Number1Change(val){
            let params = {
                id:val.id,
                order:val.orderBy,
            }            
            this.ApiLists.setDictionarySort(params).then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.analyseQuery();
                }
            }).catch(err=>{
                console.log( 'err',err );
            })
        },
        fetchTable1(data){
            this.tableData1 = data || [];
            this.loading = false;
        },
        async fetchTable2(data){
            let parentData = data;
            let deepOut = JSON.parse( JSON.stringify(parentData) );
            deepOut.forEach(ele=>{
                ele.isParent = true;
            });
            this.globalStack = [];
            let deep1 = JSON.parse( JSON.stringify(deepOut) );
            while( deep1.length ){
                let head = deep1.shift();
                this.globalStack =  this.globalStack.concat(head);    
                let res = await this.simpleRequest(head.id);
                this.globalStack = this.globalStack.concat(res);
            }
            this.tableData2  = this.globalStack;
            this.loading = false;
        },
        simpleRequest(id){
            return new Promise(resolve=>{
                let params = {
                    pId:id
                }            
                this.ApiLists.getSonNodeByParentId(params).then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        resolve(data);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            })
        },
        analyseQuery(){
            let {id,name,level} = this.$route.query;
            this.itemName = name;
            let params = {
                pId:id
            }            
            this.ApiLists.getSonNodeByParentId(params).then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    if( level == 1 ){
                        this.class1Show = true;
                        this.loading = true;
                        if( data&&data.length ){
                            this.fetchTable1(data);
                        }else{
                            this.fetchTable1();
                        }
                    }
                    if( level == 2 ){
                        this.class1Show = false;
                        this.loading = true;
                        if( data&&data.length ){
                            this.fetchTable2(data);
                        }else{
                            this.fetchTable2();
                        }
                    }
                }
            }).catch(err=>{
                console.log('err',err);
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    .itemDetailCon {  
        padding: 30px;
        background-color: #fff;
        box-sizing:border-box;
        .boldItem {
            font-weight: 600;
        }
        .topCon {
            margin-bottom: 20px;
        }
        .bottomCon {
            .tableCon {
                margin-top: 20px;
            }
        } 
    }    
</style>