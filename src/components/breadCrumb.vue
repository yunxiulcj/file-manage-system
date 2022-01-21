<template>
  <div class="pathWrap">
    <span class="goBack item" @click="goBack">返回上一级</span>
    <el-divider direction="vertical"></el-divider>
    <span
      v-for="(item, index) in path.substring(0, path.length - 2).split('/')"
      :key="item.index"
    >
      <span class="fileName item" @click="clickName(item, index)">
        {{ item == '' ? '所有文件' : item }}
      </span>
      <i class="el-icon-arrow-right"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'breadCrumb',
  props: ['path'],
  data() {
    return {}
  },
  created() {},
  methods: {
    clickName(path, index) {
      this.$emit('clickPath', index, path)
    },
    goBack() {},
  },
}
</script>

<style lang="scss" scoped>
.pathWrap {
  color: #228be6;
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .item {
    cursor: pointer;
  }
  .item:hover {
    color: #4dabf7;
  }
  i {
    margin: 0 3px;
  }
}
</style>
