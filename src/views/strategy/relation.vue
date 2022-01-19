<template>
  <div class="box">
    <page-frame
      title="用户管理"
      icon="userManage"
      :aside="true"
      asideWidth="210px"
    >
      <template #aside>
        <el-input
          v-model="filterDep"
          size="mini"
          placeholder="请输入部门名称"
          style="margin: 10px 10px 10px 0px; width: 190px"
        ></el-input>
        <el-tree
          style="width: 300px"
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
          <span class="nodeItem" slot-scope="{ node, data }">
            <el-popover placement="right" trigger="hover" :open-delay="300">
              <div>
                <div class="operation">
                  <div class="opItem" @click="changeName(data)">修改名称</div>
                  <div class="opItem" @click="setSuperior(data.dn)">
                    设置上级
                  </div>
                </div>
              </div>
              <span style="font-size: 13px" slot="reference">
                {{ node.label }}
              </span>
            </el-popover>
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
          <el-button type="primary" size="small" @click="setSuperior(tempDn)">
            设置上级
          </el-button>
          <el-button type="warning" size="small">导出Excel</el-button>
        </div>
      </div>
      <table-temp ref="table" :config="tableConfig" v-loading="tableLoading">
        <template slot="userId" slot-scope="scope">
          <div class="userBox">
            <span>{{ scope.row.userId }}</span>
            <el-tag v-if="scope.row.isTop" size="mini" style="float: right">
              上级
            </el-tag>
          </div>
        </template>
      </table-temp>
    </page-frame>
    <el-dialog :visible.sync="setSuperiorDialog" width="650px">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          设置部门上级
        </div>
      </template>
      <div class="contentBox">
        <div class="leftBox">
          <el-input
            v-model="filterUser1"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 90%; margin-bottom: 10px"
            placeholder="输入用户名进行筛选"
          ></el-input>
          <div class="leftContent">
            <el-checkbox-group v-model="tempSuperior">
              <el-checkbox
                v-for="item in depUserList"
                :key="item.userId"
                :label="item.userId"
              >
                <div class="checkItem">
                  {{ item.userId }}
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="rightBox">
          <div class="title">已选择的成员</div>
          <div class="rightContent">
            <el-tag
              v-for="tag in tempSuperior"
              :key="tag"
              @close="delSuperior(tag)"
              closable
              style="margin: 5px"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setSuperiorDialog = false" size="small">
          取 消
        </el-button>
        <el-button type="primary" size="small" @click="confirmSuperior">
          确 定
        </el-button>
      </span>
    </el-dialog>
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
      setSuperiorDialog: false,
      filterUser1: '',
      filterUser: '',
      filterDep: '',
      tempDn: '',
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
      fullData1: [],
      fullData: [],
      tempSuperior: [],
      depUserList: [],
      tableLoading: false,
      tableConfig: {
        tableData: [],
        border: true,
        maxHeight: '10000px',
        tableSetting: [
          {
            prop: 'userId',
            label: '用户名',
            align: 'left',
            slot: 'userId',
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
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 225 + 'px'
  },
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
    filterUser1(val) {
      this.depUserList = this.fullData1.filter((item) => {
        if (item.userId.indexOf(val) != -1) {
          return item
        }
      })
    },
  },
  methods: {
    confirmSuperior() {
      if (this.tempSuperior.length > 0) {
        this.$http('setDepartmentSuperior', {
          dn: this.tempDn,
          userList: this.tempSuperior,
        })
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.setSuperiorDialog = false
            this.getData(this.tempDn)
          })
      } else {
        this.$message.warning('请选择至少一个为上级')
      }
    },
    delSuperior(val) {
      this.tempSuperior = this.tempSuperior.filter((item) => {
        return item != val
      })
    },
    changeName(data) {
      console.log(data)
    },
    setSuperior(val) {
      if (val) {
        this.tempDn = val
        this.tempSuperior = []
        this.$http('getDepartmentUserList', { dn: val })
          .then((res) => {
            this.depUserList = res.data
            this.fullData1 = res.data
            res.data.map((item) => {
              if (item.isTop) this.tempSuperior.push(item.userId)
            })
          })
          .finally(() => {
            this.setSuperiorDialog = true
          })
      } else {
        this.$message.warning('请选择设置上级的部门')
      }
    },
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
    getData(val) {
      this.$http('getDepartmentUserList', { dn: val })
        .then((res) => {
          this.fullData = res.data
          this.tableConfig.tableData = res.data
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    nodeClick(node) {
      this.tempDn = node.dn
      this.tableLoading = true
      this.getData(node.dn)
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
.operation {
  .opItem {
    height: 25px;
    line-height: 25px;
    // width: 70px;
    text-align: center;
    cursor: pointer;
  }
  .opItem:hover {
    background: #f1f3f5;
    color: #228be6;
    font-weight: bolder;
  }
}
.contentBox {
  display: flex;
  flex-direction: row;
  .leftBox {
    width: 48%;
    border-right: 1px solid #e9ecef;
    margin-right: 10px;
    .leftContent {
      height: 400px;
      overflow: auto;
      .checkItem {
        height: 35px;
        line-height: 35px;
      }
    }
  }
  .rightBox {
    width: 48%;
    .title {
      font-size: 15px;
      font-weight: bolder;
      padding-left: 10px;
      margin-bottom: 15px;
    }
    .rightContent {
      height: 400px;
      overflow: auto;
    }
  }
}
</style>
