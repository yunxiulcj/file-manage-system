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
            <message-item></message-item>
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
          label: '其他',
          value: '5',
        },
      ],
    }
  },
  created() {},
  methods: {
    MarkRead() {
      this.unread = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  background: #f5f5f5;
  .tabBox {
    width: 80%;
    margin-top: 18px;
    background: white;
    box-shadow: 0px 2px 2px 2px #d9d9d9;
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
