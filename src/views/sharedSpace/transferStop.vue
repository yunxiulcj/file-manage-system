<template>
  <div class="box">
    <header>
      <div class="headLeft">
        <el-button size="mini" type="primary">
          <i class="iconfont icon-xiazai"></i>
          下载
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
    <table-temp
      :config="tableConfig"
      ref="table"
      @selection-change="handleSelectionChange"
      :loading="tableLoading"
    ></table-temp>
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
      tableLoading: false,
      tableConfig: {
        tableData: [],
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
            prop: 'fileName',
            label: '文件名',
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
  created() {},
  methods: {
    handleSelectionChange(val) {
      console.log(val)
    },
  },
}
</script>

<style lang="scss" scoped>
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
.iconfont {
  margin-right: 5px;
}
</style>
