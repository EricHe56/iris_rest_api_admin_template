<template>
  <div class="app-container">
    <h3>新建</h3>
    <el-form ref="form" :model="form" label-width="10%" :rules="rules">
      <el-form-item label="问题" prop="question">
        <el-input v-model="form.question" style="width:50%" />
      </el-form-item>
      <el-form-item label="答案">
        <el-input v-model="form.answer" type="textarea" style="width:50%" rows="5" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">放弃</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { insert } from '@/api/faq_manage'

export default {
  components: {
  },
  props: {
    editItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        id: '000000000000000000000000',
        question: '',
        answer: '',
        ctime: 0,
        mtime: 0
      },
      rules: {
        question: [{ required: true, message: '请输入问题', trigger: 'blur' }]
      },
      tagInputVisible: false,
      tagInputValue: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  mounted() {
    if (this.editItem.itemid) {
      this.form.itemid = this.editItem.itemid
    }
  },
  methods: {
    ImageChanged(imageUrl) {
      this.form.image = imageUrl
    },
    verify() {
      var result = true
      var message = ''
      if (this.form.question === '') {
        message = '问题不可为空。'
        result = false
      }
      if (!result) {
        this.$message({
          message: message,
          type: 'error'
        })
      }
      return result
    },
    onSubmit() {
      if (!this.verify()) {
        return
      }
      var postData = Object.assign({}, this.form)
      postData.itemid += ''
      insert(postData)
        .then(data => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.$emit('closeAddForm')
        })
        .catch(err => {
          this.$message({
            message: '添加失败！' + err,
            type: 'error'
          })
        })
    },
    onCancel() {
      this.$emit('closeAddForm')
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

