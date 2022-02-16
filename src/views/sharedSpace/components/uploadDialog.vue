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
          {{ $t('cs_common.cs_50') }}
        </div>
      </template>
      <div style="margin-bottom: 5px; font-size: 13px">
        {{ $t('cs_sharedSpace.cs_1') }}
      </div>
      <div class="fileTreeWrap">
        <el-tree
          style="min-width: 300px"
          ref="tree"
          :props="props"
          :load="loadNode"
          node-key="label"
          lazy
          :empty-text="$t('cs_common.cs_57')"
          @node-click="nodeClick"
        >
          <span class="nodeItem" slot-scope="{ node }">
            <span style="font-size: 13px" slot="reference">
              <i class="iconfont icon-filePool" style="margin-right: 2px"></i>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="pathBox">{{ $t('cs_sharedSpace.cs_32') + targetPath }}</div>
      <el-divider></el-divider>
      <div class="uploadWrap">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUploadChange"
          :http-request="uploadFile"
          :file-list="fileList"
          multiple
        >
          <el-button slot="trigger" size="mini" type="primary">
            {{ $t('cs_sharedSpace.cs_2') }}
          </el-button>
          <el-button
            style="float: right"
            size="mini"
            type="success"
            @click="submitUpload"
            :disabled="fileList.length <= 0"
          >
            {{ $t('cs_sharedSpace.cs_3') }}
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
            <div class="loading" v-if="file.loading">
              {{ $t('cs_sharedSpace.cs_4') }}
            </div>
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
        <el-button @click="cancel" size="small">
          {{ $t('cs_common.cs_13') }}
        </el-button>
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
              this.$message.success(
                file.name +
                  this.$t('cs_sharedSpace.cs_5') +
                  this.targetPath +
                  this.$t('cs_sharedSpace.cs_6')
              )
              this.getPersonDiskSize()
            } else {
              this.$set(this.fileList[fileIndex], 'status', 'error')
              this.$set(this.fileList[fileIndex], 'loading', false)
              this.$message.warning(file.name + '：' + obj.data.errMsg)
            }
          })
      })
    },
    getPersonDiskSize() {
      this.$http('getPersonDiskSize', {
        userId: localStorage.getItem('username') || '',
      }).then((res) => {
        this.$store.commit('SET_CAPACITY', res.data)
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
      this.fileList.splice(index, 1)
    },
    submitUpload() {
      this.$refs.upload.submit()
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
