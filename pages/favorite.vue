<template>
    <div class="w-3/4 grid grid-cols-1 gap-2">
        <h2 class="font-bold text-2xl mb-5">Favorite Story</h2>
        <ul>
            <li v-for="historyItem in history" :key="historyItem.id">
                <div
                    class="flex items-center rounded-lg shadow-md overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
                    <div class="w-150px h-220px overflow-hidden rounded-l-lg">
                        <img :src="getThumbnailUrl(historyItem.thumb_url)"
                            class="w-full h-full object-cover rounded-l-lg" v-if="historyItem.thumb_url" />
                    </div>
                    <div class="flex-1 p-5">
                        <p class="text-lg font-semibold mb-1">{{ historyItem.name }}</p>
                        <p class="text-sm mb-3">New Chapter: <a :href="historyItem.chaptersLatest[0].chapter_api_data"
                                class="hover:text-blue-500">{{ historyItem.chaptersLatest[0].filename }}</a></p>
                    </div>
                </div>
            </li>
        </ul>
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
const { get: getHistory, set: setHistory, remove: removeHistory } = useHistory();
const { get: getToken, set: setToken, remove: removeToken } = useToken();

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

// Lấy danh sách lịch sử đọc từ localStorage khi trang được load
if (typeof localStorage !== 'undefined') {
    const historyString = getHistory();
    history.value = historyString ? JSON.parse(historyString) : [];
} else {
    // Trường hợp localStorage không tồn tại (ví dụ: SSR), gán giá trị mặc định cho history
    history.value = [];
}

const saveHistoryToLocalStorage = () => {
    if (typeof localStorage !== 'undefined' && isLoggedIn()) {
        setHistory(JSON.stringify(history.value));
        return true;
    }
    return false;
};


const saveHistory = (item) => {
    if (isLoggedIn()) {
        // Thêm vào lịch sử đọc
        history.value.unshift(item);
        history.value = history.value.slice(0, 5);

        saveHistoryToLocalStorage();
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
    const token = getToken();

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