<template>
  <el-select
    v-model="tempVal"
    :size="size || 'small'"
    :style="{ width: width || '360px' }"
    clearable
  >
    <template slot="empty">
      <div class="topBar">
        <div @click="goBack(depOU)" size="mini" class="goBack">向上一级</div>
      </div>
      <div class="depWrap" v-if="depList.length > 0">
        <div
          class="depItem"
          ref="depItem"
          v-for="(item, index) in depList"
          :key="item.name"
          :style="item.style"
        >
          <i
            class="el-icon-circle-plus-outline"
            @click="getDepartmentList(item.dn)"
            title="点击获取子部门"
          ></i>
          <span class="depName" @click="selectDep(index, item)">
            {{ item.name }}
          </span>
        </div>
      </div>
    </template>
  </el-select>
</template>

<script>
export default {
  name: 'scopeSelect',
  props: ['value', 'size', 'width'],
  data() {
    return {
      tempVal: '',
      depOU: '',
      selectIndex: -1,
      depList: [],
      selectedStyle: {
        color: '#228be6',
        fontWeight: 'bolder',
      },
      normalStyle: {
        color: '#495057',
        fontWeight: 'normal',
      },
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.tempVal = val
      },
    },
  },
  mounted() {
    this.getDepartmentList(this.depOU)
  },
  methods: {
    selectDep(index, val) {
      console.log(index, val)
      if (this.selectIndex == index) {
        this.$set(val, 'style', this.normalStyle)
      } else {
        this.selectIndex = index
        this.$set(val, 'style', this.selectedStyle)
      }
      // this.$emit('input', this.tempVal)
    },
    getDepartmentList(val) {
      console.log(val)
      this.depOU = val
      this.$http('getDepartmentList', { dn: val }).then((res) => {
        if (res.data) {
          this.depList = res.data.map((item) => {
            return {
              ...item,
              style: this.normalStyle,
            }
          })
        }
      })
    },
  },
}
</script>
