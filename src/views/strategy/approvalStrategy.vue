<template>
  <div class="box">
    <page-frame title="审批策略" icon="approvalStrategy">
      <template #headBtn>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="newStrategy"
          v-show="!showNewStrategy"
        >
          新建策略
        </el-button>
      </template>
      <div class="strategyWrap" v-if="!showNewStrategy">
        <div class="tips">提示：优先匹配排序靠前的审批流程</div>
        <strategy-item
          v-if="!loading"
          :strategyList="strategyList"
          @passSignal="passSignal"
          @operation="operation"
        ></strategy-item>
        <div v-else style="margin-top: 15px">
          <el-skeleton :rows="rows" variant="rect" animated />
        </div>
      </div>
      <!-- 新建或编辑策略 -->
      <div class="newOrEditWrap" v-else>
        <div class="header">
          <div class="title">{{ newOrEditTitle }}</div>
          <div class="goBack" @click="showNewStrategy = false">
            <i class="el-icon-back"></i>
            <span>返回上一级</span>
          </div>
        </div>
        <div class="content">
          <el-form
            ref="form"
            label-width="100px"
            label-position="right"
            size="small"
          >
            <el-form-item label="策略名称">
              <el-input
                v-model="formObj.strategyName"
                placeholder="请输入策略名称"
                @blur="strategyNameExists"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="应用范围">
              <scope-select
                v-model="showScope"
                @fullPath="fullPath"
                size="small"
                width="300px"
              ></scope-select>
            </el-form-item>
            <el-form-item label="审批人">
              <div class="approval">
                <div
                  class="approvalWrap"
                  v-for="(item, index) in formObj.approvalList"
                  :key="index"
                >
                  <div class="superior" v-if="item.type == 1">
                    <div class="approvalBox">
                      <div class="iconBox">
                        <i class="iconfont icon-yonghutianchong"></i>
                      </div>
                      <span>{{ levelObj[item.superior.level] }}</span>
                      <span>
                        （{{ approvalMode[item.superior.approvalType] }}）
                      </span>
                    </div>
                  </div>
                  <div class="member" v-if="item.type == 2">
                    <div class="memberWrap">
                      <div class="content">
                        <template v-for="user in item.member.userList">
                          <div class="memberBox" :key="user.index">
                            <div class="iconBox">
                              <i class="iconfont icon-yonghutianchong"></i>
                            </div>
                            <span>{{ user.userId }}</span>
                          </div>
                        </template>
                      </div>
                      <!-- <div class="addBox" @click="showNewApproval = true">
                        <i class="el-icon-plus"></i>
                      </div> -->
                    </div>
                    <div class="memType">
                      （{{ approvalMode[item.member.approvalType] }}）
                    </div>
                  </div>
                  <div class="iAm" v-if="item.type == 3">
                    <div class="approvalBox">
                      <div class="iconBox">
                        <i class="iconfont icon-yonghutianchong"></i>
                      </div>
                      <span>申请人本人</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="addBox" @click="showNewApproval = true">
                <i class="el-icon-plus"></i>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button type="primary" size="small" @click="saveNewOrEdit">
            保存
          </el-button>
          <el-button type="info" size="small" @click="showNewStrategy = false">
            取消
          </el-button>
        </div>
      </div>
    </page-frame>
    <new-approval
      v-model="showNewApproval"
      :formObj="formObj"
      @addApproval="addApproval"
    ></new-approval>
    <new-cc v-model="showNewCc" @selectUser="selectUser"></new-cc>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import strategyItem from './components/strategyItem.vue'
import newApproval from './components/newApproval.vue'
import newCc from './components/newCc.vue'
import scopeSelect from './components/scopeSelect.vue'

