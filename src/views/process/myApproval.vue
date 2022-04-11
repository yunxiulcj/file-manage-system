<template>
  <div class="box">
    <page-frame :title="$t('cs_process.cs_9')" icon="myApproval">
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
            :range-separator="$t('cs_common.cs_63')"
            :start-placeholder="$t('cs_common.cs_64')"
            :end-placeholder="$t('cs_common.cs_65')"
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
      <table-temp :config="MultiFileConfig"></table-temp>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="MultiFileDialog = false">
          {{ $t('cs_common.cs_13') }}
        </el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog :visible.sync="agreeOrRefuseDialog" width="500px">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          {{ $t('cs_common.cs_34') }}
        </div>
      </template>
      <el-form size="small">
        <el-form-item :label="$t('cs_common.cs_46')" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadCount"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">{{ $t('cs_common.cs_27') }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">{{ $t('cs_common.cs_28') }}</span>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_47')" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadExpiredDay"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">{{ $t('cs_common.cs_27') }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">{{ $t('cs_common.cs_28') }}</span>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_60')">
          <el-input v-model="editForm.comment" style="width: 335px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="agreeOrRefuseDialog = false">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="confirmEdit"
        >
          {{ $t('cs_common.cs_12') }}
        </el-button>
      </span>
    </el-dialog> -->
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
      tableConfig: {
        maxHeight: '10000px',
        tableData: [],
        border: true,
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
            prop: 'applyUser',
            label: this.$t('cs_common.cs_3'),
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
            // {
            //   label: this.$t('cs_common.cs_43'),
            //   style: { color: '#389e0d' },
            //   type: 'text',
            //   fn: (row) => {
            //     this.editForm.applyId = row.applyId
            //     this.editForm.applyStatus = 1
            //     this.editForm.comment = ''
            //     this.editForm.downloadCount = row.downloadCount
            //     this.editForm.downloadExpiredDay = row.downloadDay
            //     this.canEdit = row.canEdit
            //     this.agreeOrRefuseDialog = true
            //   },
            //   show: (row) => {
            //     return row.canApproval
            //   },
            // },
            // {
            //   label: this.$t('cs_common.cs_44'),
            //   style: { color: '#f5222d' },
            //   type: 'text',
            //   fn: (row) => {
            //     this.editForm.applyId = row.applyId
            //     this.editForm.applyStatus = 2
            //     this.editForm.downloadCount = row.downloadCount
            //     this.editForm.downloadExpiredDay = row.downloadDay
            //     this.editForm.comment = ''
            //     this.canEdit = false
            //     this.agreeOrRefuseDialog = true
            //   },
            //   show: (row) => {
            //     return row.canApproval
            //   },
            // },
            {
              label: this.$t('cs_.cs_34'),
              type: 'text',
              fn: (row) => {
                this.$router.push({
                  name: 'approval',
                  query: {
                    accountType: '1',
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
            label: this.$t('cs_common.cs_14'),
          },
          {
            prop: 'fileSize',
            label: this.$t('cs_common.cs_78'),
          },
        ],
      },
      loading: false,
    }
  },
  created() {
    this.getDefaultTime()
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 294 + 'px'
    this.getData()
  },
  methods: {
    confirmEdit() {
      if (this.editForm.comment == '') {
        this.$message.warning(this.$t('cs_common.cs_55'))
        return
      }
      this.loading = true
      let url = this.editForm.applyStatus == 1 ? 'agree' : 'refuse'
      this.$http(url, this.editForm)
        .then((res) => {
          this.$message.success(res.errMsg)
          this.agreeOrRefuseDialog = false
          this.getData()
        })
        .finally(() => {
          this.loading = false
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
  },
}
</script>

<style scoped>
.unit {
  margin-left: 10px;
}
</style>
