<template>
  <div class="box">
    <page-frame :title="$t('cs_systemManage.cs_43')" icon="spaceManage">
      <el-button type="primary" size="small" icon="el-icon-plus">
        {{ $t('cs_systemManage.cs_44') }}
      </el-button>
      <el-input
        v-model="searchStr"
        suffix-icon="el-icon-search"
        style="width: 300px; float: right"
        size="small"
        :placeholder="$t('cs_systemManage.cs_45')"
      ></el-input>
      <div style="height: 15px; width: 100%"></div>
      <table-temp ref="table" :config="tableConfig">
        <template slot="spaceName" slot-scope="scope">
          <div class="NameBox">
            <i class="iconfont icon-home"></i>
            <span class="spaceName">{{ scope.row.spaceName }}</span>
          </div>
        </template>
      </table-temp>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
export default {
  name: 'spaceManage',
  components: { pageFrame, tableTemp },
  data() {
    return {
      searchStr: '',
      tableConfig: {
        tableData: [],
        headerCellStyle: { fontSize: '15px', background: '#f8f9fa' },
        border: false,
        stripe: false,
        tableSetting: [
          {
            prop: 'spaceName',
            label: this.$t('cs_systemManage.cs_46'),
            slot: 'spaceName',
          },
          {
            prop: 'totalQuota',
            label: this.$t('cs_systemManage.cs_47'),
          },
          {
            prop: 'administrator',
            label: this.$t('cs_systemManage.cs_48'),
          },
          {
            prop: 'membersTheSpace',
            label: this.$t('cs_systemManage.cs_49'),
            sortable: true,
          },
          {
            prop: 'creator',
            label: this.$t('cs_systemManage.cs_50'),
          },
          {
            prop: 'createTime',
            label: this.$t('cs_systemManage.cs_51'),
            sortable: true,
          },
        ],
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
      },
    }
  },
  created() {
    this.tableConfig.tableData = this.testData
  },
}
</script>

<style scoped>
.iconfont {
  font-size: 35px;
  color: #1890ff;
}
</style>
