<template>
  <div v-if="store.state.loadPage">
    <div v-if="!store.state.isBlocked">
      <Navbar />
      <div class="m-3">
        <div class="input-group gap-2 w-50 justify-content-center">
          <input
            type="search"
            class="form-control rounded"
            placeholder="Product name"
            aria-label="Search"
            aria-describedby="search-addon"
            v-model="this.productName"
          />
          <select
            class="form-select rounded"
            aria-label="Default select example"
            v-model="this.selectedBrand"
          >
            <option>All brands</option>
            <option v-for="item in this.brands" :key="item.id">
              {{ item.name }}
            </option>
          </select>
          <select
            class="form-select rounded"
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
            class="btn btn-outline-warning rounded ms-1"
            @click="filterData"
          >
            search
          </button>
          <button
            type="button"
            class="btn btn-outline-warning rounded ms-1"
            @click="clearFilter"
          >
            clear
          </button>
        </div>

        <div class="splitContent">
          <div class="d-flex mt-3 align-baseline justify-content-center">
            <div class="w-100" v-if="this.dataDownloaded">
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
                  <tr
                    v-for="(item, index) in this.products.slice(
                      this.firstRecord,
                      this.lastRecord
                    )"
                    :key="item.id"
                  >
                    <td>{{ item.productName }}</td>
                    <td>{{ item.brand }}</td>
                    <td>{{ item.category }}</td>
                    <td>
                      <button
                        class="btn btn-outline-warning"
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

              <ul class="pagination align-baseline justify-content-center">
                <li class="page-item">
                  <button
                    @click="FirstPage"
                    class="btn btn-outline-warning me-2"
                  >
                    <i class="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li class="page-item">
                  <button
                    @click="PreviousPage"
                    class="btn btn-outline-warning me-2"
                  >
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li
                  class="
                    page-item
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                >
                  <span class="ms-2 me-2 d-flex"
                    >{{ this.currentPage }} / {{ this.numOfPages }}</span
                  >
                </li>
                <li class="page-item">
                  <button
                    @click="NextPage"
                    class="btn btn-outline-warning ms-2"
                  >
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li class="page-item">
                  <button
                    @click="LastPage"
                    class="btn btn-outline-warning ms-2"
                  >
                    <i class="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </ul>
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
                      <input
                        type="number"
                        class="rounded"
                        v-model="this.editedValue"
                      />
                    </td>
                    <td>
                      <button
                        class="btn btn-outline-warning"
                        @click="editField('price')"
                        v-if="!this.editPrice"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button
                        class="btn btn-outline-warning"
                        @click="editField('price')"
                        v-else
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                      <button
                        v-if="this.editPrice"
                        class="btn btn-outline-warning ms-3"
                        @click="saveChanges()"
                      >
                        <i class="bi bi-check-lg"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Quantity:</td>
                    <td v-if="!this.editQuantity">
                      {{ this.products[this.currentIndex].quantity }} szt.
                    </td>
                    <td v-else>
                      <input
                        type="number"
                        class="rounded"
                        v-model="this.editedValue"
                      />
                    </td>
                    <td>
                      <button
                        class="btn btn-outline-warning"
                        @click="editField('quantity')"
                        v-if="!this.editQuantity"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button
                        class="btn btn-outline-warning"
                        @click="editField('quantity')"
                        v-else
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                      <button
                        v-if="this.editQuantity"
                        class="btn btn-outline-warning ms-3"
                        @click="saveChanges()"
                      >
                        <i class="bi bi-check-lg"></i>
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
    </div>
    <div v-else class="m-3">
      <h2>
        Your account is currently blocked. <br />
        Contact with administrator to unlock your account
      </h2>
      <button @click="Logout" class="btn btn-outline-warning">Logout</button>
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

      numOfRecords: 0,
      recordsPerPage: 10,
      numOfPages: 0,
      recordsOnLastPage: 0,

      firstRecord: 0,
      lastRecord: 0,
      currentPage: 1,
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
    filterData: async function () {
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

        await productRef
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
    getAllData: async function () {
      this.products = [];

      let productRef = db.collection("/products");
      await productRef
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

      this.setPages();
    },
    FirstPage: function () {
      this.currentPage = 1;

      this.firstRecord = 0;
      this.lastRecord = this.recordsPerPage;

      this.closeDetails();
    },
    PreviousPage: function () {
      if (this.currentPage > 1) {
        this.currentPage--;

        this.firstRecord -= this.recordsPerPage;
        this.lastRecord -= this.recordsPerPage;

        this.closeDetails();
      }
    },
    NextPage: function () {
      if (this.currentPage != this.numOfPages) {
        this.currentPage++;

        if (this.currentPage <= this.numOfPages) {
          this.firstRecord += this.recordsPerPage;
          this.lastRecord += this.recordsPerPage;
        }

        this.closeDetails();
      }
    },
    LastPage: function () {
      this.currentPage = this.numOfPages;

      this.firstRecord = (this.currentPage - 1) * this.recordsPerPage;
      this.lastRecord = this.currentPage * this.recordsPerPage;

      this.closeDetails();
    },
    setPages: function () {
      this.numOfRecords = this.products.length;
      this.recordsOnLastPage = this.numOfRecords % this.recordsPerPage;
      this.numOfRecords -= this.recordsOnLastPage;
      this.numOfPages = Math.floor(this.numOfRecords / this.recordsPerPage);
      if (this.recordsOnLastPage != 0) {
        this.numOfPages++;
      }

      this.firstRecord = 0;
      this.lastRecord = this.recordsPerPage;
    },
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
    closeDetails: function () {
      this.show = false;
      this.editPrice = false;
      this.editQuantity = false;
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