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
      v-if="!this.creatingProduct"
    >
      <h2 class="m-0">Add product</h2>
      <div class="form-floating" style="color: gray">
        <input
          type="text"
          class="form-control"
          id="nameInput"
          v-model="this.productName"
        />
        <label for="nameInput">Product name</label>
      </div>
      <div class="form-floating w-100" style="color: gray">
        <select
          name="category"
          id="category"
          class="form-select"
          v-model="this.selectedBrand"
        >
          <option value="" v-if="this.selectedBrand == ''">Choose brand</option>
          <option v-for="item in this.brands" :key="item.id">
            {{ item.name }}
          </option>
        </select>
        <label for="brand">Brand</label>
      </div>
      <div class="form-floating w-100" style="color: gray">
        <select
          name="category"
          id="category"
          class="form-select"
          v-model="this.selectedCategory"
        >
          <option value="" v-if="this.selectedCategory == ''">
            Choose category
          </option>
          <option v-for="item in this.category" :key="item.id">
            {{ item.name }}
          </option>
        </select>
        <label for="brand">Category</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="number"
          class="form-control"
          id="priceInput"
          v-model="this.price"
          required
        />
        <label for="priceInput">Price</label>
      </div>
      <div class="form-floating" style="color: gray">
        <input
          type="number"
          class="form-control"
          id="quantityInput"
          v-model="this.quantity"
          required
        />
        <label for="quantityInput">Quantity</label>
      </div>
      <button class="btn btn-outline-warning" @click="createProduct()">
        Add product
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
import { db } from "../main.js";
import store from "../store/index.js";
import Navbar from "../components/NavbarComponent.vue";
import { useRouter } from "vue-router";
import { brands, category } from "../data/FilterData.js";

export default {
  components: { Navbar },
  data() {
    return {
      productName: "",
      selectedBrand: "",
      selectedCategory: "",
      price: 0,
      quantity: 0,

      creatingProduct: false,
    };
  },
  setup() {
    const router = useRouter();

    return {
      store,
      router,
      brands,
      category,
    };
  },
  methods: {
    createProduct: async function () {
      if (
        this.productName != "" &&
        this.selectedBrand != "" &&
        this.selectedCategory != "" &&
        this.price > 0 &&
        this.quantity >= 0
      ) {
        this.productName = this.transformWord(this.productName);
        this.creatingProduct = true;
        await db
          .collection("products")
          .add({
            productName: this.productName,
            brand: this.selectedBrand,
            category: this.selectedCategory,
            price: this.price,
            quantity: this.quantity,
          })
          .then(() => {
            this.productName = "";
            this.selectedBrand = "";
            this.selectedCategory = "";
            this.price = 0;
            this.quantity = 0;
            this.router.push("/");
          })
          .catch((err) => {
            this.creatingUser = false;
            alert(err);
          });
      } else {
        alert(this.createAlert());
      }
    },
    transformWord: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    createAlert: function () {
      let alert = "";
      if (this.productName == "") {
        alert += "Product name cannot be empty \n";
      }
      if (this.selectedBrand == "") {
        alert += "Select brand \n";
      }
      if (this.selectedCategory == "") {
        alert += "Select category \n";
      }
      if (!this.price > 0) {
        alert += "Price has to be greater than 0 \n";
      }
      if (this.quantity < 0) {
        alert += "Quantity has to be equal or greater than 0 \n";
      }
      return alert;
    },
  },
};
</script>

<style>
</style>