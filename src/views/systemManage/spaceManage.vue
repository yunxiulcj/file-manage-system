<template>
  <div class="box">
    <page-frame title="空间管理" icon="spaceManage">
      <el-button type="primary" size="small" icon="el-icon-plus">
        新建共享空间
      </el-button>
      <el-input
        v-model="searchStr"
        suffix-icon="el-icon-search"
        style="width: 300px; float: right"
        size="small"
        placeholder="搜索空间名称、空间管理员、创建者"
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
      testData: [
        {
          spaceName: 'space1',
          totalQuota: '1055GB',
          administrator: 'test',
          membersTheSpace: '12',
          creator: 'tset',
          createTime: '2021-12-12 12:12:12',
        },
        {
          spaceName: 'space1',
          totalQuota: '2055GB',
          administrator: 'test',
          membersTheSpace: '12',
          creator: 'tset',
          createTime: '2021-12-12 12:12:12',
        },
        {
          spaceName: 'space3',
          totalQuota: '3055GB',
          administrator: 'test',
          membersTheSpace: '12',
          creator: 'tset',
          createTime: '2021-12-12 12:12:12',
        },
      ],
      tableConfig: {
        tableData: [],
        headerCellStyle: { fontSize: '15px', background: '#f8f9fa' },
        border: false,
        stripe: false,
        tableSetting: [
          {
            prop: 'spaceName',
            label: '空间名称',
            slot: 'spaceName',
          },
          {
            prop: 'totalQuota',
            label: '总配额',
          },
          {
            prop: 'administrator',
            label: '管理员',
          },
          {
            prop: 'membersTheSpace',
            label: '空间成员',
            sortable: true,
          },
          {
            prop: 'creator',
            label: '创建者',
          },
          {
            prop: 'createTime',
            label: '创建时间',
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
