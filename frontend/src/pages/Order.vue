<script setup lang="ts">
import { reactive } from "vue";
import axios from "axios";

const order = reactive({
  items: ["Flat White", "Peanut Butter Brownie"],
  client: "ClientName",
  name: "",
});

function reset() {
  order.name = "";
}

async function submit() {
  let { data } = await axios.post("/submit/job", { ...order });

  window.open(`/qr/${data.id}?name=${order.name}`);
  reset();
}
</script>

<template>
  <div class="flex flex-col w-full h-screen p-4">
    <div class="p-4 border shadow-md rounded-md bg-white">
      <h1 class="text-lg font-bold">Your Order:</h1>
      <ul>
        <li v-for="item in order.items">1x {{ item }}</li>
      </ul>
    </div>

    <form @submit.prevent="submit()" class="flex flex-col text-center">
      <!-- <label for="name" class="text-lg font-bold">Customer name</label> -->
      <input
        type="text"
        v-model="order.name"
        placeholder="How should we call you?"
        id="name"
        class="
          text-primary-dark
          p-2
          mt-4
          border
          shadow-md
          rounded-md
          font-bold
          self-center
          text-2xl
          w-full
          md:w-1/2
          text-center
        "
      />
    </form>
  </div>
</template>

<style scoped>
</style>
