<template>
  <el-select
    v-model="tempVal"
    :size="size || 'small'"
    :style="{ width: width || '360px' }"
    @clear="selectClear"
    clearable
  >
    <template slot="empty">
      <div @click="goBack(depOU)" size="mini" class="goBack">向上一级</div>
      <div class="depWrap" v-if="depList.length > 0">
        <div
          class="depItem"
          ref="depItem"
          v-for="(item, index) in depList"
          :key="item.name"
        >
          <i
            class="el-icon-circle-plus-outline"
            @click="getDepartmentList(item.dn)"
            title="点击获取子部门"
          ></i>
          <div class="depName" :style="item.style" @click="selectDep(index)">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="noData" v-loading="depLoading" v-else>暂无数据</div>
    </template>
  </el-select>
</template>

<script>
export default {
  name: 'scopeSelect',
  props: ['value', 'setPath', 'size', 'width'],
  data() {
    return {
      depLoading: false,
      tempVal: '',
      depOU: '',
      selectInfo: {
        index: -1,
        dn: '',
      },
      selectIndex: -1,
      depList: [],
      selectedStyle: {
        color: '#228be6',
        fontWeight: '600',
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
    setPath: {
      immediate: true,
      handler(val) {
        let path
        if (val) {
          if (val.indexOf('OU=') < 0) {
            path = ''
          } else {
            path = val.split(',').splice(1).join(',')
          }
          this.getDepartmentList(path)
        }
        // this.getDepartmentList(path)
      },
    },
  },
  mounted() {
    this.getDepartmentList(this.depOU)
  },
  methods: {
    goBack(val) {
      if (val) {
        let OUNum = val.indexOf('OU=')
        if (OUNum != -1) {
          console.log(val)
          this.getDepartmentList(val.substring(val.indexOf(',') + 1))
        } else {
          this.getDepartmentList('')
        }
      } else {
        this.$message.warning('已无上级')
      }
    },
    getDepartmentList(val) {
      this.depList = []
      this.depLoading = true
      this.depOU = val
      this.$http('getDepartmentList', { dn: val })
        .then((res) => {
          if (res.data) {
            this.depList = res.data.map((item, index) => {
              if (val == this.selectInfo.dn && index == this.selectInfo.index) {
                return { ...item, style: this.selectedStyle }
              } else {
                return {
                  ...item,
                  style: this.normalStyle,
                }
              }
            })
          }
        })
        .finally(() => {
          this.depLoading = false
        })
    },
    selectDep(i) {
      this.depList.map((item, index) => {
        if (index == i) {
          this.selectInfo.index = i
          this.selectInfo.dn = this.depOU
          this.$set(item, 'style', this.selectedStyle)
          this.$emit('input', item.name)
          this.$emit('fullPath', item.dn)
        } else {
          this.$set(item, 'style', this.normalStyle)
        }
      })
    },
    selectClear() {
      this.$set(this.depList[this.selectInfo.index], 'style', this.normalStyle)
      this.$emit('fullPath', '')
      this.selectInfo.index = -1
    },
  },
}
</script>

<style lang="scss" scoped>
.goBack {
  cursor: pointer;
  color: #228be6;
  padding-left: 30px;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  border-bottom: 0.5px solid #e9ecef;
}
.goBack:hover {
  background: #f8f9fa;
  font-weight: bolder;
}
.depWrap {
  font-size: 14px;
  padding: 5px 0px;
  .depItem {
    height: 30px;
    line-height: 30px;
    padding: 0px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 16px;
    }
    i:hover {
      color: #228be6;
      font-weight: bolder;
    }
    .depName {
      margin-left: 5px;
      width: calc(100% - 20px);
    }
  }
  .depItem:hover {
    background: #f5f7fa;
  }
}
.noData {
  font-size: 0.8rem;
  color: #bfbfbf;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
</style>
