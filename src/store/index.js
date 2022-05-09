import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedUser: "",
    isAdmin: false,
    isBlocked: false,

    products: [],
    isProductsLoaded: false,
    users: [],
    isUsersLoaded: false,

    loadPage: false
  },
  getters: {
    loggedUser: state => state.loggedUser,
    isAdmin: state => state.isAdmin,
    isBlocked: state => state.isBlocked
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
