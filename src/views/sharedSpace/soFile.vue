<template>
  <div class="box">
    <header>
      <div class="headLeft">
        <el-button size="mini" type="primary">
          <i class="iconfont icon-xinjianwenjian"></i>
          新建文件夹
        </el-button>
        <el-button size="mini" type="primary">
          <i class="iconfont icon-upload"></i>
          上传
        </el-button>
        <el-button size="mini" type="primary" style="background: #0eafc0">
          <i class="iconfont icon-fileDownload"></i>
          下载申请
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
    <div class="tableWrap" v-if="isTable">
      <table-temp
        :config="tableConfig"
        ref="table"
        @selection-change="handleSelectionChange"
        :loading="tableLoading"
      ></table-temp>
    </div>
    <div class="iconWrap" v-else>
      <el-checkbox v-model="checkAll">全选</el-checkbox>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import tableTemp from '../../components/table-temp.vue'
export default {
  name: 'soFile',
  components: { tableTemp },
  data() {
    return {
      checkAll: false,
      isTable: true,
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
            prop: 'fileSize',
            label: '大小',
          },
          {
            prop: 'dateChang',
            label: '修改日期',
          },
        ],
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
.icon-caidan {
  font-size: 28px;
  color: #868e96;
  cursor: pointer;
  margin-left: 15px;
}
.icon-caidan:hover {
  color: #343a40;
}
.icon-liebiao {
  font-size: 27px;
  color: #868e96;
  cursor: pointer;
  margin-left: 15px;
}
.icon-liebiao:hover {
  color: #343a40;
}
.el-divider {
  margin: 5px 0px;
}
</style>
