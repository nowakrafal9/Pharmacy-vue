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
          <li class="nav-item dropdown" v-if="store.state.isAdmin">
            <a
              class="nav-link dropdown-toggle active"
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
                  ><a class="dropdown-item w-100 active"
                    >User list</a
                  ></router-link
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

  <div class="splitContent">
    <div class="d-flex align-baseline justify-content-center">
      <div class="m-3 w-100" v-if="this.users.length > 0">
        <table class="table table-striped table-dark w-100">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Name</th>
              <th scope="col">Surname</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.users" :key="item.id">
              <td>{{ item.email }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.surname }}</td>
              <td>
                <button
                  class="btn btn-outline-success"
                  @click="showDetail(index)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

    <div class="d-flex align-baseline justify-content-center" v-if="this.show">
      <div class="m-3 w-100">
        <table class="table table-striped table-dark">
          <thead>
            <tr>
              <th colspan="3" scope="col">User details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="w-25">User email:</td>
              <td class="w-50">
                {{ this.users[this.currentIndex].email }}
              </td>
              <td class="w-25"></td>
            </tr>
            <tr>
              <td>Name:</td>
              <td>{{ this.users[this.currentIndex].name }}</td>
              <td>Edit</td>
            </tr>
            <tr>
              <td>Surname:</td>
              <td>{{ this.users[this.currentIndex].surname }}</td>
              <td>Edit</td>
            </tr>
            <tr>
              <td>Role:</td>
              <td>{{ this.users[this.currentIndex].role }}</td>
              <td>Edit</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>{{ this.users[this.currentIndex].statusBlocked }}</td>
              <td>Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../main.js";
import store from "../store/index.js";

export default {
  data() {
    return {
      users: [],
      show: false,
      currentIndex: null,
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
    let usersRef = db.collection("/users");
    usersRef.get().then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let id = childSnapshot.id;
        let data = childSnapshot.data();

        this.users.push({
          id: id,
          email: data.email,
          name: data.name,
          surname: data.surname,
          role: data.role,
          statusBlocked: data.statusBlocked,
        });
      });
    });
  },
  methods: {
    showDetail: function (index) {
      this.show = true;

      if (this.currentIndex == index) {
        this.show = false;
        this.currentIndex = null;
        return;
      }

      if (this.currentIndex != index || this.currentIndex == null) {
        this.currentIndex = index;
        return;
      }
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}

.splitContent {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>