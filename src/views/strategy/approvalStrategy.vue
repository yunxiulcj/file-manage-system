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
          :strategyList="strategyList"
          @passSignal="passSignal"
        ></strategy-item>
      </div>
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
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="应用范围">
              <el-select
                v-model="formObj.scopeId"
                style="width: 300px"
              ></el-select>
            </el-form-item>
            <el-form-item label="审批人">
              <div class="addBox" @click="showNewApproval = true">
                <i class="el-icon-plus"></i>
              </div>
            </el-form-item>
            <el-form-item label="抄送人">
              <div class="addBox" @click="showNewCc = true">
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
    <new-approval v-model="showNewApproval"></new-approval>
    <new-cc v-model="showNewCc"></new-cc>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import strategyItem from './components/strategyItem.vue'
import newApproval from './components/newApproval.vue'
import newCc from './components/newCc.vue'

export default {
  name: 'approvalStrategy',
  components: { pageFrame, strategyItem, newApproval, newCc },
  data() {
    return {
      showNewStrategy: false,
      showNewApproval: false,
      showNewCc: false,
      newOrEditTitle: '',
      formObj: {
        strategyName: '',
        strategyType: 1,
        scopeId: '',
        ccList: [
          {
            ccUser: '',
          },
        ],
        id: '',
        superior: {
          levelType: 1,
          level: 1,
          noSuperior: false,
          approvalType: 1,
        },
        member: {
          userList: [
            {
              userId: '',
              index: '',
            },
          ],
          approvalType: 1,
        },
        type: 1,
      },
      strategyList: [
        {
          strategyName: '1文件下载审批流程1',
          strategyType: 1,
          scopeId: '根目录',
          ccList: ['test1', 'test2', 'test3'],
          id: '',
          superior: {
            levelType: 1,
            level: 1,
            noSuperior: false,
            approvalType: 1,
          },
          member: {
            userList: [
              {
                userId: 'test1',
                index: '1',
              },
              {
                userId: 'test2',
                index: '2',
              },
              {
                userId: 'test3',
                index: '3',
              },
              {
                userId: 'test4',
                index: '4',
              },
            ],
            approvalType: 2,
          },
          type: 2,
        },
        {
          strategyName: '2文件下载审批流程2',
          strategyType: 1,
          scopeId: '根目录',
          ccList: [
            'test1',
            'test2',
            'test3',
            'test11',
            'test22',
            'test33',
            'test12',
            'test21',
            'test32',
          ],
          id: '2',
          superior: {
            levelType: 1,
            level: 1,
            noSuperior: false,
            approvalType: 1,
          },
          member: {
            userList: [
              {
                userId: '',
                index: '',
              },
            ],
            approvalType: 2,
          },
          type: 1,
        },
        {
          strategyName: '2文件下载审批流程2',
          strategyType: 1,
          scopeId: '根目录',
          ccList: ['test1', 'test2'],
          id: '3',
          superior: {
            levelType: 1,
            level: 1,
            noSuperior: false,
            approvalType: 1,
          },
          member: {
            userList: [
              {
                userId: '',
                index: '',
              },
            ],
            approvalType: 2,
          },
          type: 3,
        },
      ],
    }
  },
  created() {},
  methods: {
    newStrategy() {
      console.log('new')
      this.newOrEditTitle = '新建策略'
      this.showNewStrategy = true
    },
    passSignal(val, data) {
      console.log('edit', val, data)
      this.showNewStrategy = val
      this.newOrEditTitle = '编辑策略'
      this.formObj = data
    },
    saveNewOrEdit() {
      this.showNewStrategy = false
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
      .addBox {
        width: 35px;
        height: 35px;
        line-height: 35px;
        border: 1px dotted #ced4da;
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
    }
    .footer {
      padding-left: 40px;
      margin-top: 40px;
    }
  }
}
</style>
