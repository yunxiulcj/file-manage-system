<template>
  <div class="box">
    <page-frame :title="$t('cs_process.cs_4')" icon="myApplication">
      <el-form inline size="small">
        <el-form-item :label="$t('cs_common.cs_61')">
          <el-select v-model="tableConfig.condition.applyStatus">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_62')">
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
            :placeholder="$t('cs_common.cs_66')"
            clear
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">
            {{ $t('cs_common.cs_67') }}
          </el-button>
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
          {{ $t('cs_common.cs_68') }}
        </div>
      </template>
      <table-temp
        :config="MultiFileConfig"
        :loading="tableLoading1"
      ></table-temp>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="MultiFileDialog = false">
          {{ $t('cs_common.cs_13') }}
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
            text: this.$t('cs_common.cs_69'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('cs_common.cs_58'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('cs_common.cs_59'),
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
          label: this.$t('cs_common.cs_70'),
          value: '',
        },
        {
          label: this.$t('cs_common.cs_30'),
          value: '1',
        },
        {
          label: this.$t('cs_common.cs_31'),
          value: '2',
        },
        {
          label: this.$t('cs_common.cs_29'),
          value: '3',
        },
        {
          label: this.$t('cs_common.cs_32'),
          value: '4',
        },
        {
          label: this.$t('cs_common.cs_53'),
          value: '5',
        },
        {
          label: this.$t('cs_common.cs_54'),
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
            label: this.$t('cs_common.cs_71'),
          },
          {
            prop: 'fileName',
            label: this.$t('cs_common.cs_14'),
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
            label: this.$t('cs_common.cs_72'),
            formatter: (row) => {
              let str
              switch (row.applyType) {
                case 1:
                  str = this.$t('cs_common.cs_49')
                  break
                case 2:
                  str = this.$t('cs_common.cs_73')
                  break
                case 3:
                  str = this.$t('cs_common.cs_49')
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
            label: this.$t('cs_common.cs_74'),
          },
          {
            prop: 'approvalTime',
            label: this.$t('cs_common.cs_75'),
          },
          {
            prop: 'applyStatus',
            label: this.$t('cs_common.cs_76'),
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
                  str = this.$t('cs_common.cs_30')
                  break
                case 2:
                  str = this.$t('cs_common.cs_31')
                  break
                case 3:
                  str = this.$t('cs_common.cs_29')
                  break
                case 4:
                  str = this.$t('cs_common.cs_32')
                  break
                case 5:
                  str = this.$t('cs_common.cs_53')
                  break
                case 6:
                  str = this.$t('cs_common.cs_54')
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
              label: this.$t('cs_common.cs_42'),
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
              label: this.$t('cs_process.cs_5'),
              type: 'text',
              fn: (row) => {
                this.$confirm(
                  this.$t('cs_process.cs_6'),
                  this.$t('cs_common.cs_34'),
                  {
                    confirmButtonText: this.$t('cs_common.cs_35'),
                    cancelButtonText: this.$t('cs_common.cs_10'),
                    type: 'info',
                    center: true,
                  }
                ).then(() => {
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
              label: this.$t('cs_common.cs_51'),
              type: 'text',
              show: (row) => {
                return row.applyStatus == 1
              },
              fn: (row) => {
                this.$confirm(
                  this.$t('cs_process.cs_7'),
                  this.$t('cs_common.cs_34'),
                  {
                    confirmButtonText: this.$t('cs_common.cs_35'),
                    cancelButtonText: this.$t('cs_common.cs_10'),
                    type: 'info',
                    center: true,
                  }
                ).then(() => {
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
              label: this.$t('cs_common.cs_77'),
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
            label: this.$t('cs_common.cs_14'),
          },
          {
            prop: 'fileSize',
            label: this.$t('cs_common.cs_78'),
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
