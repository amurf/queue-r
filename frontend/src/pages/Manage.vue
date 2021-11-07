<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

let jobs = ref([]);

async function updateJob(job) {
  axios.put("/submit/job", job);
}

async function updateAllJobs() {
  const status = ["Started", "In progress", "Delayed", "Completed"];

  for (let job of jobs.value) {
    job.status = status[Math.floor(Math.random() * status.length)];
    updateJob(job);
  }
}

async function getJobs() {
  let { data } = await axios.get("/submit/job");
  jobs.value = data;
}

getJobs();
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center px-5">
    <button @click="updateAllJobs">Random!</button>

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
          <td>
            <button @click="updateJob(job)">Update</button>
          </td>
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
