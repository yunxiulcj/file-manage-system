<template>
  <div class="box">
    <page-frame
      :title="$t('cs_systemManage.cs_18')"
      icon="cloudManage"
      :aside="true"
    >
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
      <div class="file" v-if="menu == 'file'" v-loading="loading">
        <div class="uploadBox fileBox">
          <span class="title">{{ $t('cs_systemManage.cs_19') }}</span>
          <el-switch
            v-model="formObj.enableUploadFileSize"
            active-color="#228be6"
            inactive-color="#adb5bd"
            style="margin-bottom: 2px; margin-left: 20px"
          ></el-switch>
          <div class="contentBox">
            <div class="subtitle">{{ $t('cs_systemManage.cs_20') }}</div>
            <div class="count">
              <el-input-number
                v-model="formObj.uploadFileSize"
                :min="1"
                size="small"
              ></el-input-number>
              <span class="unit">{{ $t('cs_systemManage.cs_21') }}</span>
            </div>
          </div>
        </div>
        <div class="typeBox fileBox">
          <div class="title">{{ $t('cs_systemManage.cs_22') }}</div>
          <div class="contentBox">
            <div class="subtitle">{{ $t('cs_systemManage.cs_23') }}</div>
            <div class="type">
              <el-checkbox-group
                v-model="formObj.operationFileType"
                v-if="formObj.operationFileType"
              >
                <el-checkbox
                  v-for="(item, index) in fileTypeList"
                  v-show="item"
                  :key="item"
                  :label="item"
                  size="mini"
                  style="margin: 10px 10px 0px 0px"
                  border
                >
                  {{ item }}
                  <el-divider direction="vertical"></el-divider>
                  <i class="el-icon-close" @click.stop="delType(index)"></i>
                </el-checkbox>
                <div class="addType">
                  <div class="btn" v-if="!isInput" @click="clickAdd">
                    <i class="el-icon-plus"></i>
                    {{ $t('cs_systemManage.cs_24') }}
                  </div>
                  <div class="input" v-else>
                    <el-input
                      v-model="typeStr"
                      @keyup.enter.native="addType(typeStr, 1)"
                      @blur="addType(typeStr, 2)"
                      size="mini"
                      style="width: 100px"
                      ref="inputType"
                      clearable
                    ></el-input>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="downloadBox fileBox">
          <div class="title">{{ $t('cs_systemManage.cs_25') }}</div>
          <div class="contentBox1">
            <div class="setting1 setting">
              <el-checkbox
                v-model="formObj.enableDownLoadCount"
                :label="$t('cs_systemManage.cs_26')"
              ></el-checkbox>
              <span>
                <el-input-number
                  :min="1"
                  style="margin-left: 15px"
                  size="mini"
                  v-model="formObj.defaultDownLoadCount"
                ></el-input-number>
                <span class="unit">{{ $t('cs_common.cs_9') }}</span>
              </span>
            </div>
            <div class="setting2 setting">
              <el-checkbox
                v-model="formObj.enableDownLoadDay"
                :label="$t('cs_systemManage.cs_27')"
              ></el-checkbox>
              <span class="unit">
                {{ $t('cs_systemManage.cs_28') }}
                <el-input-number
                  :min="1"
                  size="mini"
                  v-model="formObj.defaultDownLoadDay"
                ></el-input-number>
                {{ $t('cs_common.cs_8') }}
              </span>
            </div>
          </div>
        </div>
        <div class="operate">
          <el-button
            type="primary"
            size="small"
            @click="saveFileSetting(formObj)"
          >
            {{ $t('cs_common.cs_86') }}
          </el-button>
        </div>
      </div>
      <div class="cloud" v-if="menu == 'cloud'">
        <div class="cloudPath fileBox">
          <div class="title">{{ $t('cs_common.cs_105') }}</div>
          <div class="contentBox" v-loading="loading">
            <el-form label-width="110px" label-position="right" size="small">
              <el-form-item :label="$t('cs_systemManage.cs_29')">
                <el-input
                  v-model="formObj.diskRootPath"
                  style="width: 450px"
                  :placeholder="$t('cs_systemManage.cs_30')"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="operate">
          <el-button type="primary" size="small" @click="savePath(formObj)">
            {{ $t('cs_common.cs_86') }}
          </el-button>
        </div>
      </div>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import miniMenu from '../../components/miniMenu.vue'
