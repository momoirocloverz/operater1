<template>
    <div class="user-detail">
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <template v-for="(item,index) in restTabArr">
                    <el-tab-pane :label="item.title" :name="item.name"></el-tab-pane>
                </template>
            </el-tabs>
            <div class="tabContentCon">
                <Detail :userId="data.userId" v-if="activeName == '1'">
                </Detail>
                <Record :userId="data.userId" v-if="activeName == '2'">
                </Record>
            </div>
        </div>
    </div>
</template>
<script>
    import Detail from './components/detail'
    import Record from './components/record'
    export default {
        name: "userDetail",
        components:{Detail,Record},
        data(){
            return {
                activeName: '',
                restTabArr: [],
                data:{}
            }
        },
        created(){
            this.data = this.$route.query;
        },
        mounted(){
            this.reGenerate();
        },
        methods:{
            reGenerate(){
                let empty = [];
                if( this.AuthBoolean('26') ){
                    empty.push({
                        title: '信息详情',
                        name: '1'
                    })
                }
                if( this.AuthBoolean('27') ){
                    empty.push({
                        title: '操作记录',
                        name: '2'
                    })
                }
                this.restTabArr = empty;
                if( this.restTabArr.length ){
                    this.activeName = this.restTabArr[0].name;
                }
            },
            handleClick(tab, event) {
//            console.log(tab, event);
            },
        },
    }
</script>

<style scoped>
    .user-detail{
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;
    }
</style>