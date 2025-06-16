<template>
    <div class="container mx-auto py-8">
        <h1 class="text-2xl font-bold mb-4">Admin Manager</h1>
        <div v-if="isLoggedIn && isAdmin">
            <!-- Manage Stories -->
            <section>
                <h2 class="text-xl font-semibold mb-4">Manage Stories</h2>
                <button @click="openCreateStoryModal" class="bg-blue-500 text-white px-4 py-2 rounded">Create New
                    Story</button>
                <ul class="mt-4">
                    <li v-for="story in stories" :key="story.id"
                        class="border-b py-2 flex justify-between items-center">
                        <div>
                            <p class="font-semibold">{{ story.name }}</p>
                            <p class="text-sm text-gray-600">{{ story.status }}</p>
                        </div>
                        <div>
                            <button @click="openEditStoryModal(story)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded mx-2">Edit</button>
                            <button @click="deleteStory(story.id)"
                                class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </li>
                </ul>
            </section>

            <!-- Manage Rankings -->
            <section class="mt-8">
                <h2 class="text-xl font-semibold mb-4">Manage Rankings</h2>
                <button @click="openCreateRankingModal" class="bg-blue-500 text-white px-4 py-2 rounded">Create New
                    Ranking</button>
                <ul class="mt-4">
                    <li v-for="ranking in rankings" :key="ranking.id"
                        class="border-b py-2 flex justify-between items-center">
                        <div>
                            <p class="font-semibold">{{ ranking.name }}</p>
                            <p class="text-sm text-gray-600">{{ ranking.type }}</p>
                        </div>
                        <div>
                            <button @click="openEditRankingModal(ranking)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded mx-2">Edit</button>
                            <button @click="deleteRanking(ranking.id)"
                                class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </li>
                </ul>
            </section>

            <!-- Manage Categories -->
            <section class="mt-8">
                <h2 class="text-xl font-semibold mb-4">Manage Categories</h2>
                <button @click="openCreateCategoryModal" class="bg-blue-500 text-white px-4 py-2 rounded">Create New
                    Category</button>
                <ul class="mt-4">
                    <li v-for="category in categories" :key="category.id"
                        class="border-b py-2 flex justify-between items-center">
                        <div>
                            <p class="font-semibold">{{ category.name }}</p>
                            <p class="text-sm text-gray-600">{{ category.slug }}</p>
                        </div>
                        <div>
                            <button @click="openEditCategoryModal(category)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded mx-2">Edit</button>
                            <button @click="deleteCategory(category.id)"
                                class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </li>
                </ul>
            </section>

            <!-- Add more sections for other entities as needed -->
        </div>
        <div v-else>
            <p class="text-red-500">You do not have access to this page.</p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import env_config from '../env_config.js';

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
const rankings = ref([
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
const categories = ref([
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
const isLoggedIn = ref(false);
const isAdmin = ref(false);

onMounted(async () => {
    const token = localStorage.getItem('token');
    if (token) {
        isLoggedIn.value = true;
        try {
            const response = await axios.get(`${env_config.ADMIN}/auth/GetUser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = response.data;
            isAdmin.value = user.roles.includes('Admin');
            if (isAdmin.value) {
                await fetchStories();
                await fetchRankings();
                await fetchCategories();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
});

async function fetchStories() {
    try {
        const response = await axios.get(`${env_config.ADMIN}/story`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        stories.value = response.data.data.items;
    } catch (error) {
        console.error('Error fetching stories:', error);
    }
}

async function fetchRankings() {
    try {
        const response = await axios.get(`${env_config.ADMIN}/story/BangXepHang`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        rankings.value = response.data.items;
    } catch (error) {
        console.error('Error fetching rankings:', error);
    }
}

async function fetchCategories() {
    try {
        const response = await axios.get(`${env_config.ADMIN}/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        categories.value = response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function openCreateStoryModal() {
    // logic to open the modal for creating a new story
}

function openEditStoryModal(story) {
    // logic to open the modal for editing an existing story
}

async function deleteStory(id) {
    try {
        await axios.delete(`${env_config.ADMIN}/story/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        stories.value = stories.value.filter((story) => story.id !== id);
    } catch (error) {
        console.error('Error deleting story:', error);
    }
}

function openCreateRankingModal() {
    // logic to open the modal for creating a new ranking
}

function openEditRankingModal(ranking) {
    // logic to open the modal for editing an existing ranking
}

async function deleteRanking(id) {
    try {
        await axios.delete(`${env_config.ADMIN}/story/BangXepHang/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        rankings.value = rankings.value.filter((ranking) => ranking.id !== id);
    } catch (error) {
        console.error('Error deleting ranking:', error);
    }
}

function openCreateCategoryModal() {
    // logic to open the modal for creating a new category
}

function openEditCategoryModal(category) {
    // logic to open the modal for editing an existing category
}

async function deleteCategory(id) {
    try {
        await axios.delete(`${env_config.ADMIN}/categories/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        categories.value = categories.value.filter((category) => category.id !== id);
    } catch (error) {
        console.error('Error deleting category:', error);
    }
}
</script>
<style scoped>
.container {
    padding: 20px;
}
</style>
