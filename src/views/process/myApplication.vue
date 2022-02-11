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
            placeholder="请输入工单号"
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
        :config="MultiFileConfig"
        :loading="tableLoading1"
      ></table-temp>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="MultiFileDialog = false">
          关 闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
import moment from 'moment'
import { unitSetUp } from '../../utils/obj-operation'
export default {
  name: 'myApplication',
  components: { pageFrame, tableTemp },
  data() {
    return {
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
        {
          label: '传输异常',
          value: '6',
        },
      ],
      approvalData: {
        file: [],
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
      tableConfig: {
        tableData: [],
        border: true,
        maxHeight: '10000px',
        tableSetting: [
          {
            prop: 'applyId',
            label: '工单号',
          },
          {
            prop: 'fileName',
            label: '文件名',
            style: (row) => {
              return row.multiFile
                ? { color: '#1890ff', cursor: 'pointer' }
                : { color: 'none' }
            },
            click: (row) => {
              if (row.multiFile) {
                this.$set(this.MultiFileConfig, 'tableData', row.attachmentList)
                this.MultiFileDialog = true
              }
            },
          },
          {
            prop: 'applyType',
            label: '行为',
            formatter: (row) => {
              let str
              switch (row.applyType) {
                case 1:
                  str = '文件下载申请'
                  break
                case 2:
                  str = '文件外发申请'
                  break
                case 3:
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
                case 1:
                  sty = { color: '#fd7e14' }
                  break
                case 2:
                case 3:
                  sty = { color: '#228be6' }
                  break
                case 4:
                  sty = { color: '#40c057' }
                  break
                case 5:
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
                case 1:
                  str = '已撤回'
                  break
                case 2:
                  str = '待处理'
                  break
                case 3:
                  str = '审批中'
                  break
                case 4:
                  str = '审批通过'
                  break
                case 5:
                  str = '审批拒绝'
                  break
                case 6:
                  str = '传输异常'
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
                sessionStorage.setItem(
                  'tempObj',
                  JSON.stringify({
                    accountType: '2',
                    applyId: row.applyId,
                  })
                )
                this.$router.push({
                  name: 'approval',
                  params: {
                    accountType: '2',
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
                  this.$http('back', { applyId: row.applyId }).then((res) => {
                    this.$message.success(res.errMsg)
                    this.getData()
                  })
                })
              },
              style: { color: '#fd7e14' },
              show: (row) => {
                return row.applyStatus == 2
              },
            },
            {
              label: '删除',
              type: 'text',
              show: (row) => {
                return row.applyStatus == 1
              },
              fn: (row) => {
                this.$confirm('是否删除该申请记录？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'info',
                  center: true,
                }).then(() => {
                  this.$http('deleteApply', { applyId: row.applyId }).then(
                    (res) => {
                      this.$message.success(res.errMsg)
                      this.getData()
                    }
                  )
                })
              },
            },
            {
              label: '编辑',
              type: 'text',
              show: (row) => {
                return row.applyStatus == 1
              },
              fn: (row) => {
                let obj = {
                  applyId: row.applyId,
                  applyUser: localStorage.getItem('username') || '',
                  applyType: 1,
                }
                this.$http('getApplyDetail', {
                  applyId: row.applyId,
                  type: '2',
                })
                  .then((res) => {
                    let data = res.data
                    obj['applyEmail'] = data.applyEmail
                    obj['applyTheme'] = data.applyTheme
                    obj['describe'] = data.applyDesc
                    obj['fileList'] =
                      data.fileList &&
                      data.fileList.map((item) => {
                        item['size'] = unitSetUp(item.fileSize)
                        return item
                      })
                    obj['downloadDay'] = data.downloadDay
                    obj['downloadCount'] = data.downloadCount
                    obj['approvalUserList'] = data.approvalUserList
                    sessionStorage.setItem(
                      'tempData',
                      JSON.stringify({ data: obj, type: 0 })
                    )
                  })
                  .finally(() => {
                    this.$router.push({
                      name: 'newOrEditApply',
                      params: {
                        type: 1,
                        data: obj,
                      },
                    })
                  })
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
        maxHeight: '400px',
        tableSetting: [
          {
            prop: 'fileName',
            label: '文件名',
          },
          {
            prop: 'fileSize',
            label: '文件大小',
            formatter: (row) => {
              return unitSetUp(row.fileSize)
            },
          },
        ],
      },
    }
  },
  computed: {},
  created() {
    this.getDefaultTime()
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 294 + 'px'
    this.getData()
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
