<template>
    <li v-for="item in bangXepHangList" :key="item._id" class="py-1">
        <div class="item-card">
            <div class="thumbnail-container">
                <img :src="getThumbnailUrl(item.thumb_url)" class="thumbnail" v-if="item.thumb_url" width="150"
                    height="220" />
            </div>
            <div class="item-details">
                <p class="text-lg font-semibold mb-1">
                    <a :href="'/story/' + item.slug" class="hover:text-blue-500">{{ item.name }}</a>
                </p>
                <p>Status: {{ item.status }}</p>
                <!-- For example: Display genres -->
                <p>Genre:
                    <span v-for="(category, index) in item.category" :key="index">
                        {{ category.name }}{{ index !== item.category.length - 1 ? ', ' : '' }}
                    </span>
                </p>
                <!-- For example: Display link to the chapter API -->
                <p v-if="item.chaptersLatest && item.chaptersLatest.length > 0">
                    Chapter mới nhất:
                    <a :href="'/story/' + item.slug + '/' + item.chaptersLatest[0].chapter_api_data.split('/').at(-1)">
                        {{ item.chaptersLatest[0].filename }}
                    </a>
                </p>
                <p v-else>
                    Chapter mới nhất: Chưa có
                </p>

            </div>
        </div>
    </li>
</template>


<script setup lang="js">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import env_config from './../env_config.js';
import axios from "axios";
import { useHead } from '@vueuse/head';


useHead({ title: 'Ranking', });
const route = useRoute();

const bangXepHangList = ref([
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

// Gọi API để lấy dữ liệu và gán vào bangXepHangList
await axios.get(`${env_config.O_TRUYEN}/danh-sach/${route.params.slug}`).then((response) => {
    bangXepHangList.value = response.data.data.items;
    console.log(bangXepHangList.value);
});

// Hàm này để lấy đường dẫn ảnh đầy đủ từ đường dẫn tương đối
const getThumbnailUrl = (relativeUrl) => {
    if (relativeUrl) {
        return `https://img.otruyenapi.com/uploads/comics/${relativeUrl}`;
    }
    return ''; // Trả về chuỗi rỗng nếu không có đường dẫn tương đối
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