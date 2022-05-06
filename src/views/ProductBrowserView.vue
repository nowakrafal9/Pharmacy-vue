<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/">
        <a class="navbar-brand">PharmaThory</a>
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
          <li class="nav-item">
            <router-link to="/">
              <a class="nav-link" aria-current="page">Home</a>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/productBrowser">
              <a class="nav-link active">Product browser</a>
            </router-link>
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
              <li>
                <router-link to="/orderBrowser"
                  ><a class="dropdown-item w-100">Orders list</a></router-link
                >
              </li>
              <li>
                <router-link to="/orderCreate"
                  ><a class="dropdown-item w-100">New order</a></router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown" v-if="store.state.isAdmin">
            <a
              class="nav-link dropdown-toggle"
              href="#"
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
          <span class="text-dark fw-bold pe-4"
            >Logged as: {{ store.state.loggedUser }}</span
          >
          <button class="btn btn-outline-success" @click="Logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div v-if="this.products.length > 0">
    Last orders

    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">Order date</th>
          <th scope="col">Ordered by</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in this.products" :key="item.id">
          <td>{{ item.productName }}</td>
          <td>{{ item.brand }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-flex justify-content-center mt-5" v-else>
    <div class="spinner-border" style="width: 5rem; height: 5rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../main.js";
import store from "../store/index.js";

export default {
  data() {
    return {
      products: [],
    };
  },
  setup() {
    const Logout = () => {
      auth
        .signOut()
        .then(() => console.log("Signed out"))
        .catch((err) => alert(err.message));
    };

    return {
      Logout,
      store,
    };
  },
  created() {
    let productRef = db.collection("/products");
    productRef.get().then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let id = childSnapshot.id;
        let data = childSnapshot.data();

        this.products.push({
          id: id,
          productName: data.productName,
          brand: data.brand,
          category: data.category,
          price: data.price,
          quantity: data.quantity,
        });
      });
    });
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>