<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const status: String = ref("");
const error: String = ref("");

const socket = io({
  path: "/update/socket.io/",
  query: { id: props.id },
});

socket.on("update", (newStatus) => {
  status.value = newStatus;
});
socket.on("error", (newStatus) => {
  error.value = newStatus;
});
</script>

<template>
  <h1>Track</h1>

  <p v-if="error">Something went wrong :(</p>
  <p v-else>{{ status }}</p>
</template>
