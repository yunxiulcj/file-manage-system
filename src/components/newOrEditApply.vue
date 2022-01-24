<template>
  <div class="box">
    <page-frame title="新建下载申请" icon="fileDownload">
      <template #headBtn>
        <div class="goBack" @click="goBack">
          <i class="el-icon-back"></i>
          <span>返回上一级</span>
        </div>
      </template>
      <div class="apply">
        <div class="applyForm">
          <el-form
            ref="applyForm"
            label-width="100px"
            label-position="right"
            size="small"
            style="width: 95%"
          >
            <el-form-item label="申请人">
              <div class="applyUser">{{ applyForm.applyUser }}</div>
            </el-form-item>
            <el-form-item label="申请人邮箱">
              <el-input
                v-model="applyForm.applyEmail"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item label="主题">
              <el-input
                v-model="applyForm.applyTheme"
                placeholder="请输入主题"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                type="textarea"
                :rows="3"
                v-model="applyForm.describe"
                placeholder="请输入申请描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="文件">
              <div class="fileWrap">
                <div
                  class="fileBox"
                  v-for="(item, index) in applyForm.fileList"
                  :key="item.fileName"
                >
                  <span class="fileName">{{ item.fileName }}</span>
                  <span class="fileSize">{{ item.fileSize }}</span>
                  <i class="el-icon-close" @click="delFile(index)"></i>
                  <el-divider
                    direction="vertical"
                    v-if="index + 1 != applyForm.fileList.length"
                  ></el-divider>
                </div>
              </div>
              <div class="addFile" @click="getFileList()">
                <i class="el-icon-plus"></i>
                <span>添加文件</span>
              </div>
            </el-form-item>
            <el-form-item label="审批人">
              <div class="member">
                <div class="content">
                  <template v-for="user in applyForm.approvalUserList">
                    <div :key="user">
                      <div class="memberBox">
                        <div class="iconBox">
                          <i class="iconfont icon-yonghutianchong"></i>
                        </div>
                        <span>{{ user }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="seniorWrap">
          <div class="senior">
            <div class="seniorTitle">高级选项</div>
            <div class="seniorItem">
              <el-checkbox v-model="applyForm.isPeriodValidity">
                文件下载有效期
              </el-checkbox>
              <div class="seniorContent">
                审批通过后
                <el-input-number
                  v-model="applyForm.downloadDay"
                  controls-position="right"
                  :min="1"
                  size="mini"
                  style="width: 100px; margin-left: 25px; margin-right: 10px"
                ></el-input-number>
                天内有效
              </div>
            </div>
            <div class="seniorItem">
              <el-checkbox v-model="applyForm.isDownloads">
                总下载次数
              </el-checkbox>
              <div class="seniorContent">
                文件下载次数
                <el-input-number
                  v-model="applyForm.downloadCount"
                  controls-position="right"
                  :min="1"
                  size="mini"
                  style="width: 100px; margin: 0px 10px"
                ></el-input-number>
                单位：次
              </div>
            </div>
          </div>
          <div class="btnWrap">
            <el-button
              type="primary"
              size="small"
              @click="addDownloadApply(applyForm)"
            >
              保存
            </el-button>
            <el-button type="info" size="small" @click="goBack">取消</el-button>
          </div>
        </div>
      </div>
    </page-frame>
    <el-dialog :visible.sync="showFileDialog" width="60%">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          添加文件
        </div>
      </template>
      <bread-crumb></bread-crumb>
      <div class="tableWrap">
        <table-temp
          :config="tableConfig"
          ref="table"
          @selection-change="handleSelectionChange"
        >
          <template slot="file" slot-scope="scope">
            <span
              :class="{ clickable: scope.row.dir }"
              @click="scope.row.dir && getData(scope.row.path)"
            >
              {{ scope.row.name }}
            </span>
          </template>
        </table-temp>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFileDialog = false" size="small">
          取 消
        </el-button>
        <el-button type="primary" @click="addFile" size="small">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageFrame from './pageFrame.vue'
import tableTemp from './table-temp.vue'
import breadCrumb from '../components/breadCrumb.vue'
export default {
  name: 'newOrEditApply',
  components: { pageFrame, tableTemp, breadCrumb },
  props: [],
  data() {
    return {
      nowPath: '/',
      isDownloads: false,
      isPeriodValidity: false,
      showFileDialog: false,
      type: 0,
      applyForm: {
        applyUser: '',
        applyEmail: '',
        applyTheme: '',
        describe: '',
        applyType: 1,
        downloadDay: 1,
        downloadCount: 1,
        fileList: [],
        approvalUserList: [],
      },
      tableConfig: {
        tableData: [],
        maxHeight: '550px',
        selection: true,
        border: false,
        tableSetting: [
          {
            prop: 'name',
            label: '文件名',
            slot: 'file',
          },
          {
            prop: 'size',
            label: '大小',
          },
          {
            prop: 'lastModified',
            label: '修改日期',
          },
        ],
        condition: {
          path: '',
        },
        fetchUrl: 'getFileList',
      },
      approvalMode: {
        1: '会签',
        2: '或签',
        3: '依次审批',
      },
      levelObj: {
        1: '直接上级',
        2: '第二级上级',
        3: '第三级上级',
        4: '第四级上级',
        5: '第五级上级',
        6: '第六级上级',
      },
      selectFiles: [],
      rootPath: '',
    }
  },
  created() {
    let data = this.$route.params
    this.applyTitle = data.type == 0 ? '新建下载申请' : '编辑下载申请'
    console.log('我的申请点击编辑', data)
    this.$nextTick(() => {
      this.applyForm = this.initForm(data.data)
      this.type = data.type
    })
  },
  mounted() {
    this.getCurrentApprovalUser()
    // this.getRootPath()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    delFile(val) {
      this.applyForm.fileList.splice(val, 1)
    },
    getData(path) {
      this.$http('getFileList', { path: path }).then((res) => {
        this.tableConfig.tableData = res.data
      })
    },
    addFile() {
      let fileList = this.selectFiles.map((item) => {
        return { fileSize: item.size, filePath: item.path, fileName: item.name }
      })
      console.log(fileList)
      this.$set(this.applyForm, 'fileList', fileList)
      this.showFileDialog = false
    },
    getFileList() {
      this.showFileDialog = true
      this.getData('')
    },
    addDownloadApply(data) {
      if (this.type == 0) {
        this.$http('createApply', data)
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.showNewApply = false
          })
      } else {
        this.$http('updateApply', data)
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.showNewApply = false
          })
      }
    },
    handleSelectionChange(data) {
      this.selectFiles = data.filter((item) => {
        if (!item.dir) {
          return item
        }
      })
    },
    // getRootPath() {
    //   this.$http('getSetting', { settingId: 2 }).then((res) => {
    //     this.rootPath = res.data.diskRootPath
    //   })
    // },
    initForm(data) {
      return data
    },
    getCurrentApprovalUser() {
      this.$http('getCurrentApprovalUser').then((res) => {
        this.applyForm.approvalUserList = res.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
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
  .apply {
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: center;
    .applyForm {
      overflow: auto;
      min-width: 50%;
      margin-top: 25px;
      margin-right: 10px;
      .applyUser {
        background: #f1f3f5;
        padding-left: 15px;
        font-size: 12px;
        border-radius: 5px;
      }
      .addFile {
        cursor: pointer;
        color: #228be6;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 80px;
        .el-icon-plus {
          font-size: 18px;
          font-weight: bold;
          margin-right: 5px;
        }
      }
      .addFile:hover {
        color: #845ef7;
      }
      .superior {
        .approvalBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          .iconBox {
            background: #bdccea;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 5px;
            i {
              font-size: 30px;
              color: #fcfcfc;
            }
          }
          span {
            color: #343a40;
            font-size: 12px;
            margin: 1px 0px;
          }
        }
      }
      .member {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        left: 20px;
        .content {
          display: flex;
          flex-direction: row;
          .memberBox {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 30px;
            justify-content: center;
            .iconBox {
              background: #bdccea;
              width: 40px;
              height: 40px;
              border-radius: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              i {
                margin-left: 5px;
                font-size: 30px;
                color: #fcfcfc;
              }
            }
            span {
              color: #343a40;
              font-size: 13px;
            }
          }
        }
      }
    }
    .seniorWrap {
      position: relative;
      .senior {
        margin-top: 25px;
        width: 350px;
        height: 250px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 14px;
        .seniorTitle {
          color: #495057;
          font-size: 14px;
          font-weight: bold;
          height: 40px;
          line-height: 40px;
          padding-left: 25px;
          margin-top: 20px;
        }
        .seniorItem {
          color: #495057;
          margin: 15px;
          margin-left: 25px;
          .seniorContent {
            margin: 10px;
          }
        }
      }
      .btnWrap {
        position: absolute;
        right: 0px;
        bottom: 20px;
      }
    }
  }
}
.tableWrap {
  .clickable {
    cursor: pointer;
    color: #228be6;
  }
  .clickable:hover {
    text-decoration: underline;
  }
}
.fileWrap {
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  .fileBox {
    .fileName {
      color: #343a40;
      font-weight: bold;
      font-size: 13px;
    }
    .fileSize {
      margin: 0px 12px;
      color: #495057;
      font-size: 12px;
    }
    i {
      cursor: pointer;
    }
    i:hover {
      color: #228be6;
    }
  }
}
</style>
