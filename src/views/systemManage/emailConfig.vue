<template>
  <div class="box">
    <page-frame :title="$t('cs_systemManage.cs_33')" icon="emailConfig">
      <div class="formBox" v-loading="loading">
        <el-form
          :model="formObj"
          :rules="formRules"
          size="small"
          ref="form"
          label-width="110px"
          label-position="right"
          style="width: 420px"
        >
          <div style="height: 60px"></div>
          <el-form-item
            :label="$t('cs_systemManage.cs_34')"
            prop="emailService"
          >
            <el-input
              v-model="formObj.emailService"
              :placeholder="$t('cs_common.cs_106')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="emailPort">
            <el-input
              v-model="formObj.emailPort"
              :placeholder="this.$t('cs_common.cs_107')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('cs_systemManage.cs_35')"
            prop="emailUsername"
          >
            <el-input
              v-model="formObj.emailUsername"
              :placeholder="this.$t('cs_common.cs_108')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('cs_common.cs_37')" prop="emailPassword">
            <el-input
              v-model="formObj.emailPassword"
              :type="inputType"
              :placeholder="$t('cs_common.cs_40')"
            >
              <i slot="suffix" :class="inputIcon" @click="changeType"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formObj.ssllogin"
              :label="$t('cs_systemManage.cs_36')"
            ></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="saveLoading"
              @click="emailSetting"
            >
              {{ $t('cs_common.cs_86') }}
            </el-button>
            <el-button type="danger" @click="resetForm">
              {{ $t('cs_systemManage.cs_37') }}
            </el-button>
            <el-button type="info" @click="testEmail" :loading="testLoading">
              {{ $t('cs_systemManage.cs_38') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
export default {
  name: 'emailConfig',
  components: { pageFrame },
  data() {
    return {
      loading: false,
      saveLoading: false,
      testLoading: false,
      inputType: 'password',
      inputIcon: 'iconfont icon-show',
      formObj: {
        emailService: '',
        emailPort: '',
        emailUsername: '',
        emailPassword: '',
        ssllogin: false,
      },
      formRules: {
        emailService: [
          {
            required: true,
            message: this.$t('cs_common.cs_106'),
            trigger: 'blur',
          },
        ],
        emailPort: [
          {
            required: true,
            message: this.$t('cs_common.cs_107'),
            trigger: 'blur',
          },
        ],
        emailUsername: [
          {
            required: true,
            message: this.$t('cs_common.cs_108'),
            trigger: 'blur',
          },
        ],
        emailPassword: [
          {
            required: true,
            message: this.$t('cs_common.cs_40'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    testEmail() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.testLoading = true
          this.$http('testEmail', this.formObj)
            .then((res) => {
              this.$message.success(res.errMsg)
            })
            .finally(() => {
              this.testLoading = false
            })
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.formObj.ssllogin = false
    },
    getData() {
      this.loading = true
      this.$http('getSetting', { settingId: 3 })
        .then((res) => {
          this.formObj = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    emailSetting() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          this.$http('emailSetting', this.formObj)
            .then((res) => {
              this.$message.success(res.errMsg)
            })
            .finally(() => {
              this.saveLoading = false
            })
        }
      })
    },
    changeType() {
      if (this.inputType == 'password') {
        this.inputType = 'text'
        this.inputIcon = 'iconfont icon-hidden'
      } else {
        this.inputType = 'password'
        this.inputIcon = 'iconfont icon-show'
      }
    },
  },
}
</script>

<style scoped>
.formBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.iconfont {
  font-size: 22px;
  cursor: pointer;
}
.iconfont:hover {
  color: #434343;
}
</style>
