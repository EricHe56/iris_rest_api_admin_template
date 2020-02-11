<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="curList | pagination(pageIndex, pageSize)"
      element-loading-text="Loading"
      highlight-current-row
      @sort-change="sortChanged"
    >
      <el-table-column
        prop="name"
        :label="tableData.titleList[0]"
        :sortable="'custom'"
      />
      <el-table-column
        prop="value"
        :label="tableData.titleList[1]"
        :sortable="'custom'"
      />
      <el-table-column
        prop="ratio"
        :label="tableData.titleList[2]"
        :sortable="'custom'"
      />
    </el-table>
    <el-pagination
      v-show="curList.length > pageSize"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="curList.length"
      style="text-align: center; margin-top: 20px; margin-bottom: 0px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'TableBox',
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
  components: {},
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {
          listLoading: true,
          titleList: ['标题', '数值', '占比'],
          dataList: []
        }
      }
    }
  },
  data() {
    return {
      // list: [],
      curList: [],
      curItem: {},
      // listLoading: true,
      search: '',
      pageIndex: 1,
      pageSize: 20
    }
  },
  computed: {
    listLoading: {
      get: function() {
        if (typeof this.tableData === 'undefined' || this.tableData === null) {
          return true
        }
        return this.tableData.listLoading
      }
    },
    list: {
      get: function() {
        return this.tableData.dataList
      }
    }
  },
  watch: {
    tableData: function(val) {
      this.curList = val.dataList
    }
  },
  methods: {
    // 中文排序
    sortChineseAsc(prop, order) {
      if (order === 'ascending') {
        return function(param1, param2) {
          return (param1[prop] + '').localeCompare(param2[prop] + '', 'zh')
        }
      } else if (order === 'descending') {
        return function(param1, param2) {
          return (param1[prop] + '').localeCompare(param2[prop] + '', 'zh') * -1
        }
      }
    },
    sortChanged(obj) {
      // obj = { column, prop, order }
      console.log(obj.column, obj.prop, obj.order)
      this.curList.sort(this.sortChineseAsc(obj.prop, obj.order))
    },
    searchChanged(event) {
      // 需要搜索的字段写在下面的表达式中
      this.curList = this.list.filter(
        data =>
          !this.search ||
          data.title.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.pageIndex = val
    }
  }
}
</script>

<style></style>
