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
            {{ applyStatus[approvalState] }}
          </div>
          <div class="timelineWrap">
            <timeline
              :data="detailData"
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
      <div class="btnWrap" v-if="detailData.canApproval">
        <el-button @click="agree(detailData)" type="primary" size="small" plain>
          同意
        </el-button>
        <el-button
          @click="refuse(detailData)"
          type="warning"
          size="small"
          plain
        >
          拒绝
        </el-button>
      </div>
    </page-frame>
    <el-dialog :visible.sync="agreeOrRefuseDialog" width="500px">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          提示
        </div>
      </template>
      <el-form size="small">
        <el-form-item label="下载次数" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadCount"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">单位：天</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">注：0表示长期有效</span>
        </el-form-item>
        <el-form-item label="申请有效期" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadExpiredDay"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">单位：天</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">注：0表示长期有效</span>
        </el-form-item>
        <el-form-item label="理由*">
          <el-input v-model="editForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="agreeOrRefuseDialog = false">
          取 消
        </el-button>
        <el-button size="small" type="primary" @click="confirmEdit">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pageFrame from '../../components/pageFrame.vue'
import articleSteps from './components/articleSteps.vue'
import timeline from '../../components/timeline.vue'
import { unitSetUp } from '../../utils/obj-operation'
export default {
  name: 'approval',
  components: { pageFrame, articleSteps, timeline },
  data() {
    return {
      userName: '',
      canEdit: false,
      agreeOrRefuseDialog: false,
      accountType: '2',
      approvalState: 0,
      editForm: {
        applyId: '',
        applyStatus: 1,
        downloadCount: 1,
        downloadExpiredDay: 1,
        comment: '',
      },
      applyStatus: {
        1: '已撤回',
        2: '待处理',
        3: '审批中',
        4: '审批通过',
        5: '审批不通过',
        6: '传输异常',
      },
      detailData: {
        fileList: [],
        applyTime: '',
        applyId: '',
        applyUser: '',
        userDept: '',
        applyDesc: '',
        downloadCount: '1',
        downloadDay: '1',
        state: '1',
        canApproval: false,
        canEdit: false,
        processList: [],
      },
      tempData: {},
    }
  },
  created() {
    this.userName = localStorage.getItem('username') || ''
    let queryNum = Object.keys(this.$route.query)
    let paramNum = Object.keys(this.$route.params)
    if (queryNum.length > 0) {
      this.tempData = this.$route.query
    } else if (paramNum.length > 0) {
      this.tempData = this.$route.params
    }
    this.getData(this.tempData)
    this.accountType = this.tempData.accountType
    this.approvalState = this.tempData.approvalState
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
        if (res.data) {
          this.approvalState = res.data.state
          res.data.fileList.map((file) => {
            file['fileSize'] = unitSetUp(file.fileSize)
          })
        }
        this.detailData = res.data
      })
    },
    agree(data) {
      this.editForm.applyId = data.applyId
      this.editForm.applyStatus = 1
      this.editForm.downloadCount = data.downloadCount
      this.editForm.downloadExpiredDay = data.downloadDay
      this.canEdit = data.canEdit
      this.agreeOrRefuseDialog = true
    },
    refuse(data) {
      this.editForm.applyId = data.applyId
      this.editForm.approvalState = 2
      this.editForm.downloadCount = data.downloadCount
      this.editForm.downloadExpiredDay = data.downloadDay
      this.canEdit = false
      this.agreeOrRefuseDialog = true
    },
    confirmEdit() {
      let url = this.editForm.applyStatus == 1 ? 'agree' : 'refuse'
      this.$http(url, this.editForm).then((res) => {
        this.$message.success(res.errMsg)
        this.agreeOrRefuseDialog = false
        this.getData(this.tempData)
      })
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
