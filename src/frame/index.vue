<template>
  <div class="home-frame">
    <div class="headBox">
      <head-menu></head-menu>
    </div>
    <div class="bottomBox">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import headMenu from './components/headMenu.vue'

export default {
  name: 'frame',
  components: {
    headMenu,
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.home-frame {
  width: 100%;
  min-width: 1100px;
  height: 100vh;
}
.headBox {
  width: 100%;
  height: 60px;
}
.bottomBox {
  height: calc(100% - 78px);
  width: 100%;
}
</style>
