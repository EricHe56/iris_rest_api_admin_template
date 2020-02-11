<template>
  <div :id="id" style="height: 300px;width: 100%;" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'BasicChartBox',
  components: {},
  props: {
    id: {
      type: String,
      default: 'pie-chart-01'
    },
    optionData: {
      type: Object,
      default: () => {
        return {
          initialTheme: 'light',
          option: null,
          notMerge: true,
          lazyUpdate: false
        }
      }
    }
  },
  data() {
    return {
      localPieChart: null
    }
  },
  watch: {
    optionData: function() {
      if (this.optionData === null) return null
      var divChart = document.getElementById(this.id)
      this.localPieChart = echarts.init(divChart, this.optionData.initialTheme)
      this.localPieChart.setOption(
        this.optionData.option,
        this.optionData.notMerge,
        this.optionData.lazyUpdate
      )
      // console.log(this.optionData)
    }
  },
  methods: {}
}
</script>

<style></style>
