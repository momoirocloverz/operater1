<template>
  <div class="dataListCon" v-loading="loading" element-loading-text="正在请求中...">
    <div>

      <h4 class="pl50">数据</h4>
      <div class="pl50 pt20 pb20">
        <el-row class="f14 " :gutter="20" v-for="(item,index) in data" :key="index">
          <el-col :span="4">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.name}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.busNum}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.personalBus}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.personal}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.personalReal}}</div>
          </el-col>
        </el-row>
      </div>

      <div class="pl50 pt20 pb20">
        <el-row class="f14 " :gutter="20" v-for="(item,index) in data2" :key="index">
          <el-col :span="4">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.name}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.busNum}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.personalBus}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple" :class="{'f16':item.fontBold}">{{item.personal}}</div>
          </el-col>
          <!--<el-col :span="5"><div class="grid-content bg-purple" :class="{'f16':item.fontBold}"></div></el-col>-->
        </el-row>
      </div>

      <div class="pt30">
        <el-row class="flex-box flex-right pr30 pt30 pos-r">
          <el-button type="primary" plain v-for="(item, index) in btnList" :class="{'btn-active':index === activeIndex}" @click="searchData(item,index,1)" :key="index">{{item.name}}
          </el-button>
          <el-date-picker v-model="valueDate" type="daterange" ref="datePicker" class="dete-one-box" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="handleChangeDateRange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-row>
        <div v-show="showNull" style="width:100%; height:450px;background:#ffffff;text-align:center;padding-top:160px">暂无数据
        </div>
        <div v-show="!showNull">
          <div id="chartBus" style="width:100%; height:450px;background:#ffffff;"></div>
        </div>
        <div class="pt30 pb20"></div>
        <el-row class="flex-box flex-right pr30 pt30 mt20 pos-r">
          <el-button type="primary" plain v-for="(item, index) in btnUserList" :class="{'btn-active':index === activeUserIndex}" @click="searchData(item,index,2)" :key="index">{{item.name}}
          </el-button>
          <el-date-picker v-model="valueUserDate" type="daterange" ref="dateUserPicker" class="dete-one-box" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="handleChangeDateUser" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-row>
        <div v-show="showNullUser" style="width:100%; height:450px;background:#ffffff;text-align:center;padding-top:160px">暂无数据
        </div>
        <div v-show="!showNullUser">
          <div id="chartUser" style="display:block;width:100%; height:450px;background:#ffffff;"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Datalist',
  data() {
    return {
      data: [{
        name: '',
        busNum: '企业商家',
        personalBus: '个人商家',
        personal: '个人版用户',
        personalReal: '个人版实名用户',
        fontBold: true
      }, {
        name: '今日数据',
        busNum: 0,//
        personalBus: 0,
        personal: 0,
        personalReal: 0,
      }, {
        name: '昨日数据',
        busNum: 0,
        personalBus: 0,
        personal: 0,
        personalReal: 0,
      }, {
        name: '历史累计',
        busNum: 0,
        personalBus: 0,
        personal: 0,
        personalReal: 0,
      }],
      data2: [{
        name: '',
        busNum: '发布任务',
        personalBus: '发布排班',
        personal: '出勤',
        fontBold: true
      }, {
        name: '今日数据',
        busNum: '2432',
        personalBus: '2368',
        personal: '2326',
      }, {
        name: '昨日数据',
        busNum: '2432',
        personalBus: '2368',
        personal: '2326',
      }, {
        name: '历史累计',
        busNum: '2432',
        personalBus: '2368',
        personal: '2326',
      }],
      btnList: [{ name: '近7天', type: 1 }, { name: '近14天', type: 2 }, { name: '近30天', type: 3 }, {
        name: '自定义',
        type: 4
      }],
      btnUserList: [{ name: '近7天', type: 1 }, { name: '近14天', type: 2 }, { name: '近30天', type: 3 }, {
        name: '自定义',
        type: 4
      }],
      options: {
        title: {
          text: '商家',
          left: '2%'
        },
        tooltip: {
          trigger: 'axis',
          // formatter:function (params) {
          //     console.log(params)
          //     if(params.length > 0){
          //         let str = '日期:';
          //         str += `${params[0].name} <br/>`;
          //         for(let item of params){
          //             str += `${item.seriesName}: ${item.value}  <br/>`
          //         }
          //         return str
          //     }
          //
          // }
        },
        legend: {
          left: '10%',
          icon: 'circle',
          data: ['企业商家', '个人商家']
        },
        grid: {
          top: '20%',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          name: '',
          data: []
        },
        yAxis: {
          type: 'value',
          name: '(人)',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '企业商家',
            type: 'line',
            smooth: true,
            data: [],
            itemStyle: {
              normal: {
                color: '#35c460'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
          }, {
            name: '个人商家',
            type: 'line',
            smooth: true,
            data: [],
            itemStyle: {
              normal: {
                color: '#108ee9'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
          }
        ]
      },
      optionsUser: {
        title: {
          text: '用户',
          left: '2%'
        },
        tooltip: {
          trigger: 'axis',
          // formatter:function (params) {
          //     console.log(params)
          //     if(params.length > 0){
          //         let str = '日期:';
          //         str += `${params[0].name} <br/>`;
          //         for(let item of params){
          //             str += `${item.seriesName}: ${item.value}  <br/>`
          //         }
          //         return str
          //     }
          //
          // }
        },
        legend: {
          left: '10%',
          icon: 'circle',
          data: ['用户量', '实名用户']
        },
        grid: {
          top: '20%',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          name: '',
          data: []
        },
        yAxis: {
          type: 'value',
          name: '(人)',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '用户量',
            type: 'line',
            smooth: true,
            data: [],
            itemStyle: {
              normal: {
                color: '#35c460'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
          }, {
            name: '实名用户',
            type: 'line',
            smooth: true,
            data: [],
            itemStyle: {
              normal: {
                color: '#108ee9'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
          }
        ]
      },
      form: {
        startDate: '',
        endDate: '',
        startUserDate: '',
        endUserDate: '',
      },
      activeIndex: 0,
      activeUserIndex: 0,
      valueDate: '',
      valueUserDate: '',
      loading: false,
      showNullUser: false,
      showNull: false,
    }
  },
  created() {
    this.searchData({ type: 1 }, 0, 1);
    this.getList()
    this.searchData({ type: 1 }, 0, 2);
  },
  mounted() {

  },
  methods: {
    searchData(item, index, paramType) {
      if (paramType === 1) {
        this.activeIndex = index;
      } else if (paramType === 2) {
        this.activeUserIndex = index;
      }
      let type = Number(item.type);
      switch (type) {
        case 1:
          if (paramType === 1) {
            this.form.startDate = this.Dayjs().subtract(8, 'day').format('YYYY-MM-DD');
            this.form.endDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnList[3].name = `自定义`
          } else if (paramType === 2) {
            this.form.startUserDate = this.Dayjs().subtract(8, 'day').format('YYYY-MM-DD');
            this.form.endUserDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnUserList[3].name = `自定义`
          }
          this.getEcharts(paramType)
          // this.form.endDate = this.Dayjs().format('YYYY-MM-DD');
          break;
        case 2:
          if (paramType === 1) {
            this.form.startDate = this.Dayjs().subtract(15, 'day').format('YYYY-MM-DD');
            this.form.endDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnList[3].name = `自定义`
          } else if (paramType === 2) {
            this.form.startUserDate = this.Dayjs().subtract(15, 'day').format('YYYY-MM-DD');
            this.form.endUserDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnUserList[3].name = `自定义`
          }
          this.getEcharts(paramType)
          break;
        case 3:
          if (paramType === 1) {
            this.form.startDate = this.Dayjs().subtract(31, 'day').format('YYYY-MM-DD');
            this.form.endDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnList[3].name = `自定义`
          } else if (paramType === 2) {
            this.form.startUserDate = this.Dayjs().subtract(31, 'day').format('YYYY-MM-DD');
            this.form.endUserDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnUserList[3].name = `自定义`
          }
          this.getEcharts(paramType)
          break;
        case 4:
          if (paramType === 1) {
            this.$refs.datePicker.focus()
          } else if (paramType === 2) {
            this.$refs.dateUserPicker.focus()
          }
          break;
        default:
          if (paramType === 1) {
            this.form.startDate = this.Dayjs().subtract(8, 'day').format('YYYY-MM-DD');
            this.form.endDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnList[3].name = `自定义`
          } else if (paramType === 2) {
            this.form.startUserDate = this.Dayjs().subtract(8, 'day').format('YYYY-MM-DD');
            this.form.endUserDate = this.Dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            this.btnUserList[3].name = `自定义`
          }
          this.getEcharts(paramType)
          break;
      }
    },
    getList() {
      let params = {}
      this.ApiLists.dataManageBaseData(params).then(res => {
        if (res.respCode === 0) {
          let result = [...res.data];
          this.dataAdd(result)
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    dataAdd(result) {
      this.data = [{
        name: '',
        busNum: '企业商家',
        personalBus: '个人商家',
        personal: '个人版用户',
        personalReal: '个人版实名用户',
        fontBold: true
      }, {
        name: '今日数据',
        busNum: result[0].todayCount,//
        personalBus: result[1].todayCount,
        personal: result[2].todayCount,
        personalReal: result[3].todayCount,
      }, {
        name: '昨日数据',
        busNum: result[0].count,//
        personalBus: result[1].count,
        personal: result[2].count,
        personalReal: result[3].count,
      }, {
        name: '历史累计',
        busNum: result[0].totalCount,//
        personalBus: result[1].totalCount,
        personal: result[2].totalCount,
        personalReal: result[3].totalCount,
      }]
      this.data2 = [{
        name: '',
        busNum: '发布任务',
        personalBus: '发布排班',
        personal: '出勤',
        fontBold: true
      }, {
        name: '今日数据',
        busNum: result[4].todayCount,//
        personalBus: result[5].todayCount,
        personal: result[6].todayCount,
      }, {
        name: '昨日数据',
        busNum: result[4].count,//
        personalBus: result[5].count,
        personal: result[6].count,
      }, {
        name: '历史累计',
        busNum: result[4].totalCount,//
        personalBus: result[5].totalCount,
        personal: result[6].totalCount,
      }]
    },
    getEcharts(paramType) {
      this.loading = true;
      let params = {
        start: paramType === 1 ? this.form.startDate : this.form.startUserDate,
        end: paramType === 1 ? this.form.endDate : this.form.endUserDate,
        type: paramType,
      }
      this.ApiLists.dataManageChartData(params).then(res => {
        if (res.respCode === 0) {
          let { x, y } = res.data;
          if (paramType === 1) {//商家
            this.options.xAxis.data = x;
            this.options.series[0].data = y[1];
            this.options.series[1].data = y[2];
            this.handleShowNull(y[1], y[2]);
            let chartmainline = this.$echarts.init(document.getElementById("chartBus"));
            chartmainline.setOption(this.options)
            setTimeout(() => {
              chartmainline.resize();
              console.log(this.optionsUser.series)
            })
            console.log(1)
          } else if (paramType === 2) {//用户
            this.optionsUser.xAxis.data = x;
            this.optionsUser.series[0].data = y[3];
            this.optionsUser.series[1].data = y[4];
            this.handleShowUserNull(y[3], y[4]);
            let chartUser = this.$echarts.init(document.getElementById("chartUser"));
            chartUser.setOption(this.optionsUser);
            setTimeout(() => {
              chartUser.resize();
              console.log(this.optionsUser.series)
            })
          }
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 300)
      })
    },
    handleShowNull(list, list2) {
      if (list.every(it => it === 0) && list2.every(it => it === 0)) {
        this.showNull = true;
      } else {
        this.showNull = false;
      }
    },
    handleShowUserNull(list, list2) {
      if (list.every(it => it === 0) && list2.every(it => it === 0)) {
        this.showNullUser = true;
      } else {
        this.showNullUser = false;
      }
    },
    handleChangeDateRange(val) {
      if (val) {
        this.form.startDate = val[0];
        this.form.endDate = val[1];
        this.btnList[3].name = `${this.form.startDate}-${this.form.endDate}`
      } else {
        this.form.startDate = '';
        this.form.endDate = '';
        this.btnList[3].name = `自定义`
      }
      console.log(this.form.startDate);
      console.log(this.form.endDate)
      this.getEcharts(1)
    },
    handleChangeDateUser(val) {
      if (val) {
        this.form.startUserDate = val[0];
        this.form.endUserDate = val[1];
        this.btnUserList[3].name = `${this.form.startUserDate}-${this.form.endUserDate}`
      } else {
        this.form.startUserDate = '';
        this.form.endUserDate = '';
        this.btnUserList[3].name = `自定义`
      }
      console.log(this.form.startUserDate);
      console.log(this.form.endUserDate)
      this.getEcharts(2)
    },
  },
}
</script>
<style lang="scss" scoped>
.dataListCon {
  .dete-one-box {
    position: absolute;
    right: 330px;
    z-index: -1;
    opacity: 0;
  }
}
</style>
<style lang="scss">
.dataListCon {
  .btn-active {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
    outline: 0;
  }

  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    /*border-radius: 4px;*/
    border-right: 1px solid #eee;
  }

  .bg-purple-dark {
    /*background: #99a9bf;*/
  }

  .bg-purple {
    /*background: #d3dce6;*/
  }

  .bg-purple-light {
    /*background: #e5e9f2;*/
  }

  .grid-content {
    border-radius: 4px;
    min-height: 45px;
  }

  .row-bg {
    padding: 10px 0;
    /*background-color: #f9fafc;*/
  }
}
</style>