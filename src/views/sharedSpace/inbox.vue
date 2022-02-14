<template>
  <div class="box">
    <page-frame :title="$t('cs_sharedSpace.cs_8')" icon="inbox"></page-frame>
  </div>
</template>

<script>
import pageFrame from '../../components/pageFrame.vue'
export default {
  name: 'inbox',
  components: { pageFrame },
  data() {
    return {}
  },
}
</script>

<style scoped></style>
