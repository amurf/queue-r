<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

import axios from "axios";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const socket = io({
  path: "/update/socket.io/",
  query: { id: props.id, waitingForClose: true },
});

// once qr is scanned close window?
socket.on("closeWindow", () => window.close());

const route = useRoute();

// XXX: Don't hardcore this
const url = "http://marylou.local:8885/w/" + props.id;
const qrCode: String = ref("");

async function getQR() {
  let { data } = await axios.get(`/submit/qr/${route.params.id}`);
  qrCode.value = data;
}

getQR();
</script>

<template>
  <div v-if="!qrCode">Generating QR code..</div>

  <div
    v-else
    class="w-full h-screen flex flex-col justify-center items-center px-5"
  >
    <div v-html="qrCode" class="qrcode-container"></div>
    <p>
      Hi {{ route.query.name }}, scan this QR code to keep track of your order,
      we'll let you know when it's ready
    </p>

    <a :href="url" target="_blank">{{ url }}</a>
  </div>
</template>

<style scoped>
.qrcode-container {
  width: 30%;
}

@media only screen and (max-width: 600px) {
  .qrcode-container {
    width: 100%;
  }
}
</style>
