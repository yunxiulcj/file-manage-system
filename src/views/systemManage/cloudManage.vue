<template>
  <div class="box">
    <page-frame title="网盘管理" icon="cloudManage" :aside="true">
      <template #aside></template>
    </page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
export default {
  name: 'cloudManage',
  components: { pageFrame },
  data() {
    return {}
  },
}
</script>

<style scoped></style>
