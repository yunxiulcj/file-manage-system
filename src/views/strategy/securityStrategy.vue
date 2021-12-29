<template>
  <div class="box">
    <page-frame title="安全策略" icon="securityStrategy" :aside="true">
      <template #aside>
        <mini-menu :options="menuList" v-model="menu"></mini-menu>
      </template>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
import miniMenu from '../../components/miniMenu.vue'
export default {
  name: 'securityStrategy',
  components: { pageFrame, miniMenu },
  data() {
    return {
      menu: 'passwordPolicy',
      menuList: [
        {
          label: '密码策略',
          value: 'passwordPolicy',
          // children: [
          //   {
          //     label: '1测试啊测试1',
          //     value: 'test1',
          //   },
          //   {
          //     label: '2测试啊测试2',
          //     value: 'test2',
          //   },
          //   {
          //     label: '3测试啊测试3',
          //     value: 'test3',
          //   },
          // ],
        },
        {
          label: '登录策略',
          value: 'loginStrategy',
        },
        {
          label: '登录限制策略',
          value: 'limitStrategy',
        },
      ],
    }
  },
}
</script>

<style scoped></style>
