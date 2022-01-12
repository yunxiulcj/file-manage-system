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
        <div class="approvalInfo">
          <div class="approvalState">审批通过</div>
          <div class="timeLineWrap">使用定位将审批状态定位到时间线左边</div>
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
      testData: {
        fileList: [
          {
            fileName: '2test001',
            fileSize: '412kb',
            filePath: 'c:\\test',
          },
          {
            fileName: '2test003',
            fileSize: '512kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'test0012',
            fileSize: '162kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'ftest0015',
            fileSize: '542kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'gftest004',
            fileSize: '212kb',
            filePath: 'c:\\test',
          },
        ],
        applyTime: '2022-01-11 12:12:12',
        applyId: '123',
        applyUser: 'testUser',
        userDept: '天天摸鱼研究部',
        applyDesc:
          '附件四哦啊放假安排房价松动附件是到i附件覅殴打事件佛山第，，。。？！',
        downloadCount: '12',
        downloadExpiredDay: '2022-01-16 22:22:22',
        processList: [
          {
            approvalTime: '2022-01-11 13:12:12',
            reason: '没问题啊',
            user: 'boss1',
            state: '1',
          },
          {
            approvalTime: '2022-01-11 14:12:12',
            reason: '',
            user: 'boss2',
            state: '1',
          },
          {
            approvalTime: '2022-01-11 15:12:12',
            reason: '没问题啊没问题啊没问题啊没问题啊没问题啊没问题啊',
            user: 'boss3',
            state: '1',
          },
          {
            approvalTime: '2022-01-11 16:12:12',
            reason: '很懒啊不写了呀',
            user: 'boss4',
            state: '1',
          },
          {
            approvalTime: '2022-01-11 17:12:12',
            reason: '',
            user: 'boss5',
            state: '1',
          },
        ],
      },
    }
  },
  created() {
    console.log(this.$route)
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getData() {},
    agreeOrRefuseApply(type) {
      console.log(type)
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
    right: 10px;
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
