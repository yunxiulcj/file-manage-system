<template>
  <div class="box">
    <page-frame title="用户管理" icon="userManage" :aside="true">
      <template #aside>
        <el-input
          v-model="filterDep"
          size="mini"
          placeholder="请输入部门名称"
          style="margin: 10px 10px 10px 0px; width: 172px"
        ></el-input>
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          :filter-node-method="filterNode"
          node-key="name"
          highlight-current
          lazy
          empty-text="暂无数据"
          @node-click="nodeClick"
        >
          <span class="nodeItem" slot-scope="{ node }">
            <span style="font-size: 13px">{{ node.label }}</span>
          </span>
        </el-tree>
      </template>
      <div class="header">
        <el-input
          v-model="filterUser"
          size="small"
          placeholder="请输入用户名或真实姓名查询"
          style="width: 250px; margin-right: 10px"
          clearable
        ></el-input>
        <div class="rightWrap">
          <el-button type="primary" size="small">设置上级</el-button>
          <el-button type="warning" size="small">导出Excel</el-button>
        </div>
      </div>
      <table-temp
        ref="table"
        :config="tableConfig"
        v-loading="tableLoading"
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
      filterUser: '',
      filterDep: '',
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
      fullData: [],
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
            prop: 'department',
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
      },
    }
  },
  created() {},
  watch: {
    filterDep(val) {
      this.$refs.tree.filter(val)
    },
    filterUser(val) {
      this.$set(
        this.tableConfig,
        'tableData',
        this.fullData.filter((item) => {
          if (
            item.userId.indexOf(val) != -1 ||
            item.realName.indexOf(val) != -1
          ) {
            return item
          }
        })
      )
    },
  },
  methods: {
    loadNode(node, resolve) {
      let dn = node.level == 0 ? '' : node.data.dn
      this.$http('getDepartmentList', { dn: dn }).then((res) => {
        let temp = []
        res.data.map((item) => {
          temp.push({
            name: item.name,
            dn: item.dn,
            leaf: !item.haveChildDepartment,
          })
        })
        resolve(temp)
      })
    },
    nodeClick(node) {
      this.tableLoading = true
      this.$http('getDepartmentUserList', { dn: node.dn })
        .then((res) => {
          this.fullData = res.data
          this.tableConfig.tableData = res.data
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
