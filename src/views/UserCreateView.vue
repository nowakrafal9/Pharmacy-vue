<template>
  <Navbar />

  <div class="m-3" v-if="!this.creatingUser">
    <h2>Register employee</h2>
    <input type="text" placeholder="email" v-model="this.email" /> <br />
    <input type="password" placeholder="password" v-model="this.password" />
    <br />
    <input type="name" placeholder="name" v-model="this.name" /> <br />
    <input type="surname" placeholder="surname" v-model="this.surname" />
    <br />
    <br />
    <button class="btn btn-outline-warning" @click="createUser()">
      Register user
    </button>
  </div>
  <div class="d-flex justify-content-center mt-5" v-else>
    <div class="spinner-border" style="width: 5rem; height: 5rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../main.js";
import store from "../store/index.js";
import Navbar from "../components/NavbarComponent.vue";
import { useRouter } from "vue-router";

export default {
  components: { Navbar },
  data() {
    return {
      email: "",
      password: "",
      name: "",
      surname: "",
      uid: "",

      creatingUser: false,
    };
  },
  methods: {
    createUser: async function () {
      if (
        this.email != "" &&
        this.password != "" &&
        this.name != "" &&
        this.surname != ""
      ) {
        this.creatingUser = true;
        await auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((cred) => {
            this.createDocForUser(cred.user.uid);
          })
          .catch((err) => {
            console.log(err);
            this.feedback = err.message;
          });
      } else {
        alert("All field must be filled");
      }
      useRouter().push("/userBrowser");
    },
    createDocForUser: async function (uid) {
      await db
        .collection("users")
        .doc(uid)
        .set({
          email: this.email,
          name: this.name,
          surname: this.surname,
          role: "User",
          statusBlocked: false,
        })
        .then(() => {
          alert("User was created");
          this.email = "";
          this.password = "";
          this.name = "";
          this.surname = "";
        });

      this.creatingUser = false;
    },
  },
  setup() {
    return {
      store,
    };
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>