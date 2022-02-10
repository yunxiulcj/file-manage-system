<template>
  <div class="box">
    <page-frame title="文件操作记录" icon="operatingRecord">
      <el-form size="small" inline>
        <el-form-item label="日期">
          <el-date-picker
            v-model="tableConfig.condition.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 200px"
            v-model="tableConfig.condition.username"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
      <table-temp
        ref="table"
        :config="tableConfig"
        :loading="tableLoading"
      ></table-temp>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
export default {
  name: 'operatingRecord',
  components: { pageFrame, tableTemp },
  data() {
    return {
      tableLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      tableConfig: {
        tableData: [],
        border: true,
        maxHeight: '10000px',
        tableSetting: [
          {
            label: '时间',
            prop: 'time',
          },
          {
            label: '用户',
            prop: 'username',
          },
          {
            label: '部门',
            prop: 'dept',
          },
          {
            label: '文档',
            prop: 'fileName',
          },
          {
            label: '行为',
            prop: 'operation',
          },
        ],
        condition: {
          date: '',
          username: '',
        },
        map: {
          data: 'data.data',
          total: 'data.totalCount',
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
        fetchUrl: 'getFileOperationLogList',
      },
    }
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 294 + 'px'
    this.getData()
  },
  methods: {
    getData() {
      this.$nextTick(() => {
        this.$refs.table.fetch()
      })
    },
  },
}
</script>

<style scoped>
.bax {
  position: absolute;
}
</style>
