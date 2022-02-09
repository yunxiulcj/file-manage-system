<template>
  <div class="box">
    <div class="contentBox">
      <header>
        <div class="headLeft">
          <el-button size="mini" type="primary" @click="createFolder">
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
            @click="createApply(selectData)"
          >
            <i class="iconfont icon-fileDownload"></i>
            下载申请
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="delCheckFile(selectData)"
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
      <div class="breadCrumbBox">
        <bread-crumb
          v-model="nowPath"
          @startGetData="startGetData"
        ></bread-crumb>
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
              <div
                class="fileIcon"
                v-show="scope.row.dir"
                :style="{
                  background: 'url(' + iconPath.folder + ')',
                  backgroundSize: '100% 100%',
                }"
              ></div>
              <div
                class="fileIcon"
                v-show="!scope.row.dir"
                :style="{
                  background: 'url(' + iconPath.file + ')',
                  backgroundSize: '100% 100%',
                }"
              ></div>
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
                  @click.stop="createApply([scope.row])"
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
        <!-- <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox> -->
        <el-divider></el-divider>
        <div class="fileWrap" v-if="tableConfig.tableData.length > 0">
          <template v-for="(item, index) in tableConfig.tableData">
            <el-tooltip
              :key="index"
              effect="dark"
              placement="top"
              :open-delay="400"
            >
              <div slot="content">
                <div>文件名称：{{ item.name }}</div>
                <div>文件大小：{{ item.fileSize }}</div>
                <div>修改日期：{{ item.lastModified }}</div>
              </div>
              <div
                class="fileBox"
                :class="{ checked: item.checked }"
                @click="!item.dir ? selectedFile(item) : getData(item.path)"
              >
                <i class="el-icon-success" v-if="item.checked"></i>
                <div
                  class="fileIcon"
                  v-show="item.dir"
                  :style="{
                    background: 'url(' + iconPath.folder + ')',
                    backgroundSize: '100% 100%',
                  }"
                ></div>
                <div
                  class="fileIcon"
                  v-show="!item.dir"
                  :style="{
                    background: 'url(' + iconPath.file + ')',
                    backgroundSize: '100% 100%',
                  }"
                ></div>
                <div class="fileName">{{ item.name }}</div>
              </div>
            </el-tooltip>
          </template>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </div>
    </div>
    <el-dialog :visible.sync="addFolderDialog" width="500px">
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
      <div style="margin-bottom: 5px; font-size: 13px">请选择路径</div>
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
              <i class="iconfont icon-filePool" style="margin-right: 2px"></i>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="pathBox">目标路径：{{ targetPath }}</div>
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
    <upload-dialog
      v-if="uploadDialog"
      v-model="uploadDialog"
      @goGetData="goGetData"
    ></upload-dialog>
  </div>
</template>

<script>
import tableTemp from '../../components/table-temp.vue'
import uploadDialog from './components/uploadDialog.vue'
import breadCrumb from '../../components/breadCrumb.vue'
import { unitSetUp } from '../../utils/obj-operation'

export default {
  name: 'soFile',
  components: { tableTemp, uploadDialog, breadCrumb },
  data() {
    return {
      iconPath: {
        file: require('../../assets/img/page/file.png'),
        folder: require('../../assets/img/page/folder.png'),
      },
      filterName: '',
      fullData: [],
      tempDelId: '',
      folderName: '',
      selectedList: [],
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
      isIndeterminate: true,
      uploadDialog: false,
      addFolderDialog: false,
      nowPath: '',
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
            prop: 'fileSize',
            label: '大小',
            // formatter: (row) => {
            //   return row.dir ? '-' : unitSetUp(row.size)
            // },
          },
          {
            prop: 'lastModified',
            label: '修改日期',
          },
        ],
      },
      selectData: [],
      targetPath: '/',
      node: '',
      resolve: '',
    }
  },
  created() {},
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 220 + 'px'
    this.getData(this.nowPath)
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
    isTable: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs['table'].toggleRowSelection(this.selectData)
          })
        }
      },
    },
  },
  methods: {
    nodeClick(node) {
      if (this.targetPath != node.path) {
        this.targetPath = node.path
      } else {
        this.targetPath = '/'
      }
    },
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
        this.node = node
        this.resolve = resolve
      })
    },
    createFolder() {
      this.folderName = ''
      if (this.node && this.resolve) {
        this.loadNode(this.node, this.resolve)
      }
      this.addFolderDialog = true
    },
    createApply(data) {
      let fileList = data.map((item) => {
        return {
          fileSize: item.size,
          filePath: item.path,
          fileName: item.name,
          size: item.fileSize,
        }
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
      sessionStorage.setItem('tempData', JSON.stringify({ data: obj, type: 0 }))
      this.$router.push({
        name: 'newOrEditApply',
        params: { type: 0, data: obj },
      })
    },
    createDirectory() {
      if (this.folderName) {
        this.$http('createDirectory', {
          fileName: this.folderName,
          path: this.targetPath,
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
    startGetData(val) {
      if (val) {
        this.getData(this.nowPath)
      }
    },
    getData(val) {
      this.tableLoading = true
      let path
      if (val) {
        path = val[val.length - 1] == '/' ? val : val + '/'
      } else {
        path = '/'
      }
      this.$http('getFileList', { path: path })
        .then((res) => {
          res.data.map((item) => {
            item['fileSize'] = unitSetUp(item.size)
          })
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
        this.selectData.map((item, index) => {
          if (item.name == data.name) {
            this.selectData.splice(index, 1)
          }
        })
      } else {
        this.$set(data, 'checked', true)
        this.selectData.push(data)
      }
    },
    delCheckFile(val) {
      this.$confirm('删除后不可恢复，是否删除所选文件？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.delFile(val)
      })
    },
    delFile(pathList) {
      pathList.map((item, index) => {
        this.$http('delete', {
          path: this.nowPath,
          fileName: item.dir ? item.name + '/' : item.name,
        }).then((res) => {
          if (index == pathList.length - 1) {
            this.getData(this.nowPath)
            this.$message.success(res.errMsg)
          }
        })
      })
    },
    showEditName(val) {
      this.$set(val, 'tempName', val.name)
      this.$set(val, 'isEdit', true)
    },
    goGetData(val) {
      if (val) {
        this.getData(this.nowPath)
      }
    },
    editFileName(val) {
      if (val.tempName == '') {
        this.$message.warning('文件名不能为空')
        return
      } else {
        this.$http('rename', {
          newName: val.tempName,
          path: this.nowPath,
          fileName: val.name,
        })
          .then((res) => {
            this.$message.success(res.errMsg)
            this.getData(this.nowPath)
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
      if (val) {
        this.selectData = val
        this.tableConfig.tableData.map((item) => {
          this.$set(item, 'checked', false)
        })
        val.map((item) => {
          this.$set(item, 'checked', true)
        })
      }
    },
    cellMouseEnter(val) {
      if (this.tempDelId == '') this.$set(val, 'showOperate', true)
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
        grid-gap: 4px 2px;
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
.fileTreeWrap {
  width: 420px;
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
</style>
