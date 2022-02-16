<template>
  <div class="box">
    <div class="changeLangBox">
      <el-dropdown @command="handleCommand">
        <span
          type="primary"
          plain
          size="mini"
          round
          style="color: #228be6"
          class="el-dropdown-link"
        >
          {{ $t('cs_menu.cs_19') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="formBox">
      <h3 class="titleBox">{{ $t('cs_login.cs_1') }}</h3>
      <el-form :model="loginForm" :rules="formRules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            :placeholder="$t('cs_common.cs_36')"
            @on-enter="handleSubmit"
          >
            <i slot="prefix" class="iconfont icon-zhanghao"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('cs_common.cs_37')"
            @on-enter="handleSubmit"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 14px" prop="verificationCode">
          <div class="verificationCode">{{ $t('cs_login.cs_2') }}</div>
          <el-row style="height: 40px">
            <el-col :span="11">
              <el-input
                v-model="loginForm.verificationCode"
                type="text"
                :placeholder="$t('cs_common.cs_38')"
                @on-enter="handleSubmit"
                @keyup.enter.native="handleSubmit"
              ></el-input>
            </el-col>
            <el-col :span="11" :offset="2">
              <img
                v-loading="refleshLoading"
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
            v-model="loginForm.rememberPassword"
            size="mini"
            style="font-size: 8px"
          >
            {{ $t('cs_login.cs_3') }}
          </el-checkbox>
          <span class="forget">{{ $t('cs_login.cs_4') }}</span>
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
            {{ $t('cs_login.cs_5') }}
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
      refleshLoading: false,
      loading: false,
      loginForm: {
        username: '',
        password: '',
        verificationCode: '',
        rememberPassword: false,
      },
      formRules: {
        username: [
          {
            required: true,
            message: this.$t('cs_common.cs_39'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('cs_common.cs_40'),
            trigger: 'blur',
          },
        ],
        verificationCode: [
          {
            required: true,
            message: this.$t('cs_common.cs_38'),
            trigger: 'blur',
          },
        ],
      },
      verifyImg: '',
      tempObj: {},
      lastPath: '',
    }
  },
  created() {
    this.loginForm.username = localStorage.getItem('username') || ''
    let isRemember = JSON.parse(localStorage.getItem('rememberPassword'))
    if (isRemember) {
      this.loginForm.password = localStorage.getItem('pwdToken') || ''
      this.loginForm.rememberPassword = true
    } else {
      this.loginForm.rememberPassword = false
      this.loginForm.password = ''
    }
    this.tempObj = JSON.parse(sessionStorage.getItem('pathInfo'))
  },
  mounted() {
    this.handleRefreshVerify()
  },
  methods: {
    handleSubmit() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http('login', this.loginForm)
            .then(
              (res) => {
                let data = res.data
                localStorage.setItem('username', data.userId)
                localStorage.setItem('pwdToken', data.pwdToken)
                localStorage.setItem('adminRole', data.adminRole)
                localStorage.setItem(
                  'menuList',
                  JSON.stringify(data.showMenuListId)
                )
                localStorage.setItem(
                  'rememberPassword',
                  this.loginForm.rememberPassword
                )
                this.$message.success(res.errMsg)
                if (this.tempObj && Object.keys(this.tempObj).length > 0) {
                  this.$router.push(this.tempObj)
                } else {
                  this.$router.push('/')
                }
              },
              () => {
                this.loginForm.verificationCode = ''
                this.handleRefreshVerify()
              }
            )
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    handleRefreshVerify() {
      this.refleshLoading = true
      this.$http('getCaptchaCode')
        .then((res) => {
          this.verifyImg = 'data:image/png;base64,' + res.data
        })
        .finally(() => {
          this.refleshLoading = false
        })
    },
    handleCommand(val) {
      this.$i18n.locale = val
      localStorage.setItem('language', val)
      location.reload()
    },
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
  .changeLangBox {
    position: absolute;
    top: 15px;
    right: 20px;
  }
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
.verificationCode {
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
