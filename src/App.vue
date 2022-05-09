<template>
  <router-view />
</template>

<script>
import { onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { auth } from "./main.js";
import store from "./store/index.js";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          router.replace("/login");
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace("/");
        }
      });

      if (store.state.loggedUser == "") {
        auth.signOut();
        router.replace("/login");
      }
    });

    return {
      store,
    };
  },
};
</script>

<style lang="scss">
body {
  background: #2c3e50;
  color: #fff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
