<template>
  <div class="itemBox" :key="testKey">
    <div
      class="strategyWrap"
      v-for="(item, index) in strategyList"
      :key="item.id"
    >
      <div class="strategyBox">
        <div class="topWrap">
          <div class="strategyName">
            {{ item.strategyName }}
          </div>
          <div class="operate">
            <i
              class="iconfont icon-bianji"
              title="编辑"
              @click="editItem(item)"
            ></i>
            <el-dropdown
              @command="handleCommand"
              @visible-change="visibleChange(item.id)"
            >
              <span>
                <i class="iconfont icon-gengduo"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item command="top" :disabled="index == 0">
                  置顶
                </el-dropdown-item>
                <el-dropdown-item command="up" :disabled="index == 0">
                  上移
                </el-dropdown-item>
                <el-dropdown-item
                  command="down"
                  :disabled="index == strategyList.length - 1"
                >
                  下移
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="contentWrap">
          <div class="condition">
            <div class="label">条件</div>
            <div class="content">
              <span>应用范围：</span>
              <span>{{ item.scope.split(',')[0].substring(3) }}</span>
            </div>
          </div>
          <div class="approval">
            <div class="label">审批人</div>
            <div class="approvalRound">
              <div
                class="approvalWrap"
                v-for="(approval, index1) in item.approvalList"
                :key="index1"
              >
                <div class="superior" v-if="approval.type == 1">
                  <div class="approvalBox">
                    <div class="iconBox">
                      <i class="iconfont icon-yonghutianchong"></i>
                    </div>
                    <span>{{ levelObj[approval.superior.level] }}</span>
                    <span>
                      （{{ approvalMode[approval.superior.approvalType] }}）
                    </span>
                  </div>
                </div>
                <div class="member" v-if="approval.type == 2">
                  <div class="content">
                    <div
                      v-for="user in approval.member.userList"
                      :key="user.index"
                    >
                      <el-tooltip placement="top">
                        <div slot="content">{{ user.userId }}</div>
                        <div class="memberBox">
                          <div class="iconBox">
                            <i class="iconfont icon-yonghutianchong"></i>
                          </div>
                          <span>{{ user.userId }}</span>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="memType">
                    （{{ approvalMode[approval.member.approvalType] }}）
                  </div>
                </div>
                <div class="iAm" v-if="approval.type == 3">
                  <div class="approvalBox">
                    <div class="iconBox">
                      <i class="iconfont icon-yonghutianchong"></i>
                    </div>
                    <span>申请人本人</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'strategyItem',
  props: {
    strategyList: Array,
  },
  data() {
    return {
      testKey: 0,
      operateId: 0,
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
    }
  },
  methods: {
    handleCommand(val) {
      switch (val) {
        case 'del':
          this.$http('deleteStrategy', { id: this.operateId }).then((res) => {
            this.$emit('operation', true)
            this.$message.success(res.errMsg)
          })
          break
        case 'top':
          this.$http('top', { id: this.operateId }).then((res) => {
            this.$emit('operation', true)
            this.$message.success(res.errMsg)
          })
          break
        case 'up':
        case 'down':
          this.$http('upOrDown', {
            id: this.operateId,
            isUp: val == 'up',
          }).then((res) => {
            this.$emit('operation', true)
            this.$message.success(res.errMsg)
          })
          break
      }
    },
    visibleChange(id) {
      this.operateId = id
    },
    editItem(data) {
      if (data.approvalList && data.approvalList.length > 0) {
        data.approvalList.map((item) => {
          if (item.type == 1) {
            item.member = {
              approvalType: 1,
              userList: [],
            }
          } else if (item.type == 2) {
            item.superior = {
              levelType: 1,
              level: 1,
              noSuperior: false,
              approvalType: 1,
            }
          }
        })
      }
      this.$emit('passSignal', true, data)
    },
  },
}
</script>

<style lang="scss" scoped>
.itemBox {
  position: relative;
  width: 100%;
  height: 100%;
  .strategyWrap {
    margin: 15px 5px;
    border: 0.5px solid #dee2e6;
    .topWrap {
      display: flex;
      height: 35px;
      line-height: 35px;
      flex-direction: row;
      border-bottom: 0.5px solid #dee2e6;
      .strategyName {
        padding-left: 12px;
        font-weight: bold;
        font-size: 15px;
        color: #343a40;
      }
      .operate {
        position: absolute;
        right: 15px;
        .iconfont {
          font-size: 22px;
          color: #868e96;
          cursor: pointer;
          margin-left: 8px;
        }
        .iconfont:hover {
          color: #495057;
        }
      }
    }
    .contentWrap {
      width: calc(100% - 40px);
      padding: 20px;
      font-size: 14px;
      .condition {
        display: flex;
        flex-direction: row;
        .label {
          width: 50px;
          color: #868e96;
          margin-right: 35px;
        }
        .content {
          color: #343a40;
        }
      }
      .approval {
        margin: 25px 0px;
        display: flex;
        flex-direction: row;
        .label {
          min-width: 50px;
          color: #868e96;
          margin-right: 25px;
        }
        .approvalRound {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .approvalWrap {
            display: flex;
            flex-direction: row;
            .superior {
              .approvalBox {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 0px 10px;
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
                  font-size: 12px;
                  margin: 1px 0px;
                }
              }
            }
            .member {
              display: flex;
              flex-direction: column;
              align-items: center;
              .content {
                display: flex;
                flex-direction: row;
                .memberBox {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 15px;
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
                    font-size: 13px;
                    width: 65px;
                    text-align: center;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
              }
              .memType {
                position: relative;
                left: -15px;
                color: #343a40;
                font-size: 12px;
              }
            }
            .iAm {
              .approvalBox {
                display: flex;
                flex-direction: column;
                align-items: center;
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
                  font-size: 12px;
                  margin: 1px 0px;
                }
              }
            }
          }
        }
      }
    }
  }
  .strategyWrap:hover {
    background: #f8f9fa;
  }
}
</style>
