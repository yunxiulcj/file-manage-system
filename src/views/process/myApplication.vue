<template>
  <div class="box">
    <page-frame title="我的申请" icon="myApplication">
      <el-form inline size="small">
        <el-form-item label="审批状态">
          <el-select v-model="tableConfig.condition.applyStatus">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="times"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="tableConfig.condition.searchStr"
            placeholder="请输入搜索内容"
            clear
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
      <table-temp
        :config="tableConfig"
        ref="table"
        :loading="tableLoading"
      ></table-temp>
    </page-frame>
    <el-dialog :visible.sync="MultiFileDialog" width="60%">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          文件夹
        </div>
      </template>
      <table-temp
        ref="table1"
        :config="MultiFileConfig"
        :loading="tableLoading1"
      ></table-temp>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="MultiFileDialog = false">
          取 消
        </el-button>
        <el-button size="small" type="primary" @click="MultiFileDialog = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-drawer :visible.sync="drawerVisible" direction="rtl" size="60%">
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
          审批详情
        </div>
      </template>
      <el-steps :active="1" simple>
        <el-step title="步骤 1" icon="el-icon-edit"></el-step>
        <el-step title="步骤 2" icon="el-icon-upload"></el-step>
        <el-step title="步骤 3" icon="el-icon-picture"></el-step>
      </el-steps>
      <el-divider></el-divider>

      <el-divider></el-divider>
    </el-drawer>
  </div>
