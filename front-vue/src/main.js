import { createApp } from 'vue'; //Biblioteca principal de Vue.js
import App from './App.vue';
import router from './router'; 
import store from './store';
import "./assets/styles.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app'); // Monta la instancia de la aplicación en el elemento del DOM con el ID app.
