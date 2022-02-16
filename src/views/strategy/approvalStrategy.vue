<template>
  <div class="box">
    <page-frame :title="$t('cs_strategy.cs_1')" icon="approvalStrategy">
      <template #headBtn>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="newStrategy"
          v-show="!showNewStrategy"
        >
          {{ $t('cs_common.cs_83') }}
        </el-button>
      </template>
      <div class="strategyWrap" v-if="!showNewStrategy">
        <div class="tips">{{ $t('cs_strategy.cs_2') }}</div>
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
            <span>{{ $t('cs_common.cs_1') }}</span>
          </div>
        </div>
        <div class="content">
          <el-form
            ref="form"
            label-width="100px"
            label-position="right"
            size="small"
          >
            <el-form-item :label="$t('cs_strategy.cs_3')">
              <el-input
                v-model="formObj.strategyName"
                :placeholder="$t('cs_strategy.cs_4')"
                @blur="strategyNameExists"
                style="width: 335px"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('cs_strategy.cs_5')">
              <scope-select
                v-model="showScope"
                @fullPath="fullPath"
                :setPath="setPath"
                size="small"
                width="335px"
              ></scope-select>
            </el-form-item>
            <el-form-item :label="$t('cs_common.cs_7')">
              <div class="approvalWrap">
                <div
                  class="approval"
                  v-for="(item, index) in formObj.approvalList"
                  :key="index"
                >
                  <div
                    class="approvalBox"
                    v-if="item.type == 1"
                    :title="$t('cs_common.cs_84')"
                    @mouseenter="setShowEdit(item)"
                    @mouseleave="setHideEdit(item)"
                    @click="editApproval(item, index)"
                  >
                    <div
                      class="del"
                      v-if="item.showEdit"
                      @click.stop="delApproval(index)"
                    >
                      <i class="el-icon-close"></i>
                    </div>
                    <div class="edit">
                      <i
                        class="el-icon-arrow-right"
                        :style="{
                          color: item.showEdit ? '#228be6' : '#bfbfbf',
                        }"
                      ></i>
                    </div>
                    <div class="itemWrap">
                      {{ approvalType[item.type]
                      }}{{ approvalMode[item.superior.approvalType] }}
                      ：
                      <div class="itemBox">
                        <div class="itemName">
                          {{ levelObj[item.superior.level] }}
                        </div>
                      </div>
                    </div>
                    <div class="approvalMode"></div>
                  </div>
                  <div
                    class="approvalBox"
                    v-if="item.type == 2"
                    :title="$t('cs_common.cs_84')"
                    @mouseenter="setShowEdit(item)"
                    @mouseleave="setHideEdit(item)"
                    @click="editApproval(item, index)"
                  >
                    <div
                      class="del"
                      v-if="item.showEdit"
                      @click.stop="delApproval(index)"
                    >
                      <i class="el-icon-close"></i>
                    </div>
                    <div class="edit">
                      <i
                        class="el-icon-arrow-right"
                        :style="{
                          color: item.showEdit ? '#228be6' : '#bfbfbf',
                        }"
                      ></i>
                    </div>

                    <div class="itemWrap">
                      {{ approvalType[item.type]
                      }}{{ approvalMode[item.member.approvalType] }}
                      ：
                      <div
                        class="itemBox"
                        v-for="(user, userIndex) in item.member.userList"
                        :key="user.index"
                      >
                        <div class="itemName">
                          {{ user.userId }}
                          <span
                            v-if="userIndex != item.member.userList.length - 1"
                          >
                            、
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="approvalMode"></div>
                  </div>
                  <div
                    class="approvalBox"
                    v-if="item.type == 3"
                    title="$t('cs_common.cs_84')"
                    @mouseenter="setShowEdit(item)"
                    @mouseleave="setHideEdit(item)"
                    @click="editApproval(item, index)"
                  >
                    <div
                      class="del"
                      v-if="item.showEdit"
                      @click.stop="delApproval(index)"
                    >
                      <i class="el-icon-close"></i>
                    </div>
                    <div
                      class="edit"
                      :style="{ color: item.showEdit ? '#228be6' : '#bfbfbf' }"
                    >
                      <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="itemWrap">
                      <div class="itemBox">
                        <div class="itemName">{{ $t('cs_common.cs_85') }}</div>
                      </div>
                    </div>
                    <div class="approvalMode"></div>
                  </div>
                </div>
                <div class="addBox" @click="clickAddBox(-1)">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button type="primary" size="small" @click="saveNewOrEdit">
            {{ $t('cs_common.cs_86') }}
          </el-button>
          <el-button type="info" size="small" @click="cancelCreate">
            {{ $t('cs_common.cs_10') }}
          </el-button>
        </div>
      </div>
    </page-frame>
    <new-approval
      ref="newApproval"
      v-model="showNewApproval"
      :editOrNew="editOrNew"
      @addApproval="addApproval"
    ></new-approval>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import strategyItem from './components/strategyItem.vue'
