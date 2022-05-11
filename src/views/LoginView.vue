<template>
  <div
    class="
      mt-3
      d-flex
      flex-column
      align-items-center
      justify-content-center
      gap-3
    "
  >
    <div
      class="
        d-flex
        flex-column
        align-items-center
        justify-content-center
        gap-3
        p-4
        shadow
        rounded
      "
      style="background: hsl(210, 29%, 35%)"
    >
      <h2 class="m-0">Pharmatory</h2>
      <form @submit.prevent="Login">
        <div class="form-floating" style="color: gray">
          <input
            type="email"
            class="form-control"
            id="emailInput"
            placeholder="name@example.com"
            v-model="email"
            required
          />
          <label for="emailInput">Email address</label>
        </div>
        <div class="form-floating mt-3" style="color: gray">
          <input
            type="password"
            class="form-control"
            id="passInput"
            placeholder="name@example.com"
            v-model="password"
            required
          />
          <label for="passInput">Password</label>
        </div>
        <br />
        <input type="submit" value="Login" class="btn btn-outline-warning" />
      </form>
    </div>
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