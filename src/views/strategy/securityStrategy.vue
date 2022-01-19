<template>
  <div class="box">
    <page-frame title="安全策略" icon="securityStrategy" :aside="true">
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
      <div class="pass showItem" v-if="menu == 'passwordPolicy'">
        <div class="contentBox">
          <el-form size="small" label-width="200px" label-position="left">
            <el-form-item>
              <span slot="label" style="color: #228be6; font-size: 16px">
                密码策略
              </span>
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
            <el-form-item>
              <span slot="label" style="color: #228be6; font-size: 16px">
                登录策略
              </span>
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
        <div class="contentBox">
          <div class="limitStrategy">
            <span style="color: #228be6; font-size: 16px; margin-right: 30px">
              登录限制策略
            </span>
            <el-switch
              v-model="limitForm.isOpen"
              active-color="#228be6"
              inactive-color="#adb5bd"
            ></el-switch>
          </div>

          <div class="limitTitle">
            黑名单
            <span class="limitTips">（无权登录文档管理系统的用户/用户组）</span>
          </div>
          <el-input
            v-model="limitStr"
            size="small"
            style="width: 365px; margin-right: 12px"
            clearable
            placeholder="请输入添加到黑名单的用户或用户组名称"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click="addBlacklist(limitStr)"
          >
            添加
          </el-button>
          <div class="limitListTitle">
            当前已设置的黑名单用户和用户组列表
            <span class="limitListTips">
              （
              <span class="limitListUser">
                <i class="iconfont icon-yonghutianchong"></i>
                用户
              </span>
              <span class="limitListUserGroup">
                <i class="iconfont icon-huaban"></i>
                用户组
              </span>
              ）
            </span>
          </div>
          <div class="limitListBox">
            <div class="limitList">
              <el-checkbox-group v-model="limitDelList">
                <el-checkbox
                  v-for="item in limitForm.userList"
                  :key="item.userId"
                  :label="item.userId"
                >
                  <div class="checkBox">
                    <span>
                      <i
                        class="iconfont icon-yonghutianchong"
                        v-if="!item.isUserGroup"
                      ></i>
                      <i class="iconfont icon-huaban" v-else></i>
                    </span>
                    {{ item.userId }}
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="delBtn">
              <el-button
                type="danger"
                size="small"
                @click="delBlacklist(limitDelList)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
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
      menu: 'limitStrategy',
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
      limitDelList: [],
      limitForm: {
        isOpen: false,
        userList: [],
      },
    }
  },
  watch: {
    menu: {
      immediate: true,
      handler(val) {
        if (val == 'limitStrategy') {
          this.$http('getLoginStrategy').then((res) => {
            this.limitForm = res.data
          })
        }
      },
    },
  },
  methods: {
    savePass() {
      this.$message.success('保存成功')
    },
    saveLogin() {
      this.$message.success('保存成功')
    },
    saveLimit() {
      this.$http('setLoginStrategy', this.limitForm).then((res) => {
        this.$message.success(res.errMsg)
      })
    },
    addBlacklist(val) {
      if (val) {
        this.$http('checkUserIsGroup', { userId: val }).then((res) => {
          if (res.data && res.data != 3) {
            this.limitForm.userList.push({
              userId: val,
              isUserGroup: res.data == 1 ? false : true,
            })
          } else {
            this.$message.warning('该用户不存在')
          }
        })
      }
    },
    delBlacklist(val) {
      console.log(val)
      if (val && val.length > 0) {
        let temp = this.limitForm.userList.filter(
          (item) => val.indexOf(item.userId) < 0
        )
        this.limitForm.userList = temp
      }
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
  .limitStrategy {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
  }
  .limitTitle {
    padding-left: 12px;
    border-left: 5px solid #228be6;
    margin: 10px 0px;
    .limitTips {
      font-size: 13px;
      color: #868e96;
    }
  }
  .limitListTitle {
    font-size: 13px;
    height: 70px;
    line-height: 70px;
    .limitListUser {
      margin-right: 5px;
    }
  }
  .limitListBox {
    display: flex;
    flex-direction: row;
    .limitList {
      padding-left: 15px;
      width: 350px;
      max-height: 350px;
      overflow: auto;
      margin-right: 12px;
      border: 0.5px solid #dee2e6;
      .checkBox {
        margin: 5px;
      }
    }
  }
}
.btnBox {
  margin: 20px 10px 10px 10px;
}
.icon-yonghutianchong {
  font-size: 20px;
  color: #228be6;
}
.icon-huaban {
  font-size: 23px;
  color: #40c057;
}
</style>