export default {
  name: 'approvalStrategy',
  components: { pageFrame, strategyItem, newApproval, newCc, scopeSelect },
  data() {
    return {
      rows: 14,
      showScope: '',
      loading: false,
      isCreate: false,
      showNewStrategy: false,
      showNewApproval: false,
      showNewCc: false,
      newOrEditTitle: '',
      approvalMode: {
        1: '会签',
        2: '或签',
        3: '依次审批',
      },
      levelObj: {
        1: '直接上级',
        2: '第二级上级',
        3: '第三级上级',
        4: '第四级上级',
        5: '第五级上级',
        6: '第六级上级',
      },
      formObj: {
        id: null,
        scope: '',
        strategyName: '',
        strategyType: 1,
        ccList: [],
        approvalList: [
          {
            superior: {
              levelType: 1,
              level: 1,
              noSuperior: false,
              approvalType: 1,
            },
            member: {
              approvalType: 1,
              userList: [],
            },
            type: 1,
          },
        ],
      },
      strategyList: [],
      nameUsed: false,
    }
  },
  mounted() {
    this.rows = Math.round((document.body.offsetHeight - 150) / 38)
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.$http('getApprovalStrategyList')
        .then((res) => {
          this.strategyList = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    fullPath(val) {
      console.log('dn', val)
      this.formObj.scope = val
    },
    selectUser(val) {
      this.formObj.ccList = val.map((item) => {
        return item.name
      })
    },
    strategyNameExists() {
      this.$http('strategyNameExists', {
        id: this.formObj.id,
        strategyName: this.formObj.strategyName,
      }).then((res) => {
        if (res.data) {
          this.$message.warning('该策略名称已存在')
          this.nameUsed = true
        } else {
          this.nameUsed = false
        }
      })
    },
    newStrategy() {
      this.newOrEditTitle = '新建策略'
      this.isCreate = true
      this.showScope = ''
      this.formObj.scope = ''
      this.formObj.strategyName = ''
      this.formObj.ccList = []
      this.formObj.approvalList = []
      this.formObj.id = null
      this.showNewStrategy = true
    },
    passSignal(val, data) {
      this.isCreate = false
      this.showNewStrategy = val
      this.newOrEditTitle = '编辑策略'
      this.formObj = data
    },
    operation(val) {
      if (val) {
        this.getData()
      }
    },
    addApproval(val) {
      this.formObj.approvalList.push(val)
    },
    saveNewOrEdit() {
      if (!this.nameUsed) {
        let url = this.isCreate ? 'createStrategy' : 'updateStrategy'
        console.log(url, this.formObj)
        this.$http(url, this.formObj)
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.showNewStrategy = false
            this.getData()
          })
      } else {
        this.$message.warning('该策略名称已存在')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  .strategyWrap {
    .tips {
      font-size: 13px;
      color: #868e96;
    }
  }
  .newOrEditWrap {
    .header {
      display: flex;
      flex-direction: row;
      height: 30px;
      line-height: 30px;
      margin: 15px 0px;
      border-left: 5px solid #228be6;
      padding-left: 10px;
      .title {
        color: #228be6;
        font-size: 17px;
      }
      .goBack {
        position: absolute;
        width: 100px;
        right: 40px;
        border: 0.5px solid #ced4da;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #868e96;
        cursor: pointer;
        i {
          font-size: 20px;
          width: 28px;
          text-align: center;
        }
        span {
          font-size: 13px;
        }
      }
      .goBack:hover {
        border: 0.5px solid #228be6;
        color: #228be6;
        background: #f8f9fa;
      }
    }
    .content {
      .approval {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 60%;
        flex-wrap: wrap;
        .approvalWrap {
          .superior {
            .approvalBox {
              display: flex;
              flex-direction: column;
              width: 60px;
              align-items: center;
              .iconBox {
                background: #bdccea;
                width: 40px;
                height: 40px;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                  font-size: 30px;
                  color: #fcfcfc;
                }
              }
              span {
                color: #343a40;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
              }
            }
          }
          .member {
            .memberWrap {
              display: flex;
              flex-direction: row;
              align-items: center;
              .content {
                display: flex;
                flex-direction: row;
                max-height: 152px;
                overflow: auto;
                border: 0.5px solid #d9d9d9;
                border-radius: 5px;
                width: 300px;
                padding-bottom: 10px;
                .memberBox {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin: 15px 0px 0px 16px;
                  .iconBox {
                    background: #bdccea;
                    width: 40px;
                    height: 40px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 5px;
                    i {
                      font-size: 30px;
                      color: #fcfcfc;
                    }
                  }
                  span {
                    color: #343a40;
                    height: 20px;
                    line-height: 20px;
                    font-size: 13px;
                  }
                }
              }
            }
            .memType {
              width: 300px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              color: #343a40;
              font-size: 12px;
            }
          }
          .iAm {
            .approvalBox {
              display: flex;
              flex-direction: column;
              width: 60px;
              align-items: center;
              .iconBox {
                background: #bdccea;
                width: 40px;
                height: 40px;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                  font-size: 30px;
                  color: #fcfcfc;
                }
              }
              span {
                color: #343a40;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    .footer {
      padding-left: 40px;
      margin-top: 40px;
    }
  }
}
.addBox {
  width: 35px;
  height: 35px;
  line-height: 35px;
  border: 1.5px dotted #d9d9d9;
  border-radius: 5px;
  text-align: center;
  color: #ced4da;
  cursor: pointer;
  i {
    font-size: 18px;
    font-weight: bold;
  }
}
.addBox:hover {
  border: 1px solid #228be6;
  color: #228be6;
}
</style>
