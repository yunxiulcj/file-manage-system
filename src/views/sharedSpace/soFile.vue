<template>
  <div class="box">
    <div class="contentBox">
      <header>
        <div class="headLeft">
          <el-button size="mini" type="primary" @click="addFolderDialog = true">
            <i class="iconfont icon-xinjianwenjian"></i>
            新建文件夹
          </el-button>
          <el-button size="mini" type="primary" @click="uploadFile">
            <i class="iconfont icon-upload"></i>
            上传文件
          </el-button>
          <el-button
            size="mini"
            type="primary"
            style="background: #0eafc0"
            @click="createApply"
          >
            <i class="iconfont icon-fileDownload"></i>
            下载申请
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="delFile(selectData)"
            v-show="selectData.length > 0"
          >
            <i class="iconfont icon-delete"></i>
            删除
          </el-button>
        </div>
        <div class="headRight">
          <el-input
            placeholder="请输入文件名"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 220px"
            v-model="filterName"
          ></el-input>
          <i
            class="iconfont icon-caidan"
            title="按图标排列"
            v-if="isTable"
            @click="isTable = false"
          ></i>
          <i
            class="iconfont icon-liebiao"
            title="按表格排列"
            @click="isTable = true"
            v-else
          ></i>
        </div>
      </header>
      <div class="title">所有文件</div>
      <div class="breadCrumbBox">
        <bread-crumb :path="nowPath" @clickPath="clickPath"></bread-crumb>
      </div>
      <div class="tableWrap" v-if="isTable">
        <table-temp
          ref="table"
          :config="tableConfig"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
          @cellMouseEnter="cellMouseEnter"
          @cellMouseLeave="cellMouseLeave"
        >
          <template slot="file" slot-scope="scope">
            <div class="fileWrap">
              <div class="fileIcon">iiiiiiii</div>
              <div class="fileName">
                <el-input
                  ref="editInput"
                  v-if="scope.row.isEdit"
                  v-model="scope.row.tempName"
                  placeholder="请输入文件名"
                  size="mini"
                >
                  <el-button slot="append" @click="editFileName(scope.row)">
                    <i class="el-icon-check"></i>
                  </el-button>
                </el-input>
                <span
                  :class="{ clickable: scope.row.dir }"
                  :title="scope.row.name"
                  @click="scope.row.dir && getData(scope.row.path)"
                  v-else
                >
                  {{ scope.row.name }}
                </span>
              </div>
              <div class="operate" v-show="scope.row.showOperate">
                <i
                  class="iconfont icon-edit"
                  v-show="!scope.row.isEdit"
                  @click.stop="showEditName(scope.row)"
                  title="编辑"
                ></i>
                <i
                  class="iconfont icon-quxiao"
                  v-show="scope.row.isEdit"
                  @click="cancelEdit(scope.row)"
                  title="取消编辑"
                ></i>
                <i
                  class="iconfont icon-xiazai"
                  @click.stop="createApply"
                  v-show="!scope.row.dir"
                  title="下载"
                ></i>
                <el-popconfirm
                  confirm-button-text="是的"
                  cancel-button-text="不用了"
                  icon="el-icon-info"
                  icon-color="#fa5252"
                  title="删除后不可恢复，确定删除吗？"
                  @confirm="confirmDel(scope.row)"
                  @cancel="cancelDel(scope.row)"
                >
                  <i
                    class="iconfont icon-trash"
                    :style="{
                      color: tempDelId == scope.row.id ? '#fa5252' : '#339af0',
                    }"
                    @click.stop="tempDelId = scope.row.id"
                    title="删除"
                    slot="reference"
                  ></i>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </table-temp>
      </div>
      <div class="isIconWrap" v-else>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-divider></el-divider>
        <div class="fileWrap">
          <template v-for="(item, index) in tableConfig.tableData">
            <el-tooltip
              :key="index"
              effect="dark"
              placement="top"
              :open-delay="400"
            >
              <div slot="content">
                <div>文件名称：{{ item.name }}</div>
                <div>文件大小：{{ item.size }}</div>
                <div>修改日期：{{ item.lastModified }}</div>
              </div>
              <div
                class="fileBox"
                :class="{ checked: item.checked }"
                @click="selectedFile(item)"
              >
                <i class="el-icon-success" v-if="item.checked"></i>
                <div class="fileIcon"></div>
                <div class="fileName">{{ item.name }}</div>
              </div>
            </el-tooltip>
          </template>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="addFolderDialog" width="30%">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          新建文件夹
        </div>
      </template>
      <span>文件夹名称</span>
      <el-input
        v-model="folderName"
        size="small"
        placeholder="请输入文件夹名称"
        style="margin-top: 5px"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFolderDialog = false" size="small">
          取 消
        </el-button>
        <el-button type="primary" @click="createDirectory" size="small">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <upload-dialog v-model="uploadDialog"></upload-dialog>
  </div>
