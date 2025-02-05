import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

function App() {
  const [links, setLinks] = useState([]); 
  const [filter, setFilter] = useState(""); 
  const [selectedLink, setSelectedLink] = useState(null);
  const [comments, setComments] = useState([]);
  const [newLink, setNewLink] = useState({ 
    title: '', 
    url: '', 
    description: '', 
    tags: '' 
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const response = await fetch(`${API_URL}/links`);
      if (!response.ok) throw new Error("Error al obtener los enlaces");
      const data = await response.json();
      setLinks(data.links);
    } catch (error) {
      console.error("Error al obtener enlaces:", error);
    }
  }

  async function fetchComments(linkId) {
    try {
      const response = await fetch(`${API_URL}/links/${linkId}/comments`);
      if (!response.ok) throw new Error("Error al obtener los comentarios");
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  }

  function handleInputChange(e) {
    setNewLink({ ...newLink, [e.target.name]: e.target.value });
  }

  async function handleAddLink(e) {
    e.preventDefault();
    try {
      const linkData = {
        ...newLink,
        tags: newLink.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) throw new Error('Error al guardar el enlace');
      
      await fetchLinks();
      setNewLink({ title: '', url: '', description: '', tags: '' });
    } catch (error) {
      console.error("Error al añadir el enlace:", error);
    }
  }

  async function handleVote(linkId) {
    try {
      const response = await fetch(`${API_URL}/links/${linkId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote: 1 }),
      });

      if (!response.ok) throw new Error('Error al votar');

      if (selectedLink && selectedLink.id === linkId) {
        const linkResponse = await fetch(`${API_URL}/links/${linkId}`);
        const data = await linkResponse.json();
        setSelectedLink(data.link);
      }
      
      await fetchLinks();
    } catch (error) {
      console.error("Error al votar:", error);
    }
  }

  async function handleEdit(link) {
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
          },
          body: JSON.stringify({
            title: newTitle,
            url: newUrl,
            description: newDescription || '',
            tags: newTags ? newTags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
          }),
        });

        if (!response.ok) throw new Error('Error al editar el enlace');
        await fetchLinks();
      } catch (error) {
        console.error("Error al editar el enlace:", error);
      }
    }
  }

  async function handleDelete(linkId) {
    if (window.confirm('¿Estás seguro de eliminar este enlace?')) {
      try {
        const response = await fetch(`${API_URL}/links/${linkId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar el enlace');
        await fetchLinks();
      } catch (error) {
        console.error("Error al eliminar el enlace:", error);
      }
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch(`${API_URL}/links/${selectedLink.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          content: formData.get('content')
        }),
      });

      if (!response.ok) throw new Error('Error al añadir el comentario');
      await fetchComments(selectedLink.id);
      e.target.reset();
    } catch (error) {
      console.error("Error al añadir el comentario:", error);
    }
  }

  async function handleLinkSelect(link) {
    setSelectedLink(link);
    await fetchComments(link.id);
  }

  const filteredLinks = links.filter(link => 
    !filter || (link.tags && link.tags.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    ))
  );

  return (
    <div className="container">
      <h1>Link Manager</h1>

      {!selectedLink ? (
        <>
          <form onSubmit={handleAddLink}>
            <input
              type="text"
              name="title"
              placeholder="Título del enlace"
              value={newLink.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="url"
              name="url"
              placeholder="URL del enlace"
              value={newLink.url}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={newLink.description}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (separados por comas)"
              value={newLink.tags}
              onChange={handleInputChange}
            />
            <button type="submit">Añadir Enlace</button>
          </form>

          <div id="linkFilter">
            <input
              type="text"
              placeholder="Filtrar por tag"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div id="linkList">
            {filteredLinks.map(link => (
              <div key={link.id} className="link-card">
                <h3>{link.title}</h3>
                <p>Tags: {link.tags ? link.tags.join(", ") : ""}</p>
                <div className="link-actions">
                  <button className="vote-btn" onClick={() => handleVote(link.id)}>
                    👍 ({link.votes || 0})
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(link)}>
                    Editar
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(link.id)}>
                    Eliminar
                  </button>
                  <button onClick={() => handleLinkSelect(link)}>
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="link-detail">
          <h2>{selectedLink.title}</h2>
          <div className="link-info">
            <p>
              <strong>URL:</strong>{" "}
              <a href={selectedLink.url} target="_blank" rel="noopener noreferrer">
                {selectedLink.url}
              </a>
            </p>
            <p><strong>Descripción:</strong> {selectedLink.description}</p>
            <p><strong>Tags:</strong> {selectedLink.tags ? selectedLink.tags.join(", ") : ""}</p>
            
            <div className="vote-section">
              <button onClick={() => handleVote(selectedLink.id)}>
                👍 Votos: {selectedLink.votes || 0}
              </button>
            </div>
          </div>

          <h3>Comentarios</h3>
          <form onSubmit={handleAddComment}>
            <input type="email" name="email" placeholder="Tu email" required />
            <textarea name="content" placeholder="Escribe tu comentario" required />
            <button type="submit">Enviar Comentario</button>
          </form>

          <div id="commentList">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                <small>Enviado por: {comment.email}</small>
              </div>
            ))}
            {comments.length === 0 && <p>No hay comentarios aún</p>}
          </div>

          <button className="back-link" onClick={() => setSelectedLink(null)}>
            Volver a la lista
          </button>
        </div>
      )}
    </div>
  );
}

export default App;