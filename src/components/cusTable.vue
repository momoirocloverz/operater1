<template>
    <div class="cusTableCon">
      <table>
          <template v-for="(item) in tableData">
              <tr v-if="!item.isTrue">
                  <td style="width:30%">{{ item.title }}</td>
                  <td class="wrapCon" :class=" { highLight : item.highLight ? true : false } ">
                      <div class="wrap-box">
                          <div class="textItem" v-if="item.value && item.title !== '年龄范围'">
                              {{ item.value }}
                          </div>
                          <div v-else>
                            <div class="textItem" v-if="item.value && item.value.mageLowerLimit ">
                              {{`男 :${item.value.mageLowerLimit} - ${item.value.mageUpperLimit}岁`}}
                            </div>
                            <div class="textItem" v-if="item.value && item.value.fageLowerLimit ">
                              {{`女 :${item.value.fageLowerLimit} - ${item.value.fageUpperLimit}岁`}}
                            </div>
                          </div>
                          <el-button v-if="item.btnShow" type="info" size="small" @click="innerAction">{{ item.btnText }}</el-button>
                      </div>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>
<script>
export default {
    name: 'cusTable',
    props:{
        tableData:{
            type:Array,

        },
    }, 
    methods:{
        innerAction(){
            this.$emit( 'bindEvent' );
        }
    },
}
</script>
<style scoped lang="scss">
    .cusTableCon {
        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0px;
            tr {
                &:nth-child(odd) {
                    background-color:#F0F2F5;
                }
            }
            td {
                padding-left: 20px;
                height: 50px;
                line-height: 50px; 
                box-sizing: border-box;
                border: 1px solid #EBEEF5;
                color: #606266;
                font-size: 12px;
            }
            .wrapCon {
                .wrap-box{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
            }
            .textItem {
                margin-right: 40px;
            }
            .highLight {
                color: #5C7099;
            }
        }
    }
</style>