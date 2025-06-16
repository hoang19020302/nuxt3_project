<template>
  <div class="flex">
    <div class="basis-2/3  grid grid-cols-2 gap-5">
      <h1 class="font-bold col-span-2 ">Editor's Recommendation</h1>
      <div v-for="item in stories" :key="item.id" class="col-span-1">
        <img :src="getThumbnailUrl(item.thumb_url)" class="thumbnail" v-if="item.thumb_url" />
        <p>Name:
          <router-link :to="{ name: 'StoryDetail', params: { slug: item.slug } }" class="block hover:bg-gray-200 p-2">
            {{ item.name }}
          </router-link>
        </p>
        <p>New Chapter:
          <a :href="item.chaptersLatest[0].chapter_api_data">{{ item.chaptersLatest[0].filename }}</a>
        </p>
      </div>
    </div>
    <div class="basis-1/3">
      Dang doc
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import env_config from './../env_config.js';
import axios from "axios";

const route = useRoute();

// Hàm này để lấy đường dẫn ảnh đầy đủ từ đường dẫn tương đối
const getThumbnailUrl = (relativeUrl) => {
  if (relativeUrl) {
    return `https://img.otruyenapi.com/uploads/comics/${relativeUrl}`;
  }
  return '';
};

const stories = ref([
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

// Gọi API khi component đã được mount
onMounted(async () => {
  try {
    const response = await axios.get(`${env_config.O_TRUYEN}/home/${route.params.slug}`);
    stories.value = response.data.data.items;
    console.log(stories.value);
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
});

console.log(route.params.slug);
</script>
