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
            下载
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
            v-model="searchName"
          ></el-input>
        </div>
      </header>
      <div class="title">文件中转站</div>
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
              <div class="fileIcon">xxxx</div>
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
                  title="下载"
                  v-loading="scope.row.loading"
                  element-loading-spinner="el-icon-loading"
                  element-loading-custom-class="loadingStyle"
                ></i>
                <i
                  class="iconfont icon-trash"
                  @click.stop="delFile([scope.row])"
                  title="删除"
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
export default {
  name: 'transferStop',
  components: { tableTemp },
  data() {
    return {
      searchName: '',
      selectData: [],
      downloading: false,
      tableLoading: false,
      testData: [
        {
          fileName: '1test001.txt',
          downloads: '1/5',
          fileSize: '14kb',
          applicationDate: '2022-1-12 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '22te犯得上发射点给法大师傅发生的大师傅士大夫st001.txt',
          downloads: '2/5',
          fileSize: '1443kb',
          applicationDate: '2022-1-17 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '333test001.txt',
          downloads: '3/5',
          fileSize: '2143kb',
          applicationDate: '2022-1-15 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '4444test001.txt',
          downloads: '4/5',
          fileSize: '1214kb',
          applicationDate: '2022-1-13 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '1test001.txt',
          downloads: '1/5',
          fileSize: '14kb',
          applicationDate: '2022-1-12 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '22test001.txt',
          downloads: '2/5',
          fileSize: '1443kb',
          applicationDate: '2022-1-17 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '333test001.txt',
          downloads: '3/5',
          fileSize: '2143kb',
          applicationDate: '2022-1-15 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '4444test001.txt',
          downloads: '4/5',
          fileSize: '1214kb',
          applicationDate: '2022-1-13 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '1test001.txt',
          downloads: '1/5',
          fileSize: '14kb',
          applicationDate: '2022-1-12 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '22test001.txt',
          downloads: '2/5',
          fileSize: '1443kb',
          applicationDate: '2022-1-17 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '333test001.txt',
          downloads: '3/5',
          fileSize: '2143kb',
          applicationDate: '2022-1-15 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '4444test001.txt',
          downloads: '4/5',
          fileSize: '1214kb',
          applicationDate: '2022-1-13 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '1test001.txt',
          downloads: '1/5',
          fileSize: '14kb',
          applicationDate: '2022-1-12 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '22test001.txt',
          downloads: '2/5',
          fileSize: '1443kb',
          applicationDate: '2022-1-17 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '333test001.txt',
          downloads: '3/5',
          fileSize: '2143kb',
          applicationDate: '2022-1-15 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '4444test001.txt',
          downloads: '4/5',
          fileSize: '1214kb',
          applicationDate: '2022-1-13 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '1test001.txt',
          downloads: '1/5',
          fileSize: '14kb',
          applicationDate: '2022-1-12 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '22test001.txt',
          downloads: '2/5',
          fileSize: '1443kb',
          applicationDate: '2022-1-17 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '333test001.txt',
          downloads: '3/5',
          fileSize: '2143kb',
          applicationDate: '2022-1-15 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
        {
          fileName: '4444test001.txt',
          downloads: '4/5',
          fileSize: '1214kb',
          applicationDate: '2022-1-13 11:22:12',
          failureTime: '2022-1-18 11:22:12',
        },
      ],
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
            label: '文件名',
            align: 'left',
            slot: 'file',
            minWidth: '300px',
          },
          {
            prop: 'downloads',
            label: '下载次数',
          },
          {
            prop: 'fileSize',
            label: '大小',
          },
          {
            prop: 'applicationDate',
            label: '申请日期',
          },
          {
            prop: 'failureTime',
            label: '失效时间',
          },
        ],
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
        fetchUrl: 'getApplyList',
      },
    }
  },
  created() {
    this.tableConfig.tableData = this.testData
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 260 + 'px'
  },
  methods: {
    downloadFile(data, type) {
      if (type == 1) {
        this.downloading = true
        setTimeout(() => {
          this.downloading = false
        }, 1000)
      } else {
        this.$set(data, 'loading', true)
        setTimeout(() => {
          this.$set(data, 'loading', false)
        }, 1000)
      }
    },
    delFile(val) {
      console.log(val)
      this.$confirm('删除后不可恢复，是否删除所选文件？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {})
    },
    handleSelectionChange(val) {
      this.selectData = val
      console.log(val)
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
          background: #37b24d;
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
