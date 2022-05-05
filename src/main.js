import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import { BootstrapVue } from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAsBENdbxi9-kd7fK0AVLabdNG532Ws_Mc",
    authDomain: "vue-pharmacy-inv.firebaseapp.com",
    projectId: "vue-pharmacy-inv",
    storageBucket: "vue-pharmacy-inv.appspot.com",
    messagingSenderId: "626485688171",
    appId: "1:626485688171:web:4cc77d51781c1680d43e2e"
}
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };

createApp(App).use(store).use(router).mount('#app')