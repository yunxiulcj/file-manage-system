<template>
  <div class="box">
    <page-frame title="我的审批" icon="myApproval">
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
      <table-temp :config="MultiFileConfig"></table-temp>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="MultiFileDialog = false">
          关 闭
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="agreeOrRefuseDialog" width="500px">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          提示
        </div>
      </template>
      <el-form size="small">
        <el-form-item label="下载次数" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadCount"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">单位：天</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">注：0表示长期有效</span>
        </el-form-item>
        <el-form-item label="申请有效期" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadExpiredDay"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">单位：天</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">注：0表示长期有效</span>
        </el-form-item>
        <el-form-item label="理由">
          <el-input v-model="editForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="agreeOrRefuseDialog = false">
          取 消
        </el-button>
        <el-button size="small" type="primary" @click="confirmEdit">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
import moment from 'moment'
export default {
  name: 'myApproval',
  components: { pageFrame, tableTemp },
  data() {
    return {
      MultiFileDialog: false,
      agreeOrRefuseDialog: false,
      canEdit: false,
      editForm: {
        applyId: '',
        applyStatus: 1,
        downloadCount: 1,
        downloadExpiredDay: 1,
        comment: '',
      },
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
      tableConfig: {
        tableData: [],
        border: true,
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
                case '1':
                  str = '文件下载申请'
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
              label: '同意',
              style: { color: '#389e0d' },
              type: 'text',
              fn: (row) => {
                this.editForm.applyId = row.applyId
                this.editForm.applyStatus = 1
                this.editForm.downloadCount = row.downloadCount
                this.editForm.downloadExpiredDay = row.downloadDay
                this.canEdit = row.canEdit
                this.agreeOrRefuseDialog = true
              },
              show: (row) => {
                return row.applyStatus == 2 || row.applyStatus == 3
              },
            },
            {
              label: '拒绝',
              style: { color: '#f5222d' },
              type: 'text',
              fn: (row) => {
                this.editForm.applyId = row.applyId
                this.editForm.approvalState = 2
                this.editForm.downloadCount = row.downloadCount
                this.editForm.downloadExpiredDay = row.downloadDay
                this.canEdit = false
                this.agreeOrRefuseDialog = true
              },
              show: (row) => {
                return row.applyStatus == 2 || row.applyStatus == 3
              },
            },
            {
              label: '详情',
              type: 'text',
              fn: (row) => {
                console.log(row)
                this.$router.push({
                  name: 'approval',
                  query: {
                    accountType: '1',
                    approvalState: row.applyStatus,
                    applyId: row.applyId,
                  },
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
        fetchUrl: 'getApprovalList',
      },
      MultiFileConfig: {
        tableData: [],
        border: true,
        maxHeight: '400px',
        tableSetting: [
          {
            prop: 'fileName',
            label: '文件名',
          },
          {
            prop: 'fileSize',
            label: '文件大小',
          },
        ],
      },
    }
  },
  created() {
    this.getDefaultTime()
  },
  mounted() {
    this.getData()
  },
  methods: {
    agree() {
      this.$http('agree', this.editForm).then((res) => {
        this.$message.success(res.errMsg)
      })
    },
    confirmEdit() {
      this.$http('agree', this.editForm).then((res) => {
        this.$message.success(res.errMsg)
      })
    },
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
    agreeOrRefuseApply(row, status) {
      this.$http('agreeOrRefuseApply', {
        applyId: row.applyId,
        applyType: row.applyType,
        applyStatus: status,
      }).then((res) => {
        this.$message.success(res.errMsg)
      })
    },
  },
}
</script>

<style scoped></style>