</template>

<script>
import tableTemp from '../../components/table-temp.vue'
import uploadDialog from './components/uploadDialog.vue'
import breadCrumb from '../../components/breadCrumb.vue'
export default {
  name: 'soFile',
  components: { tableTemp, uploadDialog, breadCrumb },
  data() {
    return {
      filterName: '',
      fullData: [],
      tempDelId: '',
      folderName: '',
      selectedList: [],
      isIndeterminate: true,
      uploadDialog: false,
      addFolderDialog: false,
      nowPath: '/',
      checkAll: false,
      isTable: true,
      tableLoading: false,
      tableConfig: {
        tableData: [],
        maxHeight: '10000px',
        selection: true,
        stripe: false,
        border: false,
        headerCellStyle: {
          background: '#f7f9fd',
          height: '35px',
          lineHeight: '35px',
          fontSize: '15px',
        },
        tableSetting: [
          {
            prop: 'name',
            label: '文件名',
            align: 'left',
            slot: 'file',
            minWidth: '400px',
          },
          {
            prop: 'size',
            label: '大小',
          },
          {
            prop: 'lastModified',
            label: '修改日期',
          },
        ],
      },
      selectData: [],
    }
  },
  created() {
    this.getData(this.nowPath)
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 220 + 'px'
  },
  watch: {
    filterName(val) {
      this.$set(
        this.tableConfig,
        'tableData',
        this.fullData.filter((item) => {
          if (item.name.indexOf(val) != -1) {
            return item
          }
        })
      )
    },
  },
  methods: {
    createApply() {
      let fileList = this.selectData.map((item) => {
        return { fileSize: item.size, filePath: item.path, fileName: item.name }
      })
      let obj = {
        applyUser: localStorage.getItem('username') || '',
        applyEmail: '',
        applyTheme: '',
        describe: '',
        applyType: 1,
        downloadDay: 1,
        downloadCount: 1,
        fileList: fileList,
        approvalUserList: [],
      }
      this.$router.push({
        name: 'newOrEditApply',
        params: { type: 0, data: obj },
      })
    },
    createDirectory() {
      if (this.folderName) {
        this.$http('createDirectory', {
          fileName: this.folderName,
          path: this.nowPath,
        })
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.addFolderDialog = false
            this.getData(this.nowPath)
          })
      } else {
        this.$message.warning('文件夹名称不能为空')
      }
    },
    clickPath(index, path) {
      let test = this.nowPath
        .split('/')
        .slice(0, index + 1)
        .join('/')
      console.log('test', test)
      console.log(index, path)
    },
    getData(path) {
      this.tableLoading = true
      this.$http('getFileList', { path: path })
        .then((res) => {
          this.tableConfig.tableData = res.data
          this.fullData = res.data
          this.nowPath = path
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    confirmDel(data) {
      this.delFile([data])
      this.tempDelId = ''
      this.$set(data, 'showOperate', false)
    },
    cancelDel(data) {
      this.tempDelId = ''
      this.$set(data, 'showOperate', false)
    },
    handleCheckAllChange(val) {
      console.log(val)
    },
    selectedFile(data) {
      if (data.checked) {
        this.$set(data, 'checked', false)
      } else {
        this.$set(data, 'checked', true)
      }
    },
    delFile(val) {
      let pathList = val.map((item) => {
        return item.path
      })
      this.$confirm('删除后不可恢复，是否删除所选文件？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$http('deleteFile', { filePaths: pathList }).then((res) => {
          this.$message.success(res.errMsg)
        })
      })
    },
    showEditName(val) {
      this.$set(val, 'tempName', val.name)
      this.$set(val, 'isEdit', true)
    },
    editFileName(val) {
      if (val.tempName == '') {
        this.$message.warning('文件名不能为空')
        return
      } else {
        this.$http('rename', {
          newName: val.tempName,
          path: '/',
          fileName: val.name,
        })
          .then((res) => {
            this.$message.success(res.errMsg)
            this.getData()
          })
          .finally(() => {
            this.$set(val, 'isEdit', false)
          })
      }
    },
    cancelEdit(val) {
      this.$set(val, 'isEdit', false)
    },
    uploadFile() {
      this.uploadDialog = true
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    cellMouseEnter(val) {
      this.$set(val, 'showOperate', true)
    },
    cellMouseLeave(val) {
      if (this.tempDelId != val.id) {
        this.$set(val, 'showOperate', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  .contentBox {
    width: 100%;
    height: 100%;
    header {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      .headRight {
        position: absolute;
        right: 0px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    .title {
      margin: 25px 0px 10px 0px;
      font-size: 14px;
      color: #495057;
    }
    .breadCrumbBox {
      margin: 25px 0px 10px 0px;
    }
    .tableWrap {
      width: 100%;
      height: calc(100% - 90px);
      // overflow: auto;
      .fileWrap {
        color: #495057;
        display: flex;
        flex-direction: row;
        align-items: center;
        .fileName {
          width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .clickable {
            cursor: pointer;
            color: #228be6;
          }
          .clickable:hover {
            text-decoration: underline;
          }
        }
        .fileIcon {
          width: 25px;
          height: 25px;
          margin-right: 20px;
          background: cornflowerblue;
        }
        .operate {
          color: #339af0;
          i {
            cursor: pointer;
            margin: 0px 8px;
          }
          i:hover {
            color: #1864ab;
          }
          .icon-quxiao {
            color: #ff6b6b;
          }
          .icon-quxiao:hover {
            color: #fa5252;
          }
        }
      }
    }
    .isIconWrap {
      height: calc(100% - 90px);
      width: 100%;
      .fileWrap {
        height: calc(100% - 50px);
        width: 100%;
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, 116px);
        grid-template-rows: repeat(auto-fill, 116px);
        grid-gap: 15px 8px;
        .fileBox {
          width: 115px;
          height: 115px;
          display: flex;
          flex-direction: column;
          position: relative;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          cursor: pointer;
          i {
            position: absolute;
            right: 5px;
            top: 5px;
            color: #228be6;
          }
          .fileIcon {
            width: 65px;
            height: 65px;
            background: #228be6;
            margin-bottom: 8px;
          }
          .fileName {
            width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            font-size: 13px;
            color: #343a40;
          }
        }
        .fileBox:hover {
          border: 0.5px solid #228be6;
          background: #e7f5ff;
        }
        .checked {
          border: 0.5px solid #228be6;
          background: #e7f5ff;
        }
      }
    }
    .iconfont {
      margin-right: 5px;
    }
    .icon-caidan {
      font-size: 28px;
      color: #868e96;
      cursor: pointer;
      margin-left: 15px;
    }
    .icon-caidan:hover {
      color: #228be6;
    }
    .icon-liebiao {
      font-size: 27px;
      color: #868e96;
      cursor: pointer;
      margin-left: 15px;
    }
    .icon-liebiao:hover {
      color: #228be6;
    }
    .el-divider {
      margin: 5px 0px;
    }
  }
}
</style>