</template>
<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
import moment from 'moment'
export default {
  name: 'myApplication',
  components: { pageFrame, tableTemp },
  data() {
    return {
      drawerVisible: false,
      MultiFileDialog: false,
      tableLoading1: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      tableLoading: false,
      times: [],
      stateList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '已撤回',
          value: '1',
        },
        {
          label: '待处理',
          value: '2',
        },
        {
          label: '审批中',
          value: '3',
        },
        {
          label: '审批通过',
          value: '4',
        },
        {
          label: '审批拒绝',
          value: '5',
        },
      ],
      approvalData: {
        file: [
          {
            fileName: 'testFile1.txt',
            fileLevel: '1',
          },
          {
            fileName: 'testFile1.txt',
            fileLevel: '2',
          },
        ],
        applyTime: '',
        applyState: '',
        workOrderNum: '',
        applyUser: '',
        department: '',
        invalidDay: '',
        describe: '',
        processList: [
          {
            approvalUser: '',
            approvalState: '',
            describe: '',
            approvalTime: '',
          },
        ],
        receiver: '',
        receiverEmail: '',
        receiverTel: '',
        receiverCompany: '',
        approvalSuccessTime: '',
      },
      testData: [
        {
          approvalTime: '2021-12-12 12:12:12',
          canDownload: '',
          applyStatus: '3',
          applyTime: '2021-12-12 12:12:12',
          applyType: '3',
          sensitivityLevel: '3',
          applyId: '12sd3',
          fileName: '多个文件',
          workOrderNum: '123321789',
          isMultiFile: true,
          approvalCurrentUserId: '',
        },
        {
          approvalTime: '2021-12-12 12:12:12',
          canDownload: '',
          applyStatus: '2',
          applyTime: '2021-12-12 12:12:12',
          applyType: '2',
          sensitivityLevel: '2',
          applyId: '12sdfs',
          fileName: 'Testtes',
          workOrderNum: '3123321789',
          isMultiFile: false,
          approvalCurrentUserId: '',
        },
        {
          approvalTime: '2021-12-12 12:12:12',
          canDownload: '',
          applyStatus: '1',
          applyTime: '2021-12-12 12:12:12',
          applyType: '1',
          sensitivityLevel: '1',
          applyId: '122343',
          fileName: 'qwerrewq',
          workOrderNum: '2123321789',
          isMultiFile: false,
          approvalCurrentUserId: '',
        },
        {
          approvalTime: '2021-12-12 12:12:12',
          canDownload: '',
          applyStatus: '5',
          applyTime: '2021-12-12 12:12:12',
          applyType: '1',
          sensitivityLevel: '1',
          applyId: '122gdfg343',
          fileName: 'qwerrewq',
          workOrderNum: '2123321789',
          isMultiFile: false,
          approvalCurrentUserId: '',
        },
        {
          approvalTime: '2021-12-12 12:12:12',
          canDownload: '',
          applyStatus: '4',
          applyTime: '2021-12-12 12:12:12',
          applyType: '1',
          sensitivityLevel: '1',
          applyId: '122sdfsd343',
          fileName: 'qwerrewq',
          workOrderNum: '2123321789',
          isMultiFile: false,
          approvalCurrentUserId: '',
        },
      ],
      tableConfig: {
        tableData: [],
        border: true,
        tableSetting: [
          {
            prop: 'workOrderNum',
            label: '工单号',
          },
          {
            prop: 'fileName',
            label: '文件名',
            style: (row) => {
              return row.isMultiFile
                ? { color: '#1890ff', cursor: 'pointer' }
                : { color: 'none' }
            },
            click: (row) => {
              if (row.isMultiFile) {
                this.MultiFileDialog = true
                this.$nextTick(() => {})
              }
            },
          },
          {
            prop: 'sensitivityLevel',
            label: '敏感级别',
            style: (row) => {
              let sty
              switch (row.sensitivityLevel) {
                case '1':
                  sty = { color: '#1890ff' }
                  break
                case '2':
                  sty = { color: '#faad14' }
                  break
                case '3':
                  sty = { color: '#f5222d' }
                  break
                default:
                  sty = { color: '#595959' }
                  break
              }
              return sty
            },
            formatter: (row) => {
              let str
              switch (row.sensitivityLevel) {
                case '1':
                  str = '秘密'
                  break
                case '2':
                  str = '机密'
                  break
                case '3':
                  str = '绝密'
                  break
                default:
                  str = '-'
                  break
              }
              return str
            },
          },
          {
            prop: 'applyType',
            label: '行为',
            formatter: (row) => {
              let str
              switch (row.applyType) {
                case '1':
                  str = '公网上传申请'
                  break
                case '2':
                  str = '文件外发申请'
                  break
                case '3':
                  str = '文件下载申请'
                  break
                default:
                  str = '-'
                  break
              }
              return str
            },
          },
          {
            prop: 'applyTime',
            label: '申请时间',
          },
          {
            prop: 'approvalTime',
            label: '审批时间',
          },
          {
            prop: 'applyStatus',
            label: '申请结果',
            style: (row) => {
              let sty
              switch (row.applyStatus) {
                case '1':
                  sty = { color: '#fd7e14' }
                  break
                case '2':
                case '3':
                  sty = { color: '#228be6' }
                  break
                // sty = { color: '#fcc419' }
                // break
                case '4':
                  sty = { color: '#40c057' }
                  break
                case '5':
                  sty = { color: '#f03e3e' }
                  break
                default:
                  sty = { color: '#595959' }
                  break
              }
              return sty
            },
            formatter: (row) => {
              let str
              switch (row.applyStatus) {
                case '1':
                  str = '已撤回'
                  break
                case '2':
                  str = '待处理'
                  break
                case '3':
                  str = '审批中'
                  break
                case '4':
                  str = '审批通过'
                  break
                case '5':
                  str = '审批拒绝'
                  break
                default:
                  str = '-'
                  break
              }
              return str
            },
          },
        ],
        map: {
          data: 'data.data',
          total: 'data.totalCount',
        },
        condition: {
          applyStatus: '',
          startTime: '',
          endTime: '',
          searchStr: '',
        },
        operation: {
          btns: [
            {
              label: '详情',
              type: 'text',
              fn: (row) => {
                this.$router.push({
                  name: 'approval',
                  params: {
                    accountType: '0',
                    approvalState: row.applyStatus,
                    applyId: row.applyId,
                  },
                })
              },
            },
            {
              label: '撤回',
              type: 'text',
              fn: (row) => {
                this.$confirm('是否撤回当前申请？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'info',
                  center: true,
                }).then(() => {
                  console.log(row)
                })
              },
              style: { color: '#fd7e14' },
              show: (row) => {
                return row.applyStatus == 2
              },
            },
          ],
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
        fetchUrl: 'getApplyList',
      },
      MultiFileConfig: {
        border: true,
        tableData: [],
        tableSetting: [
          {
            prop: 'fileName',
            label: '文件名',
          },
          {
            prop: 'sensitivityLevel',
            label: '敏感级别',
            style: (row) => {
              let sty
              switch (row.sensitivityLevel) {
                case '1':
                  sty = { color: '#1890ff' }
                  break
                case '2':
                  sty = { color: '#fa8c16' }
                  break
                case '3':
                  sty = { color: '#f5222d' }
                  break
                default:
                  sty = { color: '#595959' }
                  break
              }
              return sty
            },
            formatter: (row) => {
              let str
              switch (row.sensitivityLevel) {
                case '1':
                  str = '秘密'
                  break
                case '2':
                  str = '机密'
                  break
                case '3':
                  str = '绝密'
                  break
                default:
                  str = '-'
                  break
              }
              return str
            },
          },
          {
            prop: 'fileSize',
            label: '文件大小',
          },
        ],
        condition: {
          applyId: '',
        },
        fetchUrl: 'getApplyList',
      },
    }
  },
  computed: {},
  created() {
    this.getDefaultTime()
  },
  mounted() {
    this.getData()
    this.tableConfig.tableData = this.testData
  },
  methods: {
    getData() {
      this.tableConfig.condition.startTime = this.times[0]
      this.tableConfig.condition.endTime = this.times[1]
      this.$nextTick(() => {
        this.$refs.table.fetch()
      })
    },
    getDefaultTime() {
      this.times = [
        moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        moment().format('YYYY-MM-DD HH:mm:ss'),
      ]
    },
  },
}
</script>

<style scoped></style>
