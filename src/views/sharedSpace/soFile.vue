<template>
  <div class="box">
    <div class="contentBox" v-if="!showNewApply">
      <header>
        <div class="headLeft">
          <el-button size="mini" type="primary" @click="addFolderDialog = true">
            <i class="iconfont icon-xinjianwenjian"></i>
            新建文件夹
          </el-button>
          <el-button size="mini" type="primary" @click="uploadFile">
            <i class="iconfont icon-upload"></i>
            上传
          </el-button>
          <el-button
            size="mini"
            type="primary"
            style="background: #0eafc0"
            @click="showNewApply = true"
          >
            <i class="iconfont icon-fileDownload"></i>
            下载申请
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="delFile(selectData)"
            v-show="selectData.length > 0"
          >
            <i class="iconfont icon-delete"></i>
            删除
          </el-button>
        </div>
        <div class="headRight">
          <el-input
            placeholder="请输入文件名"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 220px"
            v-model="searchName"
          ></el-input>
          <i
            class="iconfont icon-caidan"
            title="按图标排列"
            v-if="isTable"
            @click="isTable = false"
          ></i>
          <i
            class="iconfont icon-liebiao"
            title="按表格排列"
            @click="isTable = true"
            v-else
          ></i>
        </div>
      </header>
      <div class="title">所有文件</div>
      <div class="tableWrap" v-if="isTable">
        <table-temp
          ref="table"
          :config="tableConfig"
          :loading="tableLoading"
          @selection-change="handleSelectionChange"
          @cellMouseEnter="cellMouseEnter"
          @cellMouseLeave="cellMouseLeave"
        >
          <template slot="file" slot-scope="scope">
            <div class="fileWrap">
              <div class="fileIcon">i</div>
              <div class="fileName">
                <el-input
                  ref="editInput"
                  v-if="scope.row.isEdit"
                  v-model="scope.row.tempName"
                  placeholder="请输入文件名"
                  size="mini"
                  clearable
                >
                  <el-button slot="append" @click="editFileName(scope.row)">
                    <i class="el-icon-check"></i>
                  </el-button>
                </el-input>
                <span
                  :class="{ clickable: scope.row.isFolder }"
                  :title="scope.row.fileName"
                  v-else
                >
                  {{ scope.row.fileName }}
                </span>
              </div>
              <div class="operate" v-show="scope.row.showOperate">
                <i
                  class="iconfont icon-edit"
                  v-show="!scope.row.isEdit"
                  @click.stop="showEditName(scope.row)"
                  title="编辑"
                ></i>
                <i
                  class="iconfont icon-quxiao"
                  v-show="scope.row.isEdit"
                  @click="cancelEdit(scope.row)"
                  title="取消编辑"
                ></i>
                <i
                  class="iconfont icon-xiazai"
                  @click.stop="showNewApply = true"
                  v-show="!scope.row.isFolder"
                  title="下载"
                ></i>
                <i
                  class="iconfont icon-trash"
                  @click.stop="delFile([scope.row])"
                  title="删除"
                ></i>
              </div>
            </div>
          </template>
        </table-temp>
      </div>
      <div class="iconWrap" v-else>
        <el-checkbox v-model="checkAll">全选</el-checkbox>
        <el-divider></el-divider>
      </div>
    </div>
    <div class="newApplyBox" v-else>
      <page-frame title="新建下载申请" icon="fileDownload">
        <template #headBtn>
          <div class="goBack" @click="showNewApply = false">
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
                <div class="applicant">{{ applyForm.applicant }}</div>
              </el-form-item>
              <el-form-item label="申请人邮箱">
                <el-input
                  v-model="applyForm.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item label="主题">
                <el-input
                  v-model="applyForm.theme"
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
              <el-form-item label="附件">
                <div class="addFile">
                  <i class="el-icon-plus"></i>
                  <span>添加附件</span>
                </div>
              </el-form-item>
              <el-form-item label="审批人">
                <div class="superior" v-if="applyForm.type == 1">
                  <div class="approvalBox">
                    <div class="iconBox">
                      <i class="iconfont icon-yonghutianchong"></i>
                    </div>
                    <span>{{ levelObj[applyForm.level] }}</span>
                    <span>（{{ approvalMode[applyForm.approvalType] }}）</span>
                  </div>
                </div>
                <div class="member" v-if="applyForm.type == 2">
                  <div class="content">
                    <template v-for="user in applyForm.approver">
                      <div :key="user.index">
                        <div class="memberBox">
                          <div class="iconBox">
                            <i class="iconfont icon-yonghutianchong"></i>
                          </div>
                          <span>{{ user }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="memType">
                    （{{ approvalMode[applyForm.approvalType] }}）
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
                    v-model="applyForm.periodValidity"
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
                    v-model="applyForm.downloads"
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
              <el-button type="info" size="small" @click="showNewApply = false">
                取消
              </el-button>
            </div>
          </div>
        </div>
      </page-frame>
    </div>
    <el-dialog :visible.sync="addFolderDialog" width="30%">
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          新建文件夹
        </div>
      </template>
      <span>文件夹名称</span>
      <el-input
        v-model="folderName"
        size="small"
        placeholder="请输入文件夹名称"
        style="margin-top: 5px"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFolderDialog = false" size="small">
          取 消
        </el-button>
        <el-button type="primary" @click="addFolderDialog = false" size="small">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <upload-dialog v-model="uploadDialog"></upload-dialog>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
import uploadDialog from './components/uploadDialog.vue'
export default {
  name: 'soFile',
  components: { tableTemp, pageFrame, uploadDialog },
  data() {
    return {
      folderName: '',
      uploadDialog: false,
      addFolderDialog: false,
      showNewApply: false,
      applyForm: {
        applicant: 'admin01',
        email: '',
        theme: '',
        describe: '',
        attachment: '',
        approver: ['test1', 'test2', 'test3'],
        approvalType: 2,
        type: 2,
        isPeriodValidity: false,
        isDownloads: '',
        periodValidity: '',
        downloads: '',
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
      checkAll: false,
      isTable: true,
      searchName: '',
      testData: [
        {
          id: 1,
          fileName: 'test001.txt',
          fileSize: '12kb',
          dateChang: '2022-01-11 13:35:12',
          isFolder: false,
        },
        {
          id: 2,
          fileName: 'test002.txt',
          fileSize: '512kb',
          dateChang: '2022-01-12 13:35:12',
          isFolder: false,
        },
        {
          id: 3,
          fileName: 'test003.txt',
          fileSize: '212kb',
          dateChang: '2022-01-13 13:35:12',
          isFolder: true,
        },
        {
          id: 4,
          fileName:
            '的犯得上发射点犯得上发生法大师傅大师傅士大夫发士大夫士大夫.txt',
          fileSize: '312kb',
          dateChang: '2022-02-11 13:35:12',
          isFolder: false,
        },
        {
          id: 5,
          fileName: 'test005.txt',
          fileSize: '123MB',
          dateChang: '2022-03-11 13:35:12',
          isFolder: false,
        },
      ],
      tableLoading: false,
      tableConfig: {
        tableData: [],
        maxHeight: '10000px',
        selection: true,
        stripe: false,
        border: false,
        headerCellStyle: {
          background: '#f7f9fd',
          height: '35px',
          lineHeight: '35px',
          fontSize: '15px',
        },
        tableSetting: [
          {
            prop: 'fileName',
            label: '文件名',
            align: 'left',
            slot: 'file',
          },
          {
            prop: 'fileSize',
            label: '大小',
            width: '250px',
          },
          {
            prop: 'dateChang',
            label: '修改日期',
            width: '300px',
          },
        ],
      },
      selectData: [],
    }
  },
  created() {
    this.tableConfig.tableData = this.testData
  },
  mounted() {
    this.tableConfig.maxHeight = document.body.clientHeight - 220 + 'px'
  },
  methods: {
    handleSelectionChange(val) {
      this.selectData = val
    },
    cellMouseEnter(val) {
      this.$set(val, 'showOperate', true)
    },
    cellMouseLeave(val) {
      this.$set(val, 'showOperate', false)
    },
    addDownloadApply(data) {
      console.log(data)
      this.showNewApply = false
    },
    delFile(val) {
      console.log(val)
      this.$confirm('删除后不可恢复，是否删除所选文件？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {})
    },
    showEditName(val) {
      this.$set(val, 'tempName', val.fileName)
      this.$set(val, 'isEdit', true)
    },
    editFileName(val) {
      if (val.tempName == '') {
        this.$message.warning('文件名不能为空')
        return
      } else {
        this.$set(val, 'fileName', val.tempName)
      }
      this.$set(val, 'isEdit', false)
    },
    cancelEdit(val) {
      this.$set(val, 'isEdit', false)
    },
    uploadFile() {
      this.uploadDialog = true
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  .contentBox {
    width: 100%;
    height: 100%;
    header {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      .headRight {
        position: absolute;
        right: 0px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    .title {
      margin: 25px 0px 10px 0px;
      font-size: 14px;
      color: #495057;
    }
    .tableWrap {
      width: 100%;
      height: calc(100% - 90px);
      overflow: auto;
      .fileWrap {
        color: #495057;
        display: flex;
        flex-direction: row;
        align-items: center;
        .fileName {
          width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .clickable {
            cursor: pointer;
          }
          .clickable:hover {
            text-decoration: underline;
          }
        }
        .fileIcon {
          width: 25px;
          height: 25px;
          margin-right: 20px;
          background: cornflowerblue;
        }
        .operate {
          color: #339af0;
          i {
            cursor: pointer;
            margin: 0px 8px;
          }
          i:hover {
            color: #1864ab;
          }
        }
      }
    }
    .iconfont {
      margin-right: 5px;
    }
    .icon-caidan {
      font-size: 28px;
      color: #868e96;
      cursor: pointer;
      margin-left: 15px;
    }
    .icon-caidan:hover {
      color: #228be6;
    }
    .icon-liebiao {
      font-size: 27px;
      color: #868e96;
      cursor: pointer;
      margin-left: 15px;
    }
    .icon-liebiao:hover {
      color: #228be6;
    }
    .el-divider {
      margin: 5px 0px;
    }
  }
  .newApplyBox {
    width: 100%;
    height: 100%;
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
        .applicant {
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
          .memType {
            position: relative;
            left: -15px;
            color: #343a40;
            font-size: 12px;
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
}
</style>
