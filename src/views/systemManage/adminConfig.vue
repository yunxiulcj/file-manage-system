<template>
  <div class="box">
    <page-frame title="管理员配置" icon="adminConfig">
      <div class="btnWrap">
        <div class="leftBtn">
          <el-button type="primary" size="small" @click="showNew">
            添加账号
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteManager(delAccount)"
          >
            删除勾选账号
          </el-button>
        </div>
        <div class="rightBtn">
          <el-button type="warning" size="small" @click="previewDialog = true">
            权限预览
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            @click="getData"
          >
            刷新列表
          </el-button>
        </div>
      </div>
      <table-temp
        :config="tableConfig"
        ref="table"
        @selection-change="handleSelectionChange"
        :loading="tableLoading"
      ></table-temp>
    </page-frame>
    <el-dialog :visible.sync="showNewOrEdit" width="500px">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          {{ newOrEdit }}
        </div>
      </template>
      <el-form
        ref="form"
        :model="formObj"
        :rules="formRules"
        size="small"
        style="width: 400px"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="域账号" prop="userId">
          <el-input
            v-model="formObj.userId"
            placeholder="请输入域账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input
            v-model="formObj.username"
            placeholder="请输入真实姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="formObj.roleId" style="width: 300px">
            <el-option
              v-for="item in roleType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="formObj.email"
            placeholder="请输入邮箱"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            v-model="formObj.phone"
            placeholder="请输入手机号码"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showNewOrEdit = false">取 消</el-button>
        <el-button size="small" type="primary" @click="NewOrEditUser">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          权限预览
        </div>
      </template>
      <div class="treeWrap">
        <div class="leftBox">
          <div class="title">普通管理员</div>
          <el-tree
            :data="normalData"
            node-key="id"
            default-expand-all
            :props="defaultProps"
          ></el-tree>
        </div>
        <div class="rightBox">
          <div class="title">系统管理员</div>
          <el-tree
            :data="adminData"
            node-key="id"
            default-expand-all
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="previewDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
import { listRouter } from '@/app/router/index.js'
export default {
  name: 'adminConfig',
  components: { pageFrame, tableTemp },
  data() {
    var checkUserId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('域账号不能为空'))
      }
      this.$http('domainAccountMatch', { userId: value }).then((res) => {
        if (res.errCode != -1) {
          callback(new Error(res.errMsg))
        } else {
          callback()
        }
      })
    }
    return {
      normalId: [],
      adminId: [],
      normalData: [],
      adminData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      newOrEdit: '',
      showNewOrEdit: false,
      tableLoading: false,
      delAccount: [],
      formObj: {
        userId: '',
        username: '',
        roleId: '1',
        email: '',
        phone: '',
      },
      formRules: {
        userId: [{ required: true, validator: checkUserId, trigger: 'blur' }],
      },
      roleType: [
        {
          label: '系统管理员',
          value: 1,
        },
        {
          label: '普通管理员',
          value: 2,
        },
      ],
      tableConfig: {
        tableData: [],
        maxHeight: '10000px',
        selection: true,
        border: true,
        tableSetting: [
          {
            prop: 'userId',
            label: '域账号',
          },
          {
            prop: 'username',
            label: '真实姓名',
          },
          {
            prop: 'roleId',
            label: '角色',
            formatter: (row) => {
              return row.roleId == 1 ? '系统管理员' : '普通管理员'
            },
          },
          {
            prop: 'email',
            label: '邮箱',
          },
          {
            prop: 'phone',
            label: '手机号码',
          },
        ],
        operation: {
          btns: [
            {
              label: '修改',
              type: 'text',
              fn: (row) => {
                this.newOrEdit = '编辑账号'
                this.formObj.userId = row.userId
                this.formObj.username = row.username
                this.formObj.roleId = row.roleId
                this.formObj.email = row.email
                this.formObj.phone = row.phone
                this.formObj['id'] = row.id
                this.showNewOrEdit = true
              },
            },
            {
              label: '删除',
              style: { color: 'red' },
              type: 'text',
              fn: (row) => {
                this.deleteManager([row.id])
              },
            },
          ],
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
        fetchUrl: 'getAccountList',
      },
      previewDialog: false,
    }
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 294 + 'px'
    this.getData()
    this.getPreViewRole()
  },
  methods: {
    getData() {
      this.$refs.table.fetch()
    },
    getPreViewRole() {
      this.$http('preViewRole')
        .then((res) => {
          if (res.data && res.data.length > 0) {
            let temp1 = [],
              temp2 = []
            res.data.map((item) => {
              if (item.roleId == 1) {
                temp1.push(item.menuId)
              } else if (item.roleId == 2) {
                temp2.push(item.menuId)
              }
            })
            this.$set(this, 'adminId', temp1)
            this.$set(this, 'normalId', temp2)
          }
        })
        .finally(() => {
          this.powerPreview()
        })
    },
    powerPreview() {
      listRouter.map((item) => {
        let temp, temp1
        if (this.adminId.includes(item.id)) {
          temp = { label: item.meta.title }
        }
        if (this.normalId.includes(item.id)) {
          temp1 = { label: item.meta.title }
        }
        if (item.children && item.children.length > 0) {
          item.children.map((child) => {
            if (this.normalId.includes(child.id)) {
              if (temp1['children']) {
                temp1['children'].push({ label: child.meta.title })
              } else {
                temp1['children'] = [{ label: child.meta.title }]
              }
            }
            if (this.adminId.includes(child.id)) {
              if (temp['children']) {
                temp['children'].push({ label: child.meta.title })
              } else {
                temp['children'] = [{ label: child.meta.title }]
              }
            }
          })
        }
        if (temp1) {
          this.normalData.push(temp1)
        }
        this.adminData.push(temp)
      })
    },
    showNew() {
      this.newOrEdit = '新建账号'
      this.formObj['id'] = ''
      this.formObj.userId = ''
      this.formObj.username = ''
      this.formObj.roleId = 1
      this.formObj.email = ''
      this.formObj.phone = ''
      this.showNewOrEdit = true
    },
    NewOrEditUser() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http('saveAccount', this.formObj)
            .then((res) => {
              this.$message.success(res.errMsg)
            })
            .finally(() => {
              this.showNewOrEdit = false
              this.getData()
            })
        }
      })
    },
    handleSelectionChange(val) {
      this.delAccount = val.map((item) => {
        return item.id
      })
    },
    deleteManager(val) {
      if (val && val.length > 0) {
        this.$confirm('是否删除所选账号？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'error',
          center: true,
        }).then(() => {
          this.$http('deleteAccount', { idList: val })
            .then((res) => {
              this.$message.success(res.errMsg)
            })
            .finally(() => {
              this.getData()
            })
        })
      } else {
        this.$message.info('请勾选删除的账号')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  .btnWrap {
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    .rightBtn {
      position: absolute;
      right: 15px;
    }
  }
  .treeWrap {
    display: flex;
    flex-direction: row;
    .title {
      color: #495057;
      font-size: 15px;
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #dee2e6;
    }
    .leftBox {
      width: 50%;
      border-right: 1px solid #dee2e6;
    }
    .rightBox {
      width: 50%;
    }
  }
}
</style>
