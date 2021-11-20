<script setup lang="ts">
import Logo from "../images/logo.svg";
import { useRouter } from "vue-router";

const router = useRouter();

function login() {
  router.push({ name: "order" });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen p-4">
    <Logo class="text-white ml-8" />
    <!-- FIX: this margin is due to logo not being cropped correctly lol -->
    <form @submit.prevent="login" class="flex flex-col">
      <label for="username" class="text-sm font-bold my-1">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        value="demo"
        class="p-4 rounded-md border"
      />

      <label for="password" class="text-sm font-bold my-1">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value="demo"
        class="p-4 rounded-md border"
      />

      <button
        type="submit"
        class="bg-primary-dark p-4 text-white text-lg rounded-md font-bold my-4"
      >
        Login
      </button>
    </form>
  </div>
</template>
