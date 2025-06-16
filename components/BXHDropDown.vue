<template>
  <div v-if="isOpen" class="absolute bg-white shadow-md rounded-md top-full left-0 z-10 grid grid-cols-6 gap-24">
    <ul>
      <li>
        <NuxtLink class="block hover:bg-gray-200 p-2" to="/bxh/truyen-moi">New Story</NuxtLink>
      </li>
      <li>
        <NuxtLink class="block hover:bg-gray-200 p-2" to="/bxh/sap-ra-mat">Coming soon</NuxtLink>
      </li>
      <li>
        <NuxtLink class="block hover:bg-gray-200 p-2" to="/bxh/dang-phat-hanh">Currently Live</NuxtLink>
      </li>
      <li>
        <NuxtLink class="block hover:bg-gray-200 p-2" to="/bxh/hoan-thanh">Complete</NuxtLink>
      </li>
      <!-- Hiển thị danh sách truyện -->
      <li v-for="item in bangXepHangList" :key="item._id" class="py-1">
        <div class="item-wrapper">
          <a :href="`#${item.slug}`" class="block hover:bg-gray-200 p-2">{{ item.name }}</a>
          <!-- Display other details of the story -->
          <p>Status: {{ item.status }}</p>
          <!-- For example: Display genres -->
          <p>Category:
            <span v-for="(category, index) in item.category" :key="index">
              {{ category.name }}{{ index !== item.category.length - 1 ? ', ' : '' }}
            </span>
          </p>
          <!-- For example: Display link to the chapter API -->
          <p>New Chapter: <a :href="item.chaptersLatest[0].chapter_api_data">{{ item.chaptersLatest[0].filename
              }}</a></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import env_config from './../env_config.js';
interface BangXepHangDropdownProps {
  isOpen: boolean;
  fetchAndToggle: (type: string) => void;
}

const props = defineProps<BangXepHangDropdownProps>();

const bangXepHangList = ref([
  {
    _id: "",
    name: "",
    slug: "",
    status: "ongoing",
    thumb_url: "",
    sub_docquyen: false,
    category: [
      {
        id: "",
        name: "",
        slug: ""
      },
      {
        id: "",
        name: "",
        slug: ""
      },
      // Thêm các thể loại khác nếu cần
    ],
    chaptersLatest: [
      {
        filename: "",
        chapter_api_data: ""
      }
    ]
  },
]);

async function fetchAndToggle(type: string) {
  props.fetchAndToggle(type);
}

async function fetchBangXepHangList(type: string) {
  let url = `https://otruyenapi.com/v1/api/danh-sach/${type}`
  try {
    const response = await axios.get(url);
    bangXepHangList.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
}

await axios.get(`${env_config.O_TRUYEN}/danh-sach/{type}`).then((response) => {
  bangXepHangList.value = response.data.data.items
  console.log(bangXepHangList.value)
})

onMounted(async () => {
  // Gọi hàm fetchBangXepHangList với các loại khác nhau
  await fetchBangXepHangList('truyen-moi');
  await fetchBangXepHangList('sap-ra-mat');
  await fetchBangXepHangList('hoan-thanh');
  await fetchBangXepHangList('dang-phat-hanh');
});

</script>
