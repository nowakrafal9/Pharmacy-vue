<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="email" v-model="email" /> <br />
      <input type="password" placeholder="password" v-model="password" /> <br />
      <input type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import store from "../store/index";
import { auth, db } from "../main.js";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const Login = () => {
      auth
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => {
          console.log(data);
          store.state.loggedUser = email.value.split("@")[0];
          setPrivillage(data.user.uid);
        })
        .catch(() => {
          alert("Incorrect email or password");
          email.value = "";
          password.value = "";
        });
    };

    const setPrivillage = (uid) => {
      var adminsRef = db.collection("/adminUsers");
      adminsRef
        .where("id", "==", uid)
        .limit(1)
        .get()
        .then(function (snapshot) {
          if (!snapshot.empty) {
            store.state.isAdmin = true;
          }
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