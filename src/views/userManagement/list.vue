<template>
    <div class="example1Con" v-loading="loading" element-loading-text="正在请求中...">
        <div class="topCon">
            <div class="topFirst">
                <div>
                    <el-input v-model="form.name" class="lockWidth" size="small" placeholder="用户姓名"
                              clearable></el-input>
                    <el-input v-model="form.id" class="lockWidth" size="small" placeholder="用户ID"
                              clearable></el-input>
                    <el-input v-model="form.mobile" class="lockWidth" size="small" placeholder="手机号"
                              clearable></el-input>
                    <el-button type="info" size="small" icon="el-icon-search" @click="searchData()">搜 索</el-button>
                </div>
            </div>
            <div class="topSec">
                <el-select size="small" class="lockWidth" v-model="form.sex" placeholder="性别"
                @change="searchData">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.auth" placeholder="实名认证"
                           @change="searchData">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.status" placeholder="账号状态"
                           @change="searchData">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="userId" label="ID" width="80"></el-table-column>
                    <el-table-column prop="realNameAlias" label="姓名"></el-table-column>
                    <el-table-column prop="sex" :formatter="sexFor" label="性别"></el-table-column>
                    <el-table-column prop="age" :formatter="ageFor" label="年龄"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="type" :formatter="typeFor" label="实名认证" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" :formatter="statusFor" label="账号状态" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" v-if="AuthBoolean('620')">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" v-Auth="'620'" @click="handleEdit(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagCon">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'exa',
        data() {
            return {
                form: {
                    name: '',
                    id: '',
                    mobile: '',
                    auth: '',
                    sex: '',
                    status: '',
                },
                options: [
                    {label: '不限', value: -1},
                    {label: '男', value: 1},
                    {label: '女', value: 2},
                ],
                options1: [
                    {label: '不限', value: -1},
                    {label: '未认证', value:0},
                    {label: '已认证', value:1},
                ],
                options2: [
                    {label: '不限', value: -1},
                    {label: '正常', value: 1},
                    {label: '冻结', value: 2},
                ],
                loading:false,
                currentPage: 1,
                pageSize: 20,
                total: 0,
                tableData: [],
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleEdit(row) {
                const { href } = this.$router.resolve({
                    path: '/main/userList/userDetail',
                    query:row
                });
                window.open(href, "_blank");
            },
            searchData(){
                this.currentPage = 1
                this.getList()
            },
            getList(){
                this.loading = true;
                this.ApiLists.listTalent({
                    userId:this.form.id,
                    realNameAlias:this.form.name,
                    sex:this.form.sex === -1 ? '' : this.form.sex,
                    // age:'',
                    mobile:this.form.mobile,
                    status:this.form.status === -1 ? '' : this.form.status,
                    type:this.form.auth === -1 ? '' : this.form.auth,
                    // idCard:'',
                    pageNum:this.currentPage,
                    pageSize:this.pageSize,
                }).then(res => {
                    if(res.respCode === 0){
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }
                }).catch(err => {

                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            typeFor(row,col,val){
                //0未认证1：已认证
                if(Number(val) === 0){
                    return '未认证'
                }else if(Number(val) === 1){
                    return '已认证'
                }
                return '-'
            },
            sexFor(row,col,val){
                //0未认证1：已认证
                if(Number(val) === 1){
                    return '男'
                }else if(Number(val) ===2){
                    return '女'
                }
                return '-'
            },
            ageFor(row,col,val){
                //0未认证1：已认证
                if(val){
                    return val
                }
                return '-'
            },
            statusFor(row,col,val){
                //1：可用2：冻结
                if(Number(val) === 1){
                    return '正常'
                }else if(Number(val) === 2){
                    return '冻结'
                }
                return '-'
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .example1Con {
        .topCon {
            .lockWidth {
                width: 200px;
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