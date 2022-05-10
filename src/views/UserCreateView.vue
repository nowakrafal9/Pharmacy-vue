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
      <form @submit="createUser()">
        <div class="form-floating" style="color: gray">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="this.email"
            required
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating mt-3" style="color: gray">
          <input
            type="password"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="this.password"
            required
            minlength="6"
          />
          <label for="floatingInput">Password</label>
        </div>
        <div class="form-floating mt-3" style="color: gray">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="this.name"
            required
            @keypress="isLetter($event)"
          />
          <label for="floatingInput">Name</label>
        </div>
        <div class="form-floating mt-3" style="color: gray">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="this.surname"
            required
            @keypress="isLetter($event)"
          />
          <label for="floatingInput">Surname</label>
        </div>
        <input
          type="submit"
          value="Submit"
          class="btn btn-outline-warning mt-3"
        />
      </form>
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
        this.name = this.transformWord(this.name);
        this.surname = this.transformWord(this.surname);

        this.creatingUser = true;
        await auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((cred) => {
            this.createDocForUser(cred.user.uid);
          })
          .catch((err) => {
            this.creatingUser = false;
            alert(err);
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
    transformWord: function (string) {
      string = string.toLowerCase();

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    isLetter: function (evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if ((charCode >= 65 && charCode < 122) || charCode == 32) {
        return true;
      } else {
        evt.preventDefault();
      }
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>