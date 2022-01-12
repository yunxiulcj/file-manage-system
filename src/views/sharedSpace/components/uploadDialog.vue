<template>
  <div class="box">
    <el-dialog
      :visible.sync="tempVal"
      width="550px"
      @close="dialogClose"
      top="4%"
    >
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
          highlight-current
        >
          <div class="treeNode" slot-scope="{ node }">
            <i class="iconfont icon-filePool"></i>
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
      <div class="pathBox">目标路径：{{ targetPath }}</div>
      <el-divider></el-divider>
      <div class="uploadWrap">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          multiple
        >
          <el-button slot="trigger" size="mini" type="primary">
            选取文件
          </el-button>
          <el-button
            style="float: right"
            size="mini"
            type="success"
            @click="submitUpload"
          >
            上传到服务器
          </el-button>
        </el-upload>
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
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
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
.box {
  .fileTreeWrap {
    width: 470px;
    padding: 20px;
    margin-bottom: 10px;
    box-shadow: 0px 0px 10px #ced4da inset;
    border-radius: 5px;
    .el-tree {
      width: 470px;
      max-height: 250px;
      overflow: auto;
      .treeNode {
        i {
          margin-right: 5px;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .pathBox {
    font-size: 12px;
    font-weight: bolder;
  }
}
.el-divider--horizontal {
  margin: 8px 0px;
}
</style>
