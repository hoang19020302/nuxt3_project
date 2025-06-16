<template>
  <div>
    <!-- Navigation -->
    <nav
      class="flex justify-between items-center py-2 px-24 bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <img src="assets/logo.png" alt="Logo" class="h-16 mr-2">
        <span class="text-xl font-semibold">Nerboo</span>
      </NuxtLink>

      <!-- Dropdowns -->
      <div class="flex items-center space-x-20">
        <!-- Thể Loại Dropdown -->
        <div class="relative">
          <button @click="toggleDropdown" class="px-4 py-4 focus:outline-none hover:bg-teal-200">Category</button>
          <div v-if="isDropdownOpen" @click.away="isDropdownOpen = false"
            class="absolute top-full left-0 mt-2 p-4 bg-cyan-400 shadow-lg rounded-lg grid grid-cols-2 md:grid-cols-8 gap-32">
            <template v-for="(chunk, index) in theLoaiChunks" :key="index">
              <ul>
                <li v-for="item in chunk" :key="item._id">
                  <NuxtLink v-if="item && item._id" :to="`/category/${item.slug}`" class="block py-2 hover:bg-gray-600"
                    @click.native="isDropdownOpen = false">
                    {{ item.name }}
                  </NuxtLink>
                </li>
              </ul>
            </template>
          </div>
        </div>

        <!-- Bảng xếp hạng Dropdown -->
        <div class="relative">
          <button @click="toggleBangXepHangDropdown"
            class="px-4 py-2 focus:outline-none hover:bg-teal-600">Ranking</button>
          <div v-if="isBangXepHangDropdownOpen" @click.away="isBangXepHangDropdownOpen = false"
            class="absolute top-full left-0 mt-2 p-4 bg-cyan-400 shadow-lg rounded-lg">
            <ul>
              <li>
                <NuxtLink to="/bxh/truyen-moi" class="block py-2 hover:bg-gray-200">New Story</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/bxh/sap-ra-mat" class="block py-2 hover:bg-gray-200">Coming Soon</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/bxh/dang-phat-hanh" class="block py-2 hover:bg-gray-200">In Release</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/bxh/hoan-thanh" class="block py-2 hover:bg-gray-200">Completle</NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <select v-model="sortOption" class="mt-3 p-2 border border-gray-300 rounded-md w-full">
          <option value="name">Sắp xếp theo tên</option>
          <option value="newest">Sắp xếp theo chương mới nhất</option>
          <option value="chaptersCount">Sắp xếp theo số lượng chương</option>
        </select>
        <!-- Search -->
        <form @submit.prevent="handleSearch" class="relative">
          <input v-model="searchKeyword" @input="filterBoth"
            class="px-8 py-2 bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg"
            type="text" placeholder="Search">
          <ul v-if="filteredCategories.length || filteredStories.length"
            class="absolute left-0 mt-2 bg-black shadow-lg rounded-lg w-full max-h-60 overflow-y-auto z-50">
            <!-- Hiển thị danh mục -->
            <li v-for="category in filteredCategories" :key="category._id"
              class="px-4 py-2 hover:bg-gray-200 cursor-pointer text-white" @click="navigateToCategory(category)">
              <strong>Danh mục:</strong> {{ category.name }}
            </li>

            <!-- Hiển thị truyện -->
            <li v-for="story in filteredStories" :key="story._id"
              class="px-4 py-2 hover:bg-gray-200 cursor-pointer text-white" @click="navigateToStory(story)">
              <strong>Truyện:</strong> {{ story.name }}
            </li>
          </ul>

          <button type="submit"
            class="absolute bottom-0 mt-2 mr-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">Search</button>
        </form>
      </div>
      <!-- Buttons -->



      <!-- User Dropdown or Login Button -->
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <div class="relative">
            <button @click="toggleUserDropdown"
              class="px-4 py-2 text-gray-700 font-medium focus:outline-none hover:text-teal-600">
              <div class="flex items-center">
                <img src="assets/logo.png" alt="User Avatar" class="w-8 h-8 rounded-full">
                <span class="ml-2 text-lg font-bold text-teal-600" style="line-height: 1.5;">{{ username.user.userName
                  }}</span>
              </div>
            </button>

            <!-- Dropdown content -->
            <div v-if="isUserDropdownOpen" @click.away="isUserDropdownOpen = false"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
              <ul>
                <li>
                  <button @click="goToProfile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</button>
                </li>
                <li>
                  <button @click="goToFavorite"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Favorite</button>
                </li>
                <li>
                  <button @click="goToPostStory" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Post
                    Story</button>
                </li>
                <template v-if="username.roles.includes('Admin')">
                  <li>
                    <button @click="goToAdminPage" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admin Home
                      Page</button>
                  </li>
                </template>
                <template v-if="username.roles.includes('Admin')">
                  <li>
                    <button @click="goToAdminsPage" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Manage
                      Admin</button>
                  </li>
                </template>
                <li>
                  <button @click="logout"
                    class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Login Button -->
          <a href="/login"
            class="px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white border border-transparent rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out">
            Login
          </a>
        </template>
      </div>

    </nav>

    <!-- Main Content -->
    <main class="mx-10 my-6 bg-white rounded-lg shadow-lg p-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="px-10 py-6 bg-gray-100">
      <div class="flex justify-center items-center mb-6">
        <img src="assets/logo.png" class="h-12" alt="Logo Nerboo">
        <span class="ml-2 text-gray-700 text-lg">NerBoo</span>
      </div>
      <p class="text-center text-gray-700 mb-6">NerBoo is an open online platform, free to read thoroughly translated
        stories, contributed by
        translators, many good and outstanding stories are updated fastest with all genres of fairy tales,
        swordplay, fantasy ...</p>
      <div class="flex justify-center mb-6">
        <a href="#" class="text-teal-500 hover:text-teal-700">Android</a>
        <a href="#" class="ml-4 text-teal-500 hover:text-teal-700">IOS</a>
      </div>
      <div class="flex justify-center">
        <a href="#" class="text-gray-700 hover:text-gray-900">Terms of Service</a>
        <a href="#" class="ml-4 text-gray-700 hover:text-gray-900">Privacy Policy</a>
        <a href="#" class="ml-4 text-gray-700 hover:text-gray-900">About copyright</a>
        <a href="#" class="ml-4 text-gray-700 hover:text-gray-900">User manual</a>
        <a href="#" class="ml-4 text-gray-700 hover:text-gray-900">Download video tiktok</a>
      </div>
    </footer>
  </div>

