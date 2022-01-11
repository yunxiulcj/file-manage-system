<template>
  <div class="box">
    <page-frame title="网盘管理" icon="cloudManage" :aside="true">
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
      <div class="file" v-if="menu == 'file'">
        <div class="uploadBox fileBox">
          <div class="title">上传文件限制</div>
          <div class="contentBox">
            <div class="subtitle">设置单个文件上传的大小上限</div>
            <div class="count">
              <el-input-number
                v-model="formObj.uploadSize"
                :min="1"
                size="small"
              ></el-input-number>
              <span class="unit">单位：MB</span>
            </div>
          </div>
        </div>
        <div class="typeBox fileBox">
          <div class="title">文件类型限制</div>
          <div class="contentBox">
            <div class="subtitle">设置一般用户可操作的文件类型</div>
            <div class="type">
              <el-checkbox-group v-model="formObj.fileType">
                <el-checkbox
                  v-for="(item, index) in fileTypeList"
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
                    添加类型
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
          <div class="title">文件下载设置</div>
          <div class="contentBox1">
            <div class="setting1 setting">
              <el-checkbox
                v-model="formObj.isDownloadLimit"
                label="文件下载申请默认下载次数上限"
                style="width: 306px"
              ></el-checkbox>
              <span v-show="formObj.isDownloadLimit">
                <el-input-number
                  :min="1"
                  size="mini"
                  v-model="formObj.downloadNum"
                ></el-input-number>
                <span class="unit">单位：次</span>
              </span>
            </div>
            <div class="setting2 setting">
              <el-checkbox
                v-model="formObj.isDownloadTime"
                label="默认下载申请有效期上限设置"
                style="width: 245px"
              ></el-checkbox>
              <span class="unit" v-show="formObj.isDownloadTime">
                审批后
                <el-input-number
                  :min="1"
                  size="mini"
                  v-model="formObj.downloadTime"
                ></el-input-number>
                天内邮箱
              </span>
            </div>
          </div>
        </div>
        <div class="operate">
          <el-button type="primary" size="small">保存</el-button>
        </div>
      </div>
      <div class="cloud" v-if="menu == 'cloud'">
        <div class="cloudPath fileBox">
          <div class="title">网盘路径设置</div>
          <div class="contentBox">
            <el-form label-width="100px" label-position="right" size="small">
              <el-form-item label="网盘根路径">
                <el-input
                  v-model="pathForm.cloudPath"
                  style="width: 450px"
                  placeholder="请输入网盘根路径，示例：\\yxcloud-DFS01\"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="operate">
          <el-button type="primary" size="small">保存</el-button>
        </div>
      </div>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import miniMenu from '../../components/miniMenu.vue'
export default {
  name: 'cloudManage',
  components: { pageFrame, miniMenu },
  data() {
    return {
      menu: 'file',
      menuList: [
        {
          label: '文件设置',
          value: 'file',
        },
        {
          label: '网盘路径设置',
          value: 'cloud',
        },
      ],
      typeStr: '',
      formObj: {
        uploadSize: 1,
        fileType: [],
        isDownloadLimit: false,
        isDownloadTime: false,
        downloadNum: 1,
        downloadTime: 1,
      },
      pathForm: {
        cloudPath: '',
        formRules: {},
      },
      fileTypeList: ['txt', 'word', 'pdf', 'excel', 'zip'],
      isInput: false,
    }
  },
  methods: {
    clickAdd() {
      this.isInput = !this.isInput
      this.$nextTick(() => {
        this.$refs['inputType'].focus()
      })
    },
    addType(val, type) {
      if (val) {
        if (!this.fileTypeList.includes(val)) {
          this.fileTypeList.push(val)
        } else {
          this.$message.info('已存在该类型')
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
