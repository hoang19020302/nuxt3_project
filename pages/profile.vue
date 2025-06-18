<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
    <div class="bg-white/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-gray-200">
      <h1
        class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-blue-600 mb-12">
        User Profile</h1>

      <div class="space-y-6">
        <div>
          <label for="id" class="block text-lg font-medium text-gray-700">ID:</label>
          <p id="id" class="text-xl font-semibold text-gray-900">{{ userProfile.user.id }}</p>
        </div>
        <div>
          <label for="username" class="block text-lg font-medium text-gray-700">Username:</label>
          <p id="username" class="text-xl font-semibold text-gray-900">{{ userProfile.user.userName }}</p>
        </div>
        <div>
          <label for="email" class="block text-lg font-medium text-gray-700">Email:</label>
          <p id="email" class="text-xl font-semibold text-gray-900">{{ userProfile.user.email }}</p>
        </div>
        <div>
          <label for="phone" class="block text-lg font-medium text-gray-700">Phone Number:</label>
          <p id="phone" class="text-xl font-semibold text-gray-900">{{ userProfile.user.phoneNumber }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";
import env_config from "./../env_config";
import { useHead } from '@vueuse/head';


useHead({ title: 'Profile', });
const userProfile = ref({
  "user": {
    "insertAt": "",
    "updateAt": null,
    "id": 14,
    "userName": "Admin",
    "normalizedUserName": "",
    "email": "",
    "normalizedEmail": "",
    "emailConfirmed": false,
    "passwordHash": "",
    "securityStamp": "",
    "concurrencyStamp": "",
    "phoneNumber": null,
    "phoneNumberConfirmed": false,
    "twoFactorEnabled": false,
    "lockoutEnd": null,
    "lockoutEnabled": true,
    "accessFailedCount": 0
  },
  "roles": [
    "Admin"
  ]
}

);


onMounted(async () => {
  const { get: getToken } = useToken();
  const token = getToken();
  try {
    const response = await axios.get(`${env_config.ADMIN}/Auth/GetUser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    userProfile.value = response.data;
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
});
</script>

<style scoped>
/* Custom styles are already applied inline with Tailwind classes */
</style>
