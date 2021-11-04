<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

import QRCode from "qrcode";

const fullName: String = ref("");
const qrCode: String = ref("");

async function fetchQrCode() {
  let { data } = await axios.post("/submit/job", { fullName: fullName.value });
  qrCode.value = data;
}
</script>

<template>
  <input type="text" v-model="fullName" />
  <button @click="fetchQrCode()">Gogo</button>
  <div v-html="qrCode"></div>
</template>

