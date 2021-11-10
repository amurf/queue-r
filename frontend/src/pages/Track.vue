<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const status = ref("");
const error = ref("");

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
  <div class="flex flex-col items-center justify-center w-full h-screen px-5">
    <div
      class="
        flex flex-col
        items-center
        w-1/2
        bg-purple-100
        border
        rounded
        shadow
      "
    >
      <h1 class="p-2 text-xl font-bold border border-bottom">
        Your order is being prepared
      </h1>

      <p class="w-full border-purple-200 border-t p-2 text-center">
        <template v-if="error">Something went wrong</template>
        <template v-else>
          {{ status }}
        </template>
      </p>
    </div>
  </div>
</template>
