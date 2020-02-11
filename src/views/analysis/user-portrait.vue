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
      <!-- 选项及时间 -->
      <el-row style="margin-bottom: 30px;">
        <el-col :span="3" style="margin-right: 20px;">
          <el-select v-model="curView" placeholder="请选择">
            <el-option label="活跃用户" value="visit_uv" />
            <el-option label="新增用户" value="visit_uv_new" />
          </el-select>
        </el-col>
        <el-col :span="5" style="margin-right: 20px;">
          <el-select
            v-model="dateRange"
            placeholder="请选择"
            @change="changedDateRange"
          >
            <el-option label="过去1天" value="last_1" />
            <el-option label="过去7天" value="last_7" />
            <el-option label="过去30天" value="last_30" />
            <el-option label="测试数据" value="test" />
          </el-select>
        </el-col>
        <!-- <el-col :span="5">
          <span
            style="font-size: 16px;margin-top: 10px;margin-left: -10px;display: block;color: #808080;"
            >{{ refDate.replace('-', ' 至 ') }}</span
          >
        </el-col> -->
      </el-row>
      <!-- 性别 -->
      <el-row>
        <el-col
          :span="12"
        ><basicChartBox
          :id="'up_bar_01'"
          :option-data="genders.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <el-col
          :span="12"
        ><tableBox
          :table-data="genders.table"
          style="height: 300px;width: 100%;"
        /></el-col>
      </el-row>
      <!-- 年龄 -->
      <el-row>
        <el-col
          :span="12"
        ><basicChartBox
          :id="'up_bar_02'"
          :option-data="ages.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <el-col
          :span="12"
        ><tableBox
          :table-data="ages.table"
          style="height: 300px;width: 100%;"
        /></el-col>
      </el-row>
      <!-- 省份 -->
      <el-row>
        <el-col
          :span="12"
        ><mapChartBox
          :id="'up_map_01'"
          :option-data="province.chart"
          style="height: 500px;width: 100%;"
        /></el-col>
        <el-col
          :span="12"
        ><tableBox
          :table-data="province.table"
          style="height: 500px;width: 100%;"
        /></el-col>
      </el-row>
      <!-- 城市 -->
      <el-row>
        <el-col
          :span="12"
        ><mapChartBox
          :id="'up_map_02'"
          :option-data="city.chart"
          style="height: 500px;width: 100%;"
        /></el-col>
        <el-col
          :span="12"
        ><tableBox
          :table-data="city.table"
          style="height: 500px;width: 100%;"
        /></el-col>
      </el-row>
      <!-- 平台 -->
      <el-row>
        <el-col
          :span="12"
        ><basicChartBox
          :id="'up_bar_03'"
          :option-data="platforms.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <el-col
          :span="12"
        ><tableBox
          :table-data="platforms.table"
          style="height: 300px;width: 100%;"
        /></el-col>
      </el-row>
      <!-- 设备 -->
      <el-row>
        <el-col
          :span="12"
        ><basicChartBox
          :id="'up_bar_04'"
          :option-data="devices.chart"
          style="height: 300px;width: 100%;"
        /></el-col>
        <el-col
          :span="12"
        ><tableBox
          :table-data="devices.table"
          style="height: 300px;width: 100%;"
        /></el-col>
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
import mapChartBox from '@/views/analysis/components/mapChartBox'
import basicChartBox from '@/views/analysis/components/basicChartBox'
import tableBox from '@/views/analysis/components/tableBox'

