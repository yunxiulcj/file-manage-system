<template>
  <div class="box">
    <page-frame :title="$t('cs_common.cs_48')" icon="approval">
      <template #headBtn>
        <div class="goBack" @click="goBack">
          <i class="el-icon-back"></i>
          <span>{{ $t('cs_common.cs_1') }}</span>
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
          <div class="title">{{ $t('cs_process.cs_1') }}</div>
          <div class="fileWrap">
            <template v-for="(item, index) in detailData.fileList">
              <el-tooltip
                :key="index"
                effect="dark"
                placement="top"
                :content="$t('cs_process.cs_2') + item.filePath"
              >
                <div class="fileBox">
                  <div
                    class="icon"
                    :style="{
                      background: 'url(' + iconPath + ')',
                      backgroundSize: '100% 100%',
                    }"
                  ></div>
                  <div class="fileInfo">
                    <div class="fileName">{{ item.fileName }}</div>
                    <div class="fileSize">{{ item.fileSize }}</div>
                  </div>
                </div>
              </el-tooltip>
            </template>
          </div>
          <div class="fileFromInfo" v-if="accountType == 2">
            {{ $t('cs_process.cs_10') + userName + $t('cs_process.cs_11') }}
          </div>
        </div>

        <el-divider></el-divider>
      </div>
      <div class="btnWrap" v-if="detailData.canApproval">
        <el-button @click="agree(detailData)" type="primary" size="small">
          {{ $t('cs_common.cs_43') }}
        </el-button>
        <el-button @click="refuse(detailData)" type="danger" size="small">
          {{ $t('cs_common.cs_44') }}
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
          {{ $t('cs_common.cs_34') }}
        </div>
      </template>
      <el-form size="small" label-position="right" label-width="100px">
        <el-form-item :label="$t('cs_common.cs_46')" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadCount"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">{{ $t('cs_common.cs_27') }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">{{ $t('cs_common.cs_28') }}</span>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_47')" v-if="canEdit">
          <el-input-number
            v-model="editForm.downloadExpiredDay"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="unit">{{ $t('cs_common.cs_27') }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tips">{{ $t('cs_common.cs_28') }}</span>
        </el-form-item>
        <el-form-item :label="$t('cs_common.cs_60')">
          <el-input v-model="editForm.comment" style="width: 335px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="agreeOrRefuseDialog = false">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="confirmEdit"
          :loading="loading"
        >
          {{ $t('cs_common.cs_12') }}
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
      loading: false,
      iconPath: require('../../assets/img/page/file.png'),
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
        1: this.$t('cs_common.cs_30'),
        2: this.$t('cs_common.cs_31'),
        3: this.$t('cs_common.cs_29'),
        4: this.$t('cs_common.cs_32'),
        5: this.$t('cs_common.cs_33'),
        6: this.$t('cs_common.cs_54'),
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
    } else {
      let pathInfo = JSON.parse(sessionStorage.getItem('pathInfo'))
      if (Object.keys(pathInfo.params).length > 0) {
        this.tempData = pathInfo.params
      } else {
        this.tempData = pathInfo.query
      }
    }
    this.getData(this.tempData)
    this.accountType = this.tempData.accountType
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
          this.$nextTick(() => {
            this.approvalState = res.data.state
          })
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
      this.editForm.applyStatus = 2
      this.editForm.downloadCount = data.downloadCount
      this.editForm.downloadExpiredDay = data.downloadDay
      this.canEdit = false
      this.agreeOrRefuseDialog = true
    },
    confirmEdit() {
      if (this.editForm.comment == '') {
        this.$message.warning(this.$t('cs_common.cs_55'))
        return
      }
      this.loading = true
      let url = this.editForm.applyStatus == 1 ? 'agree' : 'refuse'
      this.$http(url, this.editForm)
        .then((res) => {
          this.$message.success(res.errMsg)
          this.agreeOrRefuseDialog = false
          this.getData(this.tempData)
        })
        .finally(() => {
          this.loading = false
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
    left: 70px;
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
.unit {
  margin-left: 10px;
}
</style>
