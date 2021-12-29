<template>
  <div class="miniMenu">
    <div class="menuGroup">
      <div
        class="menuItem"
        v-for="item in options"
        :key="item.value"
        @click="!item.children && clickMenu(item.value)"
      >
        <div class="menuBox" :class="{ checked: item.value == checked }">
          <i :class="'iconfont icon-' + item.value"></i>
          <span class="name">{{ item.label }}</span>
        </div>
        <div class="children" v-if="item.children && item.children.length > 0">
          <ul
            v-for="child in item.children"
            :key="child.value"
            @click="test(child.value, item.value)"
          >
            <li :class="{ liChecked: child.value == children }">
              {{ child.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'minMenu',
  props: {
    options: Array,
    value: String,
  },
  data() {
    return {
      temp: '',
      menuList: [],
    }
  },
  computed: {
    checked: {
      get() {
        return this.value
      },
      set(val) {
        return val
      },
    },
    children: {
      get() {
        return this.value
      },
      set(val) {
        return val
      },
    },
  },
  model: {
    prop: 'value',
    event: 'update',
  },
  created() {},
  methods: {
    clickMenu(val) {
      this.checked = val
      this.$emit('update', val)
      console.log('clickMenu', val)
    },
    test(val, parentVal) {
      this.children = val
      this.checked = parentVal
      this.$emit('update', val)
      console.log(val, parentVal, this.checked)
    },
  },
}
</script>

<style lang="scss" scoped>
.miniMenu {
  margin-top: 15px;
}
.menuBox {
  padding: 0px 10px;
  height: 35px;
  line-height: 35px;
  margin: 8px 0px;
  color: #434343;
  width: 150px;
  display: flex;
  flex-direction: row;
  align-content: center;
  cursor: pointer;
}
.name {
  font-size: 14px;
  margin-left: 7px;
}
.iconfont {
  font-size: 20px;
  color: #8c8c8c;
}
.checked {
  background: #e6f7ff;
  border-radius: 5px;
  color: #096dd9;
}
.checked .iconfont {
  color: #096dd9;
}
.children {
  font-size: 14px;
  ul {
    color: #434343;
    li {
      cursor: pointer;
    }
  }
}
.liChecked {
  color: #096dd9;
}
</style>
