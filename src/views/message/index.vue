<template>
  <div class="box">
    <div class="tabBox">
      <div class="filter">
        <el-button
          type="text"
          style="font-weight: 600; margin-right: 20px"
          @click="MarkRead"
          v-show="activeName == 0 || activeName == 2"
        >
          {{ $t('cs_message.cs_11') }}
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
        <el-tab-pane :label="$t('cs_message.cs_12')" name="2">
          <div
            class="itemWrap"
            v-if="!showEmply"
            v-loading="loading"
            :element-loading-text="$t('cs_common.cs_56')"
          >
            <message-item
              :messageList="messageList"
              @updateList="updateList"
            ></message-item>
          </div>
          <el-empty v-else :description="$t('cs_common.cs_57')"></el-empty>
        </el-tab-pane>
        <el-tab-pane name="0">
          <span slot="label">
            {{ $t('cs_message.cs_13') }}
            <el-badge
              :value="unread"
              :hidden="unread <= 0"
              type="primary"
              class="item"
            ></el-badge>
          </span>
          <div
            class="itemWrap"
            v-if="!showEmply"
            v-loading="loading"
            :element-loading-text="$t('cs_common.cs_56')"
          >
            <message-item
              :messageList="messageList"
              @updateList="updateList"
            ></message-item>
          </div>
          <el-empty v-else :description="$t('cs_common.cs_57')"></el-empty>
        </el-tab-pane>
        <el-tab-pane :label="$t('cs_message.cs_14')" name="1">
          <div
            class="itemWrap"
            v-if="!showEmply"
            v-loading="loading"
            :element-loading-text="$t('cs_common.cs_56')"
          >
            <message-item :messageList="messageList"></message-item>
          </div>
          <el-empty v-else :description="$t('cs_common.cs_57')"></el-empty>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import messageItem from './components/messageItem.vue'
import moment from 'moment'
import { unitSetUp } from '../../utils/obj-operation'
export default {
  name: 'message',
  components: { messageItem },
  data() {
    return {
      unread: 0,
      activeName: '2',
      loading: false,
      filterTime: 1,
      timeRange: [
        {
          label: this.$t('cs_message.cs_15'),
          value: 1,
        },
        {
          label: this.$t('cs_message.cs_16'),
          value: 2,
        },
        {
          label: this.$t('cs_common.cs_58'),
          value: 3,
        },
        {
          label: this.$t('cs_common.cs_59'),
          value: 4,
        },
      ],
      messageList: [],
      showEmply: false,
    }
  },
  watch: {
    activeName: {
      handler(val) {
        this.messageList = []
        this.getNoticeList(val)
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.getUserUnreadNoticeNum()
  },
  methods: {
    updateList(val) {
      if (val) {
        this.getNoticeList(this.activeName)
        this.getUserUnreadNoticeNum()
      }
    },
    MarkRead() {
      let idList = this.messageList.map((item) => {
        return item.id
      })
      this.$http('setNoticeRead', { noticeIdList: idList })
        .then((res) => {
          this.$message.success(res.errMsg)
        })
        .finally(() => {
          this.getNoticeList(this.activeName)
          this.getUserUnreadNoticeNum()
        })
    },
    getUserUnreadNoticeNum() {
      this.$http('getUserUnreadNoticeNum').then((res) => {
        this.unread = res.data
      })
    },
    getNoticeList(type) {
      this.loading = true
      this.showEmply = false
      let startTime = '',
        endTime = ''
      switch (this.filterTime) {
        case 1:
          startTime = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
          endTime = moment().format('YYYY-MM-DD HH:mm:ss')
          break
        case 2:
          startTime = moment()
            .subtract(15, 'days')
            .format('YYYY-MM-DD HH:mm:ss')
          endTime = moment().format('YYYY-MM-DD HH:mm:ss')
          break
        case 3:
          startTime = moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD HH:mm:ss')
          endTime = moment().format('YYYY-MM-DD HH:mm:ss')
          break
        case 4:
          startTime = moment()
            .subtract(90, 'days')
            .format('YYYY-MM-DD HH:mm:ss')
          endTime = moment().format('YYYY-MM-DD HH:mm:ss')
          break
        default:
          break
      }
      this.$http('getNoticeList', {
        noticeType: type,
        startTime: startTime,
        endTime: endTime,
      })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            res.data.map((item) => {
              item.attachmentList.map((file) => {
                file['fileSize'] = unitSetUp(file.fileSize)
              })
            })
            this.showEmply = false
            this.messageList = res.data
          } else {
            this.messageList = []
            this.showEmply = true
          }
        })
        .finally(() => {
          this.loading = false
        })
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
