<!-- TheLoaiDetail.vue -->
<template>
  <div>
    <h1>{{ theLoai.titlePage }}</h1>
    <ul>
      <li v-for="truyen in truyenList" :key="truyen._id">
        <!-- Sử dụng NuxtLink để tạo liên kết tới trang chi tiết truyện -->
        <NuxtLink :to="`/story/${truyen.slug}`">{{ truyen.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'; ss
import env_config from '../env_config.js';

export default {
  props: ['slug'], // Nhận slug từ route
  data() {
    return {
      theLoai: null,
      truyenList: []
    };
  },
  async created() {
    try {
      const response = await axios.get(`${env_config.O_TRUYEN}/the-loai/${this.slug}`);
      this.theLoai = response.data;
      this.truyenList = response.data.items;
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
