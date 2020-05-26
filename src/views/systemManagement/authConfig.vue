<template>
    <div class="authConfigCon">
        <div class="topCon">
            <div class="topFirst">
                <div>角色权限管理</div>
                <div>
                    <el-button type="primary" size="small" @click="addRole"  v-Auth="'667'">新增角色</el-button>
                </div>
            </div>
        </div>
        <div class="bottomCon">
            <div class="roleftCon">
                <div class="listWrapper">
                    <el-table :data="tableData" ref="roleTable" stripe style="width: 100%" highlight-current-row v-infinite-scroll="load" infinite-scroll-disabled="disabled"  infinite-scroll-delay="900"  @current-change="handleCurrentChange">
                        <el-table-column label="角色名" show-overflow-tooltip prop="roleName"></el-table-column>
                        <el-table-column label="操作" class="hehererre" v-if="AuthBoolean('669')">
                            <template v-slot="scope">
                                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="loadingInfo" v-if="loading">加载中...</div>
                    <div class="loadingInfo" v-if="noMore && (tableData&&tableData.length)">没有更多了</div>
                </div>
            </div>
            <div class="roleRightCon">
                <div class="commonTree">
                    <div class="treeTitle"><span>{{this.currentRow.roleName}}</span> 权限</div>
                    <div class="lockTree">
                        <el-tree class="treeSelf" default-expand-all ref="tree" check-on-click-node :data="treeData1" show-checkbox node-key="permCode" :check-strictly="true" :props="defaultProps"></el-tree>
                        <!--@check="clickDeal"-->
                    </div>
                </div>
                <div class="saveBtn">
                    <el-button type="primary" size="small" @click="saveAuthLists"  v-Auth="'668'">保存</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="新增角色" class="setRoot1Scoped setMiddleDialog" :visible.sync="newVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <el-form :model="newForm" status-icon :rules="newRules" ref="newForm" label-width="120px"
                         class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model.trim="newForm.name" autocomplete="off" size="small" clearable maxlength="10" placeholder="角色名称"></el-input>
                    </el-form-item>
                    <div class="flexHere">
                        <el-button type="primary" size="small" class="sameWidthBtn"
                                   @click="submitNewFormPass('newForm')">确 定
                        </el-button>
                        <el-button type="info" size="small" class="sameWidthBtn" @click="cancelNewFormPass('newForm')">取
                            消
                        </el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="删除角色" class="setRoot2Scoped setMiddleDialog" :visible.sync="deleteVisible" width="450px"
                   :close-on-click-modal="false" center>
            <div>
                <div class="dialogText">确认要删除该角色吗？</div>
                <div class="flexHere">
                    <el-button type="primary" size="small" class="sameWidthBtn" @click="submitDeletePass">确 定
                    </el-button>
                    <el-button type="info" size="small" class="sameWidthBtn" @click="cancelDeletePass">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'authConfig',
        data() {
            return {
                newVisible: false,
                newForm: {
                    name:'',
                },
                newRules: {
                    name:[
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                    ]
                },
                tableData: [],
                treeData1: [],
                defaultProps: {
                    children: 'sonList',
                    label: 'name'
                },
                deleteVisible: false,
                deleteId:'',
                permCodeList:[],
                currentRow:{
                    roleName:'',
                },
                loading: false,
                hasNextPage:false,
                dynamicPage:1,
            }
        },
        computed: {
            noMore () {
                return !this.hasNextPage
            },
            disabled () {
                return this.loading || this.noMore
            }
        },
        mounted() {
            this.fetchTree();
            this.fetchRoleList();
        },
        methods: {  
            handleCurrentChange(val){
                this.currentRow = val;
                this.fetchRolePermission(this.currentRow);
            },
            fetchRoleList(){
                let data = {
                    customerId:-1,
                    pageSize:20,
                    pageNum:this.dynamicPage,
                };
                this.ApiLists.roleList(data).then(res => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.tableData = data.list || [];
                        this.hasNextPage = data.hasNextPage;
                        if( this.dynamicPage == 1 ){
                            this.$refs.roleTable.setCurrentRow(this.tableData[0]);
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            loadingRoleList(){
                let data = {
                    customerId:-1,
                    pageSize:20,
                    pageNum:this.dynamicPage,
                };
                this.ApiLists.roleList(data).then(res => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        let bridge = data.list || [];
                        this.tableData = this.tableData.concat( bridge );
                        this.hasNextPage = data.hasNextPage;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            load(){
                console.log('触发load');
                this.loading = true;  
                setTimeout(() => {
                    if(this.hasNextPage){
                        this.dynamicPage++;
                    }
                    this.loadingRoleList(); 
                    this.loading = false
                }, 400)
            },
            saveAuthLists(){
                let permCodeList = this.$refs.tree.getCheckedNodes();
                let finalArr = permCodeList.map(ele=>{
                    return ele.id
                })          
                if(finalArr.length === 0){
                    return this.$message.error('请为该角色设置权限');
                }
                let data = {
                    roleId:this.currentRow.id,
                    permIdList:finalArr
                };
                this.ApiLists.roleAssignPermission(data).then(res => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.$message.success('权限设置成功!')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            fetchRolePermission(item){
                let params = {
                    roleId:item.id,
                };
                this.ApiLists.roleDetail(params).then(res => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        let processer = data || [];
                        if( processer.rolePermissionList && processer.rolePermissionList.length ){
                            let pureCode = data.rolePermissionList.map(ele=>{
                                return ele.permCode;
                            })
                            this.$refs.tree.setCheckedKeys(pureCode); 
                        }else{
                            this.$refs.tree.setCheckedKeys([]);
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },            
            clickDeal (currentObj, treeStatus) {
                // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
                let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
                // 选中
                if (selected !== -1) {
                    // 子节点只要被选中父节点就被选中
                    this.selectedParent(currentObj)
                    // 统一处理子节点为相同的勾选状态
                    this.uniteChildSame(currentObj, true)
                } else {
                    // 未选中 处理子节点全部未选中
                    if (currentObj && currentObj.sonList && currentObj.sonList.length !== 0) {
                        this.uniteChildSame(currentObj, false)
                    }
                }
            },
            // 统一处理子节点为相同的勾选状态
            uniteChildSame (treeList, isSelected) {
                let len = treeList && treeList.sonList && treeList.sonList.length > 0;
                console.log(len)
                this.$refs.tree.setChecked(treeList.id, isSelected)
                for (let i = 0;i <len; i++) {
                    this.uniteChildSame(treeList.sonList[i], isSelected)
                }
            },
            // 统一处理父节点为选中
            selectedParent (currentObj) {
                let currentNode = this.$refs.tree.getNode(currentObj)
                if (currentNode.parent.key !== undefined) {
                    this.$refs.tree.setChecked(currentNode.parent, true)
                    this.selectedParent(currentNode.parent)
                }
            },
            fetchTree(){
                this.ApiLists.permissionTree({source:1}).then(res => {                    
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.treeData1 = data || [];
                        if( !this.AuthBoolean('668') ){
                            let empty = [];
                            function loopItem(ele) {
                                if(ele.sonList && ele.sonList.length){
                                    ele.sonList.forEach((subEle)=>{
                                        loopItem(subEle);
                                        subEle.disabled = true;
                                        empty.push(subEle);
                                    })
                                }
                            }
                            this.treeData1.forEach( (ele,index)=>{
                                loopItem(ele);
                            } )
                            this.treeData1.forEach(ele=>{
                               ele.disabled = true; 
                            });
                        }                        
                        this.permCodeList = this.treeData1.map(ele=>{
                            return ele.permCode;
                        });   
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            handleDelete(row) {
                this.deleteVisible = true;
                this.deleteId = row.id;
            },
            addRole() {
                this.newVisible = true;
                this.$nextTick(()=>{
                    this.$refs.newForm.resetFields();
                });
            },
            submitNewFormPass(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        let data = {
                            customerId:-1,
                            roleName:this.newForm.name
                        };
                        this.ApiLists.addRole(data).then(res => {
                            let { data,respCode } = res;
                            if( respCode === 0 ){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });        
                                this.dynamicPage = 1;
                                this.fetchRoleList();
                                this.newVisible = false;
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        })                        
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancelNewFormPass(formName) {
                this.$refs[formName].resetFields();
                this.newVisible = false;
            },
            submitDeletePass() {
                let params = {
                    id:this.deleteId
                };
                this.ApiLists.delRole(params).then(res => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });   
                        this.dynamicPage = 1;
                        this.fetchRoleList();
                        this.deleteVisible = false;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })                 
            },
            cancelDeletePass() {
                this.deleteVisible = false;
            },
        },
    }
</script>
<style lang="scss" scoped>
    .authConfigCon {
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;
        .loadingInfo {
            text-align: center;
            font-size: 12px;
            color: #606266;
            margin-top: 10px;
        }
        .topCon {
            .topFirst {
                display: flex;
                justify-content: space-between;
                align-content: center;
                align-items: center;
            }
        }
        .saveBtn {
            margin-top: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        .bottomCon {
            display: flex;
            justify-content: space-between;
            align-content: center;
            margin-top: 20px;
            .roleftCon {
                width: 24%;
            }
            .roleRightCon {
                width: 68%;
                .treeTitle {
                    height: 50px;
                    text-align: center;
                    line-height: 50px;
                    background-color: #F0F2F5;
                }
                .commonTree {
                    width: 100%;
                    border: 1px solid #DCDFE6;
                    box-sizing: border-box;
                }                
                .lockTree {
                    padding: 20px;
                    box-sizing: border-box;
                    .treeSelf {
                        width: 300px;
                        margin: 0 auto;
                    }
                }
            }
        }
        .flexHere {
            display: flex;
            justify-content: center;
        }
        .dialogText {
            text-align: center;
            margin-bottom: 20px;
        }
        .listWrapper {
            max-height: 1100px;
            overflow:auto;
        }
    }
</style>
<style lang="scss">
    .authConfigCon {
        .setRoot1Scoped .el-dialog {
            height: 210px;
        }
        .setRoot2Scoped .el-dialog {
            height: 190px;
        }        
    }
</style>