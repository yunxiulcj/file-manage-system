<template>
  <div class="box">
    soFile
    <el-button @click="test">test</el-button>
  </div>
</template>

<script>
export default {
  name: 'soFile',
  data() {
    return {}
  },
  created() {
    console.log('created', 'soFile')
  },
  methods: {
    test() {
      this.$router.push('/permissions/adminConfig')
    },
  },
}
</script>

<style scoped></style>
