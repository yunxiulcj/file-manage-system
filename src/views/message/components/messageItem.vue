<template>
  <div class="itemBox">
    <div v-for="item in messageList" :key="item.id" class="messageWrap">
      <div class="messageBox">
        <div class="topWrap">
          <div :class="{ isRead: item.read }"></div>
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
              <div class="startTime">{{ item.expiredStartTime }}</div>
            </div>
            <div class="messageContent">
              <div class="infoTop">
                <div class="applyUser infoItem">
                  <span class="label">申请人：</span>
                  {{ item.applyUser }}
                </div>
                <el-divider direction="vertical"></el-divider>

                <div class="periodValidity infoItem">
                  <span class="label">有效期：</span>
                  {{ item.expiredStartTime }} 至
                  {{ item.expiredEndTime }}
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="invalidDay infoItem">
                  申请后{{ item.noticeTime }}天内
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="detail infoItem" @click="showDetail(item)">
                  详情
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
                    <span class="label">申请描述：</span>
                    {{ item.applyDesc }}
                  </div>
                </div>
                <div class="btnBox" v-if="item.canApproval">
                  <el-button
                    @click="clickOnAgre"
                    type="success"
                    size="mini"
                    plain
                    round
                  >
                    同意
                  </el-button>
                  <el-button
                    @click="clickReject"
                    type="warning"
                    size="mini"
                    plain
                    round
                  >
                    拒绝
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
                  下载
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'messageItem',
  props: {
    messageList: Array,
  },
  data() {
    return {
      dialogVisible: false,
      tagType: {
        1: 'warning',
        2: '',
        3: '',
        4: 'success',
        5: 'danger',
      },
      applyType: {
        1: '公网上传申请',
        2: '外发申请',
        3: '文件下载申请',
        4: '文件上传',
        5: '删除',
        6: '邀请加入',
        7: '重命名',
        8: '移除',
        9: '创建',
      },
      stateType: {
        1: '已撤回',
        2: '待处理',
        3: '审批中',
        4: '审批通过',
        5: '审批拒绝',
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    showDetail(data) {
      this.dialogVisible = true
      console.log(data)
    },
    downFile(data) {
      this.$http('createToken', {
        path: data.filePath,
        fileName: data.fileName,
        type: 2,
      }).then((res) => {
        window.open(window.urlHead + res.data)
      })
    },
    clickOnAgre() {
      this.$prompt('是否同意当前申请，可选择填写同意理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的同意理由是: ' + value,
        })
      })
    },
    clickReject() {
      this.$prompt('是否拒绝当前申请，可选择填写拒绝理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的拒绝理由是: ' + value,
        })
      })
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
                width: 140px;
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
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
  }
}

.el-divider--horizontal {
  margin: 14px 0px;
}
</style>
