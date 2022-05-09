<template>
  <div class="login">
    <h1>Register</h1>
    <form @submit.prevent="Register">
      <input type="text" placeholder="email" v-model="email" /> <br />
      <input type="password" placeholder="password" v-model="password" /> <br />
      <input type="submit" value="Register" />
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

    const Register = () => {
      auth
        .createUserWithEmailAndPassword(email.value, password.value)
        .catch((err) => alert(err.message));
    };

    return {
      Register,
      email,
      password,
    };
  },
};
</script>

<style>
</style>