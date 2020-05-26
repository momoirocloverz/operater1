<template>
    <div class="example1Con">
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
                <el-select size="small" class="lockWidth" v-model="form.sex" placeholder="性别">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.auth" placeholder="实名认证">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="small" class="lockWidth" v-model="form.status" placeholder="账号状态">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="bottomCon">
            <div class="tableCon">
                <el-table :data="tableData" height="530" stripe style="width: 100%">
                    <el-table-column prop="id" label="ID" width="80"></el-table-column>
                    <el-table-column prop="name" label="花名" width="80"></el-table-column>
                    <el-table-column prop="address" label="姓名"></el-table-column>
                    <el-table-column prop="address" label="角色"></el-table-column>
                    <el-table-column prop="address" label="手机号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="注册时间" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" @click="handleEdit(scope)">修改</el-button>
                            <el-button size="mini" type="text" @click="handleEdit(scope)">授权</el-button>
                            <el-button size="mini" type="text" @click="handleEdit(scope)">重置密码</el-button>
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
                    {label: '你好', value: 1},
                    {label: '第二条', value: 2},
                ],
                options1: [
                    {label: '你好', value: 1},
                    {label: '第二条', value: 2},
                ],
                options2: [
                    {label: '你好', value: 1},
                    {label: '第二条', value: 2},
                ],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                tableData: [
                    {
                        id: '02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        id: '05',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1517 弄'
                    }, {
                        id: '20',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        id: '20',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }, {
                        id: '20',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }, {
                        id: '20',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    },
                ],
            }
        },
        mounted() {

        },
        methods: {
            handleEdit() {

            },
            handleSizeChange() {

            },
            handleCurrentChange() {

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