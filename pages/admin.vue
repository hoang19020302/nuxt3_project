<template>
  <div>
    <!-- Header -->
    <header class="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-4 px-8 shadow-lg">
      <h1 class="text-3xl font-semibold">Admin Dashboard</h1>
      <p class="text-2xl">Welcome</p>
    </header>

    <!-- Main Content -->
    <div class="container mx-auto px-4 mt-8">
      <!-- User Info Card -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-2">User Info</h2>
        <div class="mb-2">
          <label for="username" class="block text-lg font-medium text-gray-700">Username:</label>
          <p id="username" class="text-xl font-semibold text-gray-900">{{ UsersandRoles.user.userName }}</p>
        </div>
        <div>
          <label for="role" class="block text-lg font-medium text-gray-700">Role:</label>
          <p id="roles" class="text-xl font-semibold text-gray-900">{{ UsersandRoles.roles }}</p>
        </div>
      </div>

      <!-- Story Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="story in stories" :key="story.id" class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Story Post</h2>
          <div class="mb-2">
            <label for="title" class="block text-lg font-medium text-gray-700">Id:</label>
            <p id="title" class="text-xl font-semibold text-gray-900">{{ story.id }}</p>
          </div>
          <div class="mb-2">
            <label for="title" class="block text-lg font-medium text-gray-700">Title:</label>
            <p id="title" class="text-xl font-semibold text-gray-900">{{ story.title }}</p>
          </div>
          <div class="mb-2">
            <label for="description" class="block text-lg font-medium text-gray-700">Description:</label>
            <p id="description" class="text-xl font-semibold text-gray-900">{{ story.description }}</p>
          </div>
          <div>
            <label for="genre" class="block text-lg font-medium text-gray-700">Genre:</label>
            <p id="genre" class="text-xl font-semibold text-gray-900">{{ story.genre }}</p>
          </div>
          <div>
            <label for="files" class="block text-lg font-medium text-gray-700">Files:</label>
            <ul v-if="story.files && story.files.length">
              <li v-for="file in story.files" :key="file.fileUrl">
                <a :href="file.fileUrl" class="text-blue-500 hover:underline" target="_blank">
                  {{ file.fileTitle }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";
import env_config from './../env_config.js';
import { useHead } from '@vueuse/head';

useHead({ title: 'Admin Home Page', });

interface File {
  fileTitle: string;
  fileUrl: string;
}

interface Story {
  id: number;
  title: string;
  description: string;
  genre: string;
  files: File[];
}

const UsersandRoles = ref({
  user: {
    insertAt: "",
    updateAt: null,
    id: "",
    userName: "",
    normalizedUserName: "",
    email: "",
    normalizedEmail: "",
    emailConfirmed: false,
    passwordHash: "",
    securityStamp: "",
    concurrencyStamp: "",
    phoneNumber: null,
    phoneNumberConfirmed: false,
    twoFactorEnabled: false,
    lockoutEnd: null,
    lockoutEnabled: true,
    accessFailedCount: 0
  },
  roles: [""]
});

const stories = ref<Story[]>([]);

onMounted(async () => {
  const { get } = useToken()
  const token = get();
  try {
    const response = await axios.get(`${env_config.ADMIN}/Auth/GetUser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    UsersandRoles.value = response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
  }

  try {
    const response = await axios.get(`${env_config.ADMIN}/Auth/GetAllStories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    stories.value = response.data.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
});
</script>

<style scoped>
/* Add custom styles for the Admin Dashboard here */
</style>