</template>


<script setup lang="ts">
import { ref, Ref, defineAsyncComponent } from 'vue';
import axios from "axios";
import env_config from "./../env_config.js";
import { useRouter, useRoute } from 'vue-router';
// import BangXepHangDropdown from './BangXepHangDropdown.vue';


const router = useRouter();
const route = useRoute();

const sortOption = ref('name');

const auth = async () => {
  var result = await axios.get(`${env_config.ADMIN}/auth/ping`).then(response => response.status == 200 ? true : false
  )
}

const bangXepHangList: Ref<any[]> = ref([]); // Định nghĩa một mảng chứa dữ liệu từ API

const isBangXepHangDropdownOpen = ref(false);
function toggleBangXepHangDropdown() {
  isBangXepHangDropdownOpen.value = !isBangXepHangDropdownOpen.value;
  // Đồng thời đóng dropdown của Thể Loại nếu đang mở
  if (isBangXepHangDropdownOpen.value && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
}
async function fetchBangXepHangList(type: string) {
  let url = `https://otruyenapi.com/v1/api/danh-sach/${type}`;
  try {
    const response = await axios.get(url);
    if (response.data && response.data.data && response.data.data.items) {
      bangXepHangList.value = response.data.data.items;
    } else {
      bangXepHangList.value = []; // hoặc xử lý lỗi
      console.error("No items found in response:", response.data);
    }
  } catch (error) {
    console.error("Error fetching BangXepHang list:", error);
  }
}


async function fetchAndToggle(type) {
  isBangXepHangDropdownOpen.value = false;
  await fetchBangXepHangList(type);
}




async function fetchTheLoai() {
  try {
    const response = await axios.get(`${env_config.O_TRUYEN}/the-loai`);
    theLoaiList.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
}


const isDropdownOpen = ref(false);
async function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
  // Đồng thời đóng dropdown của Bảng xếp hạng nếu đang mở
  if (isDropdownOpen.value && isBangXepHangDropdownOpen.value) {
    isBangXepHangDropdownOpen.value = false;
  }
}
fetchTheLoai();

const theLoaiList: Ref<TheLoaiItem[]> = ref([]); // Danh sách các danh mục
const filteredCategories = ref<TheLoaiItem[]>([]); // Danh mục đã được lọc

interface TheLoaiItem {
  _id: string;
  name: string;
  slug: string;
  children?: TheLoaiItem[]; // Thuộc tính con, nếu có
}

const storiesList: Ref<Story[]> = ref([]); // Danh sách các truyện
const filteredStories = ref<Story[]>([]); // Truyện đã được lọc

interface Story {
  _id: string;
  name: string;
  slug: string;
  children?: Story[]; // Thuộc tính con, nếu có
}

const searchKeyword = ref(''); // Từ khóa tìm kiếm

// Hàm lọc cả danh mục và truyện
const filterBoth = () => {
  const query = searchKeyword.value.trim().toLowerCase(); // Chuyển từ khóa về chữ thường

  // Tìm kiếm trong danh mục
  filteredCategories.value = query
    ? theLoaiList.value.filter((category) => {
      const name = category.name.toLowerCase();
      return name.startsWith(query) || name.includes(query);
    })
    : [];

  // Tìm kiếm trong danh sách truyện
  filteredStories.value = query
    ? storiesList.value.filter((story) => {
      const name = story.name.toLowerCase();
      return name.startsWith(query) || name.includes(query);
    })
    : [];
};

// Hàm điều hướng tới trang chi tiết của truyện
const navigateToStory = (story: Story) => {
  window.location.href = `/Story/${story.slug}`;
};

// Hàm điều hướng tới trang danh mục
const navigateToCategory = (category: TheLoaiItem) => {
  window.location.href = `/category/${category.slug}`;
};

// Hàm xử lý khi người dùng nhấn nút tìm kiếm
const handleSearch = async () => {
  const keyword = searchKeyword.value.trim(); // Lấy từ khóa tìm kiếm
  if (keyword !== '') {
    // Điều hướng tới trang kết quả tìm kiếm với từ khóa trong query parameter
    window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
  } else {
    console.log("Keyword is empty.");
  }
};

const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
};

