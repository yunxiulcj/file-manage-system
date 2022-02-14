<template>
  <div class="itemBox">
    <div v-for="item in messageList" :key="item.id" class="messageWrap">
      <div class="messageBox">
        <div class="topWrap">
          <div :class="{ isRead: !item.read }"></div>
          <div class="topPart">
            <div class="messageTop">
              <div class="title">{{ item.title }}</div>
              <el-tag
                :type="tagType[item.applyState]"
                size="small"
                class="state"
              >
                {{ stateType[item.applyState] }}
              </el-tag>
              <div class="startTime">{{ item.noticeTime }}</div>
            </div>
            <div class="messageContent">
              <div class="infoTop">
                <div class="applyUser infoItem">
                  <span class="label">{{ $t('cs_common.cs_26') }}</span>
                  {{ item.applyUser }}
                </div>
                <el-divider direction="vertical"></el-divider>

                <div class="periodValidity infoItem">
                  <span class="label">{{ $t('cs_message.cs_1') }}</span>
                  <span v-if="!item.dayUnlimited">
                    {{ item.expiredStartTime }} 至 {{ item.expiredEndTime }}
                  </span>
                  <span v-else>{{ $t('cs_common.cs_41') }}</span>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="detail infoItem" @click="showDetail(item)">
                  {{ $t('cs_common.cs_42') }}
                </div>
              </div>
              <div class="infoBottom">
                <div
                  class="noBtn"
                  :style="
                    item.state != 1 ? { width: '100%' } : { width: '85%' }
                  "
                >
                  <div class="describe infoItem">
                    <span class="label">{{ $t('cs_message.cs_3') }}</span>
                    {{ item.applyDesc }}
                  </div>
                </div>
                <div class="btnBox" v-if="item.canApproval">
                  <el-button
                    @click="clickOnAgree(item)"
                    type="success"
                    size="mini"
                    plain
                    round
                  >
                    {{ $t('cs_common.cs_43') }}
                  </el-button>
                  <el-button
                    @click="clickReject(item)"
                    type="warning"
                    size="mini"
                    plain
                    round
                  >
                    {{ $t('cs_common.cs_44') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div
          class="messageBottom"
          v-if="item.attachmentList && item.attachmentList.length > 0"
        >
          <div
            class="fileWrap"
            v-for="file in item.attachmentList"
            :key="file.fileName"
          >
            <div
              class="fileIcon"
              :style="{
                background: 'url(' + iconPath + ')',
                backgroundSize: '100% 100%',
              }"
            ></div>
            <div class="fileBox">
              <div class="fileName">{{ file.fileName }}</div>
              <div class="fileInfo">
                <div class="fileSize">
                  {{ file.fileSize }}
                </div>
                <div
                  class="download"
                  v-if="file.canDownload"
                  @click="downFile(file)"
                >
                  {{ $t('cs_common.cs_45') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        <el-form-item :label="$t('cs_message.cs_4')">
          <el-input v-model="editForm.comment" style="width: 335px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="agreeOrRefuseDialog = false">
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button size="small" type="primary" @click="confirmEdit">
          {{ $t('cs_common.cs_12') }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="detailDialog">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          {{ $t('cs_common.cs_48') }}
        </div>
      </template>
      <div class="contentBox">
        <timeline :data="detailData" :approvalState="approvalState"></timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import timeline from '../../../components/timeline.vue'
import { unitSetUp } from '../../../utils/obj-operation'
export default {
  name: 'messageItem',
  props: {
    messageList: Array,
  },
  components: { timeline },
  data() {
    return {
      iconPath: require('../../../assets/img/page/file.png'),
      canEdit: false,
      agreeOrRefuseDialog: false,
      editForm: {
        applyId: '',
        applyStatus: 1,
        downloadCount: 1,
        downloadExpiredDay: 1,
        comment: '',
      },
      detailDialog: false,
      tagType: {
        1: 'warning',
        2: '',
        3: '',
        4: 'success',
        5: 'danger',
        6: 'danger',
      },
      applyType: {
        1: this.$t('cs_message.cs_5'),
        2: this.$t('cs_message.cs_6'),
        3: this.$t('cs_common.cs_49'),
        4: this.$t('cs_common.cs_50'),
        5: this.$t('cs_common.cs_51'),
        6: this.$t('cs_message.cs_7'),
        7: this.$t('cs_common.cs_52'),
        8: this.$t('cs_message.cs_8'),
        9: this.$t('cs_message.cs_9'),
      },
      stateType: {
        1: this.$t('cs_common.cs_30'),
        2: this.$t('cs_common.cs_31'),
        3: this.$t('cs_common.cs_29'),
        4: this.$t('cs_common.cs_32'),
        5: this.$t('cs_common.cs_53'),
        6: this.$t('cs_common.cs_54'),
      },
      detailData: {},
      approvalState: 0,
      baseUrl: '',
    }
  },
  computed: {},
  watch: {},
  created() {
    this.baseUrl = this.$store.getters.symSetting.uploadUrl
  },
  methods: {
    MarkRead(val) {
      this.$http('setNoticeRead', { noticeIdList: [val] }).then(() => {
        this.$emit('updateList', true)
      })
    },
    confirmEdit() {
      if (this.editForm.comment == '') {
        this.$message.warning(this.$t('cs_common.cs_55'))
        return
      }
      let url = this.editForm.applyStatus == 1 ? 'agree' : 'refuse'
      this.$http(url, this.editForm).then((res) => {
        this.$message.success(res.errMsg)
        this.agreeOrRefuseDialog = false
      })
    },
    showDetail(data) {
      if (!data.read) {
        this.MarkRead(data.id)
      }
      this.$http('getApplyDetail', {
        applyId: data.applyId,
        type: data.applyDetailType,
      }).then((res) => {
        if (res.data) {
          res.data.fileList.map((item) => {
            item.fileSize = unitSetUp(item.fileSize)
          })
          this.detailData = res.data
        }
      })
      this.detailDialog = true
    },
    downFile(data) {
      this.$http('download', {
        path: '/' + data.fileName,
        fileName: data.fileName,
        fileId: data.fileId,
      }).then((res) => {
        window.open(this.baseUrl + 'download?token=' + res.data)
      })
    },
    clickOnAgree(data) {
      if (!data.read) {
        this.MarkRead(data.id)
      }
      if (data.canEdit) {
        this.editForm.comment = ''
        this.editForm.applyId = data.applyId
        this.editForm.applyStatus = 1
        this.editForm.downloadCount = data.downloadCount
        this.editForm.downloadExpiredDay = data.downloadDay
        this.canEdit = data.canEdit
        this.agreeOrRefuseDialog = true
      } else {
        this.$confirm(this.$t('cs_message.cs_10'), this.$t('cs_common.cs_34'), {
          confirmButtonText: this.$t('cs_common.cs_35'),
          cancelButtonText: this.$t('cs_common.cs_10'),
          type: 'info',
          center: true,
        }).then(() => {
          this.$http('agree', {
            applyId: data.applyId,
            applyStatus: 1,
            downloadCount: data.downloadCount,
            downloadExpiredDay: data.downloadDay,
            comment: '',
          })
        })
      }
    },
    clickReject(data) {
      if (!data.read) {
        this.MarkRead(data.id)
      }
      this.editForm.comment = ''
      this.editForm.applyId = data.applyId
      this.editForm.applyStatus = 2
      this.editForm.downloadCount = data.downloadCount
      this.editForm.downloadExpiredDay = data.downloadDay
      this.canEdit = false
      this.agreeOrRefuseDialog = true
    },
  },
}
</script>

<style lang="scss" scoped>
.itemBox {
  width: 100%;
  height: 100%;
  overflow: auto;
  color: #595959;
  .messageWrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .messageBox {
      position: relative;
      padding: 15px;
      margin: 8px 0px;
      border: 0.5px solid #d9d9d9;
      border-radius: 5px;
      width: calc(100% - 70px);
      .topWrap {
        display: flex;
        flex-direction: row;
        .isRead {
          background: #e03131;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          margin: 8px 8px;
        }
        .topPart {
          .messageTop {
            display: flex;
            flex-direction: row;
            align-items: center;
            .title {
              font-size: 17px;
              font-weight: bold;
              margin-right: 15px;
            }
            .startTime {
              font-size: 13px;
              position: absolute;
              right: 20px;
            }
          }
          .messageContent {
            margin-top: 15px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            .infoTop {
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 8px;
              .detail {
                margin-left: 20px;
                color: #228be6;
                cursor: pointer;
                text-decoration: underline;
                font-size: 15px;
              }
              .detail:hover {
                color: #4dabf7;
              }
            }
            .infoBottom {
              width: 100%;
              display: flex;
              flex-direction: row;
              align-items: top;
              .noBtn {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;
                .infoItem {
                  height: 30px;
                  line-height: 30px;
                }
              }
              .btnBox {
                min-width: 140px;
                text-align: right;
              }
            }
          }
        }
      }
      .messageBottom {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .fileWrap {
          display: flex;
          flex-direction: row;
          margin-right: 30px;
          align-items: center;
        }
        .fileIcon {
          width: 40px;
          height: 40px;
          background: cornflowerblue;
          margin-right: 8px;
        }
        .fileName {
          font-size: 14px;
          font-weight: bold;
        }
        .fileInfo {
          display: flex;
          flex-direction: row;
          font-size: 12px;
          .fileLevel {
            margin: 0px 10px;
          }
          .level1 {
            color: #228be6;
          }
          .level2 {
            color: #ff922b;
          }
          .level3 {
            color: #f03e3e;
          }
          .download {
            margin-left: 8px;
            text-decoration: underline;
            cursor: pointer;
          }
          .download:hover {
            color: #868e96;
          }
        }
      }
    }
    .label {
      font-weight: bold;
    }
    .messageBox:hover {
      background: #f8f9fa;
    }
  }
}

.el-divider--horizontal {
  margin: 14px 0px;
}
.contentBox {
  min-height: 200px;
  position: relative;
  left: 40px;
}
.unit {
  margin-left: 10px;
}
</style>
