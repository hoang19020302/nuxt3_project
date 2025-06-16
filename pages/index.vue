<template>
  <div class="flex">
    <!-- Phần hiển thị danh sách truyện -->
    <div class="w-3/4 grid grid-cols-2 gap-1">
      <h1 class="font-bold text-2xl mb-5 col-span-2">Editor's Recommendation</h1>
      <router-link v-for="item in stories" :key="item.id" :to="'/story/' + item.slug" class="col-span-1"
        @click="saveHistory(item)">
        <div
          class="flex items-center rounded-lg shadow-md overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
          <div class="w-150px h-220px overflow-hidden rounded-l-lg">
            <img :src="getThumbnailUrl(item.thumb_url)" class="w-full h-full object-cover rounded-l-lg"
              v-if="item.thumb_url" />
          </div>
          <div class="flex-1 p-5">
            <p class="text-lg font-semibold mb-1">{{ item.name }}</p>
            <p class="text-sm mb-3">New Chapter: <a :href="item.chaptersLatest[0].chapter_api_data"
                class="hover:text-blue-500">{{ item.chaptersLatest[0].filename }}</a></p>
            <button @click="addToFavorites(item)"
              class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none">
              Add to Favorites
            </button>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Phần hiển thị lịch sử đọc -->
    <!-- <div class="w-1/4">
      <h2 class="font-bold text-2xl mb-5">Read History</h2>
      <ul>
        <li v-for="historyItem in history" :key="historyItem.id">
          <div
            class="flex items-center rounded-lg shadow-md overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
            <div class="w-150px h-220px overflow-hidden rounded-l-lg">
              <img :src="getThumbnailUrl(historyItem.thumb_url)" class="w-full h-full object-cover rounded-l-lg"
                v-if="historyItem.thumb_url" />
            </div>
            <div class="flex-1 p-5">
              <p class="text-lg font-semibold mb-1">{{ historyItem.name }}</p>
              <p class="text-sm mb-3">New Chapter: <a :href="historyItem.chaptersLatest[0].chapter_api_data"
                  class="hover:text-blue-500">{{ historyItem.chaptersLatest[0].filename }}</a></p>
            </div>
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";
import env_config from './../env_config.js';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';


useHead({ title: 'Home Page', });
const route = useRoute();
const router = useRouter();

const isLoggedIn = () => {
  // Thực hiện logic kiểm tra ở đây và trả về kiểu boolean
  return true;
};
// Danh sách truyện và lịch sử đọc
const stories = ref([
  {
    id: "",
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
  }
]);
const history = ref([
  {
    id: "",
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
  }
]);

const favorites = ref([
  {
    id: "",
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
  }
]); // Danh sách yêu thích

// Lấy danh sách lịch sử đọc từ localStorage khi trang được load
if (typeof localStorage !== 'undefined') {
  const historyString = localStorage.getItem('history');
  history.value = historyString ? JSON.parse(historyString) : [];

  const favoritesString = localStorage.getItem('favorites');
  favorites.value = favoritesString ? JSON.parse(favoritesString) : [];
}

const saveHistoryToLocalStorage = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('history', JSON.stringify(history.value));
  }
};

const saveFavoritesToLocalStorage = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  }
};

const saveHistory = (item) => {
  // Thêm vào lịch sử đọc
  history.value.unshift(item);
  history.value = history.value.slice(0, 5);
  saveHistoryToLocalStorage();
};

const addToFavorites = (item) => {
  if (!favorites.value.some(fav => fav.id === item.id)) {
    favorites.value.unshift(item);
    saveFavoritesToLocalStorage();
    alert(`${item.name} has been added to your favorites!`);
  } else {
    alert(`${item.name} is already in your favorites.`);
  }
};
// Fetch danh sách truyện
async function fetchStories() {
  try {
    const response = await axios.get(`${env_config.O_TRUYEN}/home`);
    stories.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
}

fetchStories();
interface Story {
  id: number;
  title: string;
  description: string;
  genre: string;
  fileTitle: string;
  fileUrl: string;// Thay any bằng kiểu dữ liệu phù hợp nếu cần
}
const storiess = ref<Story[]>([]);



async function fetchStory() {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`${env_config.ADMIN}/Auth/GetAllStories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    storiess.value = response.data.data;
    console.log(response.data.data)
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
}


onMounted(fetchStory);



const getThumbnailUrl = (relative_url: string) => {
  return relative_url ? `https://img.otruyenapi.com/uploads/comics/${relative_url}` : '';
}
</script>

<style scoped>
.flex {
  display: flex;
}

.grid {
  display: grid;
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