<template>
  <div class="box">
    <page-frame :title="$t('cs_systemManage.cs_1')" icon="adminConfig">
      <div class="btnWrap">
        <div class="leftBtn">
          <el-button type="primary" size="small" @click="showNew">
            {{ $t('cs_systemManage.cs_2') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteManager(delAccount)"
          >
            {{ $t('cs_systemManage.cs_3') }}
          </el-button>
        </div>
        <div class="rightBtn">
          <el-button type="warning" size="small" @click="previewDialog = true">
            {{ $t('cs_common.cs_100') }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            @click="getData"
          >
            {{ $t('cs_systemManage.cs_4') }}
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
        <el-form-item :label="$t('cs_common.cs_101')" prop="userId">
          <el-input
            v-model="formObj.userId"
            :placeholder="$t('cs_systemManage.cs_5')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_92')">
          <el-input
            v-model="formObj.username"
            :placeholder="$t('cs_systemManage.cs_6')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('cs_systemManage.cs_7')">
          <el-select v-model="formObj.roleId" style="width: 300px">
            <el-option
              v-for="item in roleType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_94')">
          <el-input
            v-model="formObj.email"
            :placeholder="$t('cs_common.cs_4')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_102')">
          <el-input
            v-model="formObj.phone"
            :placeholder="$t('cs_systemManage.cs_8')"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showNewOrEdit = false">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button size="small" type="primary" @click="NewOrEditUser">
          {{ $t('cs_common.cs_12') }}
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
          {{ $t('cs_common.cs_100') }}
        </div>
      </template>
      <div class="treeWrap">
        <div class="leftBox">
          <div class="title">{{ $t('cs_systemManage.cs_9') }}</div>
          <el-tree
            :data="userData"
            node-key="id"
            default-expand-all
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              {{ $t(node.label) }}
            </span>
          </el-tree>
        </div>
        <div class="leftBox">
          <div class="title">{{ $t('cs_common.cs_103') }}</div>
          <el-tree
            :data="normalData"
            node-key="id"
            default-expand-all
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              {{ $t(node.label) }}
            </span>
          </el-tree>
        </div>
        <div class="rightBox">
          <div class="title">{{ $t('cs_common.cs_104') }}</div>
          <el-tree
            :data="adminData"
            node-key="id"
            default-expand-all
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              {{ $t(node.label) }}
            </span>
          </el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="previewDialog = false">
          {{ $t('cs_common.cs_13') }}
        </el-button>
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
        return callback(new Error(this.$t('cs_systemManage.cs_10')))
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
      userId: [],
      userData: [],
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
          label: this.$t('cs_common.cs_104'),
          value: 1,
        },
        {
          label: this.$t('cs_common.cs_103'),
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
            label: this.$t('cs_common.cs_101'),
          },
          {
            prop: 'username',
            label: this.$t('cs_common.cs_92'),
          },
          {
            prop: 'roleId',
            label: this.$t('cs_systemManage.cs_11'),
            formatter: (row) => {
              return row.roleId == 1
                ? this.$t('cs_common.cs_104')
                : this.$t('cs_common.cs_103')
            },
          },
          {
            prop: 'email',
            label: this.$t('cs_common.cs_94'),
          },
          {
            prop: 'phone',
            label: this.$t('cs_common.cs_102'),
          },
        ],
        operation: {
          btns: [
            {
              label: this.$t('cs_systemManage.cs_12'),
              type: 'text',
              fn: (row) => {
                this.newOrEdit = this.$t('cs_systemManage.cs_13')
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
              label: this.$t('cs_common.cs_51'),
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
              temp2 = [],
              temp3 = []
            res.data.map((item) => {
              if (item.roleId == 1) {
                temp1.push(item.menuId)
              } else if (item.roleId == 2) {
                temp2.push(item.menuId)
              } else {
                temp3.push(item.menuId)
              }
            })
            this.$set(this, 'adminId', temp1)
            this.$set(this, 'normalId', temp2)
            this.$set(this, 'userId', temp3)
          }
        })
        .finally(() => {
          this.powerPreview()
        })
    },
    powerPreview() {
      listRouter.map((item) => {
        let temp, temp1, temp2
        if (this.adminId.includes(item.id)) {
          temp = { label: item.meta.i18nTitle }
        }
        if (this.normalId.includes(item.id)) {
          temp1 = { label: item.meta.i18nTitle }
        }
        if (this.userId.includes(item.id)) {
          temp2 = { label: item.meta.i18nTitle }
        }
        if (item.children && item.children.length > 0) {
          item.children.map((child) => {
            if (this.normalId.includes(child.id)) {
              if (temp1['children']) {
                temp1['children'].push({ label: child.meta.i18nTitle })
              } else {
                temp1['children'] = [{ label: child.meta.i18nTitle }]
              }
            }
            if (this.adminId.includes(child.id)) {
              if (temp['children']) {
                temp['children'].push({ label: child.meta.i18nTitle })
              } else {
                temp['children'] = [{ label: child.meta.i18nTitle }]
              }
            }
            if (this.userId.includes(child.id)) {
              if (temp2['children']) {
                temp2['children'].push({ label: child.meta.i18nTitle })
              } else {
                temp2['children'] = [{ label: child.meta.i18nTitle }]
              }
            }
          })
        }
        if (temp1) {
          this.normalData.push(temp1)
        }
        if (temp2) {
          this.userData.push(temp2)
        }
        this.adminData.push(temp)
      })
    },
    showNew() {
      this.newOrEdit = this.$t('cs_systemManage.cs_14')
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
        this.$confirm(
          this.$t('cs_systemManage.cs_15'),
          this.$t('cs_common.cs_34'),
          {
            confirmButtonText: this.$t('cs_common.cs_35'),
            cancelButtonText: this.$t('cs_common.cs_10'),
            type: 'error',
            center: true,
          }
        ).then(() => {
          this.$http('deleteAccount', { idList: val })
            .then((res) => {
              this.$message.success(res.errMsg)
            })
            .finally(() => {
              this.getData()
            })
        })
      } else {
        this.$message.info(this.$t('cs_systemManage.cs_16'))
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
      font-weight: bolder;
      font-size: 15px;
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #dee2e6;
    }
    .leftBox {
      width: 33%;
    }
    .middle {
      width: 33%;
    }
    .rightBox {
      width: 33%;
    }
  }
}
</style>
