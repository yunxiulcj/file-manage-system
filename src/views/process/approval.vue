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
          <article-steps :approvalState="approvalState"></article-steps>
        </div>
        <div class="approvalInfo">
          <div class="approvalState">
            {{ applyStatus[approvalState] }}（{{
              approvalMode[detailData.state]
            }}）
          </div>
          <div class="timelineWrap">
            <timeline
              :data="detailData"
              :accountType="accountType"
              :approvalState="approvalState"
            ></timeline>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="attachmentBox">
          <div class="title">附件：</div>
          <div class="fileWrap">
            <template v-for="(item, index) in detailData.fileList">
              <el-tooltip
                :key="index"
                effect="dark"
                placement="top"
                :content="'文件路径：' + item.filePath"
              >
                <div class="fileBox">
                  <div class="icon"></div>
                  <div class="fileInfo">
                    <div class="fileName">{{ item.fileName }}</div>
                    <div class="fileSize">{{ item.fileSize }}</div>
                  </div>
                </div>
              </el-tooltip>
            </template>
          </div>
          <div class="fileFromInfo">来自：{{ userName }}的个人网盘</div>
        </div>

        <el-divider></el-divider>
      </div>
      <div
        class="btnWrap"
        v-if="accountType == 1 && (approvalState == 2 || approvalState == 3)"
      >
        <el-button
          @click="agreeOrRefuseApply(1)"
          type="primary"
          size="small"
          plain
        >
          同意
        </el-button>
        <el-button
          @click="agreeOrRefuseApply(2)"
          type="warning"
          size="small"
          plain
        >
          拒绝
        </el-button>
      </div>
    </page-frame>
  </div>
</template>
<script>
import pageFrame from '../../components/pageFrame.vue'
import articleSteps from './components/articleSteps.vue'
import timeline from '../../components/timeline.vue'
export default {
  name: 'approval',
  components: { pageFrame, articleSteps, timeline },
  data() {
    return {
      userName: 'admin01',
      accountType: '2',
      approvalState: '5',
      applyStatus: {
        1: '已撤回',
        2: '待处理',
        3: '审批中',
        4: '审批通过',
        5: '审批不通过',
      },
      approvalMode: {
        1: '会签',
        2: '或签',
        3: '依次审批',
      },
      detailData: {
        fileList: [
          {
            fileName: '2test001.avi',
            fileSize: '412kb',
            filePath: 'c:\\test',
          },
          {
            fileName: '2test003.avi',
            fileSize: '512kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'test0012.avi',
            fileSize: '162kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'ftest0015.avi',
            fileSize: '542kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'gftest手动阀手动阀004.avi',
            fileSize: '212kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'ftest0015.avi',
            fileSize: '542kb',
            filePath: 'c:\\test',
          },
          {
            fileName: 'gftest犯得上发射点发生房贷首付004.avi',
            fileSize: '212kb',
            filePath: 'c:\\test',
          },
        ],
        applyTime: '2022-01-11 12:12:12',
        applyId: '42131398123',
        applyUser: 'testUser',
        userDept: '天天摸鱼研究部',
        applyDesc:
          '附件四哦啊放假安排房价松动附件是到i附件覅殴打事件佛山第，，。。？！',
        downloadCount: '12',
        downloadExpiredDay: '4',
        state: '1',
        processList: [
          {
            approvalTime: '2022-01-11 13:12:12',
            reason: '没问题啊',
            user: 'boss1',
            state: '3',
          },
          {
            approvalTime: '2022-01-11 14:12:12',
            reason: '',
            user: 'boss2',
            state: '3',
          },
          {
            approvalTime: '2022-01-11 15:12:12',
            reason: '没问题啊没问题啊没问题啊没问题啊没问题啊没问题啊',
            user: 'boss3',
            state: '4',
          },
          {
            approvalTime: '2022-01-11 16:12:12',
            reason: '很懒啊不写了呀',
            user: 'boss4',
            state: '5',
          },
          {
            approvalTime: '2022-01-11 17:12:12',
            reason: '',
            user: 'boss5',
            state: '3',
          },
        ],
      },
    }
  },
  created() {
    let queryNum = Object.keys(this.$route.query)
    let paramNum = Object.keys(this.$route.params)
    let data
    if (queryNum.length > 0) {
      data = this.$route.query
    } else if (paramNum.length > 0) {
      data = this.$route.params
    }
    this.getData(data)
    this.accountType = data.accountType
    this.approvalState = data.approvalState
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getData(data) {
      this.$http('getApplyDetail', {
        applyId: data.applyId,
        type: data.accountType,
      }).then((res) => {
        this.detailData = res.data
      })
    },
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
    height: calc(100% - 30px);
    overflow: auto;
    .approvalStepBox {
      width: 100%;
      height: 60px;
    }
    .approvalInfo {
      border: 0.5px solid #e6e6e6;
      margin: 20px 0px;
      .approvalState {
        height: 30px;
        line-height: 30px;
        font-weight: bolder;
        font-size: 15px;
        padding-left: 15px;
        background: #f7f7f7;
        border-bottom: 0.5px solid #e6e6e6;
      }
      .timelineWrap {
        background: #f3f3f3;
        padding: 30px 50px;
        // max-height: 220px;
        // overflow: auto;
      }
    }
    .attachmentBox {
      position: relative;
      display: flex;
      flex-direction: row;
      padding: 20px;

      .title {
        font-weight: bolder;
      }
      .fileWrap {
        max-height: 100px;
        overflow: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .fileBox {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 40px;
          margin-bottom: 15px;
          .icon {
            width: 34px;
            height: 34px;
            margin-right: 5px;
            background: chocolate;
          }
          .fileInfo {
            .fileName {
              font-size: 14px;
              font-weight: bolder;
              color: #343a40;
            }
            .fileSize {
              font-size: 12px;
            }
          }
        }
      }
      .fileFromInfo {
        position: absolute;
        right: 0px;
        bottom: 0px;
        font-size: 12px;
        color: #868e96;
      }
    }
  }
  .btnWrap {
    position: absolute;
    bottom: 0px;
    right: 80px;
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
  margin: 5px 0px 0px 0px;
}
</style>
