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
    <div class="demo-buttons">
      <button
        @click="updateAllJobs"
        class="border p-2 rounded shadow bg-purple-200 text-sm font-semibold"
      >
        Random status
      </button>
    </div>

    <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal table-fixed">
        <thead>
          <th>Name</th>
          <th>Status</th>
          <th>Items</th>
          <th>Created</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="job in jobs" class="bg-white">
            <td>{{ job.name }}</td>
            <td>
              <template v-if="job.items.length == 1">
                {{ job.items }}
              </template>

              <template v-else>
                <ul>
                  <li v-for="item in job.items">
                    {{ item }}
                  </li>
                </ul>
              </template>
            </td>
            <td>{{ job.status }}</td>
            <td>{{ job.created_at }}</td>
            <td>
              <button
                @click="updateJob(job)"
                class="
                  capitalize
                  text-xs
                  shadow
                  rounded
                  p-2
                  font-semibold
                  border
                  bg-gray-100
                  text-gray-600
                "
              >
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
th {
  @apply px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 tracking-wider capitalize;
}

td {
  @apply px-5 py-5 border-b border-gray-200 text-sm;
}
</style>
