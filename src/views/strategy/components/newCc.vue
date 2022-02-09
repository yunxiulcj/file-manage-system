<template>
  <div class="box">
    <el-dialog
      :visible.sync="tempVal"
      top="50px"
      width="750px"
      @close="dialogClose"
    >
      <template slot="title">
        <div
          style="
            height: 20px;
            line-height: 20px;
            border-left: 4px solid #1890ff;
            padding-left: 10px;
          "
        >
          添加成员
        </div>
      </template>
      <div class="tips">添加指定成员（不超过100人）</div>
      <div class="contentBox">
        <div class="treeWrap">
          <el-tree
            ref="tree"
            :props="props"
            :load="loadNode"
            show-checkbox
            node-key="name"
            lazy
            empty-text="暂无数据"
            @check="nodeCheck"
          >
            <span class="nodeItem" slot-scope="{ node, data }">
              <i
                :class="
                  data.type == 'user'
                    ? 'iconfont icon-yonghutianchong'
                    : data.type == 'group'
                    ? 'iconfont icon-huaban'
                    : 'iconfont icon-department'
                "
              ></i>
              <span style="margin-left: 5px">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <div class="seleWrap">
          <template v-for="(item, index) in seleNodeList">
            <div :key="item" class="seleItem">
              <i class="iconfont icon-yonghutianchong"></i>
              <span>{{ item }}</span>
              <i class="el-icon-close" @click="delMember(index, item)"></i>
            </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'newCc',
  props: {
    type: Number,
    value: Boolean,
    userList: Array,
  },
  data() {
    return {
      tempVal: false,
      seleNodeList: [],
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
    }
  },
  watch: {
    value: {
      handler(val) {
        this.tempVal = val
      },
      immediate: true,
    },
    userList: {
      immediate: true,
      handler(val) {
        this.seleNodeList = val
      },
    },
  },
  methods: {
    loadNode(node, resolve) {
      let dn = node.level == 0 ? '' : node.data.dn
      this.$http('getDepartmentUserTree', { dn: dn }).then((res) => {
        let temp = []
        if (res.data && res.data.length > 0) {
          res.data.map((item) => {
            temp.push({
              name: item.name,
              leaf: !item.hasChild,
              dn: item.dn,
              parentDn: item.parentDn,
              type: item.type,
            })
          })
        }
        resolve(temp)
        if (this.userList) {
          temp.map((item) => {
            if (this.userList.includes(item.name)) {
              this.$refs['tree'].setChecked(item.name, true)
            }
          })
        }
      })
    },
    nodeCheck(a, b) {
      b.checkedNodes.map((item) => {
        if (item.leaf && !this.seleNodeList.includes(item.name)) {
          this.seleNodeList.push(item.name)
        }
      })
    },
    setNodeCheck() {
      this.$refs['tree'].setCheckedNodes([])
      this.seleNodeList.map((item) => {
        this.$refs['tree'].setChecked(item, true)
      })
    },
    getDepartmentUserTree(val) {
      this.$http('getDepartmentUserTree', { dn: val }).then((res) => {
        return res.data
      })
    },
    delMember(val, data) {
      this.seleNodeList.splice(val, 1)
      this.$refs['tree'].setChecked(data, false)
    },
    cancel() {
      this.$emit('input', false)
    },
    confirm() {
      this.$emit('input', false)
      this.$emit('selectUser', this.seleNodeList)
    },
    dialogClose() {
      this.$emit('input', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #868e96;
}
.contentBox {
  margin-top: 15px;
  border: 0.5px solid #ced4da;
  display: flex;
  flex-direction: row;
  .treeWrap {
    padding: 10px 0px;
    width: 50%;
    height: 450px;
    overflow: auto;
    border-right: 0.5px solid #ced4da;
  }
  .seleWrap {
    padding: 10px 0px;
    width: 50%;
    height: 450px;
    overflow: auto;
    .seleItem {
      position: relative;
      padding-left: 10px;
      height: 30px;
      line-height: 30px;
      span {
        margin-left: 5px;
      }
      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 8px;
        font-size: 15px;
        color: #868e96;
        cursor: pointer;
      }
      .el-icon-close:hover {
        color: #495057;
        font-weight: bold;
      }
    }
    .seleItem:hover {
      background: #f8f9fa;
    }
  }
}
</style>
