<template>
  <div class="pageBox">
    <el-header style="height: 25px; line-height: 25px">
      <i :class="'iconfont icon-' + icon"></i>
      <span class="title">{{ title }}</span>
    </el-header>
    <el-divider></el-divider>
    <el-container>
      <el-aside
        v-if="aside"
        width="185px"
        style="border-right: 0.5px solid #d9d9d9"
      >
        <slot name="aside"></slot>
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'pageFrame',
  props: ['aside', 'title', 'icon'],
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style scoped>
.pageBox {
  width: 100%;
  height: 100%;
}
.title {
  margin-left: 15px;
}
.iconfont {
  font-size: 24px;
  font-weight: 400;
}
.el-header {
  font-size: 15px;
  font-weight: 700;
  color: #1890ff;
  padding: 0px 0px 0px 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
}
.el-container {
  height: calc(100% - 40px);
  width: 100%;
}
.el-divider {
  background-color: #d9d9d9;
}
.el-divider--horizontal {
  margin: 8px 0px 0px 0px;
}
</style>
