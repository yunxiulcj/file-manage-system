<template>
  <div class="box">
    <page-frame title="邮件配置" icon="emailConfig">
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
          <el-form-item label="SMTP服务器" prop="emailSerivce">
            <el-input
              v-model="formObj.emailService"
              placeholder="请输入SMTP服务器"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="emailPort">
            <el-input
              v-model="formObj.emailPort"
              placeholder="请输入端口"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="emailUsername">
            <el-input
              v-model="formObj.emailUsername"
              placeholder="请输入账号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="emailPassword">
            <el-input
              v-model="formObj.emailPassword"
              :type="inputType"
              placeholder="请输入密码"
            >
              <i slot="suffix" :class="inputIcon" @click="changeType"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formObj.ssllogin"
              label="使用SSL登录"
            ></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="saveLoading"
              @click="emailSetting"
            >
              保存
            </el-button>
            <el-button type="danger">重置</el-button>
            <el-button type="info">测试邮件</el-button>
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
          { required: true, message: '请输入SMTP服务器', trigger: 'blur' },
        ],
        emailPort: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        emailUsername: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        emailPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.$http('getSetting', { settingId: 3 })
        .then((res) => {
          let data = res.data
          this.formObj.emailService = data.emailService
          this.formObj.emailPort = data.emailPort
          this.formObj.emailUsername = data.emailUsername
          this.formObj.emailPassword = data.emailPassword
          this.formObj.ssllogin = data.ssllogin
          this.$message.success(res.errMsg)
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
