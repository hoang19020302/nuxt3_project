<template>
  <div class="flex">
    <div class="basis-2/3 grid grid-cols-2 gap-5">
      <h1 class="font-bold col-span-2 text-2xl mb-5">Biên Tập Viên Đề Cử</h1>
      <router-link v-for="item in theLoaiList" :key="item._id" :to="'/Story/' + item.slug" class="col-span-1">
        <div class="item-card">
          <div class="thumbnail-container">
            <img :src="getThumbnailUrl(item.thumb_url)" class="thumbnail" v-if="item.thumb_url" width="150"
              height="220" />
          </div>
          <div class="item-details">
            <p class="text-lg font-semibold mb-1">{{ item.name }}</p>
            <p>Chapter mới nhất:
              <a v-if="item.chaptersLatest && item.chaptersLatest.length > 0"
                :href="'/Story/' + item.slug + '/' + item.chaptersLatest[0].chapter_api_data.split('/').at(-1)">
                {{ item.chaptersLatest[0].filename }}
              </a>
              <span v-else>Chưa có chương nào</span> <!-- Thông báo nếu không có chương -->
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'; // Thêm watch vào import
import { useRoute } from 'vue-router';
import axios from "axios";
import env_config from '../../env_config';
import { useHead } from '@vueuse/head';


useHead({ title: 'Admin Home Page', });
const route = useRoute();

const theLoaiList = ref([
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
    chaptersLatest: [
      {
        filename: "",
        chapter_api_data: ""
      }
    ]
  },
]);

async function fetchTheLoaiData() {
  try {
    const response = await axios.get(`${env_config.O_TRUYEN}/the-loai/${route.params.slug}`);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && response.data.data && response.data.data.items) {
      theLoaiList.value = response.data.data.items;
    } else {
      console.error("Dữ liệu không hợp lệ:", response.data);
      theLoaiList.value = []; // Reset dữ liệu nếu không hợp lệ
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thể loại:", error);
    theLoaiList.value = []; // Reset dữ liệu nếu có lỗi
  }
}

// Theo dõi sự thay đổi của slug
watch(() => route.params.slug, () => {
  fetchTheLoaiData();
});

// Gọi hàm lần đầu tiên
fetchTheLoaiData();

const getThumbnailUrl = (relativeUrl) => {
  return relativeUrl ? `https://img.otruyenapi.com/uploads/comics/${relativeUrl}` : '';
};
</script>

<style scoped>
.item-card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
}

.thumbnail-container {
  width: 150px;
  height: 220px;
  overflow: hidden;
  border-radius: 8px 0 0 8px;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px 0 0 8px;
}

.item-details {
  flex: 1;
  padding: 20px;
}

.item-details p {
  margin: 8px 0;
}

.item-details p:first-child {
  margin-top: 0;
}

.item-details p:last-child {
  margin-bottom: 0;
}
</style>
