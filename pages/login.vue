<template>
    <div class="h-dvh bg-cover bg-center login-img  p-40 px-48">
        <div v-if="!isLogin" class="grid grid-cols-2 bg-white rounded-lg login-img overflow-hidden">
            <div class="p-10 col-span-1 bg-cover flex flex-col justify-around">
                <h1 class="text-center text-3xl font-bold text-cyan-600">Hello <br> friends</h1>
                <p class="text-center text-base text-cyan-600">If you had an account, login here and have fun</p>
                <div class="flex justify-center">
                    <button @click="isLogin = !isLogin"
                        class="text-white font-bold border-2 rounded-xl p-2 px-4 bg-opacity-20 bg-black hover:bg-white hover:text-black hover:bg-opacity-60">
                        Login
                    </button>
                </div>
            </div>
            <form class="p-10 col-span-1 flex flex-col justify-center gap-5 bg-white" @submit.prevent="register">
                <h1 class="text-center text-xl font-bold">Register Here</h1>
                <input class="p-2 border-b rounded" type="text" placeholder="Username"
                    v-model="register_model.username">
                <input class="p-2 border-b rounded" type="text" placeholder="Email" v-model="register_model.email">
                <input class="p-2 border-b rounded" type="text" placeholder="Password"
                    v-model="register_model.password">
                <input class="p-2 border-b rounded" type="text" placeholder="Phonenumber"
                    v-model="register_model.phonenumber">
                <!-- <input class="p-2 border-b rounded" type="text" placeholder="Address"
                    v-model="register_model.address"> -->
                <input class="p-2 rounded-lg text-white bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 font-bold"
                    type="submit" value="Register">

            </form>
        </div>
        <div v-else class="grid grid-cols-2 bg-white rounded-lg login-img overflow-hidden">
            <form class="p-10 col-span-1 flex flex-col justify-center gap-5 bg-white" @submit.prevent="login">
                <h1 class="text-center text-xl font-bold">Login Here</h1>
                <input class="p-2 border-b rounded" type="text" placeholder="Email" v-model="login_model.username">
                <input class="p-2 border-b rounded" type="password" placeholder="Password"
                    v-model="login_model.password">
                <div class="grid grid-cols-2">
                    <div class="flex gap-2 justify-center">
                        <input type="checkbox" name="remember" id="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a class="text-center" href="#">Forgot password</a>
                </div>
                <input class="p-2 rounded-lg text-white bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 font-bold"
                    type="submit" value="Login">

            </form>
            <div class="p-10 col-span-1 bg-cover flex flex-col justify-around">
                <h1 class="text-center text-3xl font-bold text-cyan-600">Start your <br> journey now</h1>
                <p class="text-center text-base text-cyan-600">If you don't have an account yet,<br> join us and start
                    your
                    journey</p>
                <div class="flex justify-center">
                    <button @click="isLogin = !isLogin"
                        class="text-white font-bold border-2 rounded-xl p-2 px-4 bg-opacity-20 bg-black hover:bg-white hover:text-black hover:bg-opacity-60">
                        Register
                    </button>
                </div>
            </div>

        </div>
    </div>

</template>
<script setup>
import axios from "axios";
import env_config from "../env_config";
import { useHead } from '@vueuse/head';


useHead({ title: 'Login', });
const isLogin = ref(true);

const login_model = ref({
    username: "",
    password: ""
})


axios.defaults.baseURL = env_config.ADMIN; // Cấu hình baseURL
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const login = async () => {
    try {
        console.log("Login payload:", login_model.value); // Debug payload
        const response = await axios.post(`${env_config.ADMIN}/Auth/Login`, login_model.value);

        if (response.data?.token) {
            console.log("Token received:", response.data.token); // Debug token
            localStorage.setItem("token", response.data.token); // Lưu token
            navigateTo('/'); // Điều hướng về trang chính
        } else {
            alert("Login failed. No token returned.");
        }
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        alert("Invalid email or password");
    }
};



const register_model = ref({
    username: "",
    email: "",
    password: "",
    phonenumber: ""
    // address: ""
})

const register = async () => {
    try {
        const response = await axios.post(`${env_config.ADMIN}/Auth/Register`, register_model.value)
        localStorage.setItem("token", response.data)
        console.log(response.data);
        // Reload trang
        window.location.reload();
        // Chuyển hướng đến trang đăng nhập
        navigateTo('/login')
    } catch (error) {
        console.error(error);
        alert("Invalid email or password")
    }
}

definePageMeta({
    layout: 'login'
})
</script>

<style scoped>
.login-img {
    background-image: url('./../assets/Login.jpg');
    background-size: cover;
}
</style>