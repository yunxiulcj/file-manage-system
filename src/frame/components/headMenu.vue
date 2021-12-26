<template>
  <div class="box">
    <div class="logoBox"></div>
    <div class="menuBox">
      <el-menu
        :default-active="activeIndex"
        background-color="#096dd9"
        text-color="#fff"
        active-text-color="#e88b00"
        mode="horizontal"
        router
      >
        <template v-for="item in menuList">
          <el-menu-item :key="item.name" :index="item.path">
            {{ item.meta.title }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="accountBox">
      <span class="account">用户：{{ account }}</span>
      <i class="iconfont icon-logout" title="注销" @click="logout"></i>
    </div>
  </div>
</template>

<script>
import { defaultRouter } from '@/app/router/index.js'

export default {
  name: 'headMenu',
  components: {},
  data() {
    return {
      activeIndex: '',
      menuList: [],
      account: 'admin01',
    }
  },
  computed: {},
  created() {
    this.menuList = defaultRouter
    this.activeIndex = defaultRouter[0].path
  },
  methods: {
    logout() {
      console.log('logout')
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  width: 100%;
  height: 100%;
  background: #096dd9;
  display: flex;
  flex-direction: row;
}
.logoBox {
  background: #096dd9;
  background-image: url('../../assets/img/page/logo_head.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 110px 35px;
  width: 195px;
  height: 60px;
}
.menuBox {
  background: #d3f261;
  height: 60px;
  width: 600px;
}
.accountBox {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  right: 20px;
  height: 60px;
  line-height: 60px;
  color: white;
  font-size: 14px;
}
.account {
  margin-right: 35px;
}
.icon-logout {
  color: #bfbfbf;
  font-size: 25px;
  cursor: pointer;
}
.icon-logout:hover {
  color: white;
}
</style>
