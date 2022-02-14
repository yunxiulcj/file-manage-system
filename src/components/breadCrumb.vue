<template>
  <div class="breadCrumb">
    <span class="goBack" @click="goBack" v-if="pathList.length > 1">
      {{ $t('cs_common.cs_1') }}
    </span>
    <el-divider direction="vertical" v-if="pathList.length > 1"></el-divider>
    <span class="pathBox" v-for="(item, index) in pathList" :key="index">
      <span
        :class="{ pathName: pathList.length - 1 !== index }"
        @click="pathList.length - 1 !== index && clickItem(index, item)"
      >
        {{ item == '' ? $t('cs_.cs_1') : item }}
      </span>
      <i class="el-icon-arrow-right" v-if="index != pathList.length - 1"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'breadCrumb',
  props: ['value'],
  data() {
    return {
      tempPath: '',
    }
  },
  computed: {
    pathList() {
      if (this.tempPath[this.tempPath.length - 1] == '/') {
        return this.tempPath.substring(0, this.tempPath.length - 1).split('/')
      } else {
        return this.tempPath.split('/')
      }
    },
  },
  watch: {
    value: {
      handler(val) {
        this.tempPath = val
      },
      immediate: true,
    },
  },
  methods: {
    goBack() {
      this.$emit(
        'input',
        this.pathList.slice(0, this.pathList.length - 1).join('/')
      )
      this.$emit('startGetData', true)
    },
    clickItem(index) {
      this.$emit(
        'input',
        this.tempPath
          .split('/')
          .slice(0, index + 1)
          .join('/')
      )
      this.$emit('startGetData', true)
    },
  },
}
</script>

<style lang="scss" scoped>
.breadCrumb {
  color: #495057;
  font-size: 13px;
  .goBack,
  .pathName {
    color: #228be6;
    cursor: pointer;
  }
  .pathName:hover {
    color: #4dabf7;
  }
  .goBack:hover {
    color: #4dabf7;
  }
}
</style>
