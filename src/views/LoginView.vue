<template>
  <div class="login mt-3">
    <h1>Pharmatory</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="email" v-model="email" class="mt-3" />
      <br />
      <input
        type="password"
        placeholder="password"
        v-model="password"
        class="mt-1"
      />
      <br />
      <input type="submit" value="Login" class="btn btn-secondary mt-3" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import store from "../store/index";
import { auth, db } from "../main.js";
// import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const Login = async () => {
      await auth
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => {
          store.state.loggedUser = email.value.split("@")[0];
          setPrivillage(data.user.uid);
        })
        .catch(() => {
          alert("Incorrect email or password");
          email.value = "";
          password.value = "";
        });
    };

    const setPrivillage = async (uid) => {
      var userRef = db.collection("/users").doc(uid);
      await userRef.get().then((snapshot) => {
        if (!snapshot.isEmpty) {
          if (snapshot.data().role == "Admin") {
            store.state.isAdmin = true;
          }
          if (snapshot.data().statusBlocked == true) {
            store.state.isBlocked = true;
          }
        }
      });

      store.state.loadPage = true;
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