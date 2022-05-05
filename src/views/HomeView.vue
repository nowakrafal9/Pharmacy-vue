<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul
          class="
            navbar-nav
            me-auto
            mb-2 mb-lg-0
            justify-content-center
            align-items-center
          "
        >
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Product browser</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Orders
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item w-100" href="#">Orders list</a></li>
              <li><a class="dropdown-item w-100" href="#">New order</a></li>
            </ul>
          </li>
        </ul>
        <div class="d-flex align-items-center justify-content-center">
          <span class="text-dark fw-bold pe-4">Logged as: {{ name }}</span>
          <button class="btn btn-outline-success" @click="Logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { auth } from "../main.js";

export default {
  setup() {
    const name = ref("");
    onBeforeMount(() => {
      const user = auth.currentUser;
      if (user) {
        name.value = user.email.split("@")[0];
      }
    });
    const Logout = () => {
      auth
        .signOut()
        .then(() => console.log("Signed out"))
        .catch((err) => alert(err.message));
    };
    return {
      name,
      Logout,
    };
  },
};
</script>