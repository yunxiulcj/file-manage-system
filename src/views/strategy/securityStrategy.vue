<template>
  <div class="box">
    <page-frame
      :title="$t('cs_strategy.cs_44')"
      icon="securityStrategy"
      :aside="true"
    >
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
      <div class="pass showItem" v-if="menu == 'passwordPolicy'">
        <div class="contentBox">
          <el-form size="small" label-width="200px" label-position="left">
            <el-form-item>
              <span slot="label" style="color: #228be6; font-size: 16px">
                {{ $t('cs_common.cs_95') }}
              </span>
              <el-switch
                v-model="passForm.passStrategy"
                active-color="#228be6"
                inactive-color="#adb5bd"
              ></el-switch>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_45')">
              <el-input-number
                v-model="passForm.passMin"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_46')">
              <el-input-number
                v-model="passForm.passUpper"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_47')">
              <el-input-number
                v-model="passForm.passSpecial"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_48')">
              <el-radio v-model="passForm.passOverdue" label="0">
                {{ $t('cs_strategy.cs_49') }}
              </el-radio>
              <el-radio v-model="passForm.passOverdue" label="1">
                {{ $t('cs_strategy.cs_50') }}
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
            {{ $t('cs_common.cs_86') }}
          </el-button>
        </div>
      </div>
      <div class="login showItem" v-if="menu == 'loginStrategy'">
        <div class="contentBox">
          <el-form size="small" label-width="170px" label-position="left">
            <el-form-item>
              <span slot="label" style="color: #228be6; font-size: 16px">
                {{ $t('cs_common.cs_96') }}
              </span>
              <el-switch
                v-model="loginForm.passStrategy"
                active-color="#228be6"
                inactive-color="#adb5bd"
              ></el-switch>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_51')">
              <el-input-number
                v-model="loginForm.lockNum"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
              <span class="unit">{{ $t('cs_common.cs_9') }}</span>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_52')">
              <el-input-number
                v-model="loginForm.lockTime"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
              <span class="unit">{{ $t('cs_strategy.cs_53') }}</span>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_54')">
              <el-input-number
                v-model="loginForm.logoutTime"
                controls-position="right"
                :min="0"
                :max="20"
              ></el-input-number>
              <span class="unit">{{ $t('cs_strategy.cs_55') }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="btnBox">
          <el-button type="primary" size="small" @click="saveLogin">
            {{ $t('cs_common.cs_86') }}
          </el-button>
        </div>
      </div>
      <div class="limit showItem" v-if="menu == 'limitStrategy'">
        <div class="contentBox">
          <div class="limitStrategy">
            <span style="color: #228be6; font-size: 16px; margin-right: 30px">
              {{ $t('cs_common.cs_97') }}
            </span>
            <el-switch
              v-model="limitForm.isOpen"
              active-color="#228be6"
              inactive-color="#adb5bd"
            ></el-switch>
          </div>

          <div class="limitTitle">
            {{ $t('cs_strategy.cs_56') }}
            <span class="limitTips">{{ $t('cs_strategy.cs_64') }}</span>
          </div>
          <el-input
            v-model="limitStr"
            size="small"
            style="width: 365px; margin-right: 12px"
            clearable
            :placeholder="$t('cs_strategy.cs_58')"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click="addBlacklist(limitStr)"
          >
            {{ $t('cs_strategy.cs_59') }}
          </el-button>
          <div class="limitListTitle">
            {{ $t('cs_strategy.cs_60') }}
            <span class="limitListTips">
              （
              <span class="limitListUser">
                <i class="iconfont icon-yonghutianchong"></i>
                {{ $t('cs_common.cs_98') }}
              </span>
              <span class="limitListUserGroup">
                <i class="iconfont icon-huaban"></i>
                {{ $t('cs_strategy.cs_61') }}
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
                {{ $t('cs_common.cs_51') }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="btnBox">
          <el-button type="primary" size="small" @click="saveLimit">
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
export default {
  name: 'securityStrategy',
  components: { pageFrame, miniMenu },
  data() {
    return {
      menu: 'limitStrategy',
      menuList: [
        {
          label: this.$t('cs_common.cs_95'),
          value: 'passwordPolicy',
        },
        {
          label: this.$t('cs_common.cs_96'),
          value: 'loginStrategy',
        },
        {
          label: this.$t('cs_common.cs_97'),
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
      this.$message.success(this.$t('cs_common.cs_99'))
    },
    saveLogin() {
      this.$message.success(this.$t('cs_common.cs_99'))
    },
    saveLimit() {
      this.$http('setLoginStrategy', this.limitForm).then((res) => {
        this.$message.success(res.errMsg)
      })
    },
    addBlacklist(val) {
      if (val) {
        let isExsit = false
        this.limitForm.userList.map((item) => {
          if (item.userId == val) {
            isExsit = true
          }
        })
        if (!isExsit) {
          this.$http('checkUserIsGroup', { userId: val }).then((res) => {
            if (res.data && res.data != 3) {
              this.limitForm.userList.push({
                userId: val,
                isUserGroup: res.data == 1 ? false : true,
              })
            } else {
              this.$message.warning(this.$t('cs_strategy.cs_62'))
            }
          })
        } else {
          this.$message.warning(val + this.$t('cs_strategy.cs_63'))
        }
      }
    },
    delBlacklist(val) {
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
