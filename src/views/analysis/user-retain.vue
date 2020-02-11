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
      <!-- 日留存 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="5">
          <span style="font-size: 22px;">日留存</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin-right: 20px;">
          <el-date-picker
            v-model="dailyRetainDate"
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
            :tableData="dailyRetain.table"
            style="height: 300px;width: 100%;"
        /></el-col> -->
      </el-row>
      <!-- 周留存 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="5">
          <span style="font-size: 22px;">周留存</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin-right: 20px;">
          <!-- <el-date-picker
            v-model="weeklyRetainDate"
            type="date"
            @change="changedWeeklyDate"
            placeholder="选择日期">
          </el-date-picker> -->
          <el-date-picker
            v-model="weeklyRetainDate"
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
            :tableData="dailyRetain.table"
            style="height: 300px;width: 100%;"
        /></el-col> -->
      </el-row>
      <!-- 月留存 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="5">
          <span style="font-size: 22px;">月留存</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" style="margin-right: 20px;">
          <el-date-picker
            v-model="monthlyRetainDate"
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
            :tableData="dailyRetain.table"
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
  name: 'UserRetain',
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
      dailyRetain: null,
      dailyRetainDate: new Date('2019-11-11'),
      dayPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 3600000
        },
        firstDayOfWeek: 1
      },
      weeklyRetain: null,
      weeklyRetainDate: new Date('2019-11-11'),
      weekPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 7 * 24 * 3600000
        },
        firstDayOfWeek: 1
      },
      monthlyRetain: null,
      monthlyRetainDate: new Date('2019-11-11'),
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
        if (this.dailyRetain === null) return this.defaultData
        var dataList = this.dailyRetain
        var chartTitle = ['日留存', '', '日']
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        if (typeof this.dailyRetain.ref_date !== 'undefined') { chartTitle[1] = this.dailyRetain.ref_date.replace('-', ' 至 ') }
        return this.fillBarData(dataList, chartTitle, color)
      }
    },
    weekly: {
      get: function() {
        if (this.weeklyRetain === null) return this.defaultData
        var dataList = this.weeklyRetain
        var chartTitle = ['周留存', '', '周']
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        if (typeof this.weeklyRetain.ref_date !== 'undefined') { chartTitle[1] = this.weeklyRetain.ref_date.replace('-', ' 至 ') }
        return this.fillBarData(dataList, chartTitle, color)
      }
    },
    monthly: {
      get: function() {
        if (this.monthlyRetain === null) return this.defaultData
        var dataList = this.monthlyRetain
        var chartTitle = ['月留存', '', '月']
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        if (typeof this.monthlyRetain.ref_date !== 'undefined') { chartTitle[1] = this.monthlyRetain.ref_date.replace('-', ' 至 ') }
        return this.fillBarData(dataList, chartTitle, color)
      }
    }
  },
  mounted() {
    this.changedDailyDate(this.dailyRetainDate)
    this.changedWeeklyDate(this.weeklyRetainDate)
    this.changedMonthlyDate(this.monthlyRetainDate)
  },
  methods: {
    fetchData(type, beginDate, endDate) {
      this.listLoading = true
      if (type === 'dailyRetain') {
        this['dailyRetain'] = JSON.parse('{"ref_date":"20170313","visit_uv_new":[{"key":0,"value":5464}],"visit_uv":[{"key":0,"value":55500}]}')
      }
      if (type === 'weeklyRetain') {
        this['weeklyRetain'] = JSON.parse('{"ref_date":"20170306-20170312","visit_uv_new":[{"key":0,"value":0},{"key":1,"value":16853}],"visit_uv":[{"key":0,"value":0},{"key":1,"value":99310}]}')
      }
      if (type === 'monthlyRetain') {
        this['monthlyRetain'] = JSON.parse('{"ref_date":"201702","visit_uv_new":[{"key":0,"value":346249}],"visit_uv":[{"key":0,"value":346249}]}')
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
      var type = 'dailyRetain'
      var beginDate = this.getBJDateString(val.getTime())
      var endDate = this.getBJDateString(val.getTime())
      this.fetchData(type, beginDate, endDate)
      console.log(val)
    },
    changedWeeklyDate(val) {
      if (val === null) return
      var i = val.getDay() - 1
      var dateLong = val.getTime() - i * 24 * 3600000
      this.weeklyRetainDate = new Date(dateLong)
      var type = 'weeklyRetain'
      var beginDate = this.getBJDateString(dateLong)
      var endDate = this.getBJDateString(dateLong + 6 * 24 * 3600000)
      this.fetchData(type, beginDate, endDate)
      console.log(val)
    },
    changedMonthlyDate(val) {
      if (val === null) return
      var type = 'monthlyRetain'
      var beginDate = this.getBJDateString(val.getTime()).substr(0, 6) + '01'
      var year = val.getFullYear()
      var month = val.getMonth() + 1
      var endDate = this.getBJDateString(new Date(year, month, 0))
      this.fetchData(type, beginDate, endDate)
      console.log(val)
    },
    fillBarData(dataList, chartTitle, color) {
      var newData = {
        chart: {
          initialTheme: 'light',
          option: {
            title: {
              // text: chartTitle,
              subtext: chartTitle[1]
            },
            color: color,
            tooltip: {
              trigger: 'item',
              formatter: '{b}' + chartTitle[2] + '留存用户{c}'
            },
            legend: {
              data: ['新用户', '活跃用户'],
              icon: 'circle',
              bottom: 0
            },
            xAxis: {
              type: 'category',
              data: dataList.visit_uv.map(a => a.key)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '新用户',
                type: 'bar',
                data: dataList.visit_uv_new.map(a => a.value)
              },
              {
                name: '活跃用户',
                type: 'bar',
                data: dataList.visit_uv.map(a => a.value)
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