import { clone } from '../../utils/obj-operation'
export default {
  name: 'cloudManage',
  components: { pageFrame, miniMenu },
  data() {
    return {
      isOpen: false,
      menu: 'file',
      menuList: [
        {
          label: this.$t('cs_systemManage.cs_31'),
          value: 'file',
        },
        {
          label: this.$t('cs_common.cs_105'),
          value: 'cloud',
        },
      ],
      typeStr: '',
      formObj: {
        uploadFileSize: 1,
        operationFileType: [],
        enableDownLoadCount: false,
        enableDownLoadDay: false,
        enableUploadFileSize: false,
        defaultDownLoadCount: 1,
        defaultDownLoadDay: 1,
        diskRootPath: '',
      },
      fileTypeList: [],
      isInput: false,
      loading: false,
    }
  },
  watch: {
    menu: {
      handler(val) {
        let type = val == 'file' ? 1 : 2
        this.getData(type)
      },
      immediate: true,
    },
  },
  methods: {
    getData(type) {
      this.loading = true
      this.$http('getSetting', { settingId: type })
        .then((res) => {
          let data = res.data
          if (data.operationFileType) {
            this.fileTypeList = clone(data.operationFileType)
          }
          data.operationFileType = data.operationFileType
            ? data.operationFileType
            : []
          this.formObj = data
        })
        .finally(() => {
          this.loading = false
        })
    },
    saveFileSetting(data) {
      this.$http('fileSetting', data).then((res) => {
        this.$message.success(res.errMsg)
      })
    },
    savePath(data) {
      this.$http('diskPathSetting', { diskRootPath: data.diskRootPath }).then(
        (res) => {
          this.$message.success(res.errMsg)
        }
      )
    },
    clickAdd() {
      this.isInput = !this.isInput
      this.$nextTick(() => {
        this.$refs['inputType'].focus()
      })
    },
    addType(val, type) {
      if (val) {
        let temp = this.fileTypeList.filter(
          (item) => item.toLowerCase() == val.toLowerCase()
        )
        if (temp.length == 0) {
          this.fileTypeList.push(val)
          this.formObj.operationFileType.push(val)
        } else {
          this.$message.info(this.$t('cs_systemManage.cs_32'))
        }
      }
      this.typeStr = ''
      if (type == 1) {
        this.$refs['inputType'].focus()
      } else {
        this.$refs['inputType'].blur()
        this.isInput = !this.isInput
      }
    },
    delType(val) {
      this.formObj.operationFileType = this.formObj.operationFileType.filter(
        (item) => item != this.fileTypeList[val]
      )
      this.fileTypeList.splice(val, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.fileBox {
  border: 0.5px solid #dee2e6;
  padding: 15px;
  margin: 20px 10px;
  .title {
    color: #228be6;
    font-size: 17px;
  }
  .contentBox {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .subtitle {
      color: #868e96;
    }
  }
}
.unit {
  font-size: 14px;
  margin-left: 12px;
  color: #343a40;
}
.uploadBox .count {
  margin-left: 100px;
}
.typeBox .contentBox {
  flex-direction: column;
  align-items: flex-start;
  .type {
    display: flex;
    margin-top: 15px;
    flex-direction: row;
    justify-content: space-between;
    // align-items: center;
    flex-wrap: wrap;
    width: 480px;
    max-height: 140px;
    overflow: auto;
    .addType {
      margin-top: 10px;
      display: inline-block;
      width: 101px;
      .btn {
        border: 0.5px solid #dee2e6;
        height: 26px;
        line-height: 26px;
        width: 100px;
        text-align: center;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      }
      .btn:hover {
        color: #495057;
        border: 0.5px solid #228be6;
        background: #f8f9fa;
      }
    }
  }
}
.downloadBox {
  display: flex;
  flex-direction: column;
  .contentBox1 {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    .setting {
      margin: 8px 0px;
    }
  }
}
.cloudPath {
  .contentBox {
    margin-top: 20px;
  }
}
.operate {
  margin-left: 15px;
}
.el-icon-close {
  font-size: 15px;
}
.el-icon-close:hover {
  font-weight: bold;
}
</style>
