<template>
  <el-timeline>
    <el-timeline-item type="success">
      <span class="labelBox">{{ $t('cs_.cs_24') }}</span>
      <div class="infoWrap">
        <div class="timeBox">{{ data.applyTime }}</div>
        <div class="infoBox">
          <div class="applyId apply">
            <span class="label">{{ $t('cs_.cs_25') }}</span>
            {{ data.applyId }}
          </div>
          <div class="applyUser apply">
            <span class="label">{{ $t('cs_common.cs_26') }}</span>
            {{ data.applyUser }}
            <el-divider direction="vertical"></el-divider>
            <span style="font-weight: bolder">{{ data.userDept }}</span>
          </div>
          <div class="applyDesc apply">
            <span class="label">{{ $t('cs_.cs_26') }}</span>
            {{ data.applyDesc }}
          </div>
          <div class="downloadCount apply">
            <span class="label">{{ $t('cs_.cs_27') }}</span>
            <span class="canBeModifi" v-if="data.canEdit">
              <el-input-number
                v-model="data.downloadCount"
                controls-position="right"
                size="small"
                :min="0"
                style="margin-left: 12px"
              ></el-input-number>
              <span class="unit">{{ $t('cs_common.cs_9') }}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="tips">{{ $t('cs_.cs_28') }}</span>
            </span>
            <span class="noModifi" v-else>
              {{ data.downloadCount + $t('cs_.cs_29') }}
            </span>
          </div>
          <div class="expiredDay apply">
            <span class="label">{{ $t('cs_.cs_30') }}</span>
            <span class="canBeModifi" v-if="data.canEdit">
              <el-input-number
                v-model="data.downloadDay"
                controls-position="right"
                size="small"
                :min="0"
              ></el-input-number>
              <span class="unit">{{ $t('cs_common.cs_27') }}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="tips">{{ $t('cs_common.cs_28') }}</span>
            </span>
            <span class="noModifi" v-else>
              {{ data.downloadDay + $t('cs_.cs_31') }}
            </span>
          </div>
        </div>
      </div>
    </el-timeline-item>
    <el-timeline-item
      v-for="(item, index) in data.processList"
      :key="index"
      :type="
        item.state == 3 || item.state == 2
          ? 'primary'
          : item.state == 4
          ? 'success'
          : 'danger'
      "
    >
      <span class="labelBox" v-if="index == 0">
        {{ $t('cs_common.cs_29') }}
      </span>
      <span class="timeBox">{{ item.approvalTime }}</span>
      <span class="approvaler">
        <span class="label">{{ $t('cs_.cs_32') }}</span>
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
        <span class="label">{{ $t('cs_.cs_33') }}</span>
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
        1: this.$t('cs_common.cs_30'),
        2: this.$t('cs_common.cs_31'),
        3: this.$t('cs_common.cs_29'),
        4: this.$t('cs_common.cs_32'),
        5: this.$t('cs_common.cs_33'),
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
  left: -110px;
  width: 100px;
  text-align: right;
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