import newApproval from './components/newApproval.vue'
import scopeSelect from './components/scopeSelect.vue'
import { clone } from '../../utils/obj-operation'

export default {
  name: 'approvalStrategy',
  components: { pageFrame, strategyItem, newApproval, scopeSelect },
  data() {
    return {
      setPath: '',
      editIndex: -1,
      showEdit: false,
      rows: 14,
      showScope: '',
      loading: false,
      isCreate: false,
      showNewStrategy: false,
      showNewApproval: false,
      newOrEditTitle: '',
      approvalType: {
        1: this.$t('cs_common.cs_87'),
        2: this.$t('cs_common.cs_88'),
        3: this.$t('cs_common.cs_85'),
      },
      approvalMode: {
        1: this.$t('cs_common.cs_17'),
        2: this.$t('cs_common.cs_18'),
        3: this.$t('cs_common.cs_19'),
      },
      levelObj: {
        1: this.$t('cs_common.cs_20'),
        2: this.$t('cs_common.cs_21'),
        3: this.$t('cs_common.cs_22'),
        4: this.$t('cs_common.cs_23'),
        5: this.$t('cs_common.cs_24'),
        6: this.$t('cs_common.cs_25'),
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
              defaultApprovalUser: '',
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
      editOrNew: 0,
      createIndex: -1,
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
      this.formObj.scope = val
    },
    selectUser(val) {
      this.formObj.ccList = val.map((item) => {
        return item.name
      })
    },
    strategyNameExists() {
      if (this.formObj.strategyName) {
        this.$http('strategyNameExists', {
          id: this.formObj.id,
          strategyName: this.formObj.strategyName,
        }).then((res) => {
          if (res.data) {
            this.$message.warning(this.$t('cs_common.cs_89'))
            this.nameUsed = true
          } else {
            this.nameUsed = false
          }
        })
      }
    },
    newStrategy() {
      this.newOrEditTitle = this.$t('cs_common.cs_83')
      this.isCreate = true
      this.showScope = ''
      this.formObj.strategyType = 1
      this.formObj.scope = ''
      this.formObj.strategyName = ''
      this.formObj.ccList = []
      this.formObj.approvalList = []
      this.formObj.id = null
      this.showNewStrategy = true
    },
    passSignal(val, data) {
      this.isCreate = false
      this.setPath = data.scope
      this.showNewStrategy = val
      this.showScope = data.scope.split(',')[0].substring(3)
      this.newOrEditTitle = this.$t('cs_strategy.cs_6')
      data['strategyType'] = 1
      this.formObj = clone(data)
    },
    operation(val) {
      if (val) {
        this.getData()
      }
    },
    alterOrder(index, data, type) {
      let temp = clone(data)
      if (type == 1) {
        this.$set(this.formObj.approvalList[index])
        this.formObj.approvalList[index] = clone(
          this.formObj.approvalList[index + 1]
        )
        this.formObj.approvalList[index + 1] = temp
      } else {
        this.formObj.approvalList[index] = clone(
          this.formObj.approvalList[index - 1]
        )
        this.formObj.approvalList[index - 1] = temp
      }
    },
    addApproval(val, type) {
      let temp = clone(val)
      if (type == 2) {
        if (this.createIndex != -1) {
          this.formObj.approvalList.splice(this.createIndex + 1, 0, temp)
        } else {
          this.formObj.approvalList.push(temp)
        }
      } else {
        if (temp.type == 1) {
          if (!this.formObj.approvalList[this.editIndex].superior) {
            this.formObj.approvalList[this.editIndex].superior = {}
          }
          this.$set(this.formObj.approvalList[this.editIndex], 'type', 1)
          this.$set(
            this.formObj.approvalList[this.editIndex].superior,
            'levelType',
            temp.superior.levelType
          )
          this.$set(
            this.formObj.approvalList[this.editIndex].superior,
            'level',
            temp.superior.level
          )
          this.$set(
            this.formObj.approvalList[this.editIndex].superior,
            'noSuperior',
            temp.superior.noSuperior
          )
          this.$set(
            this.formObj.approvalList[this.editIndex].superior,
            'approvalType',
            temp.superior.approvalType
          )
          this.$set(
            this.formObj.approvalList[this.editIndex].superior,
            'defaultApprovalUser',
            temp.superior.defaultApprovalUser
          )
        } else if (temp.type == 2) {
          if (!this.formObj.approvalList[this.editIndex].member) {
            this.formObj.approvalList[this.editIndex].member = {}
          }
          this.$set(this.formObj.approvalList[this.editIndex], 'type', 2)
          this.$set(
            this.formObj.approvalList[this.editIndex].member,
            'approvalType',
            temp.member.approvalType
          )
          this.$set(
            this.formObj.approvalList[this.editIndex].member,
            'userList',
            temp.member.userList
          )
        } else {
          this.$set(this.formObj.approvalList[this.editIndex], 'type', 3)
        }
      }
    },
    saveNewOrEdit() {
      if (!this.nameUsed) {
        let url = this.isCreate ? 'createStrategy' : 'updateStrategy'
        this.$http(url, this.formObj)
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.showNewStrategy = false
            this.getData()
          })
      } else {
        this.$message.warning(this.$t('cs_common.cs_89'))
      }
    },
    cancelCreate() {
      this.showNewStrategy = false
      this.getData()
    },
    setShowEdit(data) {
      this.$set(data, 'showEdit', true)
    },
    setHideEdit(data) {
      this.$set(data, 'showEdit', false)
    },
    delApproval(index) {
      this.formObj.approvalList.splice(index, 1)
    },
    editApproval(data, index) {
      let userInfo
      this.editIndex = index
      this.editOrNew = 1
      if (data.type == 1) {
        userInfo = data.superior
      } else if (data.type == 2) {
        userInfo = data.member
      }
      this.$refs['newApproval'].initEdit(data.type, userInfo)
      this.showNewApproval = true
    },
    clickAddBox(index) {
      this.$refs['newApproval'].initData(1)
      this.createIndex = index
      this.showNewApproval = true
      this.editOrNew = 2
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
        z-index: 99;
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
      .approvalWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 380px;
        .approval {
          width: 358px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .approvalBox {
            position: relative;
            width: 346px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            margin: 7px 0px;
            border: 0.5px solid #d9d9d9;
            border-radius: 5px;
            padding: 15px;
            .itemWrap {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              .itemName {
                color: #595959;
                height: 28px;
                line-height: 28px;
                font-size: 14px;
              }
            }
            .moveItem {
              position: absolute;
              right: 30%;
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              right: 48%;
              background: white;
              border: 0.5px solid #ced4da;
              border-radius: 50%;
            }
            .top {
              top: -12px;
            }
            .down {
              bottom: -12px;
            }
            .del {
              position: absolute;
              right: 3px;
              top: -5px;
              color: #bfbfbf;
              font-size: 18px;
              cursor: pointer;
            }
            .del:hover {
              color: #434343;
            }
            .edit {
              position: absolute;
              right: 2px;
              top: 30%;
              font-weight: bolder;
              font-size: 18px;
            }
            .itemWrap {
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
          .approvalBox:hover {
            background: #e7f5ff;
            border: 1px solid #228be6;
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
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #b0bec5;
  margin-right: 10px;
  cursor: pointer;
  i {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
}
.addBox:hover {
  background: #78909c;
}
</style>
