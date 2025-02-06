<template>
  <div class="container">
    <h1>Link Manager</h1>
    
    <!-- Formulario de creación -->
    <form @submit.prevent="createLink" class="link-form">
      <input v-model="newLink.title" type="text" name="title" placeholder="Título" required>
      <input v-model="newLink.url" type="url" name="url" placeholder="URL" required>
      <input v-model="newLink.tags" type="text" name="tags" placeholder="Tags (separadas por coma)">
      <textarea v-model="newLink.description" name="description" placeholder="Descripción"></textarea>
      <button type="submit">Crear Link</button>
    </form>

    <!-- Filtro de tags -->
    <div id="linkFilter">
      <input v-model="tagFilter" type="text" placeholder="Filtrar por tag">
    </div>

    <!-- Lista de enlaces -->
    <div id="linkList">
      <div v-for="link in filteredLinks" :key="link.id" class="link-card">
        <h3>{{ link.title }}</h3>
        <p>Tags: {{ link.tags ? link.tags.join(', ') : '' }}</p>
        <div class="link-actions">
          <button class="vote-btn" @click="voteLink(link.id)">
            👍 ({{ link.votes || 0 }})
          </button>
          <button class="edit-btn" @click="editLink(link)">
            Editar
          </button>
          <button class="delete-btn" @click="deleteLink(link.id)">
            Eliminar
          </button>
          <router-link :to="`/link/${link.id}`" class="detail-btn">
            Ver Detalles
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/api';

export default {
  name: 'LinkList',
  data() {
    return {
      links: [],
      tagFilter: '',
      newLink: {
        title: '',
        url: '',
        description: '',
        tags: ''
      }
    };
  },
  computed: {
    filteredLinks() {
      if (!this.tagFilter.trim()) return this.links;
      
      return this.links.filter(link => 
        link.tags && link.tags.some(tag => 
          tag.toLowerCase().includes(this.tagFilter.toLowerCase().trim())
        )
      );
    }
  },
  methods: {
    async fetchLinks() {
      try {
        const response = await fetch(`${API_URL}/links`);
        if (!response.ok) throw new Error('Error al obtener los enlaces');
        const data = await response.json();
        this.links = data.links;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async createLink(event) {
      try {
        const linkData = {
          ...this.newLink,
          tags: this.newLink.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        const response = await fetch(`${API_URL}/links`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(linkData)
        });

        if (!response.ok) throw new Error('Error al crear el enlace');

        await this.fetchLinks();
        this.newLink = { title: '', url: '', description: '', tags: '' };
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async voteLink(linkId) {
      try {
        const response = await fetch(`${API_URL}/links/${linkId}/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ vote: 1 })
        });

        if (!response.ok) throw new Error('Error al votar');
        await this.fetchLinks();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async editLink(link) {
      const newTitle = prompt('Editar título', link.title);
      const newUrl = prompt('Editar URL', link.url);
      const newDescription = prompt('Editar descripción', link.description);
      const newTags = prompt('Editar tags (separadas por coma)', link.tags.join(','));

      if (newTitle && newUrl) {
        try {
          const response = await fetch(`${API_URL}/links/${link.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              title: newTitle,
              url: newUrl,
              description: newDescription || '',
              tags: newTags ? newTags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
            })
          });

          if (!response.ok) throw new Error('Error al editar el enlace');
          await this.fetchLinks();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    },
    async deleteLink(linkId) {
      if (!confirm('¿Estás seguro de eliminar este enlace?')) return;
      
      try {
        const response = await fetch(`${API_URL}/links/${linkId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar el enlace');
        await this.fetchLinks();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  },
  mounted() {
    this.fetchLinks();
  }
};
</script>

<style scoped>
.link-form {
  background: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.link-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.vote-btn, .edit-btn, .delete-btn, .detail-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  text-align: center;
}

.vote-btn {
  background: #007bff;
  color: white;
}

.edit-btn {
  background: #ffc107;
  color: black;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.detail-btn {
  background: #28a745;
  color: white;
}

#linkFilter {
  margin: 15px 0;
}

.link-card {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
