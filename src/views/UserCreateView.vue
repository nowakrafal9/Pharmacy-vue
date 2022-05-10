<template>
  <Navbar />

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
      v-if="!this.creatingUser"
    >
      <h2 class="m-0">Register employee</h2>
      <div class="form-floating" style="color: gray">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="this.email"
        />
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="this.password"
        />
        <label for="floatingInput">Password</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="this.name"
        />
        <label for="floatingInput">Name</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="this.surname"
        />
        <label for="floatingInput">Surname</label>
      </div>
      <button class="btn btn-outline-warning" @click="createUser()">
        Register user
      </button>
    </div>
    <div class="d-flex justify-content-center mt-5" v-else>
      <div
        class="spinner-border"
        style="width: 5rem; height: 5rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
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
  setup() {
    const router = useRouter();

    return {
      store,
      router,
    };
  },
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
          this.email = "";
          this.password = "";
          this.name = "";
          this.surname = "";
          this.router.push("/userBrowser");
        });

      this.creatingUser = false;
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>