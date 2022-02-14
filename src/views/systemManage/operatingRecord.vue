<template>
  <div class="box">
    <page-frame :title="$t('cs_systemManage.cs_39')" icon="operatingRecord">
      <el-form size="small" inline>
        <el-form-item :label="$t('cs_common.cs_62')">
          <el-date-picker
            v-model="tableConfig.condition.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('cs_common.cs_109')"
            align="right"
            :picker-options="pickerOptions"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 200px"
            v-model="tableConfig.condition.username"
            :placeholder="$t('cs_common.cs_39')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">
            {{ $t('cs_common.cs_67') }}
          </el-button>
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
      tableConfig: {
        tableData: [],
        border: true,
        maxHeight: '10000px',
        tableSetting: [
          {
            label: this.$t('cs_systemManage.cs_40'),
            prop: 'time',
          },
          {
            label: this.$t('cs_common.cs_98'),
            prop: 'username',
          },
          {
            label: this.$t('cs_common.cs_93'),
            prop: 'dept',
          },
          {
            label: this.$t('cs_systemManage.cs_41'),
            prop: 'fileName',
          },
          {
            label: this.$t('cs_common.cs_72'),
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
