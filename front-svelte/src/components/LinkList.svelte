<script>
  import { onMount } from 'svelte';
  
  let links = [];
  let tagFilter = '';
  let error = '';
  const API_URL = 'http://localhost:3000/api';
  
  $: filteredLinks = tagFilter 
    ? links.filter(link => 
        link.tags.some(tag => 
          tag.toLowerCase().includes(tagFilter.toLowerCase())
        )
      )
    : links;
    
  async function fetchLinks() {
    try {
      const response = await fetch(`${API_URL}/links`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      links = data.links;
      error = '';
    } catch (err) {
      console.error('Error fetching links:', err);
      error = 'Error al cargar los enlaces. Por favor, verifica que el servidor esté corriendo.';
    }
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
      const link = {
        title: formData.get('title'),
        url: formData.get('url'),
        description: formData.get('description') || '',
        tags: formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || []
      };

      if (!link.title || !link.url) {
        throw new Error('Título y URL son requeridos');
      }
      
      const response = await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(link)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await fetchLinks();
      event.target.reset();
      error = '';
    } catch (err) {
      console.error('Error:', err);
      error = err.message || 'No se pudo crear el enlace';
    }
  }
  
  async function voteLink(linkId) {
    if (!linkId) {
      error = 'ID del enlace no válido';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/links/${linkId}/vote`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ vote: 1 })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchLinks();
      error = '';
    } catch (err) {
      console.error('Error:', err);
      error = 'No se pudo registrar el voto';
    }
  }

  async function editLink(link) {
    if (!link || !link.id) {
      error = 'Enlace no válido';
      return;
    }

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
            tags: newTags ? newTags.split(',').map(t => t.trim()).filter(t => t) : []
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchLinks();
        error = '';
      } catch (err) {
        console.error('Error:', err);
        error = 'No se pudo editar el enlace';
      }
    }
  }

  async function deleteLink(linkId) {
    if (!linkId) {
      error = 'ID del enlace no válido';
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este enlace?')) return;
    
    try {
      const response = await fetch(`${API_URL}/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchLinks();
      error = '';
    } catch (err) {
      console.error('Error:', err);
      error = 'No se pudo eliminar el enlace';
    }
  }
  
  onMount(fetchLinks);
</script>

<h1>Link Manager</h1>

{#if error}
  <div class="error-message">
    {error}
  </div>
{/if}

<form on:submit={handleSubmit}>
  <input name="title" placeholder="Título" required>
  <input type="url" name="url" placeholder="URL" required>
  <input name="tags" placeholder="Tags (separadas por coma)">
  <textarea name="description" placeholder="Descripción"></textarea>
  <button type="submit">Crear Link</button>
</form>

<div id="linkFilter">
  <input 
    bind:value={tagFilter}
    placeholder="Filtrar por tag"
  >
</div>

<div id="linkList">
  {#each filteredLinks as link (link.id)}
    <div class="link-card">
      <h3>{link.title}</h3>
      <p>Tags: {link.tags.join(', ')}</p>
      <div class="link-actions">
        <button on:click={() => voteLink(link.id)} class="vote-btn">
          👍 ({link.votes || 0})
        </button>
        <button on:click={() => editLink(link)} class="edit-btn">Editar</button>
        <button on:click={() => deleteLink(link.id)} class="delete-btn">Eliminar</button>
        <a href={`#/link/${link.id}`}>Ver Detalles</a>
      </div>
    </div>
  {/each}
</div>

<style>
  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }

  .link-card {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .link-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
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

  input, textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  #linkFilter {
    margin: 15px 0;
  }

  form {
    background: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
</style> 