<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="email" v-model="email" /> <br />
      <input type="password" placeholder="password" v-model="password" /> <br />
      <input type="submit" value="Login" />
      <p>
        Need an account? <router-link to="/register">Register here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../main.js";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const Login = () => {
      auth
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => console.log(data))
        .catch(() => {
          alert("Incorrect email or password");
          email.value = "";
          password.value = "";
        });
    };

    return {
      Login,
      email,
      password,
    };
  },
};
</script>

<style>
</style>