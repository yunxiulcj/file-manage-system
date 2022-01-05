<template>
  <div class="box">
    <page-frame title="用户管理" icon="userManage" :aside="true">
      <template #aside>
        <el-input
          v-model="tableConfig.codition.departmentName"
          size="mini"
          placeholder="请输入部门名称"
          style="margin: 10px 10px 10px 0px; width: 172px"
        ></el-input>
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :highlight-current="true"
          :filter-node-method="filterNode"
        ></el-tree>
      </template>
      <div class="header">
        <el-input
          v-model="tableConfig.codition.realName"
          size="small"
          placeholder="请输入用户名或真实姓名查询"
          style="width: 250px; margin-right: 10px"
        ></el-input>
        <el-button type="primary" size="small">查询</el-button>
        <div class="rightWrap">
          <el-button type="primary" size="small">设置上级</el-button>
          <el-button type="warning" size="small">导出Excel</el-button>
        </div>
      </div>
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
import TableTemp from '../../components/table-temp.vue'
export default {
  name: 'userManage',
  components: { pageFrame, TableTemp },
  data() {
    return {
      treeData: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1',
                },
              ],
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1',
                },
              ],
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1',
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      tableLoading: false,
      tableConfig: {
        tableData: [],
        border: true,
        tableSetting: [
          {
            prop: 'userId',
            label: '用户名',
          },
          {
            prop: 'realName',
            label: '真实姓名',
          },
          {
            prop: 'departmentName',
            label: '部门',
          },
          {
            prop: 'tel',
            label: '手机号',
          },
          {
            prop: 'email',
            label: '邮箱',
          },
        ],
        codition: {
          realName: '',
          departmentName: '',
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
        fetchUrl: 'getUserList',
      },
    }
  },
  created() {},
  watch: {
    'tableConfig.codition.departmentName'(val) {
      console.log(val)
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      console.log(data)
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  position: relative;
  margin-bottom: 12px;
  .rightWrap {
    position: absolute;
    right: 0px;
  }
}
</style>
