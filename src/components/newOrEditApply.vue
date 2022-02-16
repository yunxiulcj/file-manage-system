<template>
  <div class="box">
    <page-frame :title="$t('cs_common.cs_2')" icon="fileDownload">
      <template #headBtn>
        <div class="goBack" @click="goBack">
          <i class="el-icon-back"></i>
          <span>{{ $t('cs_common.cs_1') }}</span>
        </div>
      </template>
      <div class="apply">
        <div class="applyForm">
          <el-form
            ref="applyForm"
            label-width="150px"
            label-position="right"
            size="small"
            style="width: 95%"
            :model="applyForm"
            :rules="formRule"
          >
            <el-form-item :label="$t('cs_common.cs_3')">
              <div class="applyUser">{{ applyForm.applyUser }}</div>
            </el-form-item>
            <el-form-item :label="$t('cs_.cs_2')" prop="applyEmail">
              <el-input
                v-model="applyForm.applyEmail"
                :placeholder="$t('cs_common.cs_4')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cs_.cs_3')" prop="applyTheme">
              <el-input
                v-model="applyForm.applyTheme"
                :placeholder="$t('cs_common.cs_5')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cs_.cs_4')" prop="describe">
              <el-input
                type="textarea"
                :rows="3"
                v-model="applyForm.describe"
                :placeholder="$t('cs_.cs_5')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cs_.cs_6')">
              <div class="fileWrap">
                <div
                  class="fileBox"
                  v-for="(item, index) in applyForm.fileList"
                  :key="item.filePath"
                >
                  <span class="fileName">{{ item.fileName }}</span>
                  <span class="fileSize">{{ item.size }}</span>
                  <i class="el-icon-close" @click="delFile(index)"></i>
                  <el-divider
                    direction="vertical"
                    v-if="index + 1 != applyForm.fileList.length"
                  ></el-divider>
                </div>
              </div>
              <div class="addFile" @click="getFileList">
                <i class="el-icon-plus"></i>
                <span>{{ $t('cs_common.cs_6') }}</span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('cs_common.cs_7')">
              <div class="member">
                <div class="content">
                  <div v-for="user in applyForm.approvalUserList" :key="user">
                    <el-tooltip placement="top">
                      <div slot="content">
                        {{ user }}
                      </div>
                      <div class="contentBox">
                        <div class="memberBox">
                          <div class="iconBox">
                            <i class="iconfont icon-yonghutianchong"></i>
                          </div>
                          <span class="userBox">{{ user }}</span>
                        </div>
                        <div class="interval"></div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="seniorWrap">
          <div class="senior">
            <div class="seniorTitle">{{ $t('cs_.cs_7') }}</div>
            <div class="seniorItem">
              <el-checkbox v-model="isPeriodValidity">
                {{ $t('cs_.cs_8') }}
              </el-checkbox>
              <div class="seniorContent">
                {{ $t('cs_.cs_9') }}
                <el-input-number
                  v-model="applyForm.downloadDay"
                  controls-position="right"
                  :min="0"
                  size="mini"
                  style="width: 100px; margin: 0px 10px"
                ></el-input-number>
                {{ $t('cs_common.cs_8') }}
              </div>
            </div>
            <div class="seniorItem">
              <el-checkbox v-model="isDownloads">
                {{ $t('cs_.cs_10') }}
              </el-checkbox>
              <div class="seniorContent">
                {{ $t('cs_.cs_11') }}
                <el-input-number
                  v-model="applyForm.downloadCount"
                  controls-position="right"
                  :min="0"
                  size="mini"
                  style="width: 100px; margin: 0px 10px"
                ></el-input-number>
                {{ $t('cs_common.cs_9') }}
              </div>
            </div>
          </div>
          <div class="btnWrap">
            <el-button
              type="primary"
              size="small"
              :loading="loading"
              @click="addDownloadApply(applyForm)"
            >
              {{ $t('cs_.cs_12') }}
            </el-button>
            <el-button type="info" size="small" @click="goBack">
              {{ $t('cs_common.cs_10') }}
            </el-button>
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
          {{ $t('cs_common.cs_6') }}
        </div>
      </template>
      <div class="breadCrumbBox">
        <bread-crumb
          v-model="nowPath"
          @startGetData="startGetData"
        ></bread-crumb>
      </div>
      <div class="tableWrap">
        <table-temp
          :config="tableConfig"
          v-loading="tableLoading"
          ref="table"
          @handleSelect="handleSelect"
          @handleSelectAll="handleSelectAll"
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
          {{ $t('cs_common.cs_11') }}
        </el-button>
        <el-button type="primary" @click="addFile" size="small">
          {{ $t('cs_common.cs_12') }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="tipsDialog" width="450px">
      <div class="tipsWrap">
        <i class="el-icon-success"></i>
        <div class="label">{{ $t('cs_.cs_13') }}</div>
        <div>
          {{ $t('cs_.cs_14') }}
          <span class="applyId" @click="jumpDetail(tipInfo)">
            {{ tipInfo }}
          </span>
          {{ $t('cs_.cs_15') }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goBack" size="small">
          {{ $t('cs_common.cs_13') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageFrame from './pageFrame.vue'
import tableTemp from './table-temp.vue'
import breadCrumb from '../components/breadCrumb.vue'
import { unitSetUp } from '../utils/obj-operation'
export default {
  name: 'newOrEditApply',
  components: { pageFrame, tableTemp, breadCrumb },
  data() {
    return {
      loading: false,
      tipInfo: '',
      tipsDialog: false,
      nowPath: '/',
      isDownloads: false,
      isPeriodValidity: false,
      showFileDialog: false,
      tableLoading: false,
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
      formRule: {
        applyEmail: [
          {
            required: true,
            message: this.$t('cs_common.cs_4'),
            trigger: 'blur',
          },
        ],
        applyTheme: [
          {
            required: true,
            message: this.$t('cs_common.cs_5'),
            trigger: 'blur',
          },
        ],
        describe: [
          { required: true, message: this.$t('cs_.cs_16'), trigger: 'blur' },
        ],
      },
      tableConfig: {
        tableData: [],
        maxHeight: '450px',
        selection: true,
        border: false,
        tableSetting: [
          {
            prop: 'name',
            label: this.$t('cs_common.cs_14'),
            slot: 'file',
          },
          {
            prop: 'size',
            label: this.$t('cs_common.cs_15'),
            formatter: (row) => {
              return row.dir ? '-' : unitSetUp(row.size)
            },
          },
          {
            prop: 'lastModified',
            label: this.$t('cs_common.cs_16'),
          },
        ],
        condition: {
          path: '',
        },
        fetchUrl: 'getFileList',
      },
      approvalMode: {
        1: this.$t('cs_common.cs_17'),
        2: this.$t('cs_common.cs_18'),
        3: this.$t('cs_common.cs_19'),
      },
      levelObj: {
        1: this.$t('cs_common.cs_20'),
        2: this.$t('cs_common.cs_21'),
        3: this.$t('cs_common.cs_22'),
        4: this.$t('cs_common.cs_23'),
        5: this.$t('cs_common.cs_24'),
        6: this.$t('cs_common.cs_25'),
      },
      selectFiles: [],
      rootPath: '',
      tempSelectFile: {},
      parentPath: '',
    }
  },
  created() {},
  mounted() {
    let data
    if (data && Object.keys(this.$route.params).length > 0) {
      data = this.$route.params
    } else {
      data = JSON.parse(sessionStorage.getItem('tempData'))
    }
    this.applyTitle =
      data.type == 0 ? this.$t('cs_common.cs_2') : this.$t('cs_.cs_17')
    this.$nextTick(() => {
      this.applyForm = data.data
      this.tempSelectFile = {}
      if (data.data.fileList && data.data.fileList.length > 0) {
        data.data.fileList.map((item) => {
          let parentPath = item.filePath.substring(
            0,
            item.filePath.lastIndexOf('/')
          )
          if (this.tempSelectFile[parentPath]) {
            this.tempSelectFile[parentPath].push(item)
          } else {
            this.tempSelectFile[parentPath] = [item]
          }
        })
      }
      this.type = data.type
    })
    this.getCurrentApprovalUser()
  },
  methods: {
    jumpDetail(val) {
      this.$router.push({
        name: 'approval',
        params: {
          accountType: '2',
          approvalState: 2,
          applyId: val,
        },
      })
    },
    startGetData(val) {
      if (val) {
        this.getData(this.nowPath)
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    delFile(val) {
      this.applyForm.fileList.splice(val, 1)
    },
    getData(val) {
      this.tableLoading = true
      let path
      if (val) {
        path = val[val.length - 1] == '/' ? val : val + '/'
      } else {
        path = '/'
      }
      this.$http('getFileList', { path: path })
        .then((res) => {
          this.parentPath = path.substring(0, path.lastIndexOf('/'))
          this.tableConfig.tableData = res.data
          this.nowPath = path
          if (this.tempSelectFile[this.parentPath]) {
            res.data.map((item) => {
              this.tempSelectFile[this.parentPath].map((file) => {
                if (file.filePath == item.path) {
                  this.$refs['table'].toggleRowSelection([item])
                }
              })
            })
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    addFile() {
      this.applyForm.fileList = []
      for (let i in this.tempSelectFile) {
        this.tempSelectFile[i].map((item) => {
          this.applyForm.fileList.push(item)
        })
      }
      this.showFileDialog = false
    },
    getFileList() {
      this.showFileDialog = true
      this.getData('/')
    },
    addDownloadApply(data) {
      this.$refs['applyForm'].validate((valid) => {
        if (valid) {
          if (this.applyForm.fileList.length > 0) {
            this.loading = true
            if (!this.isDownloads) {
              this.applyForm.downloadCount = 0
            }
            if (!this.isPeriodValidity) {
              this.applyForm.downloadDay = 0
            }
            if (this.type == 0) {
              this.$http('createApply', data)
                .then((res) => {
                  this.tipsDialog = true
                  this.tipInfo = res.data
                })
                .finally(() => {
                  this.loading = false
                  this.showNewApply = false
                })
            } else {
              this.$http('updateApply', data)
                .then((res) => {
                  this.$message.success(res.errMsg)
                  this.goBack()
                })
                .finally(() => {
                  this.loading = false
                  this.showNewApply = false
                })
            }
          } else {
            this.$message.warning(this.$t('cs_.cs_18'))
          }
        }
      })
    },
    handleSelect(selection, row) {
      if (this.tempSelectFile[this.parentPath]) {
        let isExist = false
        this.tempSelectFile[this.parentPath].map((item, index) => {
          if (item.filePath == row.path) {
            isExist = true
            this.tempSelectFile[this.parentPath].splice(index, 1)
          }
        })
        if (!isExist) {
          this.tempSelectFile[this.parentPath].push({
            fileSize: row.size,
            size: unitSetUp(row.size),
            filePath: row.path,
            fileName: row.name,
          })
        }
      } else {
        this.tempSelectFile[this.parentPath] = [
          {
            fileSize: row.size,
            size: unitSetUp(row.size),
            filePath: row.path,
            fileName: row.name,
          },
        ]
      }
    },
    handleSelectAll(selection) {
      this.tempSelectFile[this.parentPath] = selection.map((item) => {
        return {
          fileSize: item.size,
          size: unitSetUp(item.size),
          filePath: item.path,
          fileName: item.name,
        }
      })
    },
    getCurrentApprovalUser() {
      this.$http('getCurrentApprovalUser').then((res) => {
        this.$set(this.applyForm, 'approvalUserList', res.data)
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
        left: 10px;
        .content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .contentBox {
            display: flex;
            flex-direction: row;
            .interval {
              width: 1px;
              margin: 0px 5px;
              height: 62px;
              background: #e9ecef;
            }
            .memberBox {
              display: flex;
              flex-direction: column;
              align-items: center;
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
              .userBox {
                width: 65px;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              span {
                color: #343a40;
                font-size: 13px;
              }
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
.breadCrumbBox {
  margin-bottom: 10px;
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
  flex-wrap: wrap;
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
.tipsWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  i {
    font-size: 40px;
    color: #37b24d;
  }
  .label {
    font-size: 16px;
    margin: 15px 0px;
  }
  .applyId {
    text-decoration: underline;
    color: chocolate;
    cursor: pointer;
  }
  .applyId:hover {
    color: #fab005;
  }
}
</style>
