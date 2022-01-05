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
      <el-radio-group v-model="formObj.type">
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
            v-model="formObj[formObj.type].levelType"
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
          <el-select v-model="formObj[formObj.type].level" size="small">
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
          <el-checkbox v-model="formObj[formObj.type].approvalType">
            当前层级无上级时，此审批节点为空，直接跳过由上一级审批
          </el-checkbox>
        </div>
      </div>
      <div class="member" v-if="formObj.type == 2">
        <div class="labelWrap">
          <span class="label">添加成员</span>
          <span class="tips">不能超过100人</span>
        </div>
        <div class="addBox" @click="showAddMember = true">
          <i class="el-icon-plus"></i>
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
        v-model="formObj[formObj.type].approvalType"
        v-if="formObj.type != 3"
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
    <new-cc v-model="showAddMember"></new-cc>
  </div>
</template>

<script>
import newCc from './newCc.vue'
export default {
  name: 'newApproval',
  props: {
    type: Number,
    value: Boolean,
  },
  components: { newCc },
  data() {
    return {
      showAddMember: false,
      tempVal: false,
      formObj: {
        type: '1',
        1: {
          levelType: '1',
          level: '1',
          noSuperior: false,
          approvalType: '1',
        },
        2: {
          userList: [
            {
              userId: '',
              index: '',
            },
          ],
          approvalType: '1',
        },
      },
      approvalType: [
        {
          label: '指定上级',
          value: '1',
        },
        {
          label: '指定成员',
          value: '2',
        },
        {
          label: '申请人本人',
          value: '3',
        },
      ],
      approvalMode: [
        {
          label: '会签（须所有成员同意）',
          value: '1',
        },
        {
          label: '或签（一名成员同意即可）',
          value: '2',
        },
        {
          label: '依次审批（按顺序依次审批）',
          value: '3',
        },
      ],
      levelTypes: [
        {
          label: '从下到上',
          value: '1',
        },
        {
          label: '从上到下',
          value: '2',
        },
      ],
      levelList: [
        {
          label: '直接上级',
          value: '1',
        },
        {
          label: '第二级上级',
          value: '2',
        },
        {
          label: '第三级上级',
          value: '3',
        },
        {
          label: '第四级上级',
          value: '4',
        },
        {
          label: '第五级上级',
          value: '5',
        },
        {
          label: '第六级上级',
          value: '6',
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
    cancel() {
      this.$emit('input', false)
    },
    confirm() {
      this.$emit('input', false)
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
  .addBox {
    margin: 15px;
    width: 35px;
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
.label {
  margin-bottom: 8px;
  font-weight: bold;
}
</style>
