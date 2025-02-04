<script>
  import { onMount } from 'svelte';
  import LinkList from './components/LinkList.svelte';
  import LinkDetail from './components/LinkDetail.svelte';
  
  let currentLink = null;
  let error = null;
  
  async function handleRoute() {
    const hash = window.location.hash;
    if (hash.startsWith('#/link/')) {
      const linkId = hash.split('/')[2];
      try {
        await fetchLinkDetail(linkId);
      } catch (err) {
        console.error('Error al cargar el detalle:', err);
        window.location.hash = '#/'; // Redirigir a la lista si hay error
      }
    } else {
      currentLink = null;
      error = null;
    }
  }
  
  async function fetchLinkDetail(linkId) {
    try {
      const response = await fetch(`http://localhost:3000/api/links/${linkId}`);
      if (!response.ok) {
        throw new Error('Link no encontrado');
      }
      const data = await response.json();
      currentLink = data.link;
    } catch (err) {
      error = err.message;
      throw err;
    }
  }
  
  onMount(() => {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
    
    return () => {
      window.removeEventListener('hashchange', handleRoute);
    };
  });
</script>

<main>
  {#if error}
    <div class="error">
      <p>{error}</p>
      <a href="#/">Volver a la lista</a>
    </div>
  {:else if currentLink}
    <LinkDetail {currentLink} />
  {:else}
    <LinkList />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .error {
    background: #fff3f3;
    color: #dc3545;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    text-align: center;
  }

  .error a {
    color: #0066cc;
    text-decoration: none;
    margin-top: 10px;
    display: inline-block;
  }
</style> 