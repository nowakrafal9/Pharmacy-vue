<template>
  <Navbar />

  <div>
    <h2>Register employee</h2>
    <input type="text" placeholder="email" v-model="this.email" /> <br />
    <input type="password" placeholder="password" v-model="this.password" />
    <br />
    <input type="name" placeholder="name" v-model="this.name" /> <br />
    <input type="surname" placeholder="surname" v-model="this.surname" />
    <br />
    <br />
    <button class="btn btn-secondary" @click="createUser()">
      Register user
    </button>
  </div>
</template>

<script>
import { db, auth } from "../main.js";
import store from "../store/index.js";
import Navbar from "../components/NavbarComponent.vue";

export default {
  components: { Navbar },
  data() {
    return {
      email: "",
      password: "",
      name: "",
      surname: "",
      uid: "",
    };
  },
  methods: {
    createUser: function () {
      if (
        this.email != "" &&
        this.password != "" &&
        this.name != "" &&
        this.surname != ""
      ) {
        auth
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
    },
    createDocForUser: function (uid) {
      db.collection("users")
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