<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/">
        <a class="navbar-brand text-warning">PharmaThory</a>
      </router-link>
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
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-light"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Products
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link to="/"
                  ><a class="dropdown-item w-100">Product list</a></router-link
                >
              </li>
              <li>
                <router-link to="/addProduct"
                  ><a class="dropdown-item w-100">New product</a></router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown" v-if="store.state.isAdmin">
            <a
              class="nav-link dropdown-toggle text-light"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Users
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link to="/userBrowser"
                  ><a class="dropdown-item w-100">User list</a></router-link
                >
              </li>
              <li>
                <router-link to="/userCreate"
                  ><a class="dropdown-item w-100">New user</a></router-link
                >
              </li>
            </ul>
          </li>
        </ul>
        <div class="d-flex align-items-center justify-content-center">
          <span class="text-light fw-bold pe-4"
            >Logged as: {{ store.state.loggedUser }}</span
          >
          <button class="btn btn-outline-warning" @click="Logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from "../main.js";
import store from "../store/index.js";

export default {
  setup() {
    const Logout = () => {
      auth
        .signOut()
        .then(() => {
          store.state.loggedUser = "";
          store.state.isAdmin = false;
          store.state.isBlocked = false;
          store.state.loadPage = false;
        })
        .catch((err) => alert(err.message));
    };

    return {
      Logout,
      store,
    };
  },
};
</script>

<style>
</style>