export default {
  name: 'UserPortrait',
  components: {
    DialogBox,
    mapChartBox,
    basicChartBox,
    tableBox
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
      curView: 'visit_uv',
      dateRange: 'test',
      userPortraitData: null,
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
    refDate: {
      get: function() {
        if (this.userPortraitData === null) {
          return ''
        } else {
          return this.userPortraitData.ref_date
        }
      }
    },
    province: {
      get: function() {
        if (this.userPortraitData === null) return this.defaultData
        var dataList = this.userPortraitData[this.curView].province
        var chartTitle = ['省份分布', this.userPortraitData.ref_date]
        var titleList = ['省份', '用户数', '占比']
        var color = ['#9f5ce3', '#00a2ff', '#f3ffff']
        return this.fillMapProvinceData(dataList, chartTitle, color, titleList)
      }
    },
    city: {
      get: function() {
        if (this.userPortraitData === null) return this.defaultData
        var dataList = this.userPortraitData[this.curView].city
        var chartTitle = ['城市分布', this.userPortraitData.ref_date]
        var titleList = ['城市', '用户数', '占比']
        var color = ['#9f5ce3', '#00a2ff', '#f3ffff']
        return this.fillMapCityData(dataList, chartTitle, color, titleList)
      }
    },
    genders: {
      get: function() {
        if (this.userPortraitData === null) return this.defaultData
        var dataList = this.userPortraitData[this.curView].genders
        var chartTitle = ['性别分布', this.userPortraitData.ref_date]
        var titleList = ['性别', '用户数', '占比']
        var color = ['#00cece', '#00a2ff', '#9f5ce3']
        return this.fillData(dataList, chartTitle, color, titleList)
      }
    },
    ages: {
      get: function() {
        if (this.userPortraitData === null) return this.defaultData
        var dataList = this.userPortraitData[this.curView].ages
        var chartTitle = ['年龄分布', this.userPortraitData.ref_date]
        var titleList = ['年龄', '用户数', '占比']
        var color = [
          '#00ce65',
          '#00cece',
          '#4d55ce',
          '#9f5ce3',
          '#ffb6c1',
          '#ffd237',
          '#fe5890'
        ]
        return this.fillData(dataList, chartTitle, color, titleList)
      }
    },
    platforms: {
      get: function() {
        if (this.userPortraitData === null) return this.defaultData
        var dataList = this.userPortraitData[this.curView].platforms
        var chartTitle = ['平台分布', this.userPortraitData.ref_date]
        var titleList = ['名称', '用户数', '占比']
        var color = ['#00a2ff', '#4d55ce', '#00cece']
        return this.fillData(dataList, chartTitle, color, titleList)
      }
    },
    devices: {
      get: function() {
        if (this.userPortraitData === null) return this.defaultData
        var dataList = this.userPortraitData[this.curView].devices
        var chartTitle = ['设备分布', this.userPortraitData.ref_date]
        var titleList = ['名称', '用户数', '占比']
        var color = ['#00a2ff', '#00cece', '#9f5ce3']
        return this.fillData(dataList, chartTitle, color, titleList)
      }
    }
  },
  mounted() {
    this.changedDateRange('test')
  },
  methods: {
    fetchData(beginDate, endDate) {
      this.listLoading = true
      this.userPortraitData = JSON.parse('{"ref_date":"20170611","visit_uv_new":{"province":[{"id":31,"name":"广东省","value":215},{"id":11,"name":"山东省","value":200}],"city":[{"id":3102,"name":"广州","value":78},{"id":3102,"name":"上海","value":78}],"genders":[{"id":1,"name":"男","value":2146},{"id":1,"name":"女","value":2146}],"platforms":[{"id":1,"name":"iPhone","value":27642},{"id":1,"name":"android","value":37642}],"devices":[{"name":"OPPO R9","value":61},{"name":"PoPo R8","value":161}],"ages":[{"id":1,"name":"97岁以下","value":351},{"id":1,"name":"17岁以下","value":151}]},"visit_uv":{"province":[{"id":31,"name":"广东省","value":1341},{"id":31,"name":"山东省","value":341}],"city":[{"id":3102,"name":"广州","value":234},{"id":3102,"name":"上海","value":334}],"genders":[{"id":1,"name":"男","value":14534},{"id":1,"name":"女","value":14534}],"platforms":[{"id":1,"name":"iPhone","value":21750},{"id":1,"name":"android","value":21750}],"devices":[{"name":"OPPO R9","value":617},{"name":"PoPo Rs","value":617}],"ages":[{"id":1,"name":"17岁以下","value":13156},{"id":1,"name":"97岁以下","value":3156}]}}')
      this.listLoading = false
      // var that = this

      // var pageData = {
      //   type: 'userPortrait',
      //   begin_date: beginDate,
      //   end_date: endDate
      // }
      // this.$api['analysis/get'](pageData)
      //   .then(data => {
      //     if (data === null) {
      //       that.userPortraitData = null
      //     } else {
      //       if (typeof data.errcode !== 'undefined') {
      //         that.userPortraitData = null
      //       } else {
      //         that.userPortraitData = JSON.parse(data.result)
      //       }
      //       console.log(data.result)
      //       console.log(that.userPortraitData)
      //     }
      //     that.listLoading = false
      //   })
      //   .catch(e => {
      //     console.log('Error: ', e)
      //   })
    },
    changedDateRange(val) {
      var beginDate = this.getBJDateString(
        new Date().getTime() - 7 * 24 * 3600000
      )
      var endDate = this.getBJDateString(
        new Date().getTime() - 1 * 24 * 3600000
      )
      if (val === 'last_1') {
        beginDate = this.getBJDateString(
          new Date().getTime() - 1 * 24 * 3600000
        )
        endDate = this.getBJDateString(new Date().getTime() - 1 * 24 * 3600000)
      }
      if (val === 'last_7') {
        beginDate = this.getBJDateString(
          new Date().getTime() - 7 * 24 * 3600000
        )
        endDate = this.getBJDateString(new Date().getTime() - 1 * 24 * 3600000)
      }
      if (val === 'last_30') {
        beginDate = this.getBJDateString(
          new Date().getTime() - 30 * 24 * 3600000
        )
        endDate = this.getBJDateString(new Date().getTime() - 1 * 24 * 3600000)
      }
      if (val === 'test') {
        beginDate = '19700101'
        endDate = '19700101'
      }
      this.fetchData(beginDate, endDate)
    },
    fillData(dataList, chartTitle, color, titleList) {
      var sumAll = 0
      dataList
        .map(a => a.value)
        .forEach(b => {
          sumAll += b
        })
      dataList.forEach((obj, index) => {
        obj.ratio = Math.round((obj.value * 1000000) / sumAll) / 10000 + '%'
      })

      var newData = {
        chart: {
          initialTheme: 'light',
          option: {
            title: {
              text: chartTitle[0],
              subtext: chartTitle[1]
            },
            color: color,
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'horizontal',
              icon: 'circle',
              bottom: 0,
              data: dataList.map(a => a.name)
            },
            series: [
              {
                name: chartTitle,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: dataList
              }
            ]
          },
          notMerge: true,
          lazyUpdate: false
        },
        table: {
          listLoading: false,
          titleList: titleList,
          dataList: dataList
        }
      }
      return newData
    },
    fillMapProvinceData(dataList, chartTitle, color, titleList) {
      var sumAll = 0
      var min = 0
      var max = 0
      dataList
        .map(a => a.value)
        .forEach((b, index) => {
          sumAll += b
          if (index === 0) max = min = b
          if (b > max) max = b
          if (b < min) min = b
        })
      max = (Math.round(max / 1000) + 1) * 1000
      dataList.forEach((obj, index) => {
        obj.ratio = Math.round((obj.value * 1000000) / sumAll) / 10000 + '%'
        obj.name_display = obj.name
        obj.name = obj.name_display.replace('省', '')
      })
      var newData = {
        chart: {
          initialTheme: 'light',
          isMapCities: false,
          option: {
            title: {
              text: chartTitle[0],
              subtext: chartTitle[1],
              // sublink: 'http://www.qq.com',
              left: 'left'
            },
            // color: color,
            tooltip: {
              show: false,
              trigger: 'item',
              showDelay: 0,
              transitionDuration: 0.2,
              formatter: function(params) {
                var value = (params.value + '').split('.')
                value = value[0].replace(
                  /(\d{1,3})(?=(?:\d{3})+(?!\d))/g,
                  '$1,'
                )
                return params.seriesName + '<br/>' + params.name + ': ' + value
              }
            },
            visualMap: {
              type: 'continuous',
              min: 0,
              max: max,
              text: ['High', 'Low'],
              realtime: true,
              itemWidth: 10,
              itemHeight: 70,
              color: color,
              // backgroundColor: 'rgba(0,0,0,0.1)',
              // borderWidth: 1,
              // orient: 'horizontal',
              left: 0,
              top: 50,
              calculable: true
            },
            // legend: {
            //   orient: 'horizontal',
            //   icon: 'circle',
            //   bottom: 0,
            //   data: dataList.map(a => a.name)
            // },
            series: [
              {
                name: chartTitle,
                type: 'map',
                roam: false,
                map: 'china',
                itemStyle: {
                  areaColor: '#fdfeff',
                  emphasis: {
                    areaColor: '#ffd237',
                    label: {
                      show: true
                    }
                  }
                },
                data: dataList
              }
            ]
          },
          notMerge: true,
          lazyUpdate: false
        },
        table: {
          listLoading: false,
          titleList: titleList,
          dataList: dataList
        }
      }
      return newData
    },
    fillMapCityData(dataList, chartTitle, color, titleList) {
      var sumAll = 0
      var min = 0
      var max = 0
      dataList
        .map(a => a.value)
        .forEach((b, index) => {
          sumAll += b
          if (index === 0) max = min = b
          if (b > max) max = b
          if (b < min) min = b
        })
      max = (Math.round(max / 1000) + 1) * 1000
      dataList.forEach((obj, index) => {
        obj.ratio = Math.round((obj.value * 1000000) / sumAll) / 10000 + '%'
        obj.name_display = obj.name
        obj.name = obj.name_display.replace('省', '')
      })
      var newData = {
        chart: {
          initialTheme: 'light',
          isMapCities: true,
          option: {
            title: {
              text: chartTitle[0],
              subtext: chartTitle[1],
              // sublink: 'http://www.qq.com',
              left: 'left'
            },
            // color: color,
            tooltip: {
              formatter: function(p) {
                var rtn = p.name + ': ' + p.value[2]
                // alert(JSON.stringify(p))
                console.log(p)
                return rtn
              },
              trigger: 'item'
            },
            visualMap: {
              min: 0,
              max: max,
              splitNumber: 5,
              color: ['#d94e5d', '#eac736', '#50a3ba'],
              top: 50
            },
            legend: {
              orient: 'vertical',
              top: 'bottom',
              left: 'right',
              data: [chartTitle],
              textStyle: {
                // color: '#fff'
              }
            },
            geo: {
              map: 'china',
              label: {
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#eeeeee',
                  borderColor: '#111'
                },
                emphasis: {
                  areaColor: '#eeeeee'
                }
              }
            },
            series: [
              {
                name: chartTitle,
                type: 'scatter',
                coordinateSystem: 'geo',
                data: dataList,
                symbolSize: 12,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false
                  }
                },
                itemStyle: {
                  emphasis: {
                    color: '#888888',
                    borderColor: '#fff',
                    borderWidth: 1
                  }
                }
              }
            ]
          },
          notMerge: true,
          lazyUpdate: false
        },
        table: {
          listLoading: false,
          titleList: titleList,
          dataList: dataList
        }
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
