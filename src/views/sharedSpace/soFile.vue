<template>
  <div class="box">
    <div class="contentBox">
      <header>
        <div class="headLeft">
          <el-button size="mini" type="primary" @click="createFolder">
            <i class="iconfont icon-xinjianwenjian"></i>
            {{ $t('cs_common.cs_80') }}
          </el-button>
          <el-button size="mini" type="primary" @click="uploadFile">
            <i class="iconfont icon-upload"></i>
            {{ $t('cs_sharedSpace.cs_11') }}
          </el-button>
          <el-button
            size="mini"
            type="primary"
            style="background: #0eafc0"
            @click="createApply(selectData)"
          >
            <i class="iconfont icon-fileDownload"></i>
            {{ $t('cs_sharedSpace.cs_12') }}
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="delCheckFile(selectData)"
            v-show="selectData.length > 0"
          >
            <i class="iconfont icon-delete"></i>
            {{ $t('cs_common.cs_51') }}
          </el-button>
        </div>
        <div class="headRight">
          <el-input
            :placeholder="$t('cs_common.cs_81')"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 220px"
            v-model="filterName"
          ></el-input>
          <i
            class="iconfont icon-caidan"
            :title="$t('cs_sharedSpace.cs_13')"
            v-if="isTable"
            @click="isTable = false"
          ></i>
          <i
            class="iconfont icon-liebiao"
            :title="$t('cs_sharedSpace.cs_14')"
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
                  :placeholder="$t('cs_common.cs_81')"
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
                  :title="$t('cs_common.cs_52')"
                ></i>
                <i
                  class="iconfont icon-quxiao"
                  v-show="scope.row.isEdit"
                  @click="cancelEdit(scope.row)"
                  :title="$t('cs_sharedSpace.cs_15')"
                ></i>
                <i
                  class="iconfont icon-xiazai"
                  @click.stop="createApply([scope.row])"
                  v-show="!scope.row.dir"
                  :title="$t('cs_common.cs_45')"
                ></i>
                <el-popconfirm
                  confirm-button-text="是的"
                  cancel-button-text="不用了"
                  icon="el-icon-info"
                  icon-color="#fa5252"
                  :title="$t('cs_sharedSpace.cs_18')"
                  @confirm="confirmDel(scope.row)"
                  @cancel="cancelDel(scope.row)"
                >
                  <i
                    class="iconfont icon-trash"
                    :style="{
                      color: tempDelId == scope.row.id ? '#fa5252' : '#339af0',
                    }"
                    @click.stop="tempDelId = scope.row.id"
                    :title="$t('cs_common.cs_51')"
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
          {{ $t('cs_sharedSpace.cs_19') }}
        </el-checkbox>
        <el-divider></el-divider>
        <div class="fileWrap" v-if="tableConfig.tableData.length > 0">
          <el-checkbox-group
            v-model="pathList"
            v-for="item in tableConfig.tableData"
            :key="item.path"
            @change="handleCheck"
          >
            <div
              :class="{ checked: item.checked }"
              @mouseenter="showOperate(item)"
              @mouseleave="hiddenOperate(item)"
              class="fileBoxWrap"
            >
              <div class="OperateBox" v-show="item.showOperate">
                <i
                  class="iconfont icon-edit"
                  v-show="!item.showDecide"
                  @click.stop="showEditBox(item, true)"
                  :title="$t('cs_common.cs_52')"
                ></i>
                <i
                  class="iconfont icon-xiazai"
                  v-show="!item.showDecide && !item.dir"
                  @click.stop="createApply([item])"
                  :title="$t('cs_common.cs_45')"
                ></i>
                <i
                  class="iconfont icon-trash"
                  v-show="!item.showDecide"
                  :title="$t('cs_common.cs_51')"
                  @click.stop="delCheckFile([item])"
                ></i>
                <i
                  class="el-icon-check"
                  v-show="item.showDecide"
                  @click.stop="editFileName(item)"
                  :title="$t('cs_common.cs_35')"
                ></i>
                <i
                  class="el-icon-close"
                  @click.stop="showEditBox(item, false)"
                  v-show="item.showDecide"
                  :title="$t('cs_common.cs_10')"
                ></i>
              </div>
              <div class="fileBox">
                <el-checkbox
                  v-show="item.showOperate || item.checked"
                  :label="item.path"
                  class="checkBoxs"
                >
                  <br />
                </el-checkbox>
                <div
                  @click="getData(item.path)"
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
              </div>
              <el-tooltip effect="dark" placement="bottom" :open-delay="400">
                <div slot="content">
                  <div>{{ $t('cs_sharedSpace.cs_33') + item.name }}</div>
                  <div>{{ $t('cs_sharedSpace.cs_34') + item.fileSize }}</div>
                  <div>
                    {{ $t('cs_sharedSpace.cs_35') + item.lastModified }}
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="fileName">
                    <span
                      v-show="!item.showDecide"
                      @click="item.dir && getData(item.path)"
                    >
                      {{ item.name }}
                    </span>
                    <el-input
                      v-model="item.tempName"
                      v-if="item.showDecide"
                      size="mini"
                    ></el-input>
                  </div>
                  <div class="fileSize" @click="item.dir && getData(item.path)">
                    {{ item.fileSize }}
                  </div>
                </div>
              </el-tooltip>
            </div>
          </el-checkbox-group>
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
          {{ $t('cs_common.cs_80') }}
        </div>
      </template>
      <div style="margin-bottom: 5px; font-size: 13px">
        {{ $t('cs_sharedSpace.cs_23') }}
      </div>
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
      <div class="pathBox">{{ $t('cs_sharedSpace.cs_32') + targetPath }}</div>
      <el-input
        v-model="folderName"
        size="small"
        :placeholder="$t('cs_sharedSpace.cs_24')"
        style="margin-top: 5px"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFolderDialog = false" size="small">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button type="primary" @click="createDirectory" size="small">
          {{ $t('cs_common.cs_12') }}
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
            label: this.$t('cs_common.cs_14'),
            align: 'left',
            slot: 'file',
            minWidth: '400px',
          },
          {
            prop: 'fileSize',
            label: this.$t('cs_common.cs_15'),
          },
          {
            prop: 'lastModified',
            label: this.$t('cs_common.cs_16'),
          },
        ],
      },
      selectData: [],
      targetPath: '/',
      node: '',
      resolve: '',
      pathList: [],
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
    showEditBox(data, val) {
      this.$set(data, 'tempName', data.name)
      this.$set(data, 'showDecide', val)
    },
    showOperate(data) {
      this.$set(data, 'showOperate', true)
    },
    hiddenOperate(data) {
      this.$set(data, 'showOperate', false)
    },
    handleCheck(val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.tableConfig.tableData.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableConfig.tableData.length
      this.selectData = []
      this.$set(
        this.tableConfig,
        'tableData',
        this.tableConfig.tableData.map((item) => {
          if (val.includes(item.path)) {
            this.selectData.push(item)
            this.$set(item, 'checked', true)
          } else {
            this.$set(item, 'checked', false)
          }
          return item
        })
      )
    },
    handleCheckAllChange(val) {
      this.pathList = []
      if (val) {
        this.$set(
          this.tableConfig,
          'tableData',
          this.tableConfig.tableData.map((item) => {
            this.pathList.push(item.path)
            this.$set(item, 'checked', true)
            return item
          })
        )
      } else {
        this.$set(
          this.tableConfig,
          'tableData',
          this.tableConfig.tableData.map((item) => {
            this.$set(item, 'checked', false)
            return item
          })
        )
      }
      this.isIndeterminate = false
    },
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
        this.$message.warning(this.$t('cs_sharedSpace.cs_25'))
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
    delCheckFile(val) {
      this.$confirm(this.$t('cs_common.cs_82'), this.$t('cs_common.cs_34'), {
        confirmButtonText: this.$t('cs_common.cs_35'),
        cancelButtonText: this.$t('cs_common.cs_10'),
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
            this.getPersonDiskSize()
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
        this.$message.warning(this.$t('cs_sharedSpace.cs_26'))
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
        this.pathList = []
        val.map((item) => {
          this.pathList.push(item.path)
          this.$set(item, 'checked', true)
        })
        this.tableConfig.tableData.map((item) => {
          if (this.pathList.includes(item.path)) {
            this.$set(item, 'checked', true)
          } else {
            this.$set(item, 'checked', false)
          }
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
        grid-template-rows: repeat(auto-fill, 126px);
        grid-gap: 4px 2px;
        .fileBoxWrap {
          width: 115px;
          height: 125px;
          display: flex;
          flex-direction: column;
          position: relative;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          .OperateBox {
            position: absolute;
            right: 4px;
            top: 4px;
            color: #228be6;
            i {
              font-size: 14px;
              cursor: pointer;
              margin: 0px 4px;
            }
            i:hover {
              color: #1971c2;
            }
            .iconfont {
              font-size: 12px;
            }
            .el-icon-check,
            .el-icon-close {
              font-weight: bold;
            }
          }
          .fileBox {
            margin-top: 15px;
            .checkBoxs {
              position: absolute;
              top: 3px;
              left: 8px;
            }
            i {
              position: absolute;
              right: 5px;
              top: 5px;
              color: #228be6;
            }
            .fileIcon {
              width: 55px;
              height: 55px;
              background: #228be6;
            }
          }

          .infoWrap {
            width: 110px;
            margin-top: 5px;
            .fileSize {
              color: #868e96;
              font-size: 11px;
              text-align: center;
            }
            .fileName {
              height: 24px;
              line-height: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: center;
              font-size: 12px;
            }
          }
        }
        .checked {
          border: 0.5px solid #228be6;
          background: #e7f5ff;
        }
        .fileBoxWrap:hover {
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
