<script>
  import { onMount } from 'svelte';
  
  export let currentLink;
  let comments = [];
  
  async function fetchComments() {
    try {
      const response = await fetch(`http://localhost:3000/api/links/${currentLink.id}/comments`);
      const data = await response.json();
      if (response.ok) {
        comments = data.comments || [];
      } else {
        comments = []; // Si no hay comentarios, inicializamos como array vacío
      }
    } catch (error) {
      console.error('Error:', error);
      comments = [];
    }
  }
  
  async function handleComment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
      await fetch(`http://localhost:3000/api/links/${currentLink.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          content: formData.get('content')
        })
      });
      
      await fetchComments();
      event.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo añadir el comentario');
    }
  }

  // Agregamos la función voteLink que faltaba
  async function voteLink(linkId) {
    try {
      await fetch(`http://localhost:3000/api/links/${linkId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: 1 })
      });
      // Actualizamos el currentLink después de votar
      const response = await fetch(`http://localhost:3000/api/links/${linkId}`);
      const data = await response.json();
      if (response.ok) {
        currentLink = data.link;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo registrar el voto');
    }
  }
  
  onMount(fetchComments);
</script>

<div class="link-detail">
  <h1>{currentLink.title}</h1>
  
  <div class="link-info">
    <p><strong>URL:</strong> <a href={currentLink.url} target="_blank">{currentLink.url}</a></p>
    <p><strong>Descripción:</strong> {currentLink.description}</p>
    <div class="vote-section">
      <button on:click={() => voteLink(currentLink.id)}>
        👍 Votos: {currentLink.votes || 0}
      </button>
    </div>
  </div>

  <h2>Comentarios</h2>
  <form on:submit={handleComment}>
    <input name="email" type="email" placeholder="Tu email" required>
    <textarea name="content" placeholder="Escribe tu comentario" required></textarea>
    <button type="submit">Enviar Comentario</button>
  </form>

  <div id="commentList">
    {#if comments.length === 0}
      <p>No hay comentarios aún</p>
    {:else}
      {#each comments as comment (comment.id)}
        <div class="comment">
          <p>{comment.content}</p>
          <small>Enviado por: {comment.email}</small>
        </div>
      {/each}
    {/if}
  </div>

  <a href="#/" class="back-link">Volver a la lista</a>
</div>

<style>
  .link-detail {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .comment {
    background: #f5f5f5;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
  }

  form {
    margin: 20px 0;
  }

  input, textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #007bff;
    text-decoration: none;
  }

  button {
    background: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style> 