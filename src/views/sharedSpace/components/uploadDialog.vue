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
          node-key="label"
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
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUploadChange"
          :http-request="uploadFile"
          :file-list="fileList"
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
            :disabled="fileList.length <= 0"
          >
            上传到服务器
          </el-button>
        </el-upload>
        <div class="fileList">
          <div
            class="fileItem"
            v-for="(file, index) in fileList"
            :key="file.uid"
          >
            <div class="fileName">{{ file.name }}</div>
            <div class="fileSize">{{ file.size }}</div>
            <div class="loading" v-if="file.loading">上传中...</div>
            <div class="fileState" v-else>
              <i
                class="el-icon-close"
                v-if="file.status == 'ready'"
                @click="delUploadFile(file, index)"
              ></i>
              <i class="el-icon-warning" v-if="file.status == 'error'"></i>
              <i class="el-icon-success" v-if="file.status == 'success'"></i>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { unitSetUp } from '../../../utils/obj-operation'
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
    this.fileList = []
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
      console.log(this.$refs.tree.getCurrentKey)
      if (this.targetPath != node.path) {
        this.targetPath = node.path
      } else {
        this.targetPath = '/'
      }
    },
    uploadFile(param) {
      let file = param.file
      let fileIndex = 0
      var formData = new FormData()
      formData.append('file', file, file.name)
      this.fileList.map((item, index) => {
        if (item.uid == file.uid) {
          this.$set(item, 'loading', true)
          fileIndex = index
        }
      })
      this.$http('createToken', {
        path: this.targetPath,
        fileName: file.name,
        type: 1,
      }).then((res) => {
        axios
          .post(this.baseUrl + 'upload?token=' + res.data, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((obj) => {
            if (obj.data.errCode == 0) {
              this.$set(this.fileList[fileIndex], 'status', 'success')
              this.$set(this.fileList[fileIndex], 'loading', false)
            } else {
              this.$set(this.fileList[fileIndex], 'status', 'error')
              this.$set(this.fileList[fileIndex], 'loading', false)
            }
          })
      })
    },
    onUploadChange(file) {
      let isExsit = false
      file.size = unitSetUp(file.size)
      this.fileList.map((item) => {
        if (item.uid == file.uid) {
          item = file
          isExsit = true
        }
      })
      if (!isExsit) {
        this.fileList.push(file)
      }
    },
    delUploadFile(data, index) {
      console.log(data, index)
      this.fileList.splice(index, 1)
    },
    submitUpload() {
      // console.log('submitUpload', this.fileList)
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // handlePreview(file) {
    //   console.log('handlePreview', file)
    // },
    handleNodeClick(data) {
      this.targetPath = data.label
      console.log(data)
    },
    cancel() {
      this.$emit('input', false)
      this.$emit('goGetData', true)
      this.targetPath = '/'
      this.fileList = []
    },
    dialogClose() {
      this.$emit('input', false)
      this.$emit('goGetData', true)
      this.targetPath = '/'
      this.fileList = []
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
.fileList {
  .fileItem {
    margin: 10px 10px 0px 15px;
    display: flex;
    flex-direction: row;
    .fileName {
      width: 320px;
    }
    .fileSize {
      width: 100px;
    }
    .loading,
    .fileState {
      width: 60px;
      text-align: center;
    }
    .el-icon-warning {
      color: #fa5252;
    }
    .el-icon-success {
      color: #37b24d;
    }
    .el-icon-close {
      cursor: pointer;
    }
    .el-icon-close:hover {
      color: #228be6;
    }
  }
}
</style>
