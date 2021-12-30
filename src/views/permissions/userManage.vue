<template>
  <div class="box">
    <page-frame title="用户管理" icon="userManage" :aside="true">
      <template #aside></template>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
export default {
  name: 'userManage',
  components: { pageFrame },
  data() {
    return {}
  },
  created() {},
}
</script>

<style scoped></style>
