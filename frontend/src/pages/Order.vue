<script setup lang="ts">
import { reactive } from "vue";
import axios from "axios";

const order = reactive({
  items: ["Flat white", "Peanut butter brownie"],
  client: "ClientName",
  name: "",
});

function reset() {
  order.name = "";
  order.qrCode = "";
}

async function submit() {
  let { data } = await axios.post("/submit/job", { ...order });

  window.open(`/qr/${data.id}?name=${order.name}`);
  reset();
}
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center px-5">
    <template v-if="order.submitted">
      <div v-html="order.qrCode" class="qrcode-container"></div>
      <p>
        Hi {{ order.name }}, scan this QR code to keep track of your order,
        we'll let you know when it's ready
      </p>

      <button @click="reset()" class="border p-2 bg-blue-200 rounded shadow">
        Next order
      </button>
    </template>
    <template v-else>
      <div class="border shadow p-4 mb-2">
        <h1 class="font-bold text-lg">Order</h1>
        <ul>
          <li v-for="item in order.items">{{ item }}</li>
        </ul>
      </div>

      <form @submit.prevent="submit()" class="flex flex-col text-center">
        <label for="name" class="font-bold text-lg">Customer name</label>
        <input
          type="text"
          v-model="order.name"
          id="name"
          class="border shadow p-2"
        />

        <button
          type="submit"
          class="border p-2 mt-2 shadow rounded bg-blue-200"
        >
          Submit
        </button>
      </form>
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
