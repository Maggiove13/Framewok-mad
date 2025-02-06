<template>
  <div class="link-detail" v-if="link">
    <h1>{{ link.title }}</h1>
    
    <div class="link-info">
      <p>
        <strong>URL:</strong>
        <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.url }}</a>
      </p>
      <p><strong>Descripción:</strong> {{ link.description }}</p>
      <p><strong>Tags:</strong> {{ link.tags ? link.tags.join(', ') : '' }}</p>
      
      <div class="vote-section">
        <button class="vote-btn" @click="voteLink">
          👍 Votos: {{ link.votes || 0 }}
        </button>
      </div>
    </div>

    <h2>Comentarios</h2>
    <form @submit.prevent="addComment" class="comment-form">
      <input 
        v-model="newComment.email" 
        type="email" 
        name="email" 
        placeholder="Tu email" 
        required
      >
      <textarea 
        v-model="newComment.content" 
        name="content" 
        placeholder="Escribe tu comentario" 
        required
      ></textarea>
      <button type="submit">Enviar Comentario</button>
    </form>

    <div id="commentList">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p>{{ comment.content }}</p>
        <small>Enviado por: {{ comment.email }}</small>
      </div>
      <p v-if="comments.length === 0">No hay comentarios aún</p>
    </div>

    <router-link to="/" class="back-link">
      Volver a la lista
    </router-link>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/api';

export default {
  name: 'LinkDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      link: null,
      comments: [],
      newComment: {
        email: '',
        content: ''
      }
    };
  },
  methods: {
    async fetchLink() {
      try {
        const response = await fetch(`${API_URL}/links/${this.id}`);
        if (!response.ok) throw new Error('Error al cargar el enlace');
        const data = await response.json();
        this.link = data.link;
      } catch (error) {
        console.error('Error:', error);
        this.$router.push('/');
      }
    },
    async fetchComments() {
      try {
        const response = await fetch(`${API_URL}/links/${this.id}/comments`);
        if (!response.ok) throw new Error('Error al cargar los comentarios');
        const data = await response.json();
        this.comments = data.comments;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async addComment() {
      try {
        const response = await fetch(`${API_URL}/links/${this.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.newComment)
        });

        if (!response.ok) throw new Error('Error al añadir el comentario');
        
        await this.fetchComments();
        this.newComment = { email: '', content: '' };
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async voteLink() {
      try {
        const response = await fetch(`${API_URL}/links/${this.id}/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ vote: 1 })
        });

        if (!response.ok) throw new Error('Error al votar');
        
        await this.fetchLink();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  },
  async created() {
    if (this.id) {
      await this.fetchLink();
      await this.fetchComments();
    } else {
      this.$router.push('/');
    }
  },
  watch: {
    async id(newId) {
      if (newId) {
        await this.fetchLink();
        await this.fetchComments();
      }
    }
  }
};
</script>

<style scoped>
.link-detail {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.link-info {
  margin: 20px 0;
}

.link-info p {
  margin: 10px 0;
}

.vote-section {
  margin: 15px 0;
}

.vote-btn {
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-form {
  background: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.comment {
  background: #f9f9f9;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.comment p {
  margin: 5px 0;
}

.comment small {
  color: #666;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #28a745;
  color: white;
}
</style>
