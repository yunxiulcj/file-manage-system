<template>
  <el-select
    v-model="tempDep"
    clearable
    :size="size"
    placeholder="请选择应用范围"
    :multiple="multiple"
    @remove-tag="RemoveDep"
    @clear="clearTemp"
    :style="width ? seleWidth : { width: '365px' }"
  >
    <template slot="empty">
      <div class="topBar">
        <div @click="goBack(depOU)" size="mini" class="goBack">
          {{ $t('button.goBack') }}
        </div>
        <el-input
          v-model="tempFilter"
          size="mini"
          @input="filterDep"
          clearable
          prefix-icon="el-icon-search"
          :placeholder="$t('placeholder.keyword')"
          style="width: 70%; float: right"
        ></el-input>
      </div>
      <div class="depWrap" v-if="depList.length > 0">
        <div
          class="depItem"
          ref="test"
          v-for="(item, index) in depList"
          :key="index"
          v-show="item.show"
        >
          <i
            class="el-icon-circle-plus-outline"
            @click="getDepartment(item.DepartmentFullPath)"
            title="点击获取子部门"
          ></i>
          <el-tooltip
            effect="dark"
            :content="item.DepartmentName"
            placement="top"
            v-if="item.DepartmentName.length > 22"
          >
            <span class="depInfo" :key="index" @click="selectDep(index, item)">
              {{ item.DepartmentName }}
            </span>
          </el-tooltip>
          <span class="depInfo" v-else @click="selectDep(index, item)">
            {{ item.DepartmentName }}
          </span>
        </div>
      </div>
      <div class="noData" v-loading="depLoading" v-else>暂无数据</div>
    </template>
  </el-select>
</template>

