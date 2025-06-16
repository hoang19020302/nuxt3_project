<template>
  <form class="p-10 col-span-1 flex flex-col justify-center gap-5 bg-white" @submit.prevent="poststory">
    <h1 class="text-center text-xl font-bold">Post Story</h1>
    <input class="p-2 border-b rounded" type="text" placeholder="Title" v-model="poststories.data.title" />
    <input class="p-2 border-b rounded" type="text" placeholder="Description" v-model="poststories.data.description" />
    <input class="p-2 border-b rounded" type="text" placeholder="Genre" v-model="poststories.data.genre" />
    <input class="p-2 border-b rounded" type="file" @change="handleFileUpload"
      accept="image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document" />

    <input class="p-2 rounded-lg text-white bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 font-bold" type="submit"
      value="Submit" />

    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import axios from "axios";
import { ref } from 'vue';
import env_config from "../env_config";
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

useHead({ title: 'Post Story' });
const router = useRouter();

const poststories = ref({
  data: {
    id: "",
    title: "",
    description: "",
    genre: "",
    fileData: null
  }
});

const errorMessage = ref('');

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(files[0].type)) {
      errorMessage.value = 'Invalid file type. Only images or .docx files are allowed.';
      return;
    }
    poststories.value.data.fileData = files[0]; // Lấy file đầu tiên
    errorMessage.value = ''; // Reset lỗi nếu hợp lệ
  }
};

const poststory = async () => {
  if (!poststories.value.data.title || !poststories.value.data.description || !poststories.value.data.genre || !poststories.value.data.fileData) {
    errorMessage.value = 'Please fill in all required fields and upload a file.';
    return;
  }

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('Title', poststories.value.data.title);
  formData.append('Description', poststories.value.data.description);
  formData.append('Genre', poststories.value.data.genre);
  formData.append('File', poststories.value.data.fileData); // Gửi file lên

  try {
    const response = await axios.post(`${env_config.ADMIN}/Auth/Newstory`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response.data);
    alert('Story uploaded successfully!');
    router.push('/');
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response?.data?.Error || 'Error uploading story. Please try again.';
  }
};
</script>

<style>
/* Add custom styles here if needed */
</style>
