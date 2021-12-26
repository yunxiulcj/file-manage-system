<template>
  <div class="app-login">
    <!-- <div class="app-login-logo"
         :style="{'backgroundImage': 'url(' + logo + ')'}"></div> -->
      <div class="app-login-form">
        <div class="app-login-form-title">文档管理系统</div>
        <el-form ref="formLogin"
                 :model="formLogin"
                 :rules="ruleLogin"
                 label-width="80px">
          <el-form-item :label="账号"
                        prop="userId">
            <el-input type="text"
                      v-model="formLogin.userId"
                      @on-enter="handleSubmit"></el-input>
          </el-form-item>
          <el-form-item :label="密码"
                        prop="password">
            <el-input type="password"
                      v-model="formLogin.password"
                      @on-enter="handleSubmit"></el-input>
          </el-form-item>
          <el-form-item :label="验证码"
                        prop="captchaCode">
            <el-row>
              <el-col :span="8">
                <el-input type="text"
                          v-model="formLogin.captchaCode"
                          @on-enter="handleSubmit"
                          @keyup.enter.native="handleSubmit"></el-input>
              </el-col>
              <el-col :span="11"
                      :offset="1">
                <img type="text"
                     :src="verifyImg"
                     style="cursor: pointer;"
                     @click="handleRefreshVerify" />
              </el-col>
              <el-col :span="3"
                      :offset="1">
                <i class="el-icon-refresh"
                   style="font-size: 24px;"
                   :class="{rotate: refleshLoading}"
                   @click="handleRefreshVerify"></i>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="remember">记住密码</el-checkbox>
            <span class="forget"
                  >忘记密码</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       :loading="loading"
                       @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    <div class="app-login-footer">
      {{$t('message.loginPageTips')}}
    </div>
  </div>
</template>

<script>
// import JSCookie from 'js-cookie'

export default {
  name: 'login',
  data () {
    return {
      remember: false,
      refleshLoading: false,
      loading: false,
      verifyImg: '',
      session: '',
      formLogin: {
        userId: 'infvditest02',
        password: 'csot.888',
        captchaCode: 'qwer'
      },
      ruleLogin: {
        userId: [{
          required: true,
          message: this.$t('placeholder.Account'),
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: this.$t('placeholder.Password'),
          trigger: 'blur'
        }],
        captchaCode: [{
          required: true,
          message: this.$t('placeholder.Captcha'),
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    // if (localStorage.getItem('userInfo')) {
    //   this.formLogin.userId = JSON.parse(localStorage.getItem('userInfo')).userId
    // }
    // this.handleRefreshVerify()
  },
  methods: {
    handleRefreshVerify () {
    //   this.refleshLoading = true
    //   this.$http('getAuthCode', { 'methodName': 'get' })
    //     .then(data => {
    //       this.verifyImg = 'data:image/png;base64,' + data.data
    //     })
    //     .finally(() => {
    //       this.refleshLoading = false
    //     })
    },
    handleSubmit () {
      this.$refs.formLogin.validate((valid) => {
        if (valid) {
            this.$router.push('/home')
        //   this.login({
        //     captchaCode: this.formLogin.captchaCode,
        //     password: this.formLogin.password,
        //     userId: this.formLogin.userId
        //   })
        }
      })
    },
    login (params) {
      this.loading = true
      this.$http('login', params)
        .then(
          res => {
            this.$message.success(res.message)
            localStorage.setItem('showMenuListId', JSON.stringify(res.data.showMenuListId))
            localStorage.setItem('userId', res.data.userId)
            this.$store.commit('SET_ROLELEVEL', res.data.roleId)
            this.$store.commit('SET_SHOWROUTER', res.data.showMenuListId)
            this.$router.push('/home')
          },
          () => {
            this.formLogin.captchaCode = ''
            this.handleRefreshVerify()
          }
        )
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.app-login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background-image: linear-gradient(90deg, #0f4bc3, #73a0f9);
}
.app-login-logo {
  position: absolute;
  top: 30px;
  left: 50px;
  width: 270px;
  height: 85px;
  background-repeat: no-repeat;
}
.app-login-title {
  position: absolute;
  left: 50%;
  top: 11px;
  margin-left: -520px;
  text-indent: 30px;
  color: #3f78e8;
  font-size: 20px;
  line-height: 48px;
  font-weight: bold;
  letter-spacing: 2px;
}
.app-login-wrap {
  width: 1240px;
  height: 480px;
  margin: 50px auto;
  background-position: left top;
  background-repeat: no-repeat;
  position: relative;
}
.app-login-form {
  position: absolute;
  right: 0;
  top: 40px;
  width: 430px;
  padding: 20px 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  background-position: center center;
  background-repeat: no-repeat;
}
.app-login-form-title {
  font-size: 18px;
  text-align: center;
  line-height: 2;
  margin-bottom: 20px;
}
.app-login-footer {
  position: fixed;
  bottom: 50px;
  font-size: 16px;
  color: #fff;
  left: 0;
  width: 100%;
  text-align: center;
}
.languageBox{
  position: absolute;
  top:10px;
  right: 20px;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(-360deg);
  }
}

.rotate {
  animation: rotate 1s infinite;
}
</style>
