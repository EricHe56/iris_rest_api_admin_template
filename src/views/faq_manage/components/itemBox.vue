<template>
  <div>
    <el-form-item label="物品" :label-width="labelWidth">
      <el-select v-model="item_id" placeholder="请选择">
        <el-option
          v-for="(item, index1) in itemList"
          :key="new Date().getTime() + '-' + idx + '-' + index1"
          :label="item.title"
          :value="item.itemid"
          @change="changed('')"
        />
      </el-select>
    </el-form-item>
    <el-button
      size="mini"
      icon="el-icon-delete"
      type="warning"
      style="float:right;"
      @click="delItem"
    >删除</el-button>
  </div>
</template>

<script>

export default {
  name: 'ItemBox',
  components: { },
  props: {
    idx: {
      type: Number,
      default: 0
    },
    shopItemId: {
      type: String,
      default: ''
    },
    itemList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // item_id: '',
      localItemId: '',
      labelWidth: '20%'
    }
  },
  computed: {
    item_id: {
      get: function() {
        // if (typeof this.shopItemId !== 'undefined') return ''
        if (this.shopItemId !== null) {
          return this.shopItemId
        }
        return ''
      },
      set: function(val) {
        this.localItemId = val
        this.changed('')
      }
    }
  },
  mounted() {
    if (typeof this.shopItemId !== 'undefined') {
      this.localItemId = this.shopItemId
    }
  },
  methods: {
    changed(nextRef) {
      this.$emit('changedShopItem', this.idx, this.localItemId)
    },
    delItem() {
      this.$emit('delShopItem', this.idx)
    }
  }
}
</script>

<style>
.el-transfer-panel .el-transfer-panel__header .el-checkbox {
  display: block;
  line-height: 40px;
  width: 100%;
}
.el-transfer-panel__item.el-checkbox .el-checkbox__label {
  overflow: visible;
  text-overflow: visible;
}
</style>
