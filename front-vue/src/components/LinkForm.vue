<template>
    <form @submit.prevent="createLink">
      <input v-model="title" type="text" placeholder="Título" required />
      <input v-model="url" type="url" placeholder="URL" required />
      <input v-model="tags" type="text" placeholder="Tags (separadas por coma)" />
      <textarea v-model="description" placeholder="Descripción"></textarea>
      <button type="submit">Crear Link</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: '',
        url: '',
        description: '',
        tags: ''
      };
    },
    methods: {
      async createLink() {
        const link = {
          title: this.title,
          url: this.url,
          description: this.description,
          tags: this.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        try {
          await fetch('http://localhost:3000/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(link)
          });
          this.$emit('linkAdded');
          this.title = '';
          this.url = '';
          this.description = '';
          this.tags = '';
        } catch (error) {
          console.error('Error al crear enlace:', error);
        }
      }
    }
  };
  </script>
  