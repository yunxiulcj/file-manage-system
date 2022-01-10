<template>
  <div class="stepBox">
    <div v-for="(item, index) in stepList" :key="item.value">
      <div class="stepItem">
        <div v-show="index != 0" class="dottedLine"></div>
        <div class="infoWrap">
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
  props: [],
  data() {
    return {
      stepList: [
        {
          value: '1',
          icon: 'myApplication',
          label: '用户申请',
        },
        {
          value: '2',
          icon: 'myApproval',
          label: '待处理',
        },
        // {
        //   value: '3',
        //   icon: 'daishenpi',
        //   label: '等待审批',
        // },
        {
          value: '4',
          icon: 'shenpitongguo',
          label: '审批通过',
        },
        // {
        //   value: '5',
        //   icon: 'shenhebutongguo',
        //   label: '审批不通过',
        // },
      ],
    }
  },
  created() {},
  methods: {},
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
    }
  }
}
</style>
