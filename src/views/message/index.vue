<template>
  <div class="box">
    <div class="tabBox">
      <div class="filter">
        <el-button
          type="text"
          style="font-weight: 600; margin-right: 20px"
          @click="MarkRead"
          v-show="activeName == 2"
        >
          全部标记为已读
        </el-button>
        <el-select v-model="filterTime" size="mini">
          <el-option
            v-for="item in timeRange"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="全部消息" name="1">
          <div class="itemWrap">
            <message-item :messageList="messageList"></message-item>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">
            未读消息
            <el-badge
              :value="unread"
              :hidden="unread <= 0"
              type="primary"
              class="item"
            ></el-badge>
          </span>
        </el-tab-pane>
        <el-tab-pane label="已读消息" name="3"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import messageItem from './components/messageItem.vue'
export default {
  name: 'message',
  components: { messageItem },
  data() {
    return {
      unread: 123,
      activeName: '1',
      filterTime: '1',
      timeRange: [
        {
          label: '最近七天',
          value: '1',
        },
        {
          label: '最近十五天',
          value: '2',
        },
        {
          label: '最近一个月',
          value: '3',
        },
        {
          label: '最近三个月',
          value: '4',
        },
        {
          label: '全部时间',
          value: '5',
        },
      ],
      messageList: [
        {
          id: 1,
          applyType: '1',
          state: '1',
          isRead: true,
          files: [
            {
              fileName: '好东西.txt',
              fileSize: '12kb',
              filePath: '',
            },
          ],
          invalidDay: '2',
          approver: 'approver',
          describe: '测试啊这是3',
          title: '用户chenyue进行了公网上传申请',
          invalidStartDate: '2020-1-12 02:02:02',
          invalidEndDate: '2021-12-12 12:12:12',
          applyUser: 'applyUser',
          receiver: 'receiver',
          receiverEmail: '123@cc.com',
          receiverTel: '14234325433',
          receiverCompany: '天天摸鱼3',
          applyEmail: '321@aa.com',
          applyTel: '153245431332',
        },
        {
          id: 2,
          applyType: 2,
          state: 2,
          isRead: false,
          files: [
            {
              fileName: '好东西2.txt',
              fileIcon: '',
              fileSize: '12kb',
              fileLevel: '2',
            },
          ],
          invalidDay: '3',
          approver: 'approver',
          describe: '测试啊这是2',
          title: '管理员Matt同意了您外发文件的申请',
          invalidStartDate: '2020-1-12 02:02:02',
          invalidEndDate: '2021-12-12 12:12:12',
          applyUser: 'applyUser',
          receiver: 'receiver',
          receiverEmail: '123@cc.com',
          receiverTel: '14234325433',
          receiverCompany: '天天摸鱼2',
          applyEmail: '321@aa.com',
          applyTel: '153245431332',
        },
        {
          id: 3,
          applyType: 3,
          state: 1,
          isRead: false,
          files: [
            {
              fileName: '好东西1.txt',
              fileIcon: '',
              fileSize: '232kb',
              fileLevel: '1',
            },
            {
              fileName: '好东西2.txt',
              fileIcon: '',
              fileSize: '123kb',
              fileLevel: '2',
            },
            {
              fileName: '好东西3.txt',
              fileIcon: '',
              fileSize: '12kb',
              fileLevel: '3',
            },
            {
              fileName: '好东西4.txt',
              fileIcon: '',
              fileSize: '122kb',
              fileLevel: '1',
            },
            {
              fileName: '好东西5.txt',
              fileIcon: '',
              fileSize: '12kb',
              fileLevel: '2',
            },
          ],
          invalidDay: '5',
          approver: 'approver',
          describe: '测试啊这是1',
          title: '管理员Matt 拒绝了您文件下载的申请',
          invalidStartDate: '2020-1-12 02:02:02',
          invalidEndDate: '2021-12-12 12:12:12',
          applyUser: 'applyUser',
          receiver: 'receiver',
          receiverEmail: '123@cc.com',
          receiverTel: '14234325433',
          receiverCompany: '天天摸鱼1',
          applyEmail: '321@aa.com',
          applyTel: '153245431332',
        },
      ],
    }
  },
  watch: {
    activeName: {
      handler(val) {
        console.log(val)
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    MarkRead() {
      this.unread = 0
    },
    getUserUnreadNoticeNum() {
      this.$http('getUserUnreadNoticeNum').then((res) => {
        this.unread = res.data
      })
    },
    getNoticeList() {
      this.$http('getNoticeList', { noticeType: this.activeName }).then(
        (res) => {
          if (res.data) {
            this.messageList = res.data
          }
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  background: #f0f0f0;
  height: calc(100% + 18px);
  .tabBox {
    width: 80%;
    height: calc(100% - 35px);
    margin-top: 18px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    position: relative;
    .filter {
      position: absolute;
      top: 0px;
      right: 5px;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      font-weight: 600;
      z-index: 99;
    }
  }
}
.item {
  position: relative;
}
.itemWrap {
  height: calc(100vh - 170px);
  width: 100%;
}
</style>
