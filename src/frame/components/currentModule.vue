<template>
  <div class="moduleBox">
    <div class="menuBox">
      <el-menu
        :default-active="activeIndex"
        text-color="#434343"
        mode="vertical"
        router
      >
        <template v-for="item in leftList[currentModule]">
          <el-menu-item :key="item.name" :index="item.path">
            <i :class="'iconfont icon-' + item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="contentBox">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { defaultRouter } from '@/app/router/index.js'

export default {
  name: 'currentModule',
  components: {},
  data() {
    return {
      leftList: {},
      currentModule: '',
      currentMenu: '',
      activeIndex: '',
      isCreated: false,
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.currentMenu = val.fullPath
        this.currentModule = this.currentMenu.split('/')[1]
        if (this.isCreated) {
          this.activeIndex = this.leftList[this.currentModule][0].path
        }
      },
      immediate: true,
    },
  },
  computed: {},
  created() {
    this.initLeftMenuList()
    this.isCreated = true
  },
  methods: {
    initLeftMenuList() {
      defaultRouter.map((item) => {
        if (item.children && item.children.length > 0) {
          this.leftList[item.name] = item.children
        }
      })
      this.activeIndex = this.currentMenu
    },
  },
}
</script>

<style lang="scss" scoped>
.moduleBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.menuBox {
  width: 230px;
  height: 100%;
  background: white;
  box-shadow: 1px 0 1px #f0f0f0;
  margin-top: 15px;
}
.contentBox {
  padding: 15px;
  width: 100%;
  background: #f5f5f5;
  height: calc(100% - 30px);
}
.content {
  width: calc(100% - 30px);
  height: calc(100% - 15px);
  padding: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.iconfont {
  font-size: 25px;
  margin-right: 15px;
}
</style>
