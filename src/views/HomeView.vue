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
              <a class="nav-link active" aria-current="page">Home</a>
            </router-link>
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

  <div class="splitContent">
    <div class="d-flex align-baseline justify-content-center">
      <div class="m-3 w-100" v-if="this.products.length > 0">
        <table class="table table-striped table-dark w-100">
          <thead>
            <tr>
              <th scope="col">Product name</th>
              <th scope="col">Brand</th>
              <th scope="col">Category</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.products" :key="item.id">
              <td>{{ item.productName }}</td>
              <td>{{ item.brand }}</td>
              <td>{{ item.category }}</td>
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
              <th colspan="3" scope="col">Product details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="w-25">Product name:</td>
              <td class="w-50">
                {{ this.products[this.currentIndex].productName }}
              </td>
              <td class="w-25"></td>
            </tr>
            <tr>
              <td>Brand name:</td>
              <td>{{ this.products[this.currentIndex].brand }}</td>
              <td></td>
            </tr>
            <tr>
              <td>Category:</td>
              <td>{{ this.products[this.currentIndex].category }}</td>
              <td></td>
            </tr>
            <tr>
              <td>Item price:</td>
              <td v-if="!this.editPrice">
                {{ this.products[this.currentIndex].price }} zł
              </td>
              <td v-else>
                <input type="number" v-model="this.editedValue" />
              </td>
              <td>
                <button
                  class="btn btn-outline-secondary"
                  @click="editField('price')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    />
                  </svg>
                </button>
                <button
                  v-if="this.editPrice"
                  class="btn btn-outline-secondary"
                  @click="saveChanges()"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                    />
                    <path
                      d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td>Quantity:</td>
              <td v-if="!this.editQuantity">
                {{ this.products[this.currentIndex].quantity }} szt.
              </td>
              <td v-else>
                <input type="number" v-model="this.editedValue" />
              </td>
              <td>
                <button
                  class="btn btn-outline-secondary"
                  @click="editField('quantity')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td>Overall price:</td>
              <td>
                {{
                  this.products[this.currentIndex].price *
                  this.products[this.currentIndex].quantity
                }}
                zł
              </td>
              <td></td>
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
      products: [],
      show: false,
      currentIndex: null,

      editPrice: false,
      editQuantity: false,

      editedValue: null,
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
    productRef
      .orderBy("productName", "asc")
      .get()
      .then((snapshot) => {
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
  methods: {
    showDetail: function (index) {
      this.show = true;
      this.editPrice = false;
      this.editQuantity = false;

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
    editField: function (fieldToEdit) {
      if (fieldToEdit == "price") {
        if (this.editPrice) {
          this.editPrice = false;
          return;
        }
        this.editPrice = true;
        this.editQuantity = false;
        this.editedValue = this.products[this.currentIndex].price;
      }
      if (fieldToEdit == "quantity") {
        if (this.editQuantity) {
          this.editQuantity = false;
          return;
        }
        this.editQuantity = true;
        this.editPrice = false;
        this.editedValue = this.products[this.currentIndex].quantity;
      }
    },
    saveChanges: function () {
      if (this.editPrice) {
        this.editPrice = false;
        if (this.editedValue != this.products[this.currentIndex].price) {
          this.products[this.currentIndex].price = this.editedValue;
          db.collection("products")
            .doc(this.products[this.currentIndex].id)
            .update("price", this.products[this.currentIndex].price);
        }
      } else if (this.editQuantity) {
        this.editQuantity = false;
        if (this.editedValue != this.products[this.currentIndex].quantity) {
          this.quantity[this.currentIndex].price = this.editedValue;
          db.collection("products")
            .doc(this.products[this.currentIndex].id)
            .update("quantity", this.products[this.currentIndex].quantity);
        }
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