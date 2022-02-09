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
          添加审批人
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
          <div class="label">指定层级</div>
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
          <div class="label">当前层级无上级时</div>
          <el-checkbox v-model="formObj.superior.noSuperior">
            当前层级无上级时，此审批节点为空，直接跳过由上一级审批
          </el-checkbox>
        </div>
      </div>
      <div class="member" v-if="formObj.type == 2">
        <div class="labelWrap">
          <span class="label">添加成员</span>
          <span class="tips">不能超过100人</span>
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
            ? '多人审批模式'
            : formObj.type == 1
            ? '同时有多个上级时'
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
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirm">
          确 定
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
          label: '指定上级',
          value: 1,
        },
        {
          label: '指定成员',
          value: 2,
        },
        {
          label: '申请人本人',
          value: 3,
        },
      ],
      approvalMode: [
        {
          label: '会签（须所有成员同意）',
          value: 1,
        },
        {
          label: '或签（一名成员同意即可）',
          value: 2,
        },
        {
          label: '依次审批（按顺序依次审批）',
          value: 3,
        },
      ],
      levelTypes: [
        {
          label: '从下到上',
          value: 1,
        },
        {
          label: '从上到下',
          value: 2,
        },
      ],
      levelList: [
        {
          label: '直接上级',
          value: 1,
        },
        {
          label: '第二级上级',
          value: 2,
        },
        {
          label: '第三级上级',
          value: 3,
        },
        {
          label: '第四级上级',
          value: 4,
        },
        {
          label: '第五级上级',
          value: 5,
        },
        {
          label: '第六级上级',
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
