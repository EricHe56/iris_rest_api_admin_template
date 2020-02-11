<template>
  <div :class="isTopLevel ? 'inner-content' : 'inner-sub-content'">
    <el-breadcrumb v-if="isTopLevel" separator="/">
      <el-breadcrumb-item
        v-for="(subBreadcrumb, index) in $store.state.subBreadcrumbs"
        :key="new Date().getTime() + '-' + index"
      >
        <a
          v-if="$store.state.subBreadcrumbs.length > index + 1"
          href="JavaScript:void(0)"
          @click="closeSubForm(index)"
        >{{ $store.state.subBreadcrumbs[index].title }}</a>{{
          $store.state.subBreadcrumbs.length === index + 1
            ? $store.state.subBreadcrumbs[index].title
            : ''
        }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div
      class="app-container"
      :style="
        isTopLevel
          ? 'margin: 15px 0px 0px 0px;padding: 30px; min-height: calc(100% - 80px);'
          : 'margin: 0px 0px 0px 0px; height: 100%;'
      "
    >
      <!-- 日访问 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="5">
          <span style="font-size: 22px;">日访问</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin-right: 20px;">
          <el-date-picker
            v-model="dailyVisitTrendDate"
            type="date"
            :picker-options="dayPickerOptions"
            placeholder="选择日期"
            :clearable="false"
            @change="changedDailyDate"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col><basicChartBox
          :id="'ur_bar_01'"
          :option-data="daily.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <!-- <el-col :span="12"
          ><tableBox
            :tableData="dailyVisitTrend.table"
            style="height: 300px;width: 100%;"
        /></el-col> -->
      </el-row>
      <!-- 周访问 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="5">
          <span style="font-size: 22px;">周访问</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin-right: 20px;">
          <el-date-picker
            v-model="weeklyVisitTrendDate"
            type="week"
            format="yyyy 第 WW 周"
            :picker-options="weekPickerOptions"
            placeholder="选择周"
            :clearable="false"
            @change="changedWeeklyDate"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col><basicChartBox
          :id="'ur_bar_02'"
          :option-data="weekly.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <!-- <el-col :span="12"
          ><tableBox
            :tableData="dailyVisitTrend.table"
            style="height: 300px;width: 100%;"
        /></el-col> -->
      </el-row>
      <!-- 月访问 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="5">
          <span style="font-size: 22px;">月访问</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin-right: 20px;">
          <el-date-picker
            v-model="monthlyVisitTrendDate"
            type="month"
            :picker-options="monthPickerOptions"
            placeholder="选择月"
            :clearable="false"
            @change="changedMonthlyDate"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col><basicChartBox
          :id="'ur_bar_03'"
          :option-data="monthly.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <!-- <el-col :span="12"
          ><tableBox
            :tableData="dailyVisitTrend.table"
            style="height: 300px;width: 100%;"
        /></el-col> -->
      </el-row>
      <DialogBox
        v-if="dialogVisible"
        :dialog="delDialog"
        @closeDialogBox="closeDialogBox"
      />
    </div>
  </div>
</template>

<script>
import DialogBox from '@/views/faq_manage/components/dialogBox'
// import mapChartBox from '@/views/general-infor/analysis/components/mapChartBox'
import basicChartBox from '@/views/analysis/components/basicChartBox'
// import tableBox from '@/views/general-infor/analysis/components/tableBox'

export default {
  name: 'UserVisitTrend',
  components: {
    DialogBox,
    // mapChartBox,
    basicChartBox
    // tableBox
  },
  filters: {
    pagination(array, pageIndex, pageSize) {
      const offset = (pageIndex - 1) * pageSize
      const data =
        offset + pageSize >= array.length
          ? array.slice(offset, array.length)
          : array.slice(offset, offset + pageSize)
      return data
    }
  },
  props: {
    parentItem: {
      type: Object,
      default: () => {
        return {
          subFormIndex: 0
        }
      }
    }
  },
  data() {
    return {
      dateRange: 'test',
      dailyVisitTrend: null,
      dailyVisitTrendDate: new Date('2019-11-11'),
      dayPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 3600000
        },
        firstDayOfWeek: 1
      },
      weeklyVisitTrend: null,
      weeklyVisitTrendDate: new Date('2019-11-11'),
      weekPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 7 * 24 * 3600000
        },
        firstDayOfWeek: 1
      },
      monthlyVisitTrend: null,
      monthlyVisitTrendDate: new Date('2019-11-11'),
      monthPickerOptions: {
        disabledDate(time) {
          var year = new Date().getFullYear()
          var month = new Date().getMonth()
          return time.getTime() >= new Date(year, month, 1)
        },
        firstDayOfWeek: 1
      },

      defaultData: {
        chart: null,
        table: {
          listLoading: true,
          titleList: ['标题', '数值', '占比'],
          dataList: []
        },
        emptyData: {
          session_cnt: 0,
          visit_pv: 0,
          visit_uv: 0,
          visit_uv_new: 0,
          stay_time_session: 0,
          visit_depth: 0
        }
      },
      dialogVisible: false,
      delDialog: {},
      isTopLevel: true
    }
  },
  computed: {
    daily: {
      get: function() {
        if (this.dailyVisitTrend === null) return this.defaultData
        var dataList = {}
        if (this.dailyVisitTrend.list.length === 0) {
          dataList = this.defaultData.emptyData
        } else {
          dataList = this.dailyVisitTrend.list[0]
        }
        var chartTitle = '日访问'
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        var subTitle = ''
        if (typeof this.dailyVisitTrend.ref_date !== 'undefined') { subTitle = this.dailyVisitTrend.ref_date.replace('-', ' 至 ') }
        return this.fillBarData(dataList, chartTitle, color, subTitle)
      }
    },
    weekly: {
      get: function() {
        if (this.weeklyVisitTrend === null) return this.defaultData
        var dataList = {}
        if (this.weeklyVisitTrend.list.length === 0) {
          dataList = this.defaultData.emptyData
        } else {
          dataList = this.weeklyVisitTrend.list[0]
        }
        var chartTitle = '周访问'
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        var subTitle = ''
        if (typeof this.weeklyVisitTrend.ref_date !== 'undefined') { subTitle = this.weeklyVisitTrend.ref_date.replace('-', ' 至 ') }
        return this.fillBarData(dataList, chartTitle, color, subTitle)
      }
    },
    monthly: {
      get: function() {
        if (this.monthlyVisitTrend === null) return this.defaultData
        var dataList = {}
        if (this.monthlyVisitTrend.list.length === 0) {
          dataList = this.defaultData.emptyData
        } else {
          dataList = this.monthlyVisitTrend.list[0]
        }
        var chartTitle = '月访问'
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        var subTitle = ''
        if (typeof this.monthlyVisitTrend.ref_date !== 'undefined') { subTitle = this.monthlyVisitTrend.ref_date.replace('-', ' 至 ') }
        return this.fillBarData(dataList, chartTitle, color, subTitle)
      }
    }
  },
  mounted() {
    this.changedDailyDate(this.dailyVisitTrendDate)
    this.changedWeeklyDate(this.weeklyVisitTrendDate)
    this.changedMonthlyDate(this.monthlyVisitTrendDate)
  },
  methods: {
    fetchData(type, beginDate, endDate) {
      this.listLoading = true
      if (type === 'dailyVisitTrend') {
        this['dailyVisitTrend'] = JSON.parse('{"list":[{"ref_date":"20170313","session_cnt":142549,"visit_pv":472351,"visit_uv":55500,"visit_uv_new":5464,"stay_time_session":0,"visit_depth":1.9838}]}')
      }
      if (type === 'weeklyVisitTrend') {
        this['weeklyVisitTrend'] = JSON.parse('{"list":[{"ref_date":"20170306-20170312","session_cnt":986780,"visit_pv":3251840,"visit_uv":189405,"visit_uv_new":45592,"stay_time_session":54.5346,"visit_depth":1.9735}]}')
      }
      if (type === 'monthlyVisitTrend') {
        this['monthlyVisitTrend'] = JSON.parse('{"list":[{"ref_date":"201703","session_cnt":126513,"visit_pv":426113,"visit_uv":48659,"visit_uv_new":6726,"stay_time_session":56.4112,"visit_depth":2.0189}]}')
      }
      this.listLoading = false
      // var that = this

      // var pageData = {
      //   type: type,
      //   begin_date: beginDate,
      //   end_date: endDate
      // }
      // this.$api['analysis/get'](pageData)
      //   .then(data => {
      //     if (data === null) {
      //       that[type] = null
      //     } else {
      //       if (typeof data.errcode !== 'undefined') {
      //         that[type] = null
      //       } else {
      //         that[type] = JSON.parse(data.result)
      //         if (typeof that[type].ref_date === 'undefined') {
      //           that[type].ref_date = beginDate + '-' + endDate
      //         }
      //       }
      //       console.log(data.result)
      //     }
      //     that.listLoading = false
      //   })
      //   .catch(e => {
      //     console.log('Error: ', e)
      //   })
    },
    changedDailyDate(val) {
      if (val === null) return
      var type = 'dailyVisitTrend'
      var beginDate = this.getBJDateString(val.getTime())
      var endDate = this.getBJDateString(val.getTime())
      this.fetchData(type, beginDate, endDate)
      console.log(val)
    },
    changedWeeklyDate(val) {
      if (val === null) return
      var i = val.getDay() - 1
      var dateLong = val.getTime() - i * 24 * 3600000
      this.weeklyVisitTrendDate = new Date(dateLong)
      var type = 'weeklyVisitTrend'
      var beginDate = this.getBJDateString(dateLong)
      var endDate = this.getBJDateString(dateLong + 6 * 24 * 3600000)
      this.fetchData(type, beginDate, endDate)
      console.log(val)
    },
    changedMonthlyDate(val) {
      if (val === null) return
      var type = 'monthlyVisitTrend'
      var beginDate = this.getBJDateString(val.getTime()).substr(0, 6) + '01'
      var year = val.getFullYear()
      var month = val.getMonth() + 1
      var endDate = this.getBJDateString(new Date(year, month, 0))
      this.fetchData(type, beginDate, endDate)
      console.log(val)
    },
    fillBarData(dataList, chartTitle, color, subTitle) {
      var dataValue = [
        dataList.session_cnt,
        dataList.visit_pv,
        dataList.visit_uv,
        dataList.visit_uv_new,
        dataList.stay_time_session,
        dataList.visit_depth
      ]
      console.log(dataList, dataValue)
      var newData = {
        chart: {
          initialTheme: 'light',
          option: {
            title: {
              // text: chartTitle,
              subtext: subTitle
            },
            color: color,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: '{b}:{c}'
            },
            xAxis: {
              type: 'category',
              data: [
                '打开次数',
                '访问次数',
                '访问人数',
                '新用户数',
                '每次停留时长(秒)',
                '访问深度'
              ]
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '访问数据',
                type: 'bar',
                data: dataValue
              }
            ]
          },
          notMerge: true,
          lazyUpdate: false
        }
        // table: {
        //   listLoading: false,
        //   titleList: titleList,
        //   dataList: dataList
        // }
      }
      return newData
    },
    getBJDateString(dateLong) {
      return new Date(dateLong)
        .toISOString()
        .substr(0, 10)
        .replace(/-/g, '')
    }
  }
}
</script>

<style scoped>
.inner-layout-wrapper {
  height: calc(100%);
}
.inner-content {
  min-height: calc(100% - 80px);
  margin: 10px 30px 20px 30px;
}
.inner-sub-content {
  min-height: 100%;
  margin: 0px;
}
.app-container {
  background-color: white;
}
.top-level {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;

  height: 33px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(32, 52, 66, 1);
  line-height: 33px;
}
.sub-title {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.scenic-path {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
<style>
.el-form-item .el-form-item {
  margin-bottom: 10px;
}
.el-breadcrumb__inner /deep/ a,
.el-breadcrumb__inner.is-link {
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400 !important;
  color: rgba(153, 153, 153, 1) !important;
  line-height: 17px;
}
.el-breadcrumb__inner /deep/ a:hover,
.el-breadcrumb__inner.is-link:hover {
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400 !important;
  color: rgba(72, 154, 239, 1) !important;
  line-height: 17px;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(72, 154, 239, 1);
  line-height: 17px;
}
</style>
