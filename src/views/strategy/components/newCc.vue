<template>
  <div class="box">
    <el-dialog
      :visible.sync="tempVal"
      top="50px"
      width="600px"
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
            :data="treeData"
            show-checkbox
            node-key="id"
            @check="nodeClick"
          ></el-tree>
        </div>
        <div class="seleWrap">
          <template v-for="(item, index) in seleNodeList">
            <div :key="item.id" class="seleItem">
              <i class="el-icon-user-solid"></i>
              <span>{{ item.label }}</span>
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
  },
  data() {
    return {
      tempVal: false,
      seleNodeList: [],
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1',
                },
                {
                  id: 10,
                  label: '三级 1-1-2',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1',
            },
            {
              id: 6,
              label: '二级 2-2',
            },
          ],
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1',
            },
            {
              id: 8,
              label: '二级 3-2',
            },
            {
              id: 11,
              label: '二级 3-5',
            },
            {
              id: 12,
              label: '二级 3-6',
            },
            {
              id: 13,
              label: '二级 3-7',
            },
            {
              id: 14,
              label: '二级 3-8',
            },
            {
              id: 15,
              label: '二级 3-7',
            },
            {
              id: 16,
              label: '二级 3-8',
            },
            {
              id: 17,
              label: '二级 3-7',
            },
            {
              id: 18,
              label: '二级 3-8',
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
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
  },
  methods: {
    nodeClick(a, b) {
      console.log(a, b.checkedNodes)
      this.seleNodeList = b.checkedNodes.filter((item) => {
        if (!item.children) return item
      })
    },
    delMember(val, data) {
      this.seleNodeList.splice(val, 1)
      this.$refs['tree'].setChecked(data.id, false)
    },
    cancel() {
      this.$emit('input', false)
    },
    confirm() {
      this.$emit('input', false)
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
    width: 50%;
    height: 350px;
    overflow: auto;
    border-right: 0.5px solid #ced4da;
  }
  .seleWrap {
    width: 50%;
    height: 350px;
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
