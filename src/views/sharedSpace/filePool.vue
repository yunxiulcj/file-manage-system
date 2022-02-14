<template>
  <div class="box">
    <page-frame :title="$t('cs_sharedSpace.cs_7')" icon="filePool"></page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
export default {
  name: 'filePool',
  components: { pageFrame },
  data() {
    return {}
  },
}
</script>

<style scoped></style>