const theLoaiChunks: Ref<any[][]> = ref([]); // Cung cấp kiểu dữ liệu cho theLoaiChunks
fetchTheLoai().then(() => {
  theLoaiChunks.value = chunkArray(theLoaiList.value, 8); // Chia thành 10 cột
});
console.log(theLoaiChunks.value);

function toggleUserDropdown() {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
}

const isUserDropdownOpen = ref(false);
const isLoggedIn = ref(false);
const username = ref({
  "user": {
    "insertAt": "",
    "updateAt": null,
    "id": "",
    "userName": "",
    "normalizedUserName": "",
    "email": "",
    "normalizedEmail": "",
    "emailConfirmed": false,
    "passwordHash": "",
    "securityStamp": "",
    "concurrencyStamp": "",
    "phoneNumber": null,
    "phoneNumberConfirmed": false,
    "twoFactorEnabled": false,
    "lockoutEnd": null,
    "lockoutEnabled": true,
    "accessFailedCount": 0
  },
  "roles": [
    ""
  ]
}

);

// Hàm kiểm tra người dùng đã đăng nhập hay chưa
async function checkLoggedIn() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    isLoggedIn.value = true;
    try {
      const response = await axios.get(`${env_config.ADMIN}/Auth/GetUser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      console.log(response.data);
      // Kiểm tra nếu có dữ liệu và có ít nhất một người dùng
      username.value = response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  }
}

// Hàm đăng xuất
const logout = async () => {
  try {
    localStorage.removeItem('token');
    isLoggedIn.value = false;
    window.location.href = "/login"; // Điều hướng đến trang login
    // window.location.reload(); // Làm mới trang sau khi điều hướng
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
  }
}



// Gọi hàm kiểm tra đăng nhập khi tải trang
checkLoggedIn();
const goToProfile = () => {
  // Chuyển hướng đến trang profile
  window.location.href = "/profile";
  // window.location.reload(); // Làm mới trang sau khi điều hướng
}
const goToFavorite = () => {
  window.location.href = "/favorite";
}
const goToAdminPage = () => {
  window.location.href = "/admin";
}
const goToAdminsPage = () => {
  window.location.href = "/admins";
}
const goToPostStory = () => {
  router.push('/poststory'); // Redirects to the "/poststory" page
}
</script>

<style scoped>
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>