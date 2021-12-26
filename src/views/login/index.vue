<template>
  <div class="box">
    <div class="formBox">
      <h3 class="titleBox">文档管理系统</h3>
      <el-form :model="loginForm" :rules="loginForm.formRules" ref="loginForm">
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            type="text"
            placeholder="用户名"
            @on-enter="handleSubmit"
          >
            <i slot="prefix" class="iconfont icon-zhanghao"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            @on-enter="handleSubmit"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 14px" prop="captcha">
          <div class="captcha">验证码 :</div>
          <el-row>
            <el-col :span="11">
              <el-input
                v-model="loginForm.captcha"
                type="text"
                placeholder="请输入验证码"
                @on-enter="handleSubmit"
                @keyup.enter.native="handleSubmit"
              ></el-input>
            </el-col>
            <el-col :span="11" :offset="2">
              <img
                type="text"
                :src="verifyImg"
                style="cursor: pointer"
                @click="handleRefreshVerify"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <div style="margin-bottom: 25px">
          <el-checkbox
            v-model="loginForm.remember"
            size="mini"
            style="font-size: 8px"
          >
            记住密码
          </el-checkbox>
          <span class="forget">忘记密码?</span>
        </div>
        <el-form-item>
          <el-button
            @click="handleSubmit"
            :loading="loading"
            style="
              background: linear-gradient(to right, #00d2ff, #3a7bd5);
              width: 300px;
              color: white;
            "
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      loginForm: {
        account: 'infvditest02',
        password: 'csot.888',
        captcha: '3214',
        remember: false,
        formRules: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
        },
      },
      verifyImg: '',
    }
  },
  methods: {
    handleSubmit() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$router.push('/')
        }
      })
    },
    handleRefreshVerify() {},
  },
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  min-height: 700px;
  background-image: url('../../assets/img/login/background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
.formBox {
  width: 300px;
  height: 500px;
  position: absolute;
  right: 14%;
  top: 110px;
}
.iconfont {
  font-size: 16px;
  color: #bfbfbf;
  text-align: center;
}
.captcha {
  font-size: 10px;
  height: 22px;
  line-height: 22px;
  color: #434343;
}
.el-form-item {
  margin-bottom: 18px;
}
.forget {
  line-height: 22px;
  float: right;
  font-size: 14px;
  color: #434343;
  cursor: pointer;
}
.forget:hover {
  color: cornflowerblue;
}
</style>
