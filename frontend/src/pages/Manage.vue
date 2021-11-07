<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

let jobs = ref([]);

async function getJobs() {
  let { data } = await axios.get("/submit/job");
  jobs.value = data;
}

getJobs();
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center px-5">
    <table>
      <thead>
        <th>name</th>
        <th>status</th>
        <th>items</th>
        <th>created</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="job in jobs">
          <td>{{ job.name }}</td>
          <td>{{ job.status }}</td>
          <td>{{ job.items }}</td>
          <td>{{ job.created_at }}</td>
        </tr>
      </tbody>
    </table>
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
