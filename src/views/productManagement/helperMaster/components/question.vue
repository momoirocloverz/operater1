<template>
    <div class="procuctQuestionCon" v-loading="loading" >
        <div class="topCon">
            <div class="firstLineCon" @keyup.enter="triggerAction">
                <el-input v-model.trim="questionName" class="lockWidth" size="small" placeholder="问题名称"></el-input>
                <div><el-button type="info" size="small" icon="el-icon-search" @click="triggerAction">搜索</el-button></div>
            </div>
            <div class="secondLineCon">
                <div class="selectCon" @keyup.enter="triggerAction">
                    <el-select size="small" class="lockWidth"
                               v-model="item"
                               @change="triggerAction"
                               placeholder="问题分类">
                        <el-option v-for="item in questionOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" class="lockWidth" v-model="target"
                               @change="triggerAction"
                               placeholder="目标用户">
                        <el-option v-for="item in targetOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" class="lockWidth" v-model="location"
                               @change="triggerAction"
                               placeholder="显示位置">
                        <el-option v-for="item in locationOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-button type="primary" size="small" v-Auth="'643'" @click="jumpToAdd">添加问题</el-button>
                </div>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table emptyText="暂无相关信息" :data="tableData" max-height="530" stripe style="width: 100%;margin-top:20px;">
                    <el-table-column prop="createdAt" label="添加时间" width=""></el-table-column>
                    <el-table-column prop="range" label="问题分类" width=""></el-table-column>
                    <el-table-column prop="title" label="问题名称" ></el-table-column>
                    <el-table-column prop="cost" label="显示位置">
                        <template v-slot="scope">
                            {{hotStatusMap[scope.row.position]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="toll" label="目标用户" show-overflow-tooltip>
                        <template v-slot="scope">{{ targetMap[scope.row.cusType] }}</template>
                    </el-table-column>
                    <el-table-column prop="weight" label="权重" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作"  v-if="AuthBoolean(['645','644','646'])">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'645'" @click="deleteAction(scope.row)">删除</el-button>
                            <el-button size="mini" type="text" v-Auth="'644'" @click="popEdit(scope.row)">编辑</el-button>
                             <el-button size="mini" type="text" v-Auth="'646'" @click="hotAction(scope.row)">{{hotMap[scope.row.position]}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon" v-if="total">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="total, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'questionHere',
        data() {
            return {
                targetMap:{
                    1:'全部商家',
                    2:'企业商家',
                    3:'个人商家',
                },
                hotStatusMap:{
                    0:'分类内页',
                    1:'热门问题',
                },
                hotMap:{
                    0:'设为热门',
                    1:'取消热门',
                },
                item:'',
                target:'',
                location:'',
                questionName:'',
                loading:false,
                questionOptions:[],
                targetOptions:[
                    { label:'不限',value:0 },
                    { label:'全部商家',value:1 },
                    { label:'企业商家',value:2 },
                    { label:'个人商家',value:3 },
                ],
                locationOptions:[  
                    { label:'不限',value:10 },
                    { label:'分类内页',value:0 },
                    { label:'热门问题',value:1 },
                ],
                currentPage:1,
                total:0,
                tableData: [],
                rowBridge:{},
            }
        },     
        mounted(){
            this.getDropDownLists();
            this.getList();
        },
        methods: {
            getDropDownLists(){
                this.ApiLists.dropDownRange().then(res =>{  
                    let { data,respCode } = res;
                    if(respCode === 0){
                        let arrkey = Object.keys(data);
                        let arrvalue = Object.values(data);
                        let final = arrkey.map((ele,index)=>{
                            return {
                                value:ele,
                                label:arrvalue[index]
                            }
                        });
                        this.questionOptions = [{ label:'不限',value:0 },...final];
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            jumpToAdd(){
                const { href } = this.$router.resolve({
                    name: 'addQuestion',                    
                })
                window.open(href);
            },
            deleteAction(row){
                this.rowBridge = row;
                this.$confirm('此操作将删除该条目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass:'el-button--info',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:this.rowBridge.id
                    };
                    this.ApiLists.deleteHelpQuestion(params).then(res =>{
                        let { data,respCode } = res;
                        if(respCode === 0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.triggerAction();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            hotAction(row){
                this.rowBridge = row;
                this.$confirm('此操作将改变该条目状态, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass:'el-button--info',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:this.rowBridge.id,
                        position: this.rowBridge.position ? 0 : 1, 
                    };
                    this.ApiLists.setHotQuestion(params).then(res =>{
                        let { data,respCode } = res;
                        if(respCode === 0){
                            this.$message({
                                type: 'success',
                                message: '设置成功!'
                            });
                            this.triggerAction();
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消更改'
                    });          
                });
            },
            popEdit(row){
                const { href } = this.$router.resolve({
                    name: 'editQuestion',      
                    query:{
                        id:row.id,
                        rangeId:row.rangeId,
                        content:row.content,
                        cusType:row.cusType,
                        position:row.position,
                        title:row.title,
                        weight:row.weight
                    }
                })
                window.open(href);
            },
            triggerAction(val){
                this.currentPage = 1;
                this.getList()
            },
            getList(){
                this.loading = true;
                let params = {
                    pageNum:this.currentPage,
                    pageSize:20,
                    title:this.questionName,
                    position:this.location
                };
                if( this.item ){
                    params.rangeId = this.item;
                }
                if( this.target ){
                    params.cusType = this.target;
                }
                if( this.location == 10 ){
                    delete params.position
                }
                this.ApiLists.helpQuestionList(params).then(res =>{
                    let { data,respCode } = res;
                    if(respCode === 0){
                        if(data && data.list){
                            this.tableData = data.list;
                        }else{
                            this.tableData = [];
                        }
                        this.total = data.total;
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },  
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .procuctQuestionCon {
        .topCon {
            .firstLineCon {
                display: flex;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                margin-bottom: 20px;
            }
            .lockWidth {
                width: 200px;
                margin-right: 10px;
            }
            .secondLineCon {
                display: flex;
                justify-content:space-between;
                align-content: center;
                align-items: center;
                .selectCon {
                    
                }
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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