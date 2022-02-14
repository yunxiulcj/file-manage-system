<template>
  <div class="box">
    <div class="contentBox">
      <header>
        <div class="headLeft">
          <el-button
            size="mini"
            type="primary"
            @click="downloadFile(selectData, 1)"
            :loading="downloading"
          >
            <i class="iconfont icon-xiazai"></i>
            {{ $t('cs_common.cs_45') }}
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="delFile(selectData)"
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
            style="width: 220px; margin-right: 10px"
            v-model="tableConfig.condition.fileName"
          ></el-input>
          <el-button size="small" type="primary" @click="getData">
            {{ $t('cs_common.cs_67') }}
          </el-button>
        </div>
      </header>
      <div class="title">{{ $t('cs_sharedSpace.cs_27') }}</div>
      <div class="tableWrap">
        <table-temp
          ref="table"
          :config="tableConfig"
          :loading="tableLoading"
          @selection-change="handleSelectionChange"
          @cellMouseEnter="cellMouseEnter"
          @cellMouseLeave="cellMouseLeave"
        >
          <template slot="file" slot-scope="scope">
            <div class="fileWrap">
              <div
                class="fileIcon"
                :style="{
                  background: 'url(' + fileIcon + ')',
                  backgroundSize: '100% 100%',
                }"
              ></div>
              <div class="fileName">
                <span :title="scope.row.fileName">
                  {{ scope.row.fileName }}
                </span>
              </div>
              <div class="operate" v-show="scope.row.showOperate">
                <i
                  class="iconfont icon-xiazai"
                  @click.stop="downloadFile(scope.row, 2)"
                  v-show="!scope.row.isFolder"
                  :title="$t('cs_common.cs_45')"
                  v-loading="scope.row.loading"
                  element-loading-spinner="el-icon-loading"
                  element-loading-custom-class="loadingStyle"
                ></i>
                <i
                  class="iconfont icon-trash"
                  @click.stop="delFile([scope.row])"
                  :title="$t('cs_common.cs_51')"
                ></i>
              </div>
            </div>
          </template>
        </table-temp>
      </div>
    </div>
  </div>
</template>

<script>
import tableTemp from '../../components/table-temp.vue'
import { unitSetUp } from '../../utils/obj-operation'
// import { saveAs } from 'file-saver'
// import axios from 'axios'
export default {
  name: 'transferStop',
  components: { tableTemp },
  data() {
    return {
      fileIcon: require('../../assets/img/page/file.png'),
      searchName: '',
      selectData: [],
      downloading: false,
      tableLoading: false,
      tableConfig: {
        tableData: [],
        selection: true,
        maxHeight: '10000px',
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
            prop: 'fileName',
            label: this.$t('cs_common.cs_14'),
            align: 'left',
            slot: 'file',
            minWidth: '300px',
          },
          {
            prop: 'downloadCount',
            label: this.$t('cs_common.cs_46'),
            formatter: (row) => {
              return row.countUnlimited
                ? this.$t('cs_sharedSpace.cs_28')
                : row.downloadCount
            },
          },
          {
            prop: 'fileSize',
            label: this.$t('cs_common.cs_15'),
            formatter: (row) => {
              return unitSetUp(row.fileSize)
            },
          },
          {
            prop: 'applyTime',
            label: this.$t('cs_sharedSpace.cs_29'),
          },
          {
            prop: 'expiredTime',
            label: this.$t('cs_sharedSpace.cs_30'),
            formatter: (row) => {
              return row.dayUnlimited
                ? this.$t('cs_common.cs_41')
                : row.isInvaild
                ? this.$t('cs_sharedSpace.cs_31')
                : row.expiredTime
            },
          },
        ],
        map: {
          data: 'data.data',
          total: 'data.totalCount',
        },
        condition: {
          fileName: '',
        },
        page: {
          pageIndex: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 40],
          total: 0,
          map: {
            index: 'page',
            size: 'pageSize',
          },
        },
        fetchUrl: 'getTransferCenterFileList',
      },
      baseUrl: '',
    }
  },
  created() {
    this.baseUrl = this.$store.getters.symSetting.uploadUrl
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 260 + 'px'
    this.getData()
  },
  methods: {
    getData() {
      this.$refs.table.fetch()
    },
    downloadFile(data, type) {
      if (type == 1) {
        data.map((item) => {
          this.$http('download', {
            path: '/' + item.fileName,
            fileName: item.fileName,
            fileId: item.fileId,
          }).then((res) => {
            window.open(this.baseUrl + 'download?token=' + res.data)
          })
        })
      } else {
        this.$set(data, 'loading', true)
        this.$http('download', {
          path: '/' + data.fileName,
          fileName: data.fileName,
          fileId: data.fileId,
        })
          .then((res) => {
            window.open(this.baseUrl + 'download?token=' + res.data)
            this.getData()
          })
          .finally(() => {
            this.$set(data, 'loading', false)
          })
      }
    },
    delFile(val) {
      let IdList = val.map((item) => {
        return item.fileId
      })
      this.$confirm(this.$t('cs_common.cs_82'), this.$t('cs_common.cs_34'), {
        confirmButtonText: this.$t('cs_common.cs_35'),
        cancelButtonText: this.$t('cs_common.cs_10'),
        type: 'warning',
        center: true,
      }).then(() => {
        this.$http('deteleTransferCenterFile', { fileIdList: IdList }).then(
          (res) => {
            this.$message.success(res.errMsg)
            this.getData()
          }
        )
      })
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    cellMouseEnter(val) {
      this.$set(val, 'showOperate', true)
    },
    cellMouseLeave(val) {
      this.$set(val, 'showOperate', false)
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
    .tableWrap {
      width: 100%;
      height: calc(100% - 40px);
      // overflow: auto;
      .fileWrap {
        color: #495057;
        display: flex;
        flex-direction: row;
        align-items: center;
        .fileName {
          width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        }
      }
    }
    .iconfont {
      margin-right: 5px;
    }
  }
}
</style>
