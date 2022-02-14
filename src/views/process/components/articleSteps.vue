<template>
  <div class="stepBox">
    <div v-for="(item, index) in tempSteps" :key="item.value">
      <div class="stepItem">
        <div v-show="index != 0" class="dottedLine"></div>
        <div
          class="infoWrap"
          :style="{
            color:
              item.value != 4 && item.value != 5 && item.value != 1
                ? '#228be6'
                : item.value == 4
                ? '#37b24d'
                : item.value == 1
                ? '#f59f00'
                : '#f03e3e',
          }"
        >
          <div class="iconBox">
            <i :class="'iconfont icon-' + item.icon"></i>
          </div>
          <div class="labelBox">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'articleSteps',
  props: ['approvalState'],
  data() {
    return {
      stepList: [
        {
          value: 0,
          icon: 'myApplication',
          label: this.$t('cs_process.cs_8'),
        },
        {
          value: 1,
          icon: 'withdraw',
          label: this.$t('cs_common.cs_30'),
        },
        {
          value: 2,
          icon: 'myApproval',
          label: this.$t('cs_common.cs_31'),
        },
        {
          value: 3,
          icon: 'daishenpi',
          label: this.$t('cs_common.cs_29'),
        },
        {
          value: 4,
          icon: 'shenpitongguo',
          label: this.$t('cs_common.cs_32'),
        },
        {
          value: 5,
          icon: 'shenhebutongguo',
          label: this.$t('cs_common.cs_53'),
        },
        {
          value: 6,
          icon: 'yichang',
          label: this.$t('cs_common.cs_54'),
        },
      ],
      tempSteps: [],
    }
  },
  watch: {
    approvalState: {
      handler(val) {
        this.initSteps(val)
      },
    },
  },
  created() {},
  methods: {
    initSteps(val) {
      this.tempSteps = []
      for (let i = 0; i <= val; i++) {
        if (val != 1 && i == 1) {
          continue
        }
        if (val != 2 && i == 2) {
          continue
        }
        if (val != 4 && i == 4) {
          continue
        }
        this.tempSteps.push(this.stepList[i])
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.stepBox {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .stepItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    .dottedLine {
      width: 350px;
      height: 5px;
      border-top: 3px dotted #228be6;
    }
    .infoWrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      .iconBox {
        .iconfont {
          font-size: 40px;
        }
      }
      .labelBox {
        margin-top: 5px;
      }
    }
  }
}
</style>
