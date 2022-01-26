<template>
  <div class="box">
    <page-frame title="系统日志" icon="systemLog">
      <el-form size="small" inline>
        <el-form-item label="日期">
          <el-date-picker
            v-model="tableConfig.condition.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions1"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 200px"
            v-model="tableConfig.condition.username"
            placeholder="请输入操作人名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <el-button
          type="warning"
          size="small"
          @click="dialogVisible = true"
          style="position: absolute; right: 45px"
        >
          删除历史日志
        </el-button>
      </el-form>

      <table-temp
        ref="table"
        :config="tableConfig"
        :loading="tableLoading"
      ></table-temp>
    </page-frame>
    <el-dialog :visible.sync="dialogVisible" width="550px">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
            color: #1890ff;
          "
        >
          历史日志
        </div>
      </template>
      <el-form label-width="100px">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="delLogDate"
            type="datetimerange"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="delLogTips">提示：请选择一年以前的历史记录</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="delLog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
export default {
  name: 'systemLog',
  components: { pageFrame, tableTemp },
  data() {
    return {
      dialogVisible: false,
      tableLoading: false,
      delLogDate: '',
      pickerOptions1: {
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
      pickerOptions2: {
        shortcuts: [
          {
            text: '一年前',
            onClick(picker) {
              const end = new Date()
              const start = new Date()

              end.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '一年半前',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 548)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '两年前',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 730)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      tableConfig: {
        tableData: [],
        border: true,
        tableSetting: [
          {
            label: '用户',
            prop: 'username',
          },
          {
            label: '操作时间',
            prop: 'operationTime',
          },
          {
            label: '日志类型',
            prop: 'logType',
          },
          {
            label: '日志内容',
            prop: 'logContent',
          },
          {
            label: '执行结果',
            prop: 'result',
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
        fetchUrl: 'getSystemLogList',
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$nextTick(() => {
        this.$refs.table.fetch()
      })
    },
    delLog() {
      if (this.delLogDate.length > 0) {
        this.$http('deleteSystemLog', {
          startDate: this.delLogDate[0],
          endDate: this.delLogDate[1],
        }).then((res) => {
          this.$message.success(res.message)
        })
      } else {
        this.$message.warning('请选择时间范围')
      }
    },
  },
}
</script>

<style scoped>
.delLogTips {
  text-align: center;
  color: #868e96;
}
</style>
