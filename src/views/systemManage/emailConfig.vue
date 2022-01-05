<template>
  <div class="box">
    <page-frame title="邮件配置" icon="emailConfig">
      <div class="formBox">
        <el-form
          :model="formObj"
          :rules="formObj.formRules"
          size="small"
          ref="form"
          label-width="110px"
          label-position="right"
          style="width: 420px"
        >
          <div style="height: 60px"></div>
          <el-form-item label="SMTP服务器" prop="smtpService">
            <el-input
              v-model="formObj.smtpService"
              placeholder="请输入SMTP服务器"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="port">
            <el-input
              v-model="formObj.port"
              placeholder="请输入端口"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="formObj.username"
              placeholder="请输入账号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formObj.password"
              placeholder="请输入密码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formObj.isUserSSLLogin"
              label="使用SSL登录"
            ></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
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
      formObj: {
        smtpService: '',
        port: '',
        username: '',
        password: '',
        isUserSSLLogin: false,
        formRules: {
          smtpService: [
            { required: true, message: '请输入SMTP服务器', trigger: 'blur' },
          ],
          port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        },
      },
    }
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
</style>
