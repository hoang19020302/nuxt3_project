<template>
  <div class="flex">
    <div class="basis-2/3  grid grid-cols-2 gap-5">
      <h1 class="font-bold col-span-2 ">Editor's Recommendation</h1>
      <div v-for="item in stories" :key="item.id" class="col-span-1">
        <p>Name: {{ item.name }}
        </p>
        <p>New Chapter: <a :href="item.chaptersLatest[0].chapter_api_data">{{ item.chaptersLatest[0].filename }}</a>
        </p>
      </div>
    </div>
    <div class="basis-1/3">
      Dang doc
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import env_config from './../env_config.js';
import axios from "axios";

interface homepage {
  isOpen: boolean;
  fetchAndToggle: (type: string) => void;
}
const props = defineProps<homepage>();
async function fetchAndToggle(type: string) {
  props.fetchAndToggle(type);
}

console.log(env_config)
const route = useRoute()
const stories = ref([{
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
}])

async function fetchHome() {
  let url = `https://otruyenapi.com/v1/api/home`
  try {
    const response = await axios.get(url);
    stories.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
}

await axios.get(`${env_config.O_TRUYEN}/home`).then((response) => {
  stories.value = response.data.data.items
  console.log(stories.value)
})
</script>
