<template>
  <div class="box">
    <page-frame :title="$t('cs_systemManage.cs_53')" icon="systemLog">
      <el-form size="small" inline>
        <el-form-item :label="$t('cs_common.cs_62')">
          <el-date-picker
            v-model="tableConfig.condition.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('cs_common.cs_109')"
            align="right"
            :picker-options="pickerOptions1"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 200px"
            v-model="tableConfig.condition.username"
            :placeholder="$t('cs_systemManage.cs_54')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">
            {{ $t('cs_common.cs_67') }}
          </el-button>
        </el-form-item>
        <el-button
          type="warning"
          size="small"
          @click="dialogVisible = true"
          style="position: absolute; right: 45px"
        >
          {{ $t('cs_systemManage.cs_55') }}
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
          {{ $t('cs_systemManage.cs_56') }}
        </div>
      </template>
      <el-form label-width="100px">
        <el-form-item :label="$t('cs_systemManage.cs_57')">
          <el-date-picker
            v-model="delLogDate"
            type="datetimerange"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('cs_common.cs_109')"
            align="right"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="delLogTips">{{ $t('cs_systemManage.cs_58') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button size="small" type="primary" @click="delLog">
          {{ $t('cs_common.cs_12') }}
        </el-button>
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
            text: this.$t('cs_common.cs_110'),
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: this.$t('cs_common.cs_111'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: this.$t('cs_common.cs_112'),
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
            text: this.$t('cs_systemManage.cs_59'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()

              end.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('cs_systemManage.cs_60'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 548)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('cs_systemManage.cs_61'),
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
        maxHeight: '10000px',
        tableSetting: [
          {
            label: this.$t('cs_common.cs_98'),
            prop: 'username',
          },
          {
            label: this.$t('cs_systemManage.cs_62'),
            prop: 'operationTime',
          },
          {
            label: this.$t('cs_systemManage.cs_63'),
            prop: 'logType',
          },
          {
            label: this.$t('cs_systemManage.cs_64'),
            prop: 'logContent',
          },
          {
            label: this.$t('cs_systemManage.cs_65'),
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
    this.tableConfig.maxHeight = document.body.clientHeight - 294 + 'px'
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
        this.$message.warning(this.$t('cs_systemManage.cs_66'))
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
