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
          style="width: 300px"
          ref="tree"
          :props="props"
          :load="loadNode"
          node-key="name"
          highlight-current
          lazy
          empty-text="暂无数据"
          @node-click="nodeClick"
        >
          <span class="nodeItem" slot-scope="{ node }">
            <span style="font-size: 13px" slot="reference">
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="pathBox">目标路径：{{ targetPath }}</div>
      <el-divider></el-divider>
      <div class="uploadWrap">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-change="onUploadChange"
          :before-upload="onBeforeUpload"
          :auto-upload="false"
          :http-request="uploadFile"
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
      uploadUrl: '',
      targetPath: '',
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
      fileList: [],
      rootPath: '',
      baseUrl: '',
    }
  },
  created() {
    this.baseUrl = this.$store.getters.symSetting.uploadUrl
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
    loadNode(node, resolve) {
      let path = node.level == 0 ? '' : node.data.path
      this.$http('getFileList', { path: path }).then((res) => {
        let temp = []
        res.data.map((item) => {
          if (item.dir) {
            temp.push({
              name: item.name,
              path: item.path,
              leaf: !item.dir,
            })
          }
        })
        resolve(temp)
      })
    },
    nodeClick(node) {
      this.targetPath = node.path
    },
    uploadFile(param) {
      let file = param.file
      this.$http('createToken', {
        path: this.targetPath,
        fileName: file.name,
        type: 1,
      }).then((res) => {
        param.action = this.baseUrl + 'upload?token=' + res.data
      })
      console.log('uploadFile', param)
    },
    onBeforeUpload(file) {
      console.log('onBeforeUpload', file)
    },
    onUploadChange(file) {
      if (file.status == 'ready') {
        console.log(file)
      }
    },
    submitUpload() {
      console.log('submitUpload', this.fileList)
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log('handlePreview', file)
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
