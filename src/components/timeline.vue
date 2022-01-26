<template>
  <el-timeline>
    <el-timeline-item type="success">
      <span class="labelBox">申请成功</span>
      <div class="infoWrap">
        <div class="timeBox">{{ data.applyTime }}</div>
        <div class="infoBox">
          <div class="applyId apply">
            <span class="label">工单号：</span>
            {{ data.applyId }}
          </div>
          <div class="applyUser apply">
            <span class="label">申请人：</span>
            {{ data.applyUser }}
            <el-divider direction="vertical"></el-divider>
            <span style="font-weight: bolder">{{ data.userDept }}</span>
          </div>
          <div class="applyDesc apply">
            <span class="label">描述：</span>
            {{ data.applyDesc }}
          </div>
          <div class="downloadCount apply">
            <span class="label">下载次数：</span>
            <span class="canBeModifi" v-if="data.canEdit">
              <el-input-number
                v-model="data.downloadCount"
                controls-position="right"
                size="small"
                :min="0"
                style="margin-left: 12px"
              ></el-input-number>
              <span class="unit">单位：次</span>
              <el-divider direction="vertical"></el-divider>
              <span class="tips">注：0表示没有限制</span>
            </span>
            <span class="noModifi" v-else>{{ data.downloadCount }} 次</span>
          </div>
          <div class="expiredDay apply">
            <span class="label">申请有效期：</span>
            <span class="canBeModifi" v-if="data.canEdit">
              <el-input-number
                v-model="data.downloadDay"
                controls-position="right"
                size="small"
                :min="0"
              ></el-input-number>
              <span class="unit">单位：天</span>
              <el-divider direction="vertical"></el-divider>
              <span class="tips">注：0表示长期有效</span>
            </span>
            <span class="noModifi" v-else>{{ data.downloadDay }} 天</span>
          </div>
        </div>
      </div>
    </el-timeline-item>
    <el-timeline-item
      v-for="(item, index) in data.processList"
      :key="index"
      :type="
        item.state == 3 ? 'primary' : item.state == 4 ? 'success' : 'danger'
      "
    >
      <span class="labelBox" v-if="index == 0">审批中</span>
      <span class="timeBox">{{ item.approvalTime }}</span>
      <span class="approvaler">
        <span class="label">审批人：</span>
        {{ item.user }}
      </span>
      <span
        class="state"
        :style="{
          color:
            item.state == 3 || item.state == 2
              ? '#228be6'
              : item.state == 4
              ? '#40c057'
              : item.state == 5 || item.state == 6
              ? '#f03e3e'
              : '#868e96',
        }"
      >
        {{ state[item.state] }}
      </span>
      <span class="reason" v-if="item.reason">
        <span class="label">理由：</span>
        {{ item.reason }}
      </span>
    </el-timeline-item>
    <el-timeline-item
      v-if="approvalState == 4 || approvalState == 5"
      :type="approvalState == 4 ? 'success' : 'danger'"
    >
      <span class="labelBox">{{ state[approvalState] }}</span>
      <div class="timeBox">{{ data.approvalTime }}</div>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  name: 'timeline',
  props: ['data', 'approvalState'],
  data() {
    return {
      state: {
        1: '已撤回',
        2: '待处理',
        3: '审批中',
        4: '审批通过',
        5: '审批不通过',
      },
    }
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.labelBox {
  position: absolute;
  left: -70px;
  width: 70px;
  text-align: center;
  font-size: 12px;
  font-weight: bolder;
  color: #434343;
}
.infoWrap {
  display: flex;
  flex-direction: row;
  .timeBox {
    font-size: 13px;
  }
  .infoBox {
    margin-left: 20px;
    font-size: 12px;
    .apply {
      margin-bottom: 10px;
      .label {
        font-weight: bolder;
        color: #434343;
      }
      .unit {
        margin-left: 10px;
      }
    }
  }
}
.timeBox {
  font-size: 13px;
}
.approvaler {
  font-size: 13px;
  margin: 0px 20px;
  .label {
    font-weight: bolder;
    color: #434343;
  }
}
.state {
  font-weight: bolder;
  font-size: 13px;
}
.reason {
  margin-left: 10px;
  .label {
    font-weight: bolder;
  }
}
</style>
