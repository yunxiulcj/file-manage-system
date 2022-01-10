<template>
  <div class="box">
    <page-frame title="审批详情" icon="approval">
      <template #headBtn>
        <div class="goBack" @click="goBack">
          <i class="el-icon-back"></i>
          <span>返回上一级</span>
        </div>
      </template>
      <div class="content">
        <div class="approvalStepBox">
          <article-steps></article-steps>
        </div>
        <div class="attachmentBox">
          <el-divider></el-divider>
          <div class="fileFromInfo">来自：{{ userName }}的个人网盘</div>
          <el-divider></el-divider>
        </div>
      </div>
    </page-frame>
  </div>
</template>
<script>
import pageFrame from '../../components/pageFrame.vue'
import articleSteps from './components/articleSteps.vue'
export default {
  name: 'approval',
  components: { pageFrame, articleSteps },
  data() {
    return {
      userName: 'admin01',
      stepStatus: ['wait', 'process', 'finish', 'error', 'success'],
    }
  },
  created() {},
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  .content {
    padding: 0px 60px;
    .approvalStepBox {
      width: 100%;
      height: 60px;
    }
  }

  .goBack {
    position: absolute;
    width: 100px;
    right: 40px;
    top: -15px;
    border: 0.5px solid #ced4da;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #868e96;
    cursor: pointer;
    i {
      font-size: 20px;
      width: 28px;
      text-align: center;
    }
    span {
      font-size: 13px;
    }
  }
  .goBack:hover {
    border: 0.5px solid #228be6;
    color: #228be6;
    background: #f8f9fa;
  }
}
.el-divider--horizontal {
  margin: 8px 0px 0px 0px;
}
</style>
