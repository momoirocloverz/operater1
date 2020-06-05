<template>
    <div class="class-price">
        <div style="margin-top: 40px">
            <el-table :data="tableData"  :span-method="objectSpanMethod"  border  style="width: 100%; margin-top: 20px">
                <el-table-column  prop=""  label="技能标签">
                    <template v-slot="scope">
                        <div>{{scope.row.industryName}} <span>{{$dictionary.needConfirm[scope.row.status]}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column  prop="workStartTime"  label="预期开始时间"></el-table-column>
                <el-table-column  prop=""  label="预期结束时间">
                    <template v-slot="scope">
                        <div v-if="scope.row.status === 1"><span>{{$dictionary.endWorkType[scope.row.endWorkType]}}</span> {{scope.row.workEndTime}} </div>
                    </template>
                </el-table-column>
                <el-table-column  label="结算周期">
                    <template v-slot="scope">
                        <div v-if="scope.row.status === 1" class="settlementTypeCon">
                            {{$dictionary.settlementType[scope.row.settlementType]}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  prop="sex" label="性别" :formatter="genderFormat"></el-table-column>
                <el-table-column label="计价方式">
                    <template v-slot="scope">
                        <div v-if="scope.row.status === 1">{{$dictionary.valuationType[scope.row.valuationType]}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="单价">
                    <template v-slot="scope">
                        <div v-if="scope.row.status === 1">{{ $priceFor(scope.row,null,scope.row.price,1) }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "class-price",
        data() {
            return {
                tableData:[],
            }
        },
        mounted() {
            this.getaskSalaryList()
        },
        methods: {
            genderFormat(row, column, cellValue, index){
                if(row.status === 1){
                    if( cellValue == 1 ){
                        return '男';
                    }else if(cellValue == 2){
                        return '女';
                    }else{
                        return '不限'
                    }
                }else{
                    return ''
                }
            },
            /*
             *   表格多行多列
             */
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if(row.status === 1){
                    if (columnIndex === 3) {
                        if (rowIndex % 2 === 0) {
                            return {
                                rowspan: 2,
                                colspan: 1
                            };
                        } else {
                            return {
                                rowspan: 0,
                                colspan: 0
                            };
                        }
                    }
                }else{
                    return {
                        rowspan: 1,
                        colspan: 1
                    };
                }
                if (columnIndex < 3) {
                    if (rowIndex % 6 === 0) {
                        return {
                            rowspan: 6,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            getaskSalaryList() {
                const params = {
                    taskInfoId: this.$route.query.taskId,
                    schedulingId: this.$route.query.schedulingId,
                }
                this.ApiLists.latestPrice(params).then((res) => {
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        let _arr = [];
                        data.forEach((item,index) => {
                            if(item.status === 1){
                                let salary = JSON.parse(item.salary);
                                delete item.salary
                                salary.forEach((subItem,subIndex) => {
                                    subItem.price.forEach(child=>{
                                        _arr.push({
                                            ...item,
                                            valuationType:child.valuationType,
                                            sex:child.sex,
                                            settlementType:subItem.settlementType,
                                            price:JSON.stringify(child)
                                        });
                                    })
                                })
                            }else{
                                _arr.push(item)
                            }
                        })
                        this.tableData = _arr;
                    }
                }).catch((error) => {
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .settlementTypeCon {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        .valuationText {
            padding: 3px 6px;
            border-radius: 3px;
            border: 1px solid #e84518;
            margin-left: 5px;
        }
    }
</style>
<style lang="scss">
    .class-price {
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }
    }
</style>