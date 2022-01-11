<template>
  <div class="box">
    <el-dialog :visible.sync="tempVal" width="550px" @close="dialogClose">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          文件上传
        </div>
      </template>
      <div class="fileTreeWrap">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :highlight-current="true"
        ></el-tree>
      </div>
      <div class="pathBox">目标路径：{{ targetPath }}</div>
      <el-divider></el-divider>
      <div class="uploadWrap">
        <div class="btnBox">
          <el-button type="primary" size="mini">选择文件</el-button>
          <el-button type="primary" size="mini" style="float: right">
            全部上传
          </el-button>
        </div>
        <div class="fileList"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirm">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'uploadDialog',
  props: {
    value: Boolean,
  },
  data() {
    return {
      tempVal: false,
      targetPath: 'D:\\document\\FrontEnd\\file-manage-system',
      treeData: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1',
                },
              ],
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1',
                },
              ],
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1',
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  created() {},
  watch: {
    value: {
      handler(val) {
        this.tempVal = val
      },
      immediate: true,
    },
  },
  methods: {
    handleNodeClick(data) {
      this.targetPath = data.label
      console.log(data)
    },
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

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 8px 0px;
}
</style>
