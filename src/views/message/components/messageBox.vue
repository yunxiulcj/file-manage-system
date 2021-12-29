<template>
  <div class="messageBox">
    <template>
      <message-item></message-item>
    </template>
  </div>
</template>

<script>
import messageItem from './messageItem.vue'
export default {
  name: 'messageBox',
  components: { messageItem },
  data() {
    return {
      messageList: [],
    }
  },
  methods: {
    getData() {},
  },
}
</script>
