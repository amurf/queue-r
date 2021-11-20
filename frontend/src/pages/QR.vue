<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

import axios from "axios";

import Logo from "../images/logo.svg";
import Loading from "../images/loading.svg";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const socket = io("/", {
  path: "/update/socket.io/",
  query: { id: props.id, waitingForClose: "true" },
});

// once qr is scanned close window?
socket.on("closeWindow", () => window.close());

const route = useRoute();

// XXX: Don't hardcode this
const url = "http://localhost:8885/w/" + props.id;
const qrCode = ref("");

async function getQR() {
  let { data } = await axios.get(`/submit/qr/${route.params.id}`);

  // TODO: Handle errors nicely.
  if (!data.error) {
    qrCode.value = data;
  }
}

getQR();
</script>

<template>
  <div class="w-full h-screen flex flex-col p-4">
    <Logo class="self-center" />

    <div
      v-if="!qrCode"
      class="flex flex-col justify-center items-center h-full"
    >
      <p class="font-semibold text-2xl p-4 mb-10">
        Generating your QR code now...
      </p>
      <Loading />
    </div>

    <template v-else>
      <div
        v-html="qrCode"
        class="
          bg-primary-dark
          p-12
          qrcode-container
          rounded-md
          self-center
          w-full
          md:w-1/2
          mt-20
        "
      ></div>
      <p class="self-center text-xl w-full md:w-3/4 p-4 mt-20 text-center">
        Hi
        <strong class="text-primary-dark">{{ route.query.name }}</strong>
        , scan this QR code to keep track of your order, we'll let you know when
        it's ready
      </p>
    </template>
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
