<template>
    <div class="container">
        <template v-if="data && data.item">
            <h1 class="title">{{ data.item.name }}</h1>
            <div class="content-wrapper">
                <p class="content" v-html="data.item.content"></p>
            </div>
            <div v-if="data.item.category" class="category">
                <h2>Thể loại:</h2>
                <ul>
                    <li v-for="category in data.item.category" :key="category.id" class="category-item">{{ category.name
                        }}</li>
                </ul>
            </div>
            <div v-if="data.item.author" class="author">
                <h2>Tác giả:</h2>
                <p>{{ data.item.author.join(', ') }}</p>
            </div>
            <div v-if="data.item.status" class="status">
                <h2>Tình trạng:</h2>
                <p>{{ data.item.status }}</p>
            </div>
            <div v-if="data.item.chapters" class="chapters">
                <h2>Các chương:</h2>
                <ul>
                    <li v-for="chapter in data.item.chapters[0].server_data" :key="chapter.server_name"
                        class="chapter-item">

                        <!-- <NuxtLink :to="`${data.item._id}`">{{ chapter.server_data[0].filename }}</NuxtLink> -->
                        <a class="block hover:bg-gray-200 p-2"
                            :href="`/Story/${route.params.id}/${chapter.chapter_api_data.split('/').at(-1)}`">
                            Chương: {{ chapter.chapter_name }} - {{ chapter.chapter_api_data.split("/").at(-1) }}</a>
                    </li>
                </ul>
            </div>
        </template>
        <template v-else>
            <p>Đang tải...</p>
        </template>

        <!-- Modal -->
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <iframe :src="selectedChapterApi" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import axios from "axios";
import { useRoute } from 'vue-router';
import env_config from './../../../env_config.js';

const route = useRoute();
const data = ref({
    item: {
        chapters: [{
            server_data: {},
        }],
        content: "",
        category: {},
        status: {},
        author: ""
    },
});
const selectedChapterApi = ref('');



onMounted(async () => {
    try {
        const response = await axios.get(`${env_config.O_TRUYEN}/truyen-tranh/${route.params.id}`);
        if (response.data.status === 'success') {
            data.value = response.data.data;
        } else {
            console.error('Failed to fetch data:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.content-wrapper {
    margin-top: 20px;
}

.content {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    pointer-events: auto;
}

.category {
    margin-top: 20px;
}

.category h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.category-item {
    font-size: 16px;
    color: #555;
}

.author {
    margin-top: 20px;
}

.author h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.author p {
    font-size: 16px;
    color: #555;
}

.status {
    margin-top: 20px;
}

.status h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.status p {
    font-size: 16px;
    color: #555;
}

.chapters {
    margin-top: 20px;
}

.chapters h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.chapter-item {
    font-size: 16px;
    color: #555;
}

.chapter-item a {
    color: #007bff;
    text-decoration: none;
}

.chapter-item a:hover {
    text-decoration: underline;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

iframe {
    width: 100%;
    height: 500px;
}
</style>
