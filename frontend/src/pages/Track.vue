<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue";

import Logo from "../images/logo-dark.svg";

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

document.body.style.setProperty("--colour-body", "var(--colour-primary-light)");
</script>

<template>
  <div class="flex flex-col items-center justify-between w-full h-screen p-4">
    <Logo class="text-white" />

    <div
      class="
        flex flex-col
        items-center
        w-4/5
        bg-purple-100
        shadow
        border
        p-4
        rounded-md
        text-3xl text-white
      "
    >
      <h1 class="font-bold">Order status</h1>

      <p class="">
        <template v-if="error">Something went wrong</template>
        <template v-else>
          {{ status }}
        </template>
      </p>
    </div>

    <p class="text-white text-xl font-bold w-3/4 text-2xl">
      We'll call you when your order is ready, sit tight!
    </p>

    <div class="grid grid-cols-2 gap-2">
      <button
        class="text-white border border-primary-dark p-2 rounded-md text-xl"
      >
        Name wrong? Let us know.
      </button>
      <button
        class="text-white border border-primary-dark p-2 rounded-md text-xl"
      >
        See QR code
      </button>
    </div>
  </div>
</template>
