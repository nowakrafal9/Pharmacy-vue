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
          id="emailInput"
          placeholder="name@example.com"
          v-model="this.email"
        />
        <label for="emailInput">Email address</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="password"
          class="form-control"
          id="passInput"
          placeholder="name@example.com"
          v-model="this.password"
        />
        <label for="passInput">Password</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="text"
          class="form-control"
          id="nameInput"
          placeholder="name@example.com"
          v-model="this.name"
          @keypress="isLetter($event)"
        />
        <label for="nameInput">Name</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="text"
          class="form-control"
          id="surnameInput"
          placeholder="name@example.com"
          v-model="this.surname"
          @keypress="isLetter($event)"
        />
        <label for="surnameInput">Surname</label>
      </div>
      <button class="btn btn-outline-warning" @click="createUser()">
        Create user
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
import { permittedChars } from "../data/PermittedChars.js";

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
  setup() {
    const router = useRouter();

    return {
      store,
      router,
    };
  },
  methods: {
    createUser: async function () {
      if (
        this.email != "" &&
        this.email.indexOf("@") != -1 &&
        this.password != "" &&
        this.password.length >= 6 &&
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
        alert(this.createAlert());
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
    },
    transformWord: function (string) {
      string = string.toLowerCase();

      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    isLetter: function (evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode == 32 ||
        (charCode >= 65 && charCode < 122) ||
        permittedChars.indexOf(String.fromCharCode(charCode)) != -1
      ) {
        return true;
      } else {
        evt.preventDefault();
      }
    },
    createAlert: function () {
      let alert = "";
      if (this.email == "") {
        alert += "Email cannot be empty \n";
      } else if (this.email.indexOf("@") == -1) {
        alert += "Wrong format of email: example@example.com \n";
      }
      if (this.password == "") {
        alert += "Password cannot be empty \n";
      } else if (this.password.length < 6) {
        alert += "Password has to have at least 6 characters \n";
      }
      if (this.name == "") {
        alert += "Name cannot be empty \n";
      }
      if (this.surname == "") {
        alert += "Surname cannot be empty \n";
      }

      return alert;
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>