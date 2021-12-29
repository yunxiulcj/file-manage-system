<template>
  <div class="box">
    <el-dialog :visible.sync="tempVal" width="40%" @close="dialogClose">
      sdf
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'newApprovalCc',
  props: {
    type: Number,
    value: Boolean,
  },
  data() {
    return {
      tempVal: false,
      formObj: {
        strategyName: '',
        strategyType: 1,
        levelId: '',
        scopeId: '',
        approvalList: [
          {
            approval: '',
            approvalType: '',
            level: '',
          },
        ],
        ccList: [
          {
            ccUser: '',
          },
        ],
        id: '',
        scopeType: '',
      },
    }
  },
  watch: {
    value: {
      handler(val) {
        this.tempVal = val
      },
      immediate: true,
    },
  },
  methods: {
    cancel() {
      this.$emit('input', false)
    },
    confirm() {
      this.$emit('input', false)
    },
    dialogClose() {
      this.$emit('input', false)
    },
  },
}
</script>
