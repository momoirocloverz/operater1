<template>
    <div class="class-tab">
        <div>
            <div class="nameColor">{{name}}</div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <template v-for="(item,index) in restTabArr">
                    <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
                </template>
            </el-tabs>
            <div class="tabContentCon">
                <div class="class-tab-wrap" v-if="activeName == '1' ">
                    <div class="class-tab-left">
                        <div>
                            <div class="itemTitle">任务需求</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData1" :key="1"></CusTable>
                                </div>
                            </div>
                        </div>
                        <div class="mt20">
                            <div class="itemTitle">结算模式</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData2" :key="2"></CusTable>
                                </div>
                            </div>
                        </div>
                        <div class="mt20">
                            <div class="itemTitle">管理要求</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData3" :key="3"></CusTable>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="class-tab-right">
                        <div>
                            <div class="itemTitle">人员要求</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData4" :key="4"></CusTable>
                                </div>
                            </div>
                        </div>
                        <div class="mt20">
                            <div class="itemTitle">打卡要求</div>
                            <div class="divideCon">
                                <div class="divideItem">
                                    <CusTable :tableData="tableData5" :key="5"></CusTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ClassView v-if="activeName == '2' "/>
            </div>
        </div>
    </div>
</template>
<script>
    import ClassView from './components/classView'

    export default {
        name: 'classTab',
        components: {ClassView},
        data() {
            return {
                freezeStatus: '2',
                activeName: '',
                name: '中心局晚班',
                restTabArr: [],
                tableData1: [],
                tableData2: [],
                tableData3: [],
                tableData4: [],
                tableData5: [],
            }
        },
        created(){
            this.getDetail()
        },
        mounted() {
            this.reGenerate();
        },
        methods: {
            reGenerate(){
                let empty = [];
                if( this.AuthBoolean('211') ){
                    empty.push({
                        title: '任务详情',
                        name: '1'
                    })
                }
                if( this.AuthBoolean('212') ){
                    empty.push({
                        title: '查看排班',
                        name: '2'
                    })
                }
                this.restTabArr = empty;
                if( this.restTabArr.length ){
//                    this.activeName = this.restTabArr[0].name;
                    let find = this.restTabArr.find(ele=>{
                        return ele.name == this.$route.query.type;
                    })
                    if( find ){
                        this.activeName = this.$route.query.type;
                    }
                }
            },
            handleClick(tab, event) {
//            console.log(tab, event);
            },
            getDetail() {
                this.ApiLists.taskDetail({taskId: this.$route.query.id}).then(res => {
                    let result = res.data;
                    this.name = result.taskName;
                    this.tableData1 = [
                        {title: '创建者', value:result.customerName},
                        {title: '执行人', value:result.recCustomerName},
                        {title: '任务开始时间', value: result.startTime},
                        {title: '任务结束时间', value: result.endTime ? result.endTime : '长期'},
                        {title: '预期工量', value: result.expectPieceSize || '暂无'},
                        {title: '预期总价', value: result.expectMoney || '暂无'},
                        {title: '任务说明', value: result.otherDemand || '暂无'},
                    ];
                    this.tableData2 = [
                        {title: '结算周期', value: this.$dictionary.settlementType[result.settlementType] || '无'},
                        {title: '计价方式', value: this.$dictionary.valuationType[result.valuationType] || '无'},
                        {title: '单价', value: this.$priceFor(null,null,result.price)},
                    ];
                    this.tableData3 = [
                        {title: '排班单价审核', value:this.$dictionary.needPriceCheck[result.needPriceCheck] || '无'},
                        {title: '第三方结算确认',value:this.$dictionary.needConfirm[result.needConfirm] || '无', btnShow: false, btnText: '查看设置'},
                        {title: '第三方全称', value:result.thirdPerson || '无',isTrue:result.needConfirm !== 1},
                        {title: '结算确认人', value:result.taskConfirms && result.taskConfirms.name || '无',isTrue:result.needConfirm !== 1},
                        {title: '排班是否可修改考勤', value:this.$dictionary.isModifyPunch[result.isModifyPunch] || '无'},
                        {title: '排班内奖惩限制', value:this.$dictionary.rewardLimit[result.rewardLimit] || '无', btnShow: false, btnText: '查看设置'},
                        {title: '单个零工奖励上限', value:result.rewardPersonLimit || 0 + '元',isTrue:result.rewardLimit !== 1},
                        {title: '每日排班奖励上限(合计)', value:result.rewardSchedulingLimit || 0 + '元',isTrue:result.rewardLimit !== 1},
                    ];
                    this.tableData4 = [
                        {title: '每日排班人数', value: result.authorizedNumber || 0},
                        {title: '所需技能标签', value: [...Object.values(result.industryMap)].join(',')},
                        {title: '性别要求', value: this.$dictionary.sexLimt[result.sexLimt]},
                        {title: '年龄范围', value: result } 
                    ];
                    this.tableData5 = [
                        {title: '开始打卡', value: result.workStartTime},
                        {title: '结束打卡', value: this.$dictionary.endWorkType[result.endWorkType] + ' ' + result.workEndTime},
                        {title: '打卡方式', value: this.$dictionary.punchWay[result.punchWay]},
                        {title: '打卡地点', value: result.workingPlace},
                        {title: '打卡范围', value: result.punchRange + 'm'},
                        {title: '人脸打卡', value:this.$dictionary.isFacePunch[result.isFacePunch]},
                    ];
                }).catch(err => {
                    console.log(err)
                })
            },
            testEvent(pay) {
                console.log('这里', pay);
            },
        },
    }
</script>
<style scoped lang="scss">
    .class-tab {
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;

        .class-tab-wrap {
            display: flex;
            width: 100%;
            justify-content: space-between;

            .class-tab-left {
                display: flex;
                flex-direction: column;
                width: 49%;
            }

            .class-tab-right {
                display: flex;
                flex-direction: column;
                width: 49%;
            }
        }

        .divideCon {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .divideItem {
                width: 100%;
            }
        }

        .nameColor {
            color: #303133;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .itemTitle {
            color: #606266;
            font-size: 14px;
            margin-bottom: 10px;
            margin-top: 10px;
        }
    }
</style>