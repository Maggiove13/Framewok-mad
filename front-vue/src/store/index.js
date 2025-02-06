import { createStore } from 'vuex'; //  Esta función se utiliza para crear una instancia del store.

const store = createStore({
  state: {
    links: []
  },
  mutations: {  //  Define las mutaciones del store, son métodos que modifican el estado de manera síncrona.
    setLinks(state, links) {
      state.links = links;
    }
  },
  actions: {
    async fetchLinks({ commit }) {
      try {
        const response = await fetch('http://localhost:3000/api/links');
        const data = await response.json();
        commit('setLinks', data.links); // le asigna la lista de los links al setLinks
      } catch (error) {
        console.error('Error al obtener enlaces:', error);
      }
    }
  }
});

export default store;
