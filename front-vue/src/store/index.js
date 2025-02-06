import { createStore } from 'vuex';

const store = createStore({
  state: {
    links: []
  },
  mutations: {
    setLinks(state, links) {
      state.links = links;
    }
  },
  actions: {
    async fetchLinks({ commit }) {
      try {
        const response = await fetch('http://localhost:3000/api/links');
        const data = await response.json();
        commit('setLinks', data.links);
      } catch (error) {
        console.error('Error al obtener enlaces:', error);
      }
    }
  }
});

export default store;
