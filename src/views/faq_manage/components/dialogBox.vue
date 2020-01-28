<template>
  <el-dialog :title="dialog.title" visible width="30%" @close="cancel">
    <span>{{ dialog.content }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogBox',
  components: {},
  props: {
    dialog: {
      type: Object,
      default: () => {
        return {
          title: '提示：',
          content: '对话框确认内容，如：是否删除-xxx?',
          item: {}
        }
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    submit() {
      this.$emit('closeDialogBox', this.dialog.item)
    },
    cancel() {
      this.$emit('closeDialogBox', null)
    }
  }
}
</script>

<style></style>
