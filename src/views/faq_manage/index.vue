<template>
  <div class="app-container">
    <div v-show="(!addFormShow)&&(!editFormShow)">
      <el-button
        size="mini"
        icon="el-icon-plus"
        type="primary"
        @click="showAddForm"
      >新建</el-button>

      <el-table
        v-loading="listLoading"
        :data="(curList) | pagination(pageIndex,pageSize)"
        element-loading-text="Loading"
        highlight-current-row
        @sort-change="sortChanged"
      >
        <!-- <el-table-column prop="id" label="ID" :sortable="'custom'" /> -->
        <el-table-column prop="question" label="问题" :sortable="'custom'" />
        <el-table-column prop="answer" label="答案" :sortable="'custom'" />
        <!-- <el-table-column prop="status" label="状态" :sortable="'custom'" /> -->
        <el-table-column align="right" width="300">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
              style="width:220px;"
              @change="searchChanged"
            />
            <el-button
              size="mini"
              type="primary"
              style="float:right"
              @click="searchChanged"
            >搜索</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="showEditForm(scope.$index, scope.row)"
            >编辑</el-button>
            <!-- <el-button
              size="mini"
              :type="(scope.row.status==='上线')?'info':'success'"
              :plain="(scope.row.status==='上线')"
              @click="status_switch(scope.$index, scope.row)"
            >{{ (scope.row.status==='上线')?'下线':'上线' }}</el-button> -->
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="showDelDialog(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="curList.length"
        style="text-align: center; margin-top: 30px; margin-bottom: 0px;z-index:100;position:relative;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <DialogBox
      v-if="dialogVisible"
      :dialog="delDialog"
      @closeDialogBox="closeDialogBox"
    />
    <ScenicPointAdd v-if="addFormShow" id="scenic-range-add" :edit-item="curItem" @closeAddForm="closeAddForm" />
    <ScenicPointEdit v-if="editFormShow" id="scenic-range-edit" :edit-item="curItem" @closeEditForm="closeEditForm" />
  </div>
</template>

<script>
import { getList, del } from '@/api/faq_manage'
import DialogBox from '@/views/faq_manage/components/dialogBox'
import ScenicPointAdd from '@/views/faq_manage/add'
import ScenicPointEdit from '@/views/faq_manage/edit'

export default {
  components: {
    DialogBox,
    ScenicPointAdd,
    ScenicPointEdit
  },
  filters: {
    pagination(array, pageIndex, pageSize) {
      const offset = (pageIndex - 1) * pageSize
      const data = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize)
      return data
    }
  },
  data() {
    return {
      list: [],
      curList: [],
      curItem: {},
      listLoading: true,
      search: '',
      pageIndex: 1,
      pageSize: 10,
      addFormShow: false,
      editFormShow: false,
      dialogVisible: false
    }
  },
  // created() {
  //   this.fetchData()
  // },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList()
        .then(response => {
          if (response.data.list !== null) {
            this.curList = this.list = response.data.list
          } else {
            this.curList = this.list = []
          }
          // this.list.sort(this.sortChineseAsc('name', 'ascending'))
          this.listLoading = false
        })
        .catch(e => {
          console.log('list-fetchData error:', e)
        })
    },
    // 中文排序
    sortChineseAsc(prop, order) {
      if (order === 'ascending') {
        return function(param1, param2) {
          return (param1[prop] + '').localeCompare((param2[prop] + ''), 'zh')
        }
      } else if (order === 'descending') {
        return function(param1, param2) {
          return ((param1[prop] + '').localeCompare((param2[prop] + ''), 'zh')) * -1
        }
      }
    },
    sortChanged(obj) {
      // obj = { column, prop, order }
      console.log(obj.column, obj.prop, obj.order)
      this.curList.sort(this.sortChineseAsc(obj.prop, obj.order))
    },
    searchChanged(event) { // 需要搜索的字段写在下面的表达式中
      this.curList = this.list.filter(data => (
        !this.search ||
        data.question.toLowerCase().includes(this.search.toLowerCase()) ||
          data.answer.toLowerCase().includes(this.search.toLowerCase())
      ))
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    showAddForm() {
      if (this.list.length > 0) {
        var itemids = this.list.map(a => a.itemid)
        this.curItem = {
          itemid: (Number(itemids.sort((a, b) => b - a)[0]) + 1) || 1
        }
      }

      this.addFormShow = true
    },
    showEditForm(index, row) {
      console.log(index, row)
      this.curItem = row
      this.editFormShow = true
    },
    showDelDialog(index, row) {
      this.delDialog = {
        title: '提示：',
        content: '是否删除-' + row.question,
        item: row
      }
      this.dialogVisible = true
    },
    closeAddForm() {
      this.addFormShow = false
      this.fetchData()
    },
    closeEditForm() {
      this.editFormShow = false
      this.fetchData()
    },
    closeDialogBox(item) {
      var that = this
      if (item !== null) {
        del({ id: [item.id] })
          .then(data => {
            that.$message({
              message: '删除成功！',
              type: 'success'
            })
            that.fetchData()
          })
          .catch(err => {
            that.$message({
              message: '删除失败！' + err,
              type: 'error'
            })
          })
      }
      this.dialogVisible = false
    }
  }
}
</script>
