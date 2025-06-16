<template>
    <div class="flex flex-col">
        <!-- Chapter: {{ items }} -->
        <img v-for="item in items.item.chapter_image" :src="`${items.domain_cdn}/${items.item.chapter_path}/${item.image_file}`"
            alt="">
        
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const items = ref([

]);

await axios.get(`https://sv1.otruyencdn.com/v1/api/chapter/${route.params.chapter}`).then((response) => {
    items.value = response.data.data

})
</script>