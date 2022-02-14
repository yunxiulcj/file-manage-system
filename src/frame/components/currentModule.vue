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
          <el-menu-item :key="item.name" :index="item.path" v-if="!item.hidden">
            <i :class="'iconfont icon-' + item.meta.icon"></i>
            <span slot="title">{{ $t(item.meta.i18nTitle) }}</span>
          </el-menu-item>
        </template>
      </el-menu>
      <div class="capacityView" v-if="currentModule == 'sharedSpace'">
        <div class="progressWrap">
          <el-progress
            :percentage="parseFloat($store.state.global.capacity.usagePercent)"
            color="#228be6"
            :stroke-width="20"
            :text-inside="true"
          ></el-progress>
        </div>
        <div class="info">
          {{ $store.state.global.capacity.used }} /
          {{ $store.state.global.capacity.totalSize }}
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { listRouter } from '@/app/router/index.js'

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
        if (this.currentMenu == '/sharedSpace/soFile') {
          this.getPersonDiskSize()
        }
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
      listRouter.map((item) => {
        if (item.children && item.children.length > 0) {
          this.leftList[item.name] = item.children
        }
      })
      this.activeIndex = this.currentMenu
    },
    getPersonDiskSize() {
      this.$http('getPersonDiskSize', {
        userId: localStorage.getItem('username') || '',
      }).then((res) => {
        this.$store.commit('SET_CAPACITY', res.data)
      })
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
  min-width: 200px;
  height: 100%;
  background: white;
  box-shadow: 1px 0 1px #f0f0f0;
  margin-top: 15px;
  position: relative;
}
.contentBox {
  padding: 15px;
  min-width: calc(100% - 230px);
  background: #f0f0f0;
  height: calc(100% - 12px);
}
.content {
  min-width: calc(100% - 30px);
  height: calc(100% - 30px);
  padding: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.iconfont {
  font-size: 25px;
  margin-right: 15px;
}
.capacityView {
  position: absolute;
  bottom: 50px;
  width: 90%;
  margin: 0px 10px;
  .progressWrap {
    margin-bottom: 5px;
  }
  .info {
    font-size: 12px;
    margin-left: 5px;
    color: #495057;
  }
}
</style>
