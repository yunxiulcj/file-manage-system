<template>
  <div class="box">
    <page-frame title="安全策略" icon="securityStrategy" :aside="true">
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
      <div class="pass showItem" v-if="menu == 'passwordPolicy'">
        <div class="contentBox">
          <el-form size="small" label-width="200px" label-position="left">
            <el-form-item label="密码策略">
              <el-switch
                v-model="passForm.passStrategy"
                active-color="#228be6"
                inactive-color="#adb5bd"
              ></el-switch>
            </el-form-item>
            <el-form-item label="密码最小长度">
              <el-input-number
                v-model="passForm.passMin"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="密码中至少包含大写字母数">
              <el-input-number
                v-model="passForm.passUpper"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="密码中至少包含特殊字符个数">
              <el-input-number
                v-model="passForm.passSpecial"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="密码过期时间">
              <el-radio v-model="passForm.passOverdue" label="0">
                设置天数
              </el-radio>
              <el-radio v-model="passForm.passOverdue" label="1">
                不限制
              </el-radio>
              <el-input-number
                v-show="passForm.passOverdue == 0"
                v-model="passForm.passDay"
                controls-position="right"
                :min="1"
                :max="1000"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div class="btnBox">
          <el-button type="primary" size="small" @click="savePass">
            保存
          </el-button>
        </div>
      </div>
      <div class="login showItem" v-if="menu == 'loginStrategy'">
        <div class="contentBox">
          <el-form size="small" label-width="170px" label-position="left">
            <el-form-item label="密码策略">
              <el-switch
                v-model="loginForm.passStrategy"
                active-color="#228be6"
                inactive-color="#adb5bd"
              ></el-switch>
            </el-form-item>
            <el-form-item label="密码错误锁定次数">
              <el-input-number
                v-model="loginForm.lockNum"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
              <span class="unit">单位：次</span>
            </el-form-item>
            <el-form-item label="密码错误锁定时间">
              <el-input-number
                v-model="loginForm.lockTime"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
              <span class="unit">单位：小时</span>
            </el-form-item>
            <el-form-item label="非活跃用户自动登出时间">
              <el-input-number
                v-model="loginForm.logoutTime"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
              <span class="unit">单位：分钟</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="btnBox">
          <el-button type="primary" size="small" @click="saveLogin">
            保存
          </el-button>
        </div>
      </div>
      <div class="limit showItem" v-if="menu == 'limitStrategy'">
        <div class="contentBox">3</div>
        <div class="btnBox">
          <el-button type="primary" size="small" @click="saveLimit">
            保存
          </el-button>
        </div>
      </div>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import miniMenu from '../../components/miniMenu.vue'
export default {
  name: 'securityStrategy',
  components: { pageFrame, miniMenu },
  data() {
    return {
      menu: 'passwordPolicy',
      menuList: [
        {
          label: '密码策略',
          value: 'passwordPolicy',
        },
        {
          label: '登录策略',
          value: 'loginStrategy',
        },
        {
          label: '登录限制策略',
          value: 'limitStrategy',
        },
      ],
      passForm: {
        passStrategy: false,
        passMin: 0,
        passUpper: 0,
        passSpecial: 0,
        passOverdue: '0',
        passDay: 0,
      },
      loginForm: {
        loginStrategy: false,
        lockNum: 0,
        lockTime: 0,
        logoutTime: 0,
      },
      limitStr: '',
    }
  },
  methods: {
    savePass() {
      this.$message.success('保存成功')
    },
    saveLogin() {
      this.$message.success('保存成功')
    },
    saveLimit() {
      this.$message.success('保存成功')
    },
  },
}
</script>

<style lang="scss" scoped>
.contentBox {
  border: 0.5px solid #dee2e6;
  margin: 10px;
  padding: 15px;
  .unit {
    margin-left: 10px;
    font-size: 13px;
  }
}
.btnBox {
  margin: 20px 10px 10px 10px;
}
</style>
