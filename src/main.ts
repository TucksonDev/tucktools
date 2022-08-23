/*
References (already copied to README, we can remove this):
    - Vue: https://vuejs.org/guide/introduction.html
    - Vue Router: https://router.vuejs.org/guide/
    - Pinia: https://pinia.vuejs.org/introduction.html
*/

// Libraries
import { createApp } from "vue";
import { createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import VueGtag from "vue-gtag";

// (Styles are imported in vite.config, because I can't seem to find the proper way to load my custom scss from here)
// import "./assets/scss/custom_bootstrap.scss";
// import "bootstrap/scss/bootstrap.scss";
// import "bootstrap-icons/font/bootstrap-icons.scss";

// Main flow components
import createRouter from "./pages/routes";
import setPageInfo from "./pages/analytics";
import App from "./App.vue";

// Create the Pinia store
const store = createPinia();

// Create the router
const router = createRouter(createWebHistory());
router.afterEach((to, from, failure) => {
    if (!failure) {
        setPageInfo(to);
    }
});

// Create App
const app = createApp(App);

// Pass the router
app.use(router);

// Pass the store
app.use(store);

// GoogleTag
if (import.meta.env.VITE_GA_ID) {
    app.use(
        VueGtag,
        {
            config: {
                id: import.meta.env.VITE_GA_ID,
            },
        },
        router
    );
}

// Mount the app
app.mount("#app");

// Bootstrap (Why does this need to be here?)
import "bootstrap/dist/js/bootstrap.js";
