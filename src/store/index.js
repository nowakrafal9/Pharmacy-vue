import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedUser: "",
    isAdmin: false
  },
  getters: {
    loggedUser: state => state.loggedUser,
    isAdmin: state => state.isAdmin
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
