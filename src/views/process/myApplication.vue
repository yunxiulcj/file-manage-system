<template>
  <div class="box">myApplication</div>
</template>

<script>
export default {
  name: "myApplication",
  data() {
    return {};
  },
  created() {
    console.log("created", "myApplication");
  },
  destroyed() {
    console.log("destroyed", "myApplication");
  },
};
</script>

<style scoped></style>
