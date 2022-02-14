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
          <el-menu-item
            :key="item.name"
            :index="item.path"
            v-if="!item.hidden"
            class="meauName"
          >
            {{ $t(item.meta.i18nTitle) }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="accountBox">
      <el-dropdown @command="handleCommand">
        <span
          type="primary"
          plain
          size="mini"
          round
          style="color: white"
          class="el-dropdown-link"
        >
          {{ $t('cs_menu.cs_19') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="account">{{ $t('cs_common.cs_98') + '：' + account }}</span>
      <i
        class="iconfont icon-logout"
        :title="$t('cs_frame.cs_2')"
        @click="logout"
      ></i>
    </div>
  </div>
</template>

<script>
import { listRouter } from '@/app/router/index.js'

export default {
  name: 'headMenu',
  components: {},
  data() {
    return {
      activeIndex: '',
      menuList: [],
      account: '',
    }
  },
  computed: {},
  created() {
    this.account = localStorage.getItem('username') || ''
    this.menuList = listRouter
    this.activeIndex = this.$route.path.substring(
      0,
      this.$route.path.lastIndexOf('/')
    )
  },
  methods: {
    logout() {
      this.$confirm(this.$t('cs_frame.cs_3'), this.$t('cs_common.cs_34'), {
        confirmButtonText: this.$t('cs_common.cs_35'),
        cancelButtonText: this.$t('cs_common.cs_10'),
        type: 'info',
        center: true,
      }).then(() => {
        this.$http('logout', { userId: this.account })
          .then((res) => {
            this.$message.success(res.errMsg)
          })
          .finally(() => {
            this.$router.push({ path: '/login', replace: true })
          })
      })
    },
    handleCommand(val) {
      this.$i18n.locale = val
      localStorage.setItem('language', val)
      location.reload()
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
  width: 200px;
  height: 60px;
}
.menuBox {
  background: #d3f261;
  height: 60px;
  min-width: 600px;
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
  margin: 0px 35px;
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
