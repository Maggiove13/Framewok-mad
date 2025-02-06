import { createRouter, createWebHashHistory } from 'vue-router';
import LinkDetail from '../components/LinkDetail.vue';
import LinkList from '../components/LinkList.vue';

const routes = [
  { path: '/', component: LinkList },
  { path: '/link/:id', component: LinkDetail, props: true }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