<script>
// import { clone } from "@/utils/obj-operation";
export default {
  name: 'depSelect',
  props: ['value', 'fullPath', 'multiple', 'size', 'delDep', 'width'],
  data() {
    return {
      tempDep: '',
      depOUList: [],
      checkAll: false,
      depLoading: false,
      isIndeterminate: false,
      depOU: 'OU=中车株洲电力机车研究所有限公司',
      depList: [], //存储当前选项
      depNameList: [], //多选模式存储当前选项的部门名称
      tempObj: {}, //多选模式存储已选部门
      selectId: '', //单选模式存储已选部门的位置
      seleWidth: { width: this.width },
      tempFilter: '',
    }
  },
  mounted() {
    if (this.fullPath != undefined && this.fullPath != '') {
      this.goBack(this.fullPath)
    } else {
      this.getDepartment(this.depOU)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.tempDep = val
        if (this.delDep) {
          this.delName(this.delDep)
        }
      },
    },
    fullPath(val) {
      this.goBack(val)
    },
  },
  methods: {
    filterDep(val) {
      if (val) {
        this.depList.map((item) => {
          if (
            item.DepartmentName.toLowerCase().indexOf(val.toLowerCase()) != -1
          ) {
            item['show'] = true
          } else {
            item['show'] = false
          }
        })
      } else {
        this.depList.map((item) => {
          item['show'] = true
        })
      }
    },
    RemoveDep(val) {
      this.delName(val)
    },
    handleCheckAllChange(val) {
      if (val) {
        this.depList.map((item, index) => {
          if (!this.tempDep.includes(item.DepartmentName)) {
            this.selectStyle(index)
            this.tempDep.push(item.DepartmentName)
            this.depOUList.push(item.DepartmentFullPath)
          }
        })
        this.tempObj[this.depOU] = this.depNameList

        this.$emit('returnOU', this.depOUList)
      } else {
        this.depList.map((item, index) => {
          this.normalStyle(index)
          let temp = this.tempDep.indexOf(item.DepartmentName)
          if (temp != -1) {
            this.tempDep.splice(temp, 1)
            this.depOUList.splice(temp, 1)
          }
        })
        this.tempObj[this.depOU] = []
        this.$emit('returnOU', this.depOUList)
      }
      this.isIndeterminate = false
    },
    clearTemp() {
      if (!this.multiple) {
        this.normalStyle(this.selectId)
        this.selectId = ''
      } else {
        if (this.tempObj[this.depOU] && this.tempObj[this.depOU].length > 0) {
          this.depNameList.map((item, index) => {
            if (this.tempObj[this.depOU].indexOf(item) != -1) {
              this.normalStyle(index)
            }
          })
        }
        this.depOUList = []
        this.tempObj = {}
        this.$emit('returnOU', this.depOUList)
      }
      this.$emit('input', this.tempDep)
    },
    getDepartment(val) {
      this.depLoading = true
      this.depList = []
      let temp = ''
      let flag = false
      request.post(
        {
          url: '/SystemManagement/SysOUInfoGetDepListByParent',
          data: {
            DepartmentFullPath: val,
          },
        },
        (data) => {
          if (data.data && data.data.length > 0) {
            if (!this.multiple) {
              this.selectId = ''
            }
            this.depList = data.data
            this.depNameList = data.data.map((item, index) => {
              item['show'] = true
              if (
                !this.multiple &&
                this.tempDep != '' &&
                item.DepartmentName == this.tempDep
              ) {
                temp = index
                flag = true
              }
              return item.DepartmentName
            })
          } else {
            this.$message({
              message: '该部门没有子部门',
            })
          }
        },
        (data) => {
          this.$message({
            message: '该部门没有子部门',
            type: 'warning',
          })
        },
        (data) => {
          this.depOU = val
          if (flag) {
            this.selectStyle(temp)
          }
          if (this.multiple) {
            if (this.tempObj[val] && this.tempObj[val].length > 0) {
              let i
              this.tempObj[val].map((item) => {
                i = this.depNameList.indexOf(item)
                this.selectStyle(i)
              })
            }
          }
          this.depLoading = false
        }
      )
    },
    selectDep(index, item) {
      if (this.multiple) {
        this.multipleSelect(index, item)
      } else {
        this.singleSelect(index, item)
      }
      this.$emit('input', this.tempDep)
    },
    singleSelect(index, item) {
      let node1 = this.$refs.test[index]
      if (this.selectId !== '' && this.selectId === index) {
        this.normalStyle(index)
        this.tempDep = ''
        this.selectId = ''
      } else {
        if (this.selectId !== '' && this.selectId !== index) {
          this.normalStyle(this.selectId)
        }
        this.selectStyle(index)
        this.selectId = index
        this.tempDep = item.DepartmentName
        this.$emit('retureData', item)
      }
    },
    multipleSelect(index, item) {
      let pushNew = false
      if (this.tempObj[this.depOU]) {
        let tempIndex = this.tempObj[this.depOU].indexOf(item.DepartmentName)
        let nameIndex = this.tempDep.indexOf(item.DepartmentName)
        if (tempIndex == -1) {
          this.tempObj[this.depOU].push(item.DepartmentName)
          this.tempDep.push(item.DepartmentName)
          this.depOUList.push(item.DepartmentFullPath)
          pushNew = true
        } else {
          this.tempObj[this.depOU].splice(tempIndex, 1)
          this.tempDep.splice(nameIndex, 1)
          this.depOUList.splice(nameIndex, 1)
          this.normalStyle(index)
          pushNew = false
        }
      } else {
        this.tempObj[this.depOU] = [item.DepartmentName]
        this.tempDep.push(item.DepartmentName)
        this.depOUList.push(item.DepartmentFullPath)
        pushNew = true
      }
      this.$emit('returnOU', this.depOUList)
      if (pushNew) {
        this.selectStyle(index)
      }
    },
    goBack(path) {
      let temp
      if (path == '' || path.indexOf(',') == -1) {
        this.$message({
          message: '没有上一级了',
          type: 'warning',
        })
      }
      temp = path.substring(path.indexOf(',OU') + 1)
      this.getDepartment(temp)
    },
    delName(depName) {
      this.depOUList.splice(this.depNameList.indexOf(depName), 1)
      this.$emit('returnOU', this.depOUList)
      for (let item in this.tempObj) {
        let temp = this.tempObj[item].indexOf(depName)
        if (temp != -1) {
          if (this.depOU == item) {
            this.normalStyle(this.depNameList.indexOf(depName))
            this.tempObj[item].splice(temp, 1)
            this.$emit('input', this.tempDep)
          } else {
            this.tempObj[item].splice(temp, 1)
            this.$emit('input', this.tempDep)
          }
          break
        }
      }
    },
    //设置选择样式
    selectStyle(index) {
      let node = document.createElement('i')
      let node1 = this.$refs.test[index]
      node.className = 'el-icon-check'
      node.style.display = 'inline-block'
      node.style.height = '35px'
      node.style.lineHeight = '35px'
      node.style.position = 'absolute'
      node.style.right = '15px'
      node.style.color = '#40a9ff'
      node.style.fontSize = '1.1rem'
      node.style.fontWeight = '600'
      node1.appendChild(node)
      node1.getElementsByClassName('depInfo')[0].style.color = '#40a9ff'
      node1.getElementsByClassName('depInfo')[0].style.fontWeight = '600'
      if (!this.multiple) {
        this.selectId = index
      }
    },
    //取消选择样式
    normalStyle(index) {
      let node1 = this.$refs.test[index]
      node1.removeChild(node1.lastElementChild)
      node1.getElementsByClassName('depInfo')[0].style.color = null
      node1.getElementsByClassName('depInfo')[0].style.fontWeight = null
    },
  },
}
</script>

<style scoped>
.topBar {
  padding-left: 12px;
  color: #1890ff;
  font-size: 0.9rem;
  height: 32px;
  background: #f5f5f5;
  line-height: 32px;
  border-bottom: 0.5px solid #d9d9d9;
  user-select: none;
}
.topBar:hover {
  background: #f1f3f5;
}
.goBack {
  display: inline-block;
  text-align: center;
  width: 85px;
  line-height: 22px;
  height: 22px;
  border: 0.5px solid;
  border-radius: 3px;
  cursor: pointer;
}
.goBack:hover {
  border: 1.5px solid;
  font-weight: 600;
}
.checkAll {
  display: inline-block;
  float: right;
  margin-right: 8px;
}
.noData {
  font-size: 0.8rem;
  color: #bfbfbf;
  text-align: center;
  height: 65px;
  line-height: 65px;
}
.depWrap {
  min-height: 50px;
  max-height: 300px;
  overflow: auto;
}
.depItem {
  font-size: 0.9rem;
  color: #434343;
  padding: 0 20px 0 10px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  position: relative;
}
.depItem:hover {
  background: #f5f5f5;
}
.depItem:nth-child(1) {
  margin-top: 5px;
}
.depInfo {
  display: inline-block;
  height: 35px;
  line-height: 35px;
  position: absolute;
  width: 315px;
  left: 35px;
  overflow: hidden;
  user-select: none;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.el-icon-circle-plus-outline {
  height: 35px;
  line-height: 35px;
  position: absolute;
  left: 10px;
  font-size: 1.1rem;
}
.el-icon-circle-plus-outline:hover {
  color: #40a9ff;
}
</style>
