<template>
  <div class="box">
    <div class="contentBox" v-if="!showNewApply">
      <header>
        <div class="headLeft">
          <el-button size="mini" type="primary" @click="addFolderDialog = true">
            <i class="iconfont icon-xinjianwenjian"></i>
            新建文件夹
          </el-button>
          <el-button size="mini" type="primary">
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
          :config="tableConfig"
          ref="table"
          @selection-change="handleSelectionChange"
          :loading="tableLoading"
        ></table-temp>
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
              <el-form-item label="审批人"></el-form-item>
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
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import tableTemp from '../../components/table-temp.vue'
export default {
  name: 'soFile',
  components: { tableTemp, pageFrame },
  data() {
    return {
      folderName: '',
      addFolderDialog: false,
      showNewApply: false,
      applyForm: {
        applicant: 'admin01',
        email: '',
        theme: '',
        describe: '',
        attachment: '',
        approver: '',
        isPeriodValidity: false,
        isDownloads: '',
        periodValidity: '',
        downloads: '',
      },
      checkAll: false,
      isTable: true,
      searchName: '',
      tableLoading: false,
      tableConfig: {
        tableData: [],
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
          },
          {
            prop: 'fileSize',
            label: '大小',
          },
          {
            prop: 'dateChang',
            label: '修改日期',
          },
        ],
      },
    }
  },
  created() {},
  methods: {
    handleSelectionChange(val) {
      console.log(val)
    },
    addDownloadApply(data) {
      console.log(data)
      this.showNewApply = false
    },
  },
}
</script>

<style lang="scss" scoped>
.contentBox {
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
    color: #343a40;
  }
  .icon-liebiao {
    font-size: 27px;
    color: #868e96;
    cursor: pointer;
    margin-left: 15px;
  }
  .icon-liebiao:hover {
    color: #343a40;
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
        background: #e9ecef;
        padding-left: 15px;
        font-size: 12px;
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
</style>
