<template>
  <Navbar />

  <div class="m-3">
    <div class="input-group w-50">
      <input
        type="search"
        class="form-control rounded"
        placeholder="User email"
        aria-label="Search"
        aria-describedby="search-addon"
        v-model="this.userEmail"
      />
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

    <div class="splitContent mt-3">
      <div class="d-flex flex-column">
        <div class="w-100" v-if="this.dataDownloaded">
          <table class="table table-striped table-dark w-100">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Name</th>
                <th scope="col">Surname</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody v-if="this.users.length > 0">
              <tr v-for="(item, index) in this.users" :key="item.id">
                <td>{{ item.email }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.surname }}</td>
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
        </div>
        <div class="d-flex justify-content-center" v-else>
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
        <div class="ms-3 w-100">
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
                <td v-if="!this.editName">
                  {{ this.users[this.currentIndex].name }}
                </td>
                <td v-else>
                  <input
                    type="text"
                    class="rounded"
                    v-model="this.editedValue"
                  />
                </td>
                <td>
                  <button
                    class="btn btn-outline-warning"
                    @click="editField('name')"
                    v-if="!this.editName"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-outline-warning"
                    @click="editField('name')"
                    v-else
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                  <button
                    v-if="this.editName"
                    class="btn btn-outline-warning ms-3"
                    @click="saveChanges()"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>Surname:</td>
                <td v-if="!this.editSurname">
                  {{ this.users[this.currentIndex].surname }}
                </td>
                <td v-else>
                  <input
                    type="text"
                    class="rounded"
                    v-model="this.editedValue"
                  />
                </td>
                <td>
                  <button
                    class="btn btn-outline-warning"
                    @click="editField('surname')"
                    v-if="!this.editSurname"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-outline-warning"
                    @click="editField('surname')"
                    v-else
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                  <button
                    v-if="this.editSurname"
                    class="btn btn-outline-warning ms-3"
                    @click="saveChanges()"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>Role:</td>
                <td>{{ this.users[this.currentIndex].role }}</td>
                <td></td>
              </tr>
              <tr>
                <td>Status:</td>
                <td v-if="this.users[this.currentIndex].statusBlocked == true">
                  Blocked
                </td>
                <td v-else>Unblocked</td>
                <td v-if="this.users[this.currentIndex].role != 'Admin'">
                  <button
                    class="btn btn-outline-warning"
                    @click="changeBlockStatus()"
                  >
                    <i
                      class="bi bi-unlock"
                      v-if="this.users[this.currentIndex].statusBlocked == true"
                    ></i>
                    <i class="bi bi-lock" v-else></i>
                  </button>
                </td>
                <td v-else></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import store from "../store/index.js";
import Navbar from "../components/NavbarComponent.vue";

export default {
  components: { Navbar },
  data() {
    return {
      users: [],
      show: false,
      currentIndex: null,

      dataDownloaded: false,

      userEmail: "",
      userName: "",
      userSurname: "",

      previousUserEmail: "",
      previousUserName: "",
      previousUserSurname: "",

      editName: false,
      editSurname: false,
      editRole: false,
      editStatus: false,
    };
  },
  setup() {
    return {
      store,
    };
  },
  created() {
    this.getAllData();
  },
  methods: {
    clearFilter: function () {
      if (
        this.previousUserEmail != "" ||
        this.previousUserName != "" ||
        this.previousUserSurname != ""
      ) {
        this.dataDownloaded = false;

        this.editName = false;
        this.editSurname = false;
        this.editRole = false;
        this.editStatus = false;
        this.show = false;
      }

      if (!this.dataDownloaded) {
        this.getAllData();
      }

      this.userEmail = "";
      this.userName = "";
      this.userSurname = "";

      this.previousUserEmail = "";
      this.previousUserName = "";
      this.previousUserSurname = "";
    },
    filterData: function () {
      if (
        this.previousUserEmail != this.userEmail ||
        this.previousUserName != this.userName ||
        this.previousUserSurname != this.userSurname
      ) {
        this.previousUserEmail = this.userEmail;
        this.previousUserName = this.userName;
        this.previousUserSurname = this.userSurname;

        this.dataDownloaded = false;

        this.editName = false;
        this.editSurname = false;
        this.editRole = false;
        this.editStatus = false;
        this.show = false;
      }

      if (!this.dataDownloaded) {
        this.users = [];

        let userRef = db.collection("users");
        if (this.userEmail != "") {
          userRef = userRef.where("email", ">=", this.userEmail);
          userRef = userRef.where("email", "<=", this.userEmail + "uf8ff");
        }

        userRef
          .orderBy("email", "asc")
          .get()
          .then((snapshot) => {
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
            this.dataDownloaded = true;
          });
      }
    },
    getAllData: function () {
      this.users = [];

      let userRef = db.collection("users");
      userRef
        .where("role", "!=", "Admin")
        .orderBy("role", "asc")
        .orderBy("email", "asc")
        .get()
        .then((snapshot) => {
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
          this.dataDownloaded = true;
        });
    },
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
    editField: function (fieldToEdit) {
      if (fieldToEdit == "name") {
        if (this.editName) {
          this.editName = false;
          return;
        }
        this.clearEdit();
        this.editName = true;
        this.editedValue = this.users[this.currentIndex].name;
      }

      if (fieldToEdit == "surname") {
        if (this.editSurname) {
          this.editSurname = false;
          return;
        }
        this.clearEdit();
        this.editSurname = true;
        this.editedValue = this.users[this.currentIndex].surname;
      }

      if (fieldToEdit == "status") {
        if (this.editStatus) {
          this.editStatus = false;
          return;
        }
        this.clearEdit();
        this.editStatus = true;
        this.editedValue = this.users[this.currentIndex].statusBlocked;
      }
    },
    clearEdit: function () {
      this.editName = false;
      this.editSurname = false;
      this.editStatus = false;
    },
    changeBlockStatus: function () {
      this.users[this.currentIndex].statusBlocked =
        !this.users[this.currentIndex].statusBlocked;

      db.collection("users")
        .doc(this.users[this.currentIndex].id)
        .update("statusBlocked", this.users[this.currentIndex].statusBlocked);
    },
    saveChanges: function () {
      if (this.editName) {
        this.editName = false;
        if (this.editedValue != this.users[this.currentIndex].name) {
          this.users[this.currentIndex].name = this.editedValue;
          db.collection("users")
            .doc(this.users[this.currentIndex].id)
            .update("name", this.users[this.currentIndex].name);
        }
      } else if (this.editSurname) {
        this.editSurname = false;

        if (this.editedValue != this.users[this.currentIndex].surname) {
          this.users[this.currentIndex].surname = this.editedValue;
          db.collection("users")
            .doc(this.users[this.currentIndex].id)
            .update("surname", this.users[this.currentIndex].surname);
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