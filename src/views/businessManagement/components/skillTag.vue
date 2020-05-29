<template>
    <div class="skill-tag" v-loading="loading" element-loading-text="正在请求中...">
        <div class="pt20">
            <div class="flex-box flex-left">
                <el-select size="small" class="lockWidth" v-model="value"
                           @change="showChang"
                           placeholder="显示状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="tableCon">
                <el-table :data="tableData"
                          style="width: 100%; margin-top: 20px"
                          row-key="id"
                          border
                          default-expand-all
                          :tree-props="{children: 'sonNode', hasChildren: 'hasChildren'}"
                          key="111">
                    <el-table-column prop="dicName" :formatter="forOne" label="一级分类"></el-table-column>
                    <el-table-column prop="dicName" :formatter="forTwo" label="二级分类"></el-table-column>
                    <el-table-column prop="orderBy" label="排序"></el-table-column>
                    <el-table-column prop="status" :formatter="statusFor" label="显示状态">
                    </el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean('69')">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'69'" v-if="scope.row.status === 0 && scope.row.pid !== pid" @click="handleShow(scope.row,1)">显示标签</el-button>
                            <el-button size="mini" type="text" v-Auth="'69'" v-if="scope.row.status === 1 && scope.row.pid !== pid" @click="handleShow(scope.row,0)">隐藏标签</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Skill',
        props:{
          id:{
              default:1
          }
        },
        data() {
            return {
                currentPage: 1,
                pageSize:0,
                total:0,
                tableData: [],
                value:'',
                options:[{label:'不限',value:-1},{label:'显示标签',value:1},{label:'隐藏标签',value:0}],
                type:1,
                pid:'',
                loading:false,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleShow(row,status){
                this.ApiLists.displayStatus({
                    customerId:this.$route.query.id,
                    dicCode:row.dicCode,
                    dicVal:row.dicVal,
                    status:status
                }).then(res => {
                    if(res.respCode === 0){
                        this.getList()
                        this.$message.success('设置成功!');
                    }
                }).catch(err => {

                }).finally(()=>{

                })
            },
            showChang(val){
                this.getList(val)
            },
            forOne(row,col,val){
                if(row.pid == this.pid){
                    return val
                }else{
                    return ''
                }
            },
            forTwo(row,col,val){
                if(row.pid !== this.pid){
                    return val
                }else{
                    return ''
                }
            },
            statusFor(row,col,val){
                let str = Number(val);
                if(row.pid !== this.pid){
                    if(str === 1){
                        return '显示'
                    }else if(str === 0){
                        return '隐藏'
                    }
                }
                return '-'
            },
             getList(val){
                 this.loading = true;
                 this.ApiLists.customerIndustry({
                    pageNum:this.currentPage,
                    pageSize:this.pageSize,
                    customerId:this.$route.query.id,
                }).then(res => {
                    if(res.respCode === 0){
                        this.pid = res.data[0].id || '';
                        this.tableData = res.data[0].sonNode || [];
                        if(val >= 0){
                            let result = this.tableData;
                            result.forEach((item,index) => {
                                let arr = item.sonNode.filter(i => i.status === val);
                                this.tableData[index].sonNode = arr
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                 })
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .skill-tag {
        .topCon {
            .lockWidth {
                width:120px;
                margin-right: 10px;
            }
            .topFirst {
                display: flex;
                justify-content: space-between;
                align-content: center;
                align-items: center;
            }

            .topSec {
                margin-top: 15px;
            }
        }

        .bottomCon {
            .tableCon {
                margin-top: 10px;
            }

            .pagCon {
                display: flex;
                justify-content: center;
                margin-top: 30px;
            }
        }
    }
</style>
