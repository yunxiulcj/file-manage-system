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
          <el-button type="warning" size="small">权限预览</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh">
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
        :rules="formObj.formRules"
        size="small"
        style="width: 400px"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="域账号" prop="id">
          <el-input
            v-model="formObj.id"
            placeholder="请输入域账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input
            v-model="formObj.realName"
            placeholder="请输入真实姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="formObj.userRole" style="width: 300px">
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
            v-model="formObj.tel"
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
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
export default {
  name: 'adminConfig',
  components: { pageFrame, tableTemp },
  data() {
    return {
      newOrEdit: '',
      showNewOrEdit: false,
      tableLoading: false,
      delAccount: [],
      formObj: {
        id: '',
        realName: '',
        userRole: '1',
        email: '',
        tel: '',
        formRules: {
          id: [{ required: true, message: '请输入域账号', trigger: 'blur' }],
        },
      },
      roleType: [
        {
          label: '系统管理员',
          value: '1',
        },
        {
          label: '普通管理员',
          value: '2',
        },
      ],
      testData: [
        {
          id: '123456',
          realName: 'qwer',
          userRole: '1',
          email: '123213@qq.com',
          tel: '12321452355',
        },
        {
          id: '654321',
          realName: 'rewrt',
          userRole: '2',
          email: 'gfdf13@qq.com',
          tel: '1234435355',
        },
      ],
      tableConfig: {
        tableData: [],
        selection: true,
        border: true,
        tableSetting: [
          {
            prop: 'id',
            label: '域账号',
          },
          {
            prop: 'realName',
            label: '真实姓名',
          },
          {
            prop: 'userRole',
            label: '角色',
          },
          {
            prop: 'email',
            label: '邮箱',
          },
          {
            prop: 'tel',
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
                this.formObj.id = row.id
                this.formObj.realName = row.realName
                this.formObj.userRole = row.userRole
                this.formObj.email = row.email
                this.formObj.tel = row.tel
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
    }
  },
  created() {
    this.tableConfig.tableData = this.testData
  },
  methods: {
    showNew() {
      this.newOrEdit = '新建账号'
      this.formObj.id = ''
      this.formObj.realName = ''
      this.formObj.email = ''
      this.formObj.tel = ''
      this.showNewOrEdit = true
    },
    NewOrEditUser() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.showNewOrEdit = false
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
          type: 'info',
          center: true,
        }).then(() => {
          console.log(val)
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
      right: 0px;
    }
  }
}
</style>
