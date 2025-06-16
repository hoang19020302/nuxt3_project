<template>
  <div class="relative">
    <button @click="toggleDropdown" class="px-4 py-2 focus:outline-none hover:bg-teal-600">Thể Loại</button>
    <div v-if="isDropdownOpen" @click.away="isDropdownOpen = false"
      class="absolute top-full left-0 mt-2 p-4 bg-cyan-400 shadow-lg rounded-lg grid grid-cols-2 md:grid-cols-8 gap-32">
      <template v-for="(chunk, index) in theLoaiChunks" :key="index">
        <ul>
          <li v-for="item in chunk" :key="item._id">
            <NuxtLink :to="`/category/${item.slug}`" class="block py-2 hover:bg-gray-200 hover:text-gray-800"
              @click="isDropdownOpen = false">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, Ref } from 'vue';
import axios from "axios";
import env_config from '../../env_config';

const route = useRoute();
const router = useRouter();

const isDropdownOpen = ref(false);
const theLoaiList: Ref<TheLoaiItem[]> = ref([]);

interface TheLoaiItem {
  _id: string;
  name: string;
  slug: string;
}

async function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

async function fetchTheLoai() {
  try {
    const response = await axios.get(`${env_config.O_TRUYEN}/the-loai`);
    theLoaiList.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
}

async function handleCategoryClick(item: TheLoaiItem) {
  // Đóng dropdown trước khi điều hướng
  isDropdownOpen.value = false;

  // Điều hướng đến trang mới
  router.push(`/category/${item.slug}`);
}

const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
};

const theLoaiChunks: Ref<any[][]> = ref([]);

fetchTheLoai().then(() => {
  theLoaiChunks.value = chunkArray(theLoaiList.value, 8);
});
</script>

<style scoped>
.hover\:bg-gray-200:hover {
  background-color: #edf2f7;
}
</style>
