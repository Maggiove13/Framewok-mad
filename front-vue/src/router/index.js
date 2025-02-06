import { createRouter, createWebHashHistory } from 'vue-router';
//createWebHashHistory: Esta función se utiliza para crear un historial basado en el hash (#) en la URL. 
import LinkDetail from '../components/LinkDetail.vue';
import LinkList from '../components/LinkList.vue';

const routes = [
  { path: '/', component: LinkList },
  { path: '/link/:id', component: LinkDetail, props: true }
];

const router = createRouter({
  history: createWebHashHistory(), // Configura el router para utilizar las rutas basadas en el hash (#) de la URL
  routes // Configura las rutas. Es el array creado anteriormente.
});

export default router;
