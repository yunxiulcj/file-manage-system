<template>
  <div class="box">
    <el-dialog :visible.sync="tempVal" width="550px" @close="dialogClose">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          {{ $t('cs_strategy.cs_7') }}
        </div>
      </template>
      <el-radio-group v-model="formObj.type" @change="typeChange">
        <el-radio
          v-for="item in approvalType"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
      <el-divider></el-divider>
      <div class="superior" v-if="formObj.type == 1">
        <div class="level">
          <div class="label">{{ $t('cs_strategy.cs_8') }}</div>
          <el-select
            v-model="formObj.superior.levelType"
            size="small"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in levelTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="formObj.superior.level" size="small">
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="noLevel">
          <div class="label">{{ $t('cs_strategy.cs_9') }}</div>
          <el-checkbox v-model="formObj.superior.noSuperior">
            <span
              style="
                display: inline-grid;
                white-space: pre-line;
                word-wrap: break-word;
                overflow: hidden;
                line-height: 20px;
                width: 460px;
              "
            >
              {{ $t('cs_strategy.cs_10') }}
            </span>
          </el-checkbox>
        </div>
        <div class="noLevel">
          <div class="label">{{ $t('cs_strategy.cs_65') }}</div>
          <div class="Default">
            <span class="label">{{ $t('cs_strategy.cs_66') }}</span>
            <el-input
              v-model="formObj.superior.defaultApprovalUser"
              size="small"
              style="width: 380px; margin-left: 10px"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="member" v-if="formObj.type == 2">
        <div class="labelWrap">
          <span class="label">{{ $t('cs_common.cs_90') }}</span>
          <span class="tips">{{ $t('cs_strategy.cs_11') }}</span>
        </div>
        <div class="memberWrap">
          <div
            class="content"
            v-if="formObj.member.userList && formObj.member.userList.length > 0"
          >
            <div
              v-for="(user, userIndex) in formObj.member.userList"
              :key="user.index"
              class="userBox"
            >
              <el-tooltip placement="top">
                <div slot="content">{{ user.userId }}</div>
                <div class="memberBox">
                  <div class="iconBox">
                    <i class="el-icon-error" @click="delUser(userIndex)"></i>
                    <i class="iconfont icon-yonghutianchong"></i>
                  </div>
                  <span class="userName">{{ user.userId }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="addBox" @click="addUser">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>
      <el-divider v-if="formObj.type != 3"></el-divider>
      <div class="label">
        {{
          formObj.type == 2
            ? this.$t('cs_strategy.cs_12')
            : formObj.type == 1
            ? this.$t('cs_strategy.cs_13')
            : ''
        }}
      </div>
      <el-radio-group
        v-if="formObj.type != 3"
        v-model="formObj[type].approvalType"
        style="width: 150px"
      >
        <el-radio
          v-for="item in approvalMode"
          :key="item.value"
          :label="item.value"
          :disabled="formObj.type == 1 && item.value == 3"
          style="margin: 5px 0px"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button type="primary" size="small" @click="confirm">
          {{ $t('cs_common.cs_12') }}
        </el-button>
      </span>
    </el-dialog>
    <new-cc
      v-model="showAddMember"
      ref="newCC"
      :userList="userList"
      @selectUser="selectUser"
    ></new-cc>
  </div>
</template>

<script>
import newCc from './newCc.vue'
import { clone } from '../../../utils/obj-operation'
export default {
  name: 'newApproval',
  props: {
    value: Boolean,
    editOrNew: Number,
  },
  components: { newCc },
  data() {
    return {
      formObj: {
        superior: {
          levelType: 1,
          level: 1,
          noSuperior: false,
          approvalType: 1,
        },
        member: {
          approvalType: 1,
          userList: [],
        },
        type: 1,
      },
      userList: [],
      type: 'superior',
      showAddMember: false,
      tempVal: false,
      approvalType: [
        {
          label: this.$t('cs_common.cs_87'),
          value: 1,
        },
        {
          label: this.$t('cs_common.cs_88'),
          value: 2,
        },
        {
          label: this.$t('cs_common.cs_85'),
          value: 3,
        },
      ],
      approvalMode: [
        {
          label: this.$t('cs_strategy.cs_14'),
          value: 1,
        },
        {
          label: this.$t('cs_strategy.cs_15'),
          value: 2,
        },
        {
          label: this.$t('cs_strategy.cs_16'),
          value: 3,
        },
      ],
      levelTypes: [
        {
          label: this.$t('cs_strategy.cs_17'),
          value: 1,
        },
        {
          label: this.$t('cs_strategy.cs_18'),
          value: 2,
        },
      ],
      levelList: [
        {
          label: this.$t('cs_common.cs_20'),
          value: 1,
        },
        {
          label: this.$t('cs_common.cs_21'),
          value: 2,
        },
        {
          label: this.$t('cs_common.cs_22'),
          value: 3,
        },
        {
          label: this.$t('cs_common.cs_23'),
          value: 4,
        },
        {
          label: this.$t('cs_common.cs_24'),
          value: 5,
        },
        {
          label: this.$t('cs_common.cs_25'),
          value: 6,
        },
      ],
    }
  },
  watch: {
    value: {
      handler(val) {
        this.tempVal = val
      },
      immediate: true,
    },
  },
  methods: {
    initData(val) {
      this.formObj = {
        superior: {
          levelType: 1,
          level: 1,
          noSuperior: false,
          approvalType: 1,
          defaultApprovalUser: '',
        },
        member: {
          approvalType: 1,
          userList: [],
        },
        type: val,
      }
    },
    initEdit(val, data) {
      console.log('init', data)
      this.type = val == 1 ? 'superior' : 'member'
      this.formObj.type = val
      if (val == 1) {
        this.formObj.superior = clone(data)
        this.formObj.member = {
          approvalType: 1,
          userList: [],
        }
      } else if (val == 2) {
        this.formObj.member = clone(data)
        this.formObj.superior = {
          levelType: 1,
          level: 1,
          noSuperior: false,
          approvalType: 1,
          defaultApprovalUser: '',
        }
      } else {
        this.initData(3)
      }
    },
    delUser(index) {
      this.formObj.member.userList.splice(index, 1)
    },
    selectUser(val) {
      this.formObj.member.userList = val.map((item, index) => {
        return { userId: item, index: index }
      })
    },
    addUser() {
      this.userList = this.formObj.member.userList
        ? this.formObj.member.userList.map((item) => {
            return item.userId
          })
        : []
      console.log(this.userList, this.formObj.member.userList)
      this.$nextTick(() => {
        this.$refs['newCC'].setNodeCheck()
      })
      this.showAddMember = true
    },
    typeChange(val) {
      this.$set(this, 'type', val == 1 ? 'superior' : 'member')
    },
    cancel() {
      this.$emit('input', false)
    },
    confirm() {
      if (this.formObj.type == 2 && this.formObj.member.userList.length <= 0) {
        this.$message.warning(this.$t('cs_strategy.cs_19'))
        return
      }
      this.$emit('input', false)
      this.$emit('addApproval', clone(this.formObj), this.editOrNew)
    },
    dialogClose() {
      this.$emit('input', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.superior {
  .noLevel {
    margin-top: 25px;
  }
}
.member {
  .labelWrap {
    .label {
      margin-right: 12px;
    }
    .tips {
      font-size: 12px;
    }
  }
  .memberWrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    .content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding-bottom: 10px;
      .userBox {
        .memberBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 15px 0px 0px 16px;
          .iconBox {
            position: relative;
            background: #bdccea;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 5px;
            .iconfont {
              font-size: 30px;
              color: #fcfcfc;
            }
            .el-icon-error {
              position: absolute;
              top: -5px;
              right: -5px;
              font-size: 14px;
              cursor: pointer;
            }
          }
          .userName {
            color: #343a40;
            height: 20px;
            line-height: 20px;
            font-size: 13px;
            width: 65px;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
    .addBox {
      margin: 15px;
      min-width: 35px;
      height: 35px;
      line-height: 35px;
      border: 1px dotted #ced4da;
      border-radius: 5px;
      text-align: center;
      color: #ced4da;
      cursor: pointer;
      i {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .addBox:hover {
      border: 1px solid #228be6;
      color: #228be6;
    }
  }
}
.label {
  margin-bottom: 8px;
  font-weight: bold;
}
</style>
