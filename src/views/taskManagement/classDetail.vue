<template>
    <div class="class-detail">
        <div>
            <div class="nameColor">{{name}}</div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <template v-for="(item,index) in restTabArr">
                    <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
                </template>
            </el-tabs>
            <div class="tabContentCon">
                <classPeople v-if="activeName == '1' "></classPeople>
                <classPrice v-if="activeName == '2'"></classPrice>
                <classAttend v-if="activeName == '3'"></classAttend>
                <confirmationForm v-if="activeName == '4'"></confirmationForm>
            </div>
        </div>
    </div>
</template>
<script>
    import classPeople from './components/classPeople'
    import classPrice from './components/classPrice'
    import classAttend from './components/classAttendance'
    import confirmationForm from './components/confirmationForm'
    export default {
        name: 'classDetail',
        components: {classPeople, classPrice, classAttend, confirmationForm},
        data() {
            return {
                freezeStatus: '2',
                activeName: '',
                name: '中心局',
                restTabArr: [],
            }
        },
        mounted() {
            this.analyseQuery();
        },
        methods: {
            analyseQuery(){
                this.name = this.$route.query.schedulingName;                
                let empty = [];
                if( this.AuthBoolean('39') ){
                    empty.push({
                        title: '排班人员',
                        name: '1'
                    })
                }
                if( this.AuthBoolean('310') ){
                    empty.push({
                        title: '排班单价',
                        name: '2'
                    })
                }
                if( this.AuthBoolean('311') ){
                    empty.push({
                        title: '特殊考勤人员',
                        name: '3'
                    })
                }
                if( this.AuthBoolean('312') ){
                    empty.push({
                        title: '三方确认表',
                        name: '4'
                    })
                }
                this.restTabArr = empty;
                if( this.restTabArr.length ){
                    let target = this.restTabArr.find(ele=>{
                        return ele.name == this.$route.query.type; 
                    });
                    if( target ){
                        this.activeName = this.$route.query.type;
                    }
                }                
            },
            handleClick(tab, event) {
//            console.log(tab, event);
            },
            testEvent(pay) {
                console.log('这里', pay);
            },
        },
    }
</script>
<style scoped lang="scss">
    .class-detail {
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