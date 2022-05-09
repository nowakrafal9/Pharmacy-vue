<template>
  <div v-if="store.state.loadPage">
    <div v-if="!store.state.isBlocked">
      <Navbar />
      <div class="input-group mt-3 ms-3 w-50 justify-content-center">
        <input
          type="search"
          class="form-control"
          placeholder="Product name"
          aria-label="Search"
          aria-describedby="search-addon"
          v-model="this.productName"
        />
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="this.selectedBrand"
        >
          <option>All brands</option>
          <option v-for="item in this.brands" :key="item.id">
            {{ item.name }}
          </option>
        </select>
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="this.selectedCategory"
        >
          <option>All categories</option>
          <option v-for="item in this.category" :key="item.id">
            {{ item.name }}
          </option>
        </select>
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="filterData"
        >
          search
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="clearFilter"
        >
          clear
        </button>
      </div>

      <div class="splitContent">
        <div class="d-flex align-baseline justify-content-center">
          <div class="m-3 w-100" v-if="this.dataDownloaded">
            <table class="table table-striped table-dark w-100">
              <thead>
                <tr>
                  <th scope="col">Product name</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Category</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody v-if="this.products.length > 0">
                <tr v-for="(item, index) in this.products" :key="item.id">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.brand }}</td>
                  <td>{{ item.category }}</td>
                  <td>
                    <button
                      class="btn btn-outline-success"
                      @click="showDetail(index)"
                    >
                      <i class="bi bi-search"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4">No data found</td>
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

        <div
          class="d-flex align-baseline justify-content-center"
          v-if="this.show"
        >
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
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      v-if="this.editPrice"
                      class="btn btn-outline-secondary"
                      @click="saveChanges()"
                    >
                      <i class="bi bi-check-square"></i>
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
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      v-if="this.editQuantity"
                      class="btn btn-outline-secondary"
                      @click="saveChanges()"
                    >
                      <i class="bi bi-check-square"></i>
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
    </div>
    <div v-else class="m-3">
      <h2>
        Your account is currently blocked. <br />
        Contact with administrator to unlock your account
      </h2>
      <button @click="Logout">Logout</button>
    </div>
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
import Navbar from "../components/NavbarComponent.vue";
import { brands, category } from "../data/FilterData.js";

export default {
  components: { Navbar },
  data() {
    return {
      products: [],
      show: false,
      dataDownloaded: false,
      currentIndex: null,

      editPrice: false,
      editQuantity: false,

      editedValue: null,

      productName: "",
      selectedBrand: "All brands",
      selectedCategory: "All categories",

      previousProductName: "",
      previousSelectedBrand: "All brands",
      previousSelectedCategory: "All categories",
    };
  },
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
      brands,
      category,
    };
  },
  created() {
    this.getAllData();
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
          this.products[this.currentIndex].quantity = this.editedValue;
          db.collection("products")
            .doc(this.products[this.currentIndex].id)
            .update("quantity", this.products[this.currentIndex].quantity);
        }
      }
    },
    getAllData: function () {
      this.products = [];

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
          this.dataDownloaded = true;
        });
    },
    filterData: function () {
      if (
        this.previousProductName != this.productName ||
        this.previousSelectedBrand != this.selectedBrand ||
        this.previousSelectedCategory != this.selectedCategory
      ) {
        this.previousProductName = this.productName;
        this.previousSelectedBrand = this.selectedBrand;
        this.previousSelectedCategory = this.selectedCategory;

        this.dataDownloaded = false;

        this.editPrice = false;
        this.editQuantity = false;
        this.show = false;
      }

      if (!this.dataDownloaded) {
        this.products = [];

        let productRef = db.collection("products");
        if (this.productName != "") {
          productRef = productRef.where("productName", ">=", this.productName);
          productRef = productRef.where(
            "productName",
            "<=",
            this.productName + "uf8ff"
          );
        }
        if (this.selectedCategory != "All categories") {
          productRef = productRef.where(
            "category",
            "==",
            this.selectedCategory
          );
        }
        if (this.selectedBrand != "All brands") {
          productRef = productRef.where("brand", "==", this.selectedBrand);
        }

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
            this.dataDownloaded = true;
          });
      }
    },
    clearFilter: function () {
      if (
        this.previousProductName != "" ||
        this.previousSelectedBrand != "All brands" ||
        this.previousSelectedCategory != "All categories"
      ) {
        this.dataDownloaded = false;

        this.editPrice = false;
        this.editQuantity = false;
        this.show = false;
      }

      if (!this.dataDownloaded) {
        this.getAllData();
      }

      this.productName = "";
      this.selectedBrand = "All brands";
      this.selectedCategory = "All categories";

      this.previousProductName = "";
      this.previousSelectedBrand = "All brands";
      this.previousSelectedCategory = "All categories";
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