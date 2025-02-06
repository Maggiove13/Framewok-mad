import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Esto debería coincidir con la ruta correcta
import store from './store';
import "./assets/styles.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
