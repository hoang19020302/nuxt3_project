<template>
  <div class="flex">
    <div class="basis-2/3 grid grid-cols-2 gap-5">
      <h1 class="font-bold col-span-2 text-2xl mb-5">Editor's Recommendation</h1>
      <router-link v-for="item in sorted_results" :key="item._id" :to="'/Story/' + item.slug" class="col-span-1">
        <div
          class="bg-white flex items-center rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:-translate-y-1">
          <div class="w-36 h-56 overflow-hidden rounded-l-lg">
            <img :src="get_thumbnail_url(item.thumb_url)" class="w-full h-full object-cover" v-if="item.thumb_url" />
          </div>
          <div class="p-5">
            <p class="text-lg font-semibold mb-1">{{ item.name }}</p>
            <p>New Chapter:
              <a v-if="item.chapters_latest && item.chapters_latest.length > 0 && item.chapters_latest[0].chapter_api_data"
                :href="'/Story/' + item.slug + '/' + (item.chapters_latest[0].chapter_api_data.split('/').pop())"
                class="text-blue-500 hover:underline">
                {{ item.chapters_latest[0].filename }}
              </a>
            </p>
          </div>
        </div>
      </router-link>
    </div>
    <div class="basis-1/3">
      <input v-model.trim="search_keyword" @keyup.enter="handle_search" placeholder="Nhập từ khóa tìm kiếm..."
        class="p-2 border border-gray-300 rounded-md w-full mb-3">
      <button @click="handle_search"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md w-full">
        Tìm Kiếm
      </button>

      <!-- Dropdown for sorting -->
      <select v-model="sortOption" class="mt-3 p-2 border border-gray-300 rounded-md w-full">
        <option value="name">Sắp xếp theo tên</option>
        <option value="newest">Sắp xếp theo chương mới nhất</option>
        <option value="chaptersCount">Sắp xếp theo số lượng chương</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import env_config from './../env_config';
import { useHead } from '@vueuse/head';


useHead({ title: 'Search', });
const route = useRoute();
const search_keyword = ref('');
const search_results = ref([
  {
    _id: "",
    name: "",
    slug: "",
    status: "",
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
    ],
    chapters_latest: [
      {
        filename: "",
        chapter_api_data: ""
      }
    ]
  },
]);
const sortOption = ref('name');

// Hàm tìm kiếm
const search_books = async (keyword: string) => {
  try {
    const response = await axios.get(`${env_config.O_TRUYEN}/tim-kiem?keyword=${keyword}`);
    search_results.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
}

// Hàm xử lý tìm kiếm
const handle_search = async () => {
  const keyword = search_keyword.value.trim();
  if (keyword !== '') {
    await search_books(keyword); // Tìm kiếm với từ khóa
  } else {
    console.log("Keyword is empty.");
  }
}

// Lấy từ khóa từ query parameter khi trang được tải
onMounted(async () => {
  const keyword = route.query.keyword as string;
  if (keyword) {
    search_keyword.value = keyword; // Cập nhật input tìm kiếm
    await search_books(keyword); // Tìm kiếm với từ khóa
  }
});

// Sắp xếp kết quả tìm kiếm
const sorted_results = computed(() => {
  return [...search_results.value].sort((a, b) => {
    if (sortOption.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption.value === 'newest') {
      // Kiểm tra dữ liệu ngày tháng
      const dateA = new Date(a.chapters_latest[0]?.chapter_api_data || 0);
      const dateB = new Date(b.chapters_latest[0]?.chapter_api_data || 0);
      return dateB.getTime() - dateA.getTime();
    } else if (sortOption.value === 'chaptersCount') {
      return b.chapters_latest.length - a.chapters_latest.length;
    }
    return 0;
  });
});

// Hàm lấy URL thumbnail
const get_thumbnail_url = (relative_url: string) => {
  return relative_url ? `https://img.otruyenapi.com/uploads/comics/${relative_url}` : '';
}
</script>